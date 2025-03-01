self.addEventListener('push', (event) => {
  const options = event.data.json();
  event.waitUntil(
    self.registration.showNotification(options.title, {
      body: options.body,
      icon: '/vite.svg',
      badge: '/vite.svg'
    })
  );
});

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Pre-cache application shell and assets
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});