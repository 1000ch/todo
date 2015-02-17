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
    })
  );
});

self.addEventListener('fetch', function (e) {
  
  e.respondWith(
    caches.open(CACHE_KEY).then(function (cache) {

      return cache.match(e.request).then(function (response) {
        if (response) {

          console.log('cache was found', response);

          // e.requestに対するキャッシュが見つかったのでそれを返却
          return response;
        } else {

          console.log('cache was not found', e.request);

          // キャッシュが見つからなかったので取得
          fetch(e.request.clone()).then(function (response) {

            // 取得したリソースをキャッシュに登録
            cache.put(e.request, response.clone());

            // 取得したリソースを返却
            return response;
          });
        }
      });
    })
  );
});