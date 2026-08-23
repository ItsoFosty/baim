const SHELL_CACHE = "comrade-candidate-shell-v5";
const RUNTIME_CACHE = "comrade-candidate-runtime-v1";
const APP_SHELL = ["./", "./index.html", "./manifest.webmanifest", "./src/styles.css", "./src/main.js"];
const RUNTIME_MANIFEST_PATH = "/target/runtime-assets/manifest.json";
const RUNTIME_ASSET_PREFIX = "/target/runtime-assets/assets/";
const MAX_SHELL_ENTRIES = 64;
const MAX_RUNTIME_ENTRIES = 96;

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(SHELL_CACHE).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  const active = new Set([SHELL_CACHE, RUNTIME_CACHE]);
  event.waitUntil(
    caches.keys().then((names) => Promise.all(names.filter((name) => !active.has(name)).map((name) => caches.delete(name))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;
  const path = new URL(event.request.url).pathname;
  if (path.startsWith(RUNTIME_ASSET_PREFIX)) {
    event.respondWith(cacheFirst(event.request, RUNTIME_CACHE, MAX_RUNTIME_ENTRIES));
    return;
  }
  if (path === RUNTIME_MANIFEST_PATH) {
    event.respondWith(networkFirst(new Request(event.request, { cache: "no-store" }), SHELL_CACHE, MAX_SHELL_ENTRIES));
    return;
  }
  event.respondWith(networkFirst(event.request, SHELL_CACHE, MAX_SHELL_ENTRIES));
});

async function cacheFirst(request, cacheName, maxEntries) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(cacheName);
    await cache.put(request, response.clone());
    await trimCache(cache, maxEntries);
  }
  return response;
}

async function networkFirst(request, cacheName, maxEntries) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      await cache.put(request, response.clone());
      await trimCache(cache, maxEntries);
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (request.mode === "navigate") return caches.match("./index.html");
    return new Response("Offline", { status: 503, statusText: "Offline" });
  }
}

async function trimCache(cache, maximum) {
  const keys = await cache.keys();
  const excess = Math.max(0, keys.length - maximum);
  await Promise.all(keys.slice(0, excess).map((key) => cache.delete(key)));
}
