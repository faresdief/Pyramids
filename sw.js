const PREFIX = 'pyramids-site-';
const CACHE = PREFIX + 'v1';
const SCOPE = new URL(self.registration.scope);
const ICONS = ['icon-192.png', 'icon-512.png'].map(path => new URL(path, SCOPE).href);
const OFFLINE = '<!doctype html><html lang="ar-EG" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>بيراميدز | غير متصل</title><body style="font:18px/1.7 system-ui;margin:10vw;color:#12292c;background:#f5eedf"><h1>بيراميدز</h1><p>الإنترنت مش متاح دلوقتي. عشان نعرض أحدث منيو وبيانات الطلب، اتصل بالإنترنت وافتح الصفحة تاني.</p><a href="./">حاول تاني</a></body></html>';

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ICONS.map(url => new Request(url, {cache:'reload'})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== SCOPE.origin || !url.pathname.startsWith(SCOPE.pathname)) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request, {cache:'no-cache'}).catch(() => new Response(OFFLINE, {status: 503, headers: {'Content-Type':'text/html; charset=utf-8', 'Cache-Control':'no-store'}})));
  } else if (ICONS.includes(url.href)) {
    event.respondWith(caches.open(CACHE).then(cache => cache.match(url.href)).then(hit => hit || fetch(event.request)));
  }
});
