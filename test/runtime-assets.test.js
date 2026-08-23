import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { AssetLoader } from "../src/engine/AssetLoader.js";

test("runtime asset build publishes content-hashed files for every raster manifest entry", () => {
  const runtime = JSON.parse(readFileSync("target/runtime-assets/manifest.json", "utf8"));
  assert.match(runtime.version, /^[a-f0-9]{12}$/);
  assert.equal(runtime.summary.count, Object.keys(runtime.assets).length);
  assert.ok(runtime.summary.bytes > 0);

  for (const [source, record] of Object.entries(runtime.assets)) {
    assert.ok(existsSync(source), `missing source asset ${source}`);
    assert.ok(existsSync(record.url), `missing runtime asset ${record.url}`);
    assert.match(record.url, new RegExp(`\\.${record.hash}\\.[a-z0-9]+$`));
  }
});

test("asset loader adopts a fresh runtime manifest without changing logical IDs", async () => {
  const initial = { scenes: {}, characters: {}, items: {} };
  const replacement = {
    scenes: { "scene.chapter1.apartment": { background: "asset.hash.png" } },
    characters: { "npc.bai_mitko": { walk: "walk.hash.webp" } },
    items: { "item.unpaid_bills": { icon: "bills.hash.png" } }
  };
  const loader = new AssetLoader(initial);
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    ok: true,
    async json() { return { version: "abc123", manifest: replacement }; }
  });
  try {
    assert.equal(await loader.loadRuntimeManifest(), true);
    assert.equal(loader.runtimeVersion, "abc123");
    assert.equal(loader.manifest.scenes["scene.chapter1.apartment"].background, "asset.hash.png");
    assert.equal(loader.manifest.items["item.unpaid_bills"].icon, "bills.hash.png");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("runtime character animations use optimized WebP sheets", () => {
  const source = readFileSync("src/content/art/externalAnimationRuntime.generated.js", "utf8");
  assert.match(source, /runtime\/walk_east_start\.webp/);
  assert.match(source, /"runtimeScale": 0\.5/);
  assert.match(source, /"runtimeSource": "half-scale-alpha-webp"/);
});
