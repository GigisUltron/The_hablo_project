/* sema — offline shell. Network-first for app files, cache fallback offline.
 * Model servers are cross-origin and never handled here. */
const CACHE = "hablo-shell-v1";

async function cacheShell() {
  const cache = await caches.open(CACHE);
  const index = await fetch("./index.html", { cache: "reload" });
  await cache.put("./index.html", index.clone());
  const html = await index.text();
  const scripts = Array.from(html.matchAll(/<script src="([^"]+)"/g)).map((m) => "./" + m[1]);
  const assets = ["./", "./assets/styles.css", "./manifest.webmanifest", "./assets/icon.svg",
    "./assets/icon-192.png", "./assets/icon-512.png"];
  await Promise.all(scripts.concat(assets).map(async (url) => {
    try {
      const response = await fetch(url, { cache: "reload" });
      if (response.ok) await cache.put(url, response);
    } catch (err) { /* one missing file must not break install */ }
  }));
}

self.addEventListener("install", (event) => {
  event.waitUntil(cacheShell().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) =>
    Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
  ).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    fetch(request).then(async (response) => {
      if (response.ok) {
        const cache = await caches.open(CACHE);
        cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    }).catch(async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      if (request.mode === "navigate") {
        const shell = await caches.match("./index.html");
        if (shell) return shell;
      }
      return new Response("offline", { status: 503, headers: { "Content-Type": "text/plain" } });
    })
  );
});
