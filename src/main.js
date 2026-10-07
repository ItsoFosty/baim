import { Game } from "./engine/Game.js";
import { viewportLayout } from "./engine/ViewportLayout.js";

const app = document.querySelector("#app");
const canvas = document.querySelector("#game");
const uiRoot = document.querySelector("#ui-root");

const installedDisplayMode = () =>
  window.matchMedia("(display-mode: fullscreen)").matches ||
  window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone === true;

function syncAppScale() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const layout = viewportLayout(width, height);
  const query = new URLSearchParams(window.location.search);
  const gameplay = query.get("play") === "1" || query.has("scene") || query.has("review");
  const developerView = ["edit", "animLab", "simpleAnimTest"].some(key => query.get(key) === "1");
  app?.classList.toggle("compact-ui", layout.compact && gameplay && !developerView);
  for (const [name, value] of Object.entries({
    "app-scale": layout.scale,
    "ui-inverse-scale": layout.inverseScale,
    "ui-left": `${layout.uiLeft}px`, "ui-top": `${layout.uiTop}px`,
    "viewport-width": `${width}px`, "viewport-height": `${height}px`,
    "scene-top": `${layout.sceneTop}px`, "scene-height": `${layout.sceneHeight}px`
  })) app?.style.setProperty(`--${name}`, String(value));
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
    navigator.serviceWorker.register("./sw.js", { updateViaCache: "none" }).catch((error) => {
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
