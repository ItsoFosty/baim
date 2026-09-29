import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { assetManifest } from "../src/content/art/assetManifest.js";

const npcHtml = readFileSync("docs/chapter1-npc-animation-catalog.html", "utf8");
const worldHtml = readFileSync("docs/chapter1-world-motion-catalog.html", "utf8");
const indexHtml = readFileSync("docs/animation-library-index.html", "utf8");

test("animation library publishes index, NPC, and world catalogs in HTML and PDF", () => {
  for (const name of ["animation-library-index", "chapter1-npc-animation-catalog", "chapter1-world-motion-catalog"]) {
    assert.ok(existsSync(`docs/${name}.html`));
    assert.ok(existsSync(`docs/${name}.pdf`));
  }
  assert.match(indexHtml, /Bai Mitko/);
  assert.match(indexHtml, /Chapter 1 NPCs/);
  assert.match(indexHtml, /World Motion/);
});

test("every Chapter 1 character asset is represented in the NPC catalog", () => {
  const characterAssets = new Set();
  for (const assets of Object.values(assetManifest.scenes)) {
    for (const path of Object.values(assets)) if (path.includes("\/characters\/")) characterAssets.add(path);
  }
  for (const path of characterAssets) assert.ok(npcHtml.includes(path), `NPC catalog is missing ${path}`);
  assert.match(npcHtml, /Static only/);
  assert.match(npcHtml, /Future Idle/);
});

test("world catalog includes procedural, CSS, and static-state categories", () => {
  assert.match(worldHtml, /effect\.fountain_water_stream/);
  assert.match(worldHtml, /UI keyframe/);
  assert.match(worldHtml, /Static state change/);
});
