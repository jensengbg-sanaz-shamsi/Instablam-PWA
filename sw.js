const staticCacheName = 'site-staticV77';
const assets = [
    '/',
    '/index.html',
    'manifest.json',
    '/js/script.js',
    '/js/materialize.min.js',
    '/js/FileSaver.min.js',
    '/css/styles.css',
    '/css/materialize.min.css',
    '/imgs/192.png',
    '/imgs/taking-pictures.jpg',
    '/imgs/golden.jpg',
    '/imgs/huskey.jpg',
    '/imgs/pakotah.jpg',
    '/imgs/samoyed.jpg',
    'https://fonts.googleapis.com/icon?family=Material+Icons'
];

// install service worker
self.addEventListener('install', evt => {
    //console.log(' service worker has been installed')
    evt.waitUntil(
        caches.open(staticCacheName).then(cache => {
            cache.addAll(assets);
        })
    );
});

// active service worker
self.addEventListener('activate', evt => {
    //console.log('service worker has been activated')
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys.filter(
                key => key !== staticCacheName)
            .map(key => caches.delete(key)))
        })
    )
});

//fetch event
self.addEventListener('fetch', evt => {
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request);
        })
    );
});