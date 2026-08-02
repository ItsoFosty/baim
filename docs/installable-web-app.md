# Installable Web App

The browser build is an installable Progressive Web App (PWA). The install metadata lives in
`manifest.webmanifest`, registration lives in `src/main.js`, and caching behavior lives in `sw.js`.
This layer wraps the existing game runtime; it does not change scene or chapter content contracts.

## Installation Requirements

Serve the repository over HTTPS, or use `localhost` during development. The service worker is only
registered in a secure browser context. Browser and operating-system support determine whether an
install prompt or menu action is available.

The installed app requests:

- fullscreen or standalone display;
- landscape orientation;
- a 1280 x 720 game surface scaled to the available viewport;
- the icons under `assets/app/`.

On the first pointer interaction in installed display mode, the runtime requests fullscreen and a
landscape orientation lock. Browsers may decline either request; the game continues without them.

For local development:

```bash
npm run dev
```

For detached and HTTPS server commands, see `docs/server-operations.md`.

## Cache And Offline Behavior

The service worker uses a network-first strategy for same-origin `GET` requests:

1. It requests the current resource from the network.
2. A successful response is copied into the current cache.
3. If the network request fails, it returns a previously cached copy.
4. An uncached navigation falls back to the cached `index.html`.
5. Any other uncached request returns HTTP `503 Offline`.

The initial app shell contains the entry page, manifest, main stylesheet, and main module. Other
scripts, localization modules, artwork, audio, and animation assets become available offline only
after the browser has successfully requested and cached them. Installing or opening the app once
therefore does not guarantee that every scene is ready for offline play.

## Updates

`CACHE_NAME` in `sw.js` versions the runtime cache. Change it when a release must discard responses
stored by an older service worker. During activation, the current implementation deletes every other
Cache Storage entry on the same origin, then the new worker takes control of open clients. Deploy the
game on a dedicated origin unless that cache ownership policy is changed.

The network-first policy normally serves current development files while online. When testing
offline behavior, load the exact route and assets online first, then disable the network and reload.
Browser developer tools can clear the application cache when a clean-install test is required.

## Verification

Run:

```bash
npm test
```

`test/pwa.test.js` verifies the manifest's install settings and icon paths, plus the service worker's
navigation fallback and `503` behavior. Also perform a browser smoke test when changing the manifest,
service worker lifecycle, start URL, scope, icons, display mode, or orientation handling.
