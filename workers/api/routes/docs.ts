/**
 * Docs routes — GET/POST/PATCH /api/docs
 * File upload handled separately via /api/files (R2)
 */

import { Hono }          from 'hono'
import { HTTPException } from 'hono/http-exception'
import type { Env }      from '../index'
import { requireRole }   from '../middleware/auth'

export const docsRouter = new Hono<{ Bindings: Env }>()

// ─── GET /api/docs ─────────────────────────────────────────────────────────────
// Query: ?project_id=PRJ-001  ?status=pending|review|...
docsRouter.get('/', async (c) => {
  const { project_id, status } = c.req.query()

  let sql = `
    SELECT d.*, p.name AS project_name, p.legal_status AS project_legal_status
    FROM docs d
    JOIN projects p ON p.id = d.project_id
    WHERE 1=1
  `
  const binds: string[] = []
  if (project_id) { sql += ' AND d.project_id = ?'; binds.push(project_id) }
  if (status)     { sql += ' AND d.status = ?';     binds.push(status) }
  sql += ' ORDER BY d.project_id, d.id'

  const { results } = await c.env.DB.prepare(sql).bind(...binds).all()
  return c.json(results)
})

// ─── GET /api/docs/:id ────────────────────────────────────────────────────────
docsRouter.get('/:id', async (c) => {
  const row = await c.env.DB
    .prepare(`
      SELECT d.*, p.name AS project_name
      FROM docs d JOIN projects p ON p.id = d.project_id
      WHERE d.id = ?
    `)
    .bind(c.req.param('id'))
    .first()
  if (!row) throw new HTTPException(404, { message: 'Document not found' })
  return c.json(row)
})

// ─── POST /api/docs ────────────────────────────────────────────────────────────
docsRouter.post('/', requireRole('admin', 'legal'), async (c) => {
  const body = await c.req.json<{
    project_id: string; type: string
    status?: string; signed_date?: string; expiry?: string
    file_key?: string; file_name?: string
  }>()

  if (!body.project_id || !body.type?.trim()) {
    throw new HTTPException(400, { message: 'project_id and type are required' })
  }

  const projExists = await c.env.DB
    .prepare('SELECT id FROM projects WHERE id = ?').bind(body.project_id).first()
  if (!projExists) throw new HTTPException(404, { message: 'Project not found' })

  const last = await c.env.DB
    .prepare("SELECT id FROM docs ORDER BY id DESC LIMIT 1")
    .first<{ id: string }>()
  const nextNum = last ? parseInt(last.id.replace('DOC-', ''), 10) + 1 : 1
  const id      = `DOC-${String(nextNum).padStart(3, '0')}`

  await c.env.DB.prepare(`
    INSERT INTO docs (id, project_id, type, status, signed_date, expiry, file_key, file_name)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id, body.project_id, body.type.trim(),
    body.status     ?? 'pending',
    body.signed_date ?? null,
    body.expiry      ?? null,
    body.file_key    ?? null,
    body.file_name   ?? null,
  ).run()

  const created = await c.env.DB.prepare('SELECT * FROM docs WHERE id = ?').bind(id).first()
  return c.json(created, 201)
})

// ─── PATCH /api/docs/:id ───────────────────────────────────────────────────────
docsRouter.patch('/:id', requireRole('admin', 'legal'), async (c) => {
  const id   = c.req.param('id')
  const body = await c.req.json<Partial<{
    status: string; signed_date: string; expiry: string; file_key: string; file_name: string
  }>>()

  const existing = await c.env.DB.prepare('SELECT id FROM docs WHERE id = ?').bind(id).first()
  if (!existing) throw new HTTPException(404, { message: 'Document not found' })

  const allowed = ['status', 'signed_date', 'expiry', 'file_key', 'file_name']
  const safe    = Object.keys(body).filter(f => allowed.includes(f))
  if (safe.length === 0) throw new HTTPException(400, { message: 'No valid fields to update' })

  const setClauses = safe.map(f => `${f} = ?`).join(', ')
  const values     = safe.map(f => (body as Record<string, unknown>)[f])

  await c.env.DB
    .prepare(`UPDATE docs SET ${setClauses} WHERE id = ?`)
    .bind(...values, id)
    .run()

  const updated = await c.env.DB.prepare('SELECT * FROM docs WHERE id = ?').bind(id).first()
  return c.json(updated)
})

// ─── DELETE /api/docs/:id ─────────────────────────────────────────────────────
docsRouter.delete('/:id', requireRole('admin', 'legal'), async (c) => {
  const id = c.req.param('id')
  const existing = await c.env.DB.prepare('SELECT id, file_key FROM docs WHERE id = ?')
    .bind(id).first<{ id: string; file_key: string | null }>()
  if (!existing) throw new HTTPException(404, { message: 'Document not found' })

  // Remove R2 file if present
  if (existing.file_key) {
    await c.env.FILES.delete(existing.file_key)
  }

  await c.env.DB.prepare('DELETE FROM docs WHERE id = ?').bind(id).run()
  return c.json({ ok: true, deleted: id })
})
