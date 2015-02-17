importScripts('bower_components/cache-polyfill/dist/serviceworker-cache-polyfill.js');

var CACHE_KEY = 'todo-cache-v1';

self.addEventListener('install', function (e) {

  e.waitUntil(
    caches.open(CACHE_KEY).then(function (cache) {
      return cache.addAll([
        'index.html',
        'vulcanized.html',
        'bower_components/cache-polyfill/dist/serviceworker-cache-polyfill.js',
        'bower_components/rsvp/rsvp.min.js',
        'bower_components/webcomponentsjs/webcomponents.min.js',
        'bower_components/polymer/polymer.js'
      ]);
    }, function (e) {
      console.log(e);
    })
  );
});

self.addEventListener('message', function (e) {
  
  switch (e.data.indication) {
    case 'clear-cache':
      e.waitUntil(
        caches.keys().then(function (cacheNames) {
          return Promise.all(
            cacheNames.map(function (cacheName) {
              return caches.delete(cacheName)
            })
          )
        })
      );
      break;
    default:
      break;
  }
});

self.addEventListener('fetch', function (e) {
  
  e.respondWith(
    caches.open(CACHE_KEY).then(function (cache) {
      return cache.match(e.request).then(function (response) {
        if (response) {
          console.log('cache was found', response);

          return response;
        } else {
          console.log('cache was not found', e.request);
          
          fetch(e.request.clone()).then(function (response) {
            cache.put(e.request, response.clone());
            return response;
          });
        }
      });
    })
  );
});