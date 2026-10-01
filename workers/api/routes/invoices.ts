/**
 * Invoices routes — GET/POST/PATCH /api/invoices
 */

import { Hono }          from 'hono'
import { HTTPException } from 'hono/http-exception'
import type { Env }      from '../index'
import { requireRole }   from '../middleware/auth'
import { sendEmail, invoiceOverdueEmail } from '../lib/email'

export const invoicesRouter = new Hono<{ Bindings: Env }>()

// ─── GET /api/invoices ─────────────────────────────────────────────────────────
// Query: ?project_id=PRJ-001  ?status=pending|paid|overdue
invoicesRouter.get('/', async (c) => {
  const { project_id, status } = c.req.query()

  let sql = `
    SELECT inv.*, p.name AS project_name, p.client
    FROM invoices inv
    JOIN projects p ON p.id = inv.project_id
    WHERE 1=1
  `
  const binds: string[] = []
  if (project_id) { sql += ' AND inv.project_id = ?'; binds.push(project_id) }
  if (status)     { sql += ' AND inv.status = ?';     binds.push(status) }
  sql += ' ORDER BY inv.due ASC'

  const { results } = await c.env.DB.prepare(sql).bind(...binds).all()
  return c.json(results)
})

// ─── GET /api/invoices/:id ────────────────────────────────────────────────────
invoicesRouter.get('/:id', async (c) => {
  const row = await c.env.DB
    .prepare(`
      SELECT inv.*, p.name AS project_name, p.client
      FROM invoices inv JOIN projects p ON p.id = inv.project_id
      WHERE inv.id = ?
    `)
    .bind(c.req.param('id'))
    .first()
  if (!row) throw new HTTPException(404, { message: 'Invoice not found' })
  return c.json(row)
})

// ─── POST /api/invoices ────────────────────────────────────────────────────────
invoicesRouter.post('/', requireRole('admin', 'finance'), async (c) => {
  const body = await c.req.json<{
    project_id: string; amount: number; issued: string; due: string
    status?: string; type?: string
  }>()

  if (!body.project_id || !body.amount || !body.issued || !body.due) {
    throw new HTTPException(400, { message: 'project_id, amount, issued, due are required' })
  }

  const projExists = await c.env.DB
    .prepare('SELECT id FROM projects WHERE id = ?').bind(body.project_id).first()
  if (!projExists) throw new HTTPException(404, { message: 'Project not found' })

  const last = await c.env.DB
    .prepare("SELECT id FROM invoices ORDER BY id DESC LIMIT 1")
    .first<{ id: string }>()
  const nextNum = last ? parseInt(last.id.replace('INV-', ''), 10) + 1 : 1
  const id      = `INV-${String(nextNum).padStart(3, '0')}`

  await c.env.DB.prepare(`
    INSERT INTO invoices (id, project_id, amount, issued, due, status, type)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id, body.project_id, body.amount, body.issued, body.due,
    body.status ?? 'pending', body.type ?? 'progress',
  ).run()

  const created = await c.env.DB.prepare('SELECT * FROM invoices WHERE id = ?').bind(id).first()
  return c.json(created, 201)
})

// ─── PATCH /api/invoices/:id ───────────────────────────────────────────────────
invoicesRouter.patch('/:id', requireRole('admin', 'finance'), async (c) => {
  const id   = c.req.param('id')
  const body = await c.req.json<Partial<{ status: string; amount: number; due: string }>>()

  const existing = await c.env.DB.prepare('SELECT id FROM invoices WHERE id = ?').bind(id).first()
  if (!existing) throw new HTTPException(404, { message: 'Invoice not found' })

  const allowed = ['status', 'amount', 'due']
  const safe    = Object.keys(body).filter(f => allowed.includes(f))
  if (safe.length === 0) throw new HTTPException(400, { message: 'No valid fields to update' })

  const setClauses = safe.map(f => `${f} = ?`).join(', ')
  const values     = safe.map(f => (body as Record<string, unknown>)[f])

  await c.env.DB
    .prepare(`UPDATE invoices SET ${setClauses} WHERE id = ?`)
    .bind(...values, id)
    .run()

  const updated = await c.env.DB
    .prepare(`
      SELECT inv.*, p.name AS project_name
      FROM invoices inv JOIN projects p ON p.id = inv.project_id
      WHERE inv.id = ?
    `)
    .bind(id)
    .first<{ id: string; amount: number; due: string; status: string; project_name: string }>()

  // Send email alert when marking overdue
  if (body.status === 'overdue' && updated && c.env.RESEND_API_KEY) {
    const fmt = (n: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n)
    await sendEmail(invoiceOverdueEmail({
      invoiceId:   updated.id,
      projectName: updated.project_name,
      amount:      fmt(updated.amount),
      dueDate:     new Date(updated.due).toLocaleDateString('vi-VN'),
    }), c.env.RESEND_API_KEY)
  }

  return c.json(updated)
})
