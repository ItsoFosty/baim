import { Game } from "./engine/Game.js";

const app = document.querySelector("#app");
const canvas = document.querySelector("#game");
const uiRoot = document.querySelector("#ui-root");

const installedDisplayMode = () =>
  window.matchMedia("(display-mode: fullscreen)").matches ||
  window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone === true;

function syncAppScale() {
  const scale = Math.min(window.innerWidth / 1280, window.innerHeight / 720);
  app?.style.setProperty("--app-scale", String(Math.max(0.01, scale)));
}

syncAppScale();
window.addEventListener("resize", syncAppScale);

if (installedDisplayMode() && !document.fullscreenElement) {
  document.addEventListener("pointerdown", () => {
    document.documentElement.requestFullscreen?.({ navigationUI: "hide" }).catch(() => {});
    screen.orientation?.lock?.("landscape").catch(() => {});
  }, { once: true, capture: true });
}

if ("serviceWorker" in navigator && window.isSecureContext) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.warn("Web app service worker registration failed", error);
    });
  });
}

const game = new Game(canvas, uiRoot);
const params = new URLSearchParams(window.location.search);

if (params.get("animationFit") === "1") {
  window.__comradeCandidateAnimationFit = { game };
}

const startPromise = game.start();

if (params.get("testHarness") === "1") {
  window.__comradeCandidateTest = { game, ready: startPromise };
}
