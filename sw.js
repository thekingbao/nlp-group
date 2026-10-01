/**
 * NLP Group – Service Worker (sw.js)
 * Strategy: Cache-first for static assets, Network-first for HTML pages
 * Enables fast repeat loads and basic offline fallback
 */

const CACHE_VERSION = 'nlpgroup-v3';
const STATIC_CACHE  = `${CACHE_VERSION}-static`;
const PAGE_CACHE    = `${CACHE_VERSION}-pages`;

// Core static assets to pre-cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/css/main.css',
  '/js/main.js',
  '/favicon_io/favicon.ico',
  '/favicon_io/favicon-32x32.png',
  '/favicon_io/android-chrome-192x192.png',
  '/favicon_io/android-chrome-512x512.png',
  '/admin/db.json',
  '/pages/ve-chung-toi/',
  '/pages/doi-tac/',
  '/pages/du-an/',
  '/pages/dien-mat-troi/',
  '/pages/tru-sac/',
  '/pages/tin-tuc/',
  '/pages/lien-he/',
  '/pages/dieu-khoan/',
  '/pages/bao-mat/',
];

const CACHE_VERSION_DATE = '2026-10-02';  // Sprint 4: mobile nav, main.js UX blocks, manifest fix

// ── INSTALL ────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATE ───────────────────────────────────
// Remove old cache versions
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k.startsWith('nlpgroup-') && k !== STATIC_CACHE && k !== PAGE_CACHE)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH ──────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Skip admin, non-GET, and chrome-extension requests
  if (request.method !== 'GET') return;
  if (url.pathname.startsWith('/admin/')) return;

  // Static assets (CSS, JS, fonts, icons, images) → Cache-first
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // HTML pages → Network-first with cache fallback
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirst(request, PAGE_CACHE));
    return;
  }

  // Everything else → Network-first
  event.respondWith(networkFirst(request, PAGE_CACHE));
});

// ── STRATEGIES ─────────────────────────────────

/**
 * Cache-first: return cached version immediately, update cache in background
 */
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Asset unavailable offline.', { status: 503 });
  }
}

/**
 * Network-first: try network, fall back to cache, then offline page
 */
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    // Return offline fallback for HTML
    const offline = await caches.match('/index.html');
    if (offline) return offline;
    return new Response(offlinePage(), {
      status: 503,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
}

// ── HELPERS ────────────────────────────────────

function isStaticAsset(pathname) {
  return /\.(css|js|woff2?|ttf|otf|eot|svg|png|jpg|jpeg|gif|webp|ico|json)$/i.test(pathname);
}

function offlinePage() {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NLP Group – Đang ngoại tuyến</title>
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; text-align: center; padding: 2rem; }
    .card { max-width: 400px; }
    h1 { font-size: 2rem; font-weight: 900; margin-bottom: 1rem; }
    p { color: #94a3b8; line-height: 1.6; margin-bottom: 1.5rem; }
    a { background: #16a34a; color: white; text-decoration: none; padding: .75rem 2rem; border-radius: .75rem; font-weight: 700; display: inline-block; }
    .icon { font-size: 4rem; margin-bottom: 1rem; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">📡</div>
    <h1>Bạn đang ngoại tuyến</h1>
    <p>Không có kết nối internet. Vui lòng kiểm tra lại kết nối mạng và thử lại.</p>
    <a href="/" onclick="location.reload()">Thử lại</a>
  </div>
</body>
</html>`;
}
