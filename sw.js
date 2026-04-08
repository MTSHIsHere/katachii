const CACHE_NAME = 'katachi-onsha-v1';
const OFFLINE_URL = '/index.html';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/download.html',
  '/about.html',
  '/musics.html',
  '/terms.html',
  '/404.html',
  '/jp/index.html',
  '/jp/download.html',
  '/jp/about.html',
  '/jp/musics.html',
  '/jp/terms.html',
  '/jp/404.html',
  '/style.css',
  '/script.js',
  '/icon.png',
  '/character.png',
  '/charactersoft.png',
  '/manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then((networkResponse) => {
          if (event.request.url.startsWith(self.location.origin)) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
          return caches.match('/icon.png');
        });
    })
  );
});
