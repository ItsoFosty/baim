import test from "node:test";
import assert from "node:assert/strict";
import { viewportLayout } from "../src/engine/ViewportLayout.js";
import { foleySamples } from "../src/engine/SoundSynthesis.js";
import { chapter1 } from "../src/content/chapter1/index.js";
import { Game } from "../src/engine/Game.js";
import { DEFAULT_SAVE } from "../src/engine/ids.js";
import { findTargetAt } from "../src/engine/SceneGeometry.js";
import { strings } from "../src/content/localization/index.js";

test("compact controls map to the physical viewport without changing world proportions", () => {
  for (const [width, height] of [[390,844], [320,568], [844,390], [640,360], [1280,720], [1920,1080]]) {
    const v = viewportLayout(width, height);
    assert.ok(Math.abs(v.sceneLeft + v.uiLeft * v.scale) < 0.001);
    assert.ok(Math.abs(v.sceneTop + v.uiTop * v.scale) < 0.001);
    assert.ok(Math.abs(v.scale * v.inverseScale - 1) < 0.001);
    assert.ok(1280 * v.scale <= width + 0.001);
    assert.ok(720 * v.scale <= height + 0.001);
  }
  assert.equal(viewportLayout(390,844).compact, true);
  assert.equal(viewportLayout(1280,720).compact, false);
});

test("physical cues have finite, non-silent samples and quiet boundaries at both device sample rates", () => {
  for (const kind of ["paper", "glass", "water", "wood", "stamp"]) {
    for (const rate of [44100,48000]) {
      const samples = foleySamples(kind, rate, 0.4);
      let peak = 0, energy = 0;
      for (const sample of samples) {
        assert.ok(Number.isFinite(sample));
        peak = Math.max(peak, Math.abs(sample));
        energy += sample * sample;
      }
      assert.ok(peak < 1 && peak > 0.01, kind);
      assert.ok(energy / samples.length > 0.00001, kind);
      assert.equal(Math.abs(samples[0]), 0);
      assert.ok(Math.abs(samples.at(-1)) < 0.003);
    }
  }
});

test("fountain ambience follows saved repair progress and stays off after an ending", () => {
  const game = Object.create(Game.prototype);
  game.state = structuredClone(DEFAULT_SAVE);
  game.currentScene = chapter1.scenes.find(scene => scene.id === "scene.chapter1.village_square");
  const dry = game.sceneAmbience();
  game.state.flags.fountainRepaired = true;
  assert.notEqual(game.sceneAmbience(), dry);
  const repaired = game.sceneAmbience();
  game.state = JSON.parse(JSON.stringify(game.state));
  assert.equal(game.sceneAmbience(), repaired);
  game.state.chapter1Completed = true;
  assert.equal(game.sceneAmbience(), null);
});

test("seated election supporters remain individually clickable and conditional", () => {
  const game = Object.create(Game.prototype);
  game.state = { ...structuredClone(DEFAULT_SAVE), babaStoyankaVote: true, tonyVote: true };
  game.currentScene = chapter1.scenes.find(scene => scene.id === "scene.chapter1.election_booth");
  for (const [id, point] of [["npc.baba_stoyanka", {x:354,y:309}], ["npc.tony_fridge", {x:433,y:291}]]) {
    assert.equal(findTargetAt(game.currentScene, point, target => game.targetAvailable(target))?.id, id);
  }
  game.state.babaStoyankaVote = false;
  game.state.tonyVote = false;
  for (const target of game.currentScene.npcs.filter(npc => ["npc.baba_stoyanka", "npc.tony_fridge"].includes(npc.id))) {
    assert.equal(game.targetAvailable(target), false);
  }
});

test("viewing the completed election room cannot move the player or reopen dialogue", () => {
  const game = Object.create(Game.prototype);
  game.state = { chapter1Completed: true };
  game.player = { position: { x:455, y:625 } };
  game.currentScene = chapter1.scenes.find(scene => scene.id === "scene.chapter1.election_booth");
  game.dialogue = {};
  game.handleTarget = () => assert.fail("completed room must be read-only");
  game.walkToPoint = () => assert.fail("completed actor must remain in the ending pose");
  game.handleWorldClick({x:1100,y:400});
  game.handleWorldClick({x:600,y:600});
  assert.deepEqual(game.player.position, {x:455,y:625});
  assert.equal(game.updateHoveredTarget({x:1100,y:400}), null);
});

test("phone and ending controls have authored Bulgarian and English labels", () => {
  for (const key of ["ui.phone.landscape_hint", "ui.ending.view_room", "ui.ending.show_results"]) {
    assert.ok(strings.bg[key]);
    assert.ok(strings.en[key]);
    assert.notEqual(strings.bg[key], strings.en[key]);
  }
});
