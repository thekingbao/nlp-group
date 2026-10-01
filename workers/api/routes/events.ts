/**
 * SSE (Server-Sent Events) route for real-time portal notifications
 * GET /api/events — streams events to portal clients
 *
 * Cloudflare Workers doesn't support WebSockets in the free tier,
 * but SSE works perfectly with the Streams API.
 *
 * Events format: { event: string, data: object, ts: string }
 */

import { Hono }        from 'hono'
import type { Env }    from '../index'
import { authMiddleware } from '../middleware/auth'

export const eventsRouter = new Hono<{ Bindings: Env }>()

eventsRouter.use('*', authMiddleware)

// ─── GET /api/events ──────────────────────────────────────────────────────────
eventsRouter.get('/', async (c) => {
  const user = c.get('user')

  let pingInterval: ReturnType<typeof setInterval>

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connected event
      const encode = (event: string, data: unknown) =>
        new TextEncoder().encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)

      controller.enqueue(encode('connected', { userId: user.id, role: user.role, ts: new Date().toISOString() }))

      // Heartbeat every 25s (keeps connection alive through proxies)
      pingInterval = setInterval(() => {
        try {
          controller.enqueue(encode('ping', { ts: new Date().toISOString() }))
        } catch {
          clearInterval(pingInterval)
        }
      }, 25_000)
    },
    cancel() {
      clearInterval(pingInterval)
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type':  'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection':    'keep-alive',
      'X-Accel-Buffering': 'no',    // Disable Nginx buffering
    },
  })
})

/**
 * POST /api/events/broadcast — trigger a notification to all connected clients
 * Internal use only (called by invoice/legal/doc routes after mutations)
 */
eventsRouter.post('/broadcast', async (c) => {
  const user = c.get('user')
  if (user.role !== 'admin') return c.json({ error: 'Forbidden' }, 403)

  const body = await c.req.json<{ event: string; data: unknown }>()

  // In a real setup, use Cloudflare Durable Objects to fan-out to all SSE clients.
  // For now, KV-based polling is the fallback: store event in KV with short TTL.
  const key = `event:${Date.now()}`
  await c.env.KV.put(key, JSON.stringify({ ...body, ts: new Date().toISOString() }), {
    expirationTtl: 300,  // 5 min TTL
  })

  return c.json({ ok: true, key })
})
