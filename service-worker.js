importScripts('bower_components/cache-polyfill/dist/serviceworker-cache-polyfill.js');

var CACHE_KEY = 'todo-cache-v1';

self.addEventListener('install', function (e) {

  e.waitUntil(
    caches.open(CACHE_KEY).then(function (cache) {

      return cache.addAll([
        'index.html',
        'todo-list.html',
        'todo-task.html',
        'bower_components/cache-polyfill/dist/serviceworker-cache-polyfill.js',
        'bower_components/core-component-page/core-component-page.html',
        'bower_components/core-icon-button/core-icon-button.css',
        'bower_components/core-icon-button/core-icon-button.html',
        'bower_components/core-icon/core-icon.css',
        'bower_components/core-icon/core-icon.html',
        'bower_components/core-icons/av-icons.html',
        'bower_components/core-icons/communication-icons.html',
        'bower_components/core-icons/core-icons.html',
        'bower_components/core-icons/device-icons.html',
        'bower_components/core-icons/editor-icons.html',
        'bower_components/core-icons/hardware-icons.html',
        'bower_components/core-icons/image-icons.html',
        'bower_components/core-icons/maps-icons.html',
        'bower_components/core-icons/notification-icons.html',
        'bower_components/core-icons/social-icons.html',
        'bower_components/core-iconset-svg/core-iconset-svg.html',
        'bower_components/core-input/core-input.css',
        'bower_components/core-input/core-input.html',
        'bower_components/core-meta/core-meta.html',
        'bower_components/polymer-idb/polymer-idb.html',
        'bower_components/polymer/layout.html',
        'bower_components/polymer/polymer.html',
        'bower_components/polymer/polymer.js',
        'bower_components/polymer/polymer.html',
        'bower_components/rsvp/rsvp.min.js',
        'bower_components/webcomponentsjs/webcomponents.min.js'
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