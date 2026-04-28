// Mini Projects JS — service worker
// Strategy: cache-first for static shell, network-first (no cache) for /api/*.

const CACHE_NAME = 'mini-projects-v2';
const SHELL = [
  '/',
  '/index.html',
  '/global.css',
  '/terminal.css',
  '/terminal-utils.js',
  '/script.js',
  '/favicon.svg',
  '/manifest.webmanifest',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(SHELL).catch(() => { /* tolerate missing assets in dev */ })
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Same-origin only — never cache cross-origin requests (weather/dictionary/qr APIs).
  if (url.origin !== self.location.origin) return;

  // /api/* must not be cached: weather data is dynamic and key-dependent.
  if (url.pathname.startsWith('/api/')) return;

  // GET only.
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        // Refresh in background.
        fetch(request).then((res) => {
          if (res.ok) caches.open(CACHE_NAME).then((c) => c.put(request, res));
        }).catch(() => {});
        return cached;
      }
      return fetch(request).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(request, copy));
        }
        return res;
      }).catch(() => caches.match('/'));
    })
  );
});
