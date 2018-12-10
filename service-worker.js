/*
 *
 * Service Worker for Bargav Kondapu
 * Saves pages to cache.
 *
 */

const version = "0.0.1";
const cacheName = `bargavkondapu-${version}`;
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
        `/page/3/`
      ])
          .then(() => self.skipWaiting());
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(cacheName)
      .then(cache => cache.match(event.request, {ignoreSearch: true}))
      .then(response => {
      return response || fetch(event.request);
    })
  );
});
