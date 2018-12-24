/*
 *
 * Service Worker for Bargav Kondapu
 * Saves pages to cache.
 *
 */

const version = "0.1.1";
const cacheName = 'bargavkondapu-${version}';
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
        `/css/w3.css`,
        `/css/bkondapu.css`,
        `/404.html`,
        '/offline.html'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    // Try the network
    fetch(event.request)
      .then(function(res) {
        return caches.open(cacheName)
          .then(function(cache) {
            // Put in cache if succeeds
            cache.put(event.request.url, res.clone());
            return res;
          })
      })
      .catch(function(err) {
          // Fallback to cache
          return caches.match(event.request);
      })
  );
});


self.addEventListener('activate', function(event) {

  var cacheWhitelist = ['bargavkondapu-${version}'];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});
