const CACHE_NAME = 'hello-world-pwa-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});

self.addEventListener('push', event => {
    let data;
    try {
        data = event.data.json();
    } catch (error) {
        data = { title: 'Test push', body: event.data.text() };
    }
    const options = {
        body: data.body,
        icon: data.icon
    };
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});
