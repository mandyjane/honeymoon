const CACHE_NAME = "honeymoon-v16";
const ASSETS = [
  "./",
  "./index.html"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request).then(r => {
      if (r && r.status === 200) {
        const rc = r.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, rc));
      }
      return r;
    }).catch(() => caches.match(e.request))
  );
});
