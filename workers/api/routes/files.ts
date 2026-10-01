/**
 * Files routes — R2 upload / presigned download
 * POST /api/files/upload         → upload file, returns { key, file_name, url }
 * GET  /api/files/:key/url       → get short-lived presigned download URL
 * DELETE /api/files/:key         → delete file from R2
 */

import { Hono }          from 'hono'
import { HTTPException } from 'hono/http-exception'
import type { Env }      from '../index'
import { requireRole }   from '../middleware/auth'

export const filesRouter = new Hono<{ Bindings: Env }>()

const ALLOWED_TYPES  = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 20 * 1024 * 1024   // 20 MB

// ─── POST /api/files/upload ────────────────────────────────────────────────────
filesRouter.post('/upload', requireRole('admin', 'legal', 'finance'), async (c) => {
  const formData = await c.req.formData()
  const file     = formData.get('file') as File | null
  const docId    = formData.get('doc_id') as string | null  // optional — link to doc

  if (!file) throw new HTTPException(400, { message: 'No file provided' })
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new HTTPException(415, { message: `Unsupported type: ${file.type}. Allowed: PDF, JPEG, PNG, WEBP` })
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new HTTPException(413, { message: `File too large (max ${MAX_SIZE_BYTES / 1024 / 1024}MB)` })
  }

  // Build R2 key: docs/<docId or random>/<timestamp>_<original_name>
  const prefix = docId ? `docs/${docId}` : `uploads/${crypto.randomUUID()}`
  const key    = `${prefix}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`

  const arrayBuf = await file.arrayBuffer()
  await c.env.FILES.put(key, arrayBuf, {
    httpMetadata: { contentType: file.type },
    customMetadata: { originalName: file.name, uploadedBy: c.get('user').email },
  })

  // If doc_id provided, update docs table
  if (docId) {
    await c.env.DB
      .prepare('UPDATE docs SET file_key = ?, file_name = ? WHERE id = ?')
      .bind(key, file.name, docId)
      .run()
  }

  return c.json({ key, file_name: file.name, doc_id: docId ?? null }, 201)
})

// ─── GET /api/files/:key/url — presigned download link (15 min TTL) ──────────
filesRouter.get('/:key{.+}/url', async (c) => {
  const key = c.req.param('key')
  const obj = await c.env.FILES.head(key)
  if (!obj) throw new HTTPException(404, { message: 'File not found' })

  // R2 presigned URL via createPresignedUrl (Workers R2 API)
  // Note: requires "public bucket" or Workers R2 presigning support
  // Fallback: stream directly through Worker
  const signedUrl = await c.env.FILES.createPresignedUrl
    ? (c.env.FILES as unknown as { createPresignedUrl(key: string, opts: { expiresIn: number }): Promise<string> })
        .createPresignedUrl(key, { expiresIn: 900 })  // 15 min
    : `/api/files/${encodeURIComponent(key)}/stream`  // fallback to streaming

  return c.json({ url: signedUrl, expires_in: 900, key })
})

// ─── GET /api/files/:key/stream — stream file through Worker ─────────────────
filesRouter.get('/:key{.+}/stream', async (c) => {
  const key = c.req.param('key')
  const obj = await c.env.FILES.get(key)
  if (!obj) throw new HTTPException(404, { message: 'File not found' })

  const headers = new Headers()
  obj.writeHttpMetadata(headers)
  headers.set('Cache-Control', 'private, max-age=900')
  headers.set('Content-Disposition', `inline; filename="${obj.customMetadata?.originalName ?? key}"`)

  return new Response(obj.body, { headers })
})

// ─── DELETE /api/files/:key ────────────────────────────────────────────────────
filesRouter.delete('/:key{.+}', requireRole('admin', 'legal'), async (c) => {
  const key = c.req.param('key')
  await c.env.FILES.delete(key)
  // Clear file_key from any docs referencing this key
  await c.env.DB
    .prepare('UPDATE docs SET file_key = NULL, file_name = NULL WHERE file_key = ?')
    .bind(key)
    .run()
  return c.json({ ok: true, deleted: key })
})
