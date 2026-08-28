import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

test("web app manifest references existing install icons", () => {
  const manifest = JSON.parse(readFileSync("manifest.webmanifest", "utf8"));
  assert.equal(manifest.display, "fullscreen");
  assert.equal(manifest.orientation, "landscape");
  for (const icon of manifest.icons) {
    assert.equal(existsSync(icon.src.replace(/^\.\//, "")), true, `missing ${icon.src}`);
  }
});

test("service worker uses the app shell only as a navigation fallback", () => {
  const source = readFileSync("sw.js", "utf8");
  assert.match(source, /request\.mode === "navigate"/);
  assert.match(source, /new Response\("Offline", \{ status: 503/);
  assert.doesNotMatch(source, /cached \|\| caches\.match\("\.\/index\.html"\)/);
});

test("service worker checks the runtime manifest but caches hashed assets immutably", () => {
  const source = readFileSync("sw.js", "utf8");
  assert.match(source, /RUNTIME_MANIFEST_PATH/);
  assert.match(source, /RUNTIME_ASSET_PREFIX/);
  assert.match(source, /cacheFirst\(event\.request, RUNTIME_CACHE/);
  assert.match(source, /cache: "no-store"/);
  assert.match(source, /MAX_RUNTIME_ENTRIES = 96/);
});

test("start and pause menus scroll inside the logical game viewport", () => {
  const source = readFileSync("src/styles.css", "utf8");
  for (const selector of [".main-menu", ".pause-menu", ".dev-home", ".scene-editor"]) {
    const start = source.indexOf(`${selector} {`);
    const end = source.indexOf("}\n", start);
    const rule = source.slice(start, end);
    assert.ok(start >= 0, `missing ${selector}`);
    assert.match(rule, /max-height: calc\(100% -/);
    assert.match(rule, /overflow-y: auto/);
    assert.match(rule, /touch-action: pan-y/);
  }
});

test("development home and server expose Mehana and municipality editors", () => {
  const gameSource = readFileSync("src/engine/Game.js", "utf8");
  const serverSource = readFileSync("tools/dev-server.mjs", "utf8");
  for (const sceneId of ["scene.chapter1.mehana", "scene.chapter1.municipality"]) {
    const escapedSceneId = sceneId.replaceAll(".", "\\.");
    assert.match(gameSource, new RegExp(`edit=1&scene=${escapedSceneId}`));
    assert.match(serverSource, new RegExp(`"${escapedSceneId}"`));
  }
  assert.match(gameSource, /<h2>Scene Editors<\/h2>/);
  assert.match(gameSource, /dev-links dev-scene-editors/);
});

test("every configured scene editor provides a Back to Main control", () => {
  const source = readFileSync("src/engine/SceneEditor.js", "utf8");
  assert.match(source, /data-editor="home">Back to Main<\/button>/);
  assert.match(source, /globalThis\.location\.href = "\.\/"/);
});
