/*
 *
 * Service Worker for Bargav Kondapu
 * Saves pages to cache.
 *
 */

const version = "0.1.0";
const cacheName = 'bargavkondapu-${version}';
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
        `/css/w3.css`,
        `/css/bkondapu.css`,
        `/`,
        `/index.html`,
        `/404.html`,
        `/page/2/`,
        `/page/3/`,
        '/offline.html'
      ])
          .then(() => self.skipWaiting());
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
  evt.respondWith(fromNetwork(evt.request, 400).catch(function () {
    return fromCache(evt.request);
  }));
});

function fromNetwork(request, timeout) {
  return new Promise(function (fulfill, reject) {
    var timeoutId = setTimeout(reject, timeout);
    fetch(request).then(function (response) {
    clearTimeout(timeoutId);
    fulfill(response);
    }, reject);
    });
}

function fromCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject('no-match');
    });
  });
}


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
});
