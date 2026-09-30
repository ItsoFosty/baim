import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { assetManifest } from "../src/content/art/assetManifest.js";

const npcHtml = readFileSync("docs/chapter1-npc-animation-catalog.html", "utf8");
const tonyPilot = JSON.parse(readFileSync("assets_src/characters/tony_fridge/external_animation_v1/animation-pilot.json", "utf8"));
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

test("Tony's seated idle pilot records runtime approval after local review", () => {
  const pilot = tonyPilot.animations.tony_idle_seated_1;
  assert.equal(tonyPilot.characterId, "npc.tony_fridge");
  assert.equal(tonyPilot.scope.sceneId, "scene.chapter1.mehana");
  assert.deepEqual(tonyPilot.scope.canvas, { width: 1280, height: 720 });
  assert.deepEqual(tonyPilot.scope.placement, { left: 861, top: 310, height: 244, zIndex: 35 });
  assert.equal(tonyPilot.scope.fallbackAsset, "assets/chapter1/characters/tony_fridge/seated-v1.png");
  assert.deepEqual(tonyPilot.scope.excludedScenes, ["scene.chapter1.election_booth"]);
  assert.equal(pilot.slot, "Idle");
  assert.equal(pilot.status, "runtime_approved");
  assert.equal(pilot.use, true);
  assert.equal(pilot.loop, true);
  assert.equal(pilot.source.exportFilename, "sprite-384px-frames-25-rows-5-cols-5.zip");
  assert.equal(pilot.source.sourceZipSha256, "070458b291740af5fc75213e9c8f0106e7d54c03e0b3ba1ddd683a8a8dbc966c");
  assert.equal(pilot.generation.creditsSpent, 15);
  assert.equal(pilot.review.candidateStatus, "runtime_approved");
  assert.equal(pilot.review.decision, "approved_for_runtime");
  assert.equal(pilot.review.approvedAt, "2026-09-30");
  assert.equal(pilot.import.runtime.asset, "assets/chapter1/characters/tony_fridge/idle-seated-v1.webp");
  assert.equal(pilot.import.derivedOutputHashes[pilot.import.runtime.asset], "1cca1e9231c9401f01625f16913e124c0ac3728c2d10f05b862e2836f6e2fd7e");
  assert.equal(pilot.source.references[0].sha256, "b1d088b7d120490bcf5a4dcabcbab9531462a36e467661cff7242ae2c911bde8");
  assert.match(npcHtml, /tony_idle_seated_1/);
  assert.match(npcHtml, /Runtime approved/);
  assert.match(npcHtml, /Runtime Approved/);
  assert.match(npcHtml, /assets\/chapter1\/characters\/tony_fridge\/idle-seated-v1\.webp/);
  assert.doesNotMatch(npcHtml, /Awaiting generated-source details and human review/);
});

test("world catalog includes procedural, CSS, and static-state categories", () => {
  assert.match(worldHtml, /effect\.fountain_water_stream/);
  assert.match(worldHtml, /UI keyframe/);
  assert.match(worldHtml, /Static state change/);
});

test("approved NPC motion is counted without claiming missing evidence needs approval", () => {
  assert.match(npcHtml, /<strong>2<\/strong><span>live motion<\/span>/);
  assert.match(npcHtml, /Runtime approved; generation evidence incomplete \(see manifest\)/);
});
