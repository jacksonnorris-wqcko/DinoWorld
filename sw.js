/* Dino World auto-update service worker.
   For each release, update CACHE_VERSION in this file AND version.json.
   Keep app assets local so the shell remains available offline. */
const CACHE_VERSION = 'dino-world-v0.0.1';
const APP_PREFIX = 'dino-world-';
const APP_SHELL = ['./', './index.html', './styles.css', './app.js', './manifest.json', './version.json', './icon.svg'];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_VERSION);
    await cache.addAll(APP_SHELL);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(APP_PREFIX) && key !== CACHE_VERSION).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // The version file must be checked against the network, not trusted from cache.
  if (url.pathname.endsWith('/version.json')) {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(request, {cache: 'no-store'});
        if (fresh && fresh.ok) {
          const cache = await caches.open(CACHE_VERSION);
          await cache.put('./version.json', fresh.clone());
        }
        return fresh;
      } catch (error) {
        return (await caches.match('./version.json')) || Response.error();
      }
    })());
    return;
  }

  // Network-first app shell: pick up published files when online, fall back to cache offline.
  if (request.mode === 'navigate' || APP_SHELL.some(path => url.pathname.endsWith(path.replace('./','')))) {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(request, {cache: 'no-store'});
        if (fresh && fresh.ok) {
          const cache = await caches.open(CACHE_VERSION);
          cache.put(request, fresh.clone()).catch(() => {});
        }
        return fresh;
      } catch (error) {
        return (await caches.match(request)) || (await caches.match('./index.html')) || Response.error();
      }
    })());
  }
});
