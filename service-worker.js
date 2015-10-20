var CACHE_KEY = 'todo-cache-v1';

self.addEventListener('install', e => {

  e.waitUntil(
    caches.open(CACHE_KEY).then(cache => {
      return cache.addAll([
        'index.html',
        'vulcanized.html',
        'bower_components/node-uuid/uuid.js',
        'bower_components/promise-polyfill/Promise.js',
        'bower_components/webcomponentsjs/webcomponents.min.js'
      ]);
    }).catch(e => console.log(e))
  );
});

self.addEventListener('message', e => {

  switch (e.data.indication) {
    case 'clear-cache':
      e.waitUntil(
        caches.keys().then(cacheNames => {
          return Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)))
        })
      );
      break;
    default:
      break;
  }
});

self.addEventListener('fetch', e => {

  e.respondWith(
    caches.open(CACHE_KEY).then(cache => {
      return cache.match(e.request).then(response => {
        return response || fetch(e.request.clone()).then(response => {
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});
