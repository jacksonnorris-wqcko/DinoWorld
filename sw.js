/* Dino World v0.0.20 updater */
const CACHE_VERSION = 'dino-world-v0.0.20';
const APP_PREFIX = 'dino-world-';
const APP_SHELL = ['./', './index.html', './styles.css', './app.js', './artwork.js', './manifest.json', './version.json', './icon.svg', './apple-touch-icon.png'];
self.addEventListener('install', event => { event.waitUntil((async()=>{ const cache=await caches.open(CACHE_VERSION); await cache.addAll(APP_SHELL); await self.skipWaiting(); })()); });
self.addEventListener('activate', event => { event.waitUntil((async()=>{ const keys=await caches.keys(); await Promise.all(keys.filter(k=>k.startsWith(APP_PREFIX)&&k!==CACHE_VERSION).map(k=>caches.delete(k))); await self.clients.claim(); })()); });
self.addEventListener('message', event => { if(event.data&&event.data.type==='SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('fetch', event => { const req=event.request; if(req.method!=='GET')return; const url=new URL(req.url); if(url.origin!==self.location.origin)return;
 if(url.pathname.endsWith('/version.json')){event.respondWith((async()=>{try{const fresh=await fetch(req,{cache:'no-store'});if(fresh&&fresh.ok){const c=await caches.open(CACHE_VERSION);await c.put('./version.json',fresh.clone());}return fresh;}catch(e){return (await caches.match('./version.json'))||Response.error();}})());return;}
 if(req.mode==='navigate'||APP_SHELL.some(p=>url.pathname.endsWith(p.replace('./','')))){event.respondWith((async()=>{try{const fresh=await fetch(req,{cache:'no-store'});if(fresh&&fresh.ok){const c=await caches.open(CACHE_VERSION);c.put(req,fresh.clone()).catch(()=>{});}return fresh;}catch(e){return (await caches.match(req))||(await caches.match('./index.html'))||Response.error();}})());}
});
