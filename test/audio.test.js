import test from "node:test";
import assert from "node:assert/strict";
import { AudioSystem } from "../src/engine/AudioSystem.js";
import { SaveSystem } from "../src/engine/SaveSystem.js";
import { accordionCue } from "../src/content/chapter1/audio.js";
import { chapter1 } from "../src/content/chapter1/index.js";
import { archiveOpenRule } from "../src/content/chapter1/archive.js";

test("volume migrates old saves, persists zero, and clamps invalid levels", () => {
  const load = value => new SaveSystem({ getItem: () => JSON.stringify(value) }).load();
  assert.equal(load({}).audioVolume, 0.6);
  assert.equal(load({ audioVolume: 0 }).audioVolume, 0);
  assert.equal(load({ audioVolume: 2 }).audioVolume, 1);
  assert.equal(load({ audioVolume: -1 }).audioVolume, 0);
  assert.equal(load({ audioVolume: "invalid" }).audioVolume, 0.6);
  let raw;
  const saves = new SaveSystem({ getItem: () => raw, setItem: (_key, value) => { raw = value; } });
  saves.save({ audioEnabled: true, audioVolume: 0.37 });
  assert.equal(saves.load().audioVolume, 0.37);
});

test("volume changes live gain and stays silent while muted", () => {
  const audio = new AudioSystem();
  let gain;
  audio.context = { currentTime: 1 };
  audio.master = { gain: { setTargetAtTime: value => { gain = value; } } };
  audio.setVolume(1);
  assert.equal(gain, 0);
  audio.enabled = true;
  audio.setVolume(0.5);
  assert.equal(gain, 0.15);
  audio.setVolume(0);
  assert.equal(gain, 0);
});

test("all accordion performance routes play the phrase, but using the strap does not", () => {
  const item = chapter1.items.find(item => item.id === "item.accordion");
  for (const rule of [...item.selfUseRules, ...item.targetUseRules]) assert.equal(rule.soundCue, accordionCue);
  const tony = chapter1.scenes.find(scene => scene.id === "scene.chapter1.mehana").npcs.find(npc => npc.id === "npc.tony_fridge");
  assert.equal(tony.itemUseRules.find(rule => rule.itemId === "item.accordion").soundCue, accordionCue);
  assert.equal(archiveOpenRule.soundCue, undefined);
  assert.ok(Math.max(...accordionCue.notes.map(note => note.at + note.duration)) < 2.5);
});
