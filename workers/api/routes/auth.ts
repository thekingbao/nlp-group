/**
 * Auth routes: POST /api/auth/login, POST /api/auth/refresh, POST /api/auth/logout
 */

import { Hono }          from 'hono'
import { HTTPException } from 'hono/http-exception'
import type { Env }      from '../index'
import { signToken, hashToken, verifyToken } from '../lib/jwt'
import { verifyPassword }                    from '../lib/password'

export const authRouter = new Hono<{ Bindings: Env }>()

const ACCESS_TTL  = 3600          // 1 hour
const REFRESH_TTL = 60 * 60 * 24 * 30  // 30 days

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
authRouter.post('/login', async (c) => {
  const { email, password } = await c.req.json<{ email: string; password: string }>()
  if (!email || !password) throw new HTTPException(400, { message: 'email and password required' })

  const user = await c.env.DB
    .prepare('SELECT id, email, name, role, password_hash FROM users WHERE email = ? AND active = 1')
    .bind(email.toLowerCase().trim())
    .first<{ id: string; email: string; name: string; role: string; password_hash: string | null }>()

  if (!user || !user.password_hash) throw new HTTPException(401, { message: 'Invalid credentials' })

  const ok = await verifyPassword(password, user.password_hash)
  if (!ok) throw new HTTPException(401, { message: 'Invalid credentials' })

  // Issue tokens
  const accessToken  = await signToken({ sub: user.id, email: user.email, role: user.role }, c.env.JWT_SECRET, ACCESS_TTL)
  const refreshToken = crypto.randomUUID() + crypto.randomUUID()  // 72 chars random
  const tokenHash    = await hashToken(refreshToken)
  const expiresAt    = new Date(Date.now() + REFRESH_TTL * 1000).toISOString()

  await c.env.DB
    .prepare('INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)')
    .bind(user.id, tokenHash, expiresAt)
    .run()

  return c.json({
    access_token:  accessToken,
    refresh_token: refreshToken,
    token_type:    'Bearer',
    expires_in:    ACCESS_TTL,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  })
})

// ─── POST /api/auth/refresh ───────────────────────────────────────────────────
authRouter.post('/refresh', async (c) => {
  const { refresh_token } = await c.req.json<{ refresh_token: string }>()
  if (!refresh_token) throw new HTTPException(400, { message: 'refresh_token required' })

  const tokenHash = await hashToken(refresh_token)
  const row = await c.env.DB
    .prepare(`
      SELECT rt.user_id, rt.expires_at, u.email, u.role
      FROM refresh_tokens rt
      JOIN users u ON u.id = rt.user_id
      WHERE rt.token_hash = ? AND u.active = 1
    `)
    .bind(tokenHash)
    .first<{ user_id: string; expires_at: string; email: string; role: string }>()

  if (!row || new Date(row.expires_at) < new Date()) {
    throw new HTTPException(401, { message: 'Refresh token expired or invalid' })
  }

  const accessToken = await signToken(
    { sub: row.user_id, email: row.email, role: row.role },
    c.env.JWT_SECRET, ACCESS_TTL,
  )

  return c.json({ access_token: accessToken, token_type: 'Bearer', expires_in: ACCESS_TTL })
})

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
authRouter.post('/logout', async (c) => {
  const { refresh_token } = await c.req.json<{ refresh_token?: string }>()
  if (refresh_token) {
    const tokenHash = await hashToken(refresh_token)
    await c.env.DB
      .prepare('DELETE FROM refresh_tokens WHERE token_hash = ?')
      .bind(tokenHash)
      .run()
  }
  return c.json({ ok: true })
})

// ─── GET /api/auth/me (protected — caller supplies valid access token) ─────────
authRouter.get('/me', async (c) => {
  const header = c.req.header('Authorization')
  if (!header?.startsWith('Bearer ')) throw new HTTPException(401, { message: 'Unauthorized' })
  const payload = await verifyToken(header.slice(7), c.env.JWT_SECRET)
  if (!payload) throw new HTTPException(401, { message: 'Token invalid or expired' })

  const user = await c.env.DB
    .prepare('SELECT id, email, name, role FROM users WHERE id = ?')
    .bind(payload.sub)
    .first()

  if (!user) throw new HTTPException(404, { message: 'User not found' })
  return c.json(user)
})
