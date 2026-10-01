/**
 * Projects routes — GET/POST/PATCH /api/projects
 * Role guards: admin can write; all authenticated users can read
 */

import { Hono }          from 'hono'
import { HTTPException } from 'hono/http-exception'
import type { Env }      from '../index'
import { requireRole }   from '../middleware/auth'

export const projectsRouter = new Hono<{ Bindings: Env }>()

// ─── GET /api/projects ────────────────────────────────────────────────────────
// Query params: ?type=solar|ev  ?status=active|...  ?legal_status=pending|...
projectsRouter.get('/', async (c) => {
  const { type, status, legal_status } = c.req.query()

  let sql = 'SELECT * FROM projects WHERE 1=1'
  const binds: string[] = []
  if (type)         { sql += ' AND type = ?';         binds.push(type) }
  if (status)       { sql += ' AND status = ?';       binds.push(status) }
  if (legal_status) { sql += ' AND legal_status = ?'; binds.push(legal_status) }
  sql += ' ORDER BY created_at DESC'

  const { results } = await c.env.DB.prepare(sql).bind(...binds).all()
  return c.json(results)
})

// ─── GET /api/projects/:id ────────────────────────────────────────────────────
projectsRouter.get('/:id', async (c) => {
  const row = await c.env.DB
    .prepare('SELECT * FROM projects WHERE id = ?')
    .bind(c.req.param('id'))
    .first()
  if (!row) throw new HTTPException(404, { message: 'Project not found' })
  return c.json(row)
})

// ─── POST /api/projects ───────────────────────────────────────────────────────
projectsRouter.post('/', requireRole('admin'), async (c) => {
  const body = await c.req.json<{
    name: string; client: string; type: 'solar' | 'ev'; power: number
    status?: string; contract_date?: string; value?: number; paid?: number
    legal_status?: string; legal_note?: string; region?: string
  }>()

  if (!body.name || !body.client || !body.type || !body.power) {
    throw new HTTPException(400, { message: 'name, client, type, power are required' })
  }

  // Auto-generate ID: PRJ-NNN
  const last = await c.env.DB
    .prepare("SELECT id FROM projects ORDER BY id DESC LIMIT 1")
    .first<{ id: string }>()
  const nextNum = last ? parseInt(last.id.replace('PRJ-', ''), 10) + 1 : 1
  const id      = `PRJ-${String(nextNum).padStart(3, '0')}`

  await c.env.DB.prepare(`
    INSERT INTO projects (id, name, client, type, power, status, contract_date, value, paid, legal_status, legal_note, region)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id, body.name, body.client, body.type, body.power,
    body.status ?? 'pending', body.contract_date ?? null,
    body.value ?? 0, body.paid ?? 0,
    body.legal_status ?? 'pending', body.legal_note ?? null, body.region ?? null,
  ).run()

  const created = await c.env.DB.prepare('SELECT * FROM projects WHERE id = ?').bind(id).first()
  return c.json(created, 201)
})

// ─── PATCH /api/projects/:id ──────────────────────────────────────────────────
projectsRouter.patch('/:id', requireRole('admin', 'legal', 'finance'), async (c) => {
  const id   = c.req.param('id')
  const body = await c.req.json<Partial<{
    name: string; client: string; status: string; contract_date: string
    value: number; paid: number; legal_status: string; legal_note: string; region: string
  }>>()

  const existing = await c.env.DB.prepare('SELECT id FROM projects WHERE id = ?').bind(id).first()
  if (!existing) throw new HTTPException(404, { message: 'Project not found' })

  const fields  = Object.keys(body) as string[]
  if (fields.length === 0) throw new HTTPException(400, { message: 'No fields to update' })

  // Whitelist updatable columns
  const allowed = ['name','client','status','contract_date','value','paid','legal_status','legal_note','region']
  const safe    = fields.filter(f => allowed.includes(f))
  if (safe.length === 0) throw new HTTPException(400, { message: 'No valid fields to update' })

  const setClauses = safe.map(f => `${f} = ?`).join(', ')
  const values     = safe.map(f => (body as Record<string, unknown>)[f])

  await c.env.DB
    .prepare(`UPDATE projects SET ${setClauses} WHERE id = ?`)
    .bind(...values, id)
    .run()

  const updated = await c.env.DB.prepare('SELECT * FROM projects WHERE id = ?').bind(id).first()
  return c.json(updated)
})

// ─── DELETE /api/projects/:id ─────────────────────────────────────────────────
projectsRouter.delete('/:id', requireRole('admin'), async (c) => {
  const id = c.req.param('id')
  const existing = await c.env.DB.prepare('SELECT id FROM projects WHERE id = ?').bind(id).first()
  if (!existing) throw new HTTPException(404, { message: 'Project not found' })
  await c.env.DB.prepare('DELETE FROM projects WHERE id = ?').bind(id).run()
  return c.json({ ok: true, deleted: id })
})
