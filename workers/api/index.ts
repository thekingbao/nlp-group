/**
 * NLP Group — Workers API
 * Entry point: Hono app + route mounting
 */

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'

import { projectsRouter } from './routes/projects'
import { invoicesRouter } from './routes/invoices'
import { docsRouter }     from './routes/docs'
import { authRouter }     from './routes/auth'
import { filesRouter }    from './routes/files'
import { eventsRouter }   from './routes/events'
import { authMiddleware } from './middleware/auth'

export type Env = {
  DB:    D1Database
  FILES: R2Bucket
  KV:    KVNamespace
  JWT_SECRET:     string   // Workers Secret
  RESEND_API_KEY: string   // Workers Secret (Giai đoạn 5)
  ENVIRONMENT:    string   // 'production' | 'preview'
}

const app = new Hono<{ Bindings: Env }>()

// ─── Global middleware ────────────────────────────────────────────────────────
app.use('*', logger())
app.use('*', prettyJSON())
app.use('/api/*', cors({
  origin: [
    'https://nlpgroup.com.vn',
    'http://localhost:5173',   // noi-bo-react dev
    'http://localhost:4173',   // vite preview
  ],
  allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

// ─── Health check (no auth) ───────────────────────────────────────────────────
app.get('/api/health', (c) => c.json({ ok: true, ts: new Date().toISOString() }))

// ─── Auth routes (no auth guard) ─────────────────────────────────────────────
app.route('/api/auth', authRouter)

// ─── Protected routes ─────────────────────────────────────────────────────────
app.use('/api/*', authMiddleware)
app.route('/api/projects', projectsRouter)
app.route('/api/invoices', invoicesRouter)
app.route('/api/docs',     docsRouter)
app.route('/api/files',    filesRouter)
app.route('/api/events',   eventsRouter)

// ─── 404 fallback ────────────────────────────────────────────────────────────
app.notFound((c) => c.json({ error: 'Not found' }, 404))
app.onError((err, c) => {
  console.error(err)
  return c.json({ error: err.message ?? 'Internal error' }, 500)
})

export default app
