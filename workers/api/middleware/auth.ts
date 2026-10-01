/**
 * Auth middleware — verify JWT access token from Authorization header.
 * Also checks role-based access for sensitive routes.
 */

import { createMiddleware } from 'hono/factory'
import { HTTPException }    from 'hono/http-exception'
import type { Env }         from '../index'
import { verifyToken }      from '../lib/jwt'

export type AuthUser = {
  id:    string
  email: string
  role:  'admin' | 'finance' | 'legal' | 'viewer'
}

declare module 'hono' {
  interface ContextVariableMap {
    user: AuthUser
  }
}

export const authMiddleware = createMiddleware<{ Bindings: Env }>(async (c, next) => {
  const header = c.req.header('Authorization')
  if (!header?.startsWith('Bearer ')) {
    throw new HTTPException(401, { message: 'Missing or invalid Authorization header' })
  }

  const token = header.slice(7)
  const payload = await verifyToken(token, c.env.JWT_SECRET)
  if (!payload) {
    throw new HTTPException(401, { message: 'Token expired or invalid' })
  }

  c.set('user', payload as AuthUser)
  await next()
})

/**
 * Role guard factory — use inside a route handler or as middleware.
 * Usage: requireRole('admin', 'finance')
 */
export function requireRole(...roles: AuthUser['role'][]) {
  return createMiddleware<{ Bindings: Env }>(async (c, next) => {
    const user = c.get('user')
    if (!roles.includes(user.role)) {
      throw new HTTPException(403, { message: `Requires role: ${roles.join(' or ')}` })
    }
    await next()
  })
}
