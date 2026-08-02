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
  assert.match(source, /event\.request\.mode === "navigate"/);
  assert.match(source, /new Response\("Offline", \{ status: 503/);
  assert.doesNotMatch(source, /cached \|\| caches\.match\("\.\/index\.html"\)/);
});
