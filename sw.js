// KODE BARU (PERBAIKAN TOTAL sw.js)
const CACHE_NAME = 'assunnah-app-v2'; // Ganti versi ke v2
const urlsToCache = [
  '/',
  '/index.html',
  '/app.html',
  '/logohekinan.jpeg'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Memaksa service worker baru langsung aktif
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  // Menghapus cache versi lama (v1) agar web terupdate
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  // NETWORK-FIRST STRATEGY: Selalu coba ambil dari server/internet dulu
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Jika sukses ambil dari server, perbarui cache
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Jika gagal/offline, baru tampilkan dari cache
        return caches.match(event.request);
      })
  );
});
