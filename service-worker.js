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
    `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css`,
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

function refresh(response) {
  return self.clients.matchAll().then(function (clients) {
    clients.forEach(function (client) {
      var message = {
        type: 'refresh',
        url: response.url,
        eTag: response.headers.get('ETag')
      };
      client.postMessage(JSON.stringify(message));
   });
 });
}
