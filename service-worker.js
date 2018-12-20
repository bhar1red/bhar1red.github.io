/*
 *
 * Service Worker for Bargav Kondapu
 * Saves pages to cache.
 *
 */

const version = "0.0.2";
const cacheName = `bargavkondapu-${version}`;

self.addEventListener('install', function(evt) {
  console.log('The service worker is being installed.');
  evt.waitUntil(caches.open(cacheName).then(function (cache) {
  cache.addAll([
    `/css/w3.css`,
    `/css/bkondapu.css`,
    `/`,
    `/index.html`,
    `/404.html`,
    `/page/2/`,
    `/page/3/`
  ]);
}));
});

self.addEventListener('fetch', function(evt) {
  console.log('The service worker is serving the asset.');

  evt.respondWith(fromCache(evt.request));

  evt.waitUntil(
    update(evt.request)
    .then(refresh)
  );
});

function fromCache(request) {
  return caches.open(cacheName).then(function (cache) {
    return cache.match(request);
  });
}

function update(request) {
  return caches.open(cacheName).then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response.clone()).then(function () {
        return response;
      });
    });
  });
}
