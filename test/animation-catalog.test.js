import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

test("animation catalog includes every enabled Ludo animation", () => {
  const selection = JSON.parse(readFileSync("assets_src/characters/bai_mitko/external_animation_v1/external-animation-selection.json", "utf8"));
  const html = readFileSync("docs/bai-mitko-animation-catalog.html", "utf8");
  const enabled = Object.entries(selection.animations).filter(([, config]) => config.use).map(([key]) => key);
  assert.ok(enabled.length > 0);
  for (const key of enabled) assert.match(html, new RegExp(`data-animation-id="${key}"`), `catalog is missing ${key}`);
});

test("animation catalog contains review metadata and a printable PDF", () => {
  const html = readFileSync("docs/bai-mitko-animation-catalog.html", "utf8");
  assert.match(html, /Bai Mitko Animation Catalog/);
  assert.match(html, /Live/);
  assert.match(html, /Runtime-ready/);
  assert.ok(existsSync("docs/bai-mitko-animation-catalog.pdf"));
});
