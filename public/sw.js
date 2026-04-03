const STATIC_CACHE_NAME = "hidden-static-v1";
const PAGE_CACHE_NAME = "hidden-pages-v1";
const OFFLINE_PUBLIC_URL = "/offline.html";
const OFFLINE_DASHBOARD_URL = "/offline-dashboard.html";

const STATIC_ASSET_PATHS = [
  OFFLINE_PUBLIC_URL,
  OFFLINE_DASHBOARD_URL,
  "/pwa/icon-192.png",
  "/pwa/icon-512.png",
  "/favicon.ico",
];

function isApiPath(pathname) {
  return pathname.startsWith("/api/");
}

function isAdminPath(pathname) {
  return pathname === "/admin-login" || pathname.startsWith("/admin");
}

function isDashboardPath(pathname) {
  return pathname.startsWith("/dashboard");
}

function isAuthPath(pathname) {
  return pathname === "/login" || pathname === "/register";
}

function canCachePage(pathname) {
  return !isDashboardPath(pathname) && !isAdminPath(pathname) && !isAuthPath(pathname);
}

function isStaticResourceRequest(request, url) {
  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return false;
  }

  if (url.pathname.startsWith("/_next/static/")) {
    return true;
  }

  if (url.pathname.startsWith("/pwa/")) {
    return true;
  }

  if (url.pathname === "/favicon.ico") {
    return true;
  }

  return ["style", "script", "font", "image"].includes(request.destination);
}

self.addEventListener("install", (event) => {
  self.skipWaiting();

  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE_NAME);
      await cache.addAll(STATIC_ASSET_PATHS.map((path) => new Request(path, { cache: "reload" })));
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheKeys = await caches.keys();
      const activeCaches = new Set([STATIC_CACHE_NAME, PAGE_CACHE_NAME]);

      await Promise.all(
        cacheKeys
          .filter((key) => !activeCaches.has(key))
          .map((key) => caches.delete(key)),
      );

      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

async function staleWhileRevalidate(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  const cached = await cache.match(request);

  const networkPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }

      return response;
    });

  if (cached) {
    networkPromise.catch(() => undefined);
    return cached;
  }

  try {
    return await networkPromise;
  } catch {
    return Response.error();
  }
}

async function networkFirstNavigation(request, url) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok && canCachePage(url.pathname)) {
      const pageCache = await caches.open(PAGE_CACHE_NAME);
      await pageCache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch {
    if (canCachePage(url.pathname)) {
      const pageCache = await caches.open(PAGE_CACHE_NAME);
      const cachedPage = await pageCache.match(request);

      if (cachedPage) {
        return cachedPage;
      }
    }

    const fallbackUrl = isDashboardPath(url.pathname)
      ? OFFLINE_DASHBOARD_URL
      : OFFLINE_PUBLIC_URL;
    const fallbackResponse = await caches.match(fallbackUrl);
    return fallbackResponse ?? Response.error();
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  if (isApiPath(url.pathname)) {
    event.respondWith(fetch(request));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(request, url));
    return;
  }

  if (isStaticResourceRequest(request, url)) {
    event.respondWith(staleWhileRevalidate(request));
  }
});
