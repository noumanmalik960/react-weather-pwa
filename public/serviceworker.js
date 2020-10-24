const CACHE_NAME = "version-1";
const urlsToCache = ['index.html', 'offline.html'];

// All this code is available with explanation in google's official docs here: https://developers.google.com/web/fundamentals/primers/service-workers

// Install service worker
// In this we open the cache and urlsToCache files in in the cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');

        return cache.addAll(urlsToCache);
      })
  )
});

// Listen for requests
// respond to request after we listen to them
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(() => {
        return fetch(event.request)
          .catch(() => caches.match('offline.html'))
      })
  )
});

// Activate the service worker
// only keeps the cache we need and delete rest of them
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [];
  cacheWhitelist.push(CACHE_NAME);

  event.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames.map((cacheName) => {
        if (!cacheWhitelist.includes(cacheName)) {
          return caches.delete(cacheName);
        }
      })
    ))

  )
});