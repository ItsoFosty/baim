import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { AudioSystem } from "../src/engine/AudioSystem.js";
import { Game } from "../src/engine/Game.js";
import { DEFAULT_SAVE } from "../src/engine/ids.js";
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
  const recording = readFileSync(new URL(`../${accordionCue.src}`, import.meta.url));
  const approved = readFileSync(new URL("../assets_src/audio/accordion-vivid-v1/accordion-vivid-7s.wav", import.meta.url));
  assert.deepEqual(recording, approved);
});

test("actual accordion rule selection uses the recording for every NPC, self and animal", () => {
  const game = Object.create(Game.prototype);
  game.state = structuredClone(DEFAULT_SAVE);
  game.inventory = { has: id => id === "item.accordion" };
  game.content = { items: Object.fromEntries(chapter1.items.map(item => [item.id, item])) };
  game.clearInventoryInteraction = () => {};
  game.applyContentEffect = rule => rule;
  for (const supported of [false, true]) {
    game.state.babaStoyankaVote = supported;
    game.state.tonyVote = supported;
    game.state.flags.tonyChallengeStarted = true;
    game.state.flags.tonyDistracted = supported;
    for (const scene of chapter1.scenes) {
      for (const npc of scene.npcs || []) {
        const rule = game.useInventoryItemOnTarget("item.accordion", npc);
        assert.equal(rule.soundCue, accordionCue, `${scene.id}/${npc.id}, supported=${supported}`);
      }
    }
    const baba = chapter1.scenes.find(s => s.id.endsWith("village_square")).npcs.find(n => n.id === "npc.baba_stoyanka");
    assert.equal(game.useInventoryItemOnTarget("item.accordion", baba).messageKey,
      `msg.accordion_baba_${supported ? "after" : "before"}_vote`);
  }
  assert.equal(game.useInventoryItemOnSelf("item.accordion").soundCue, accordionCue);
  assert.equal(game.useInventoryItemOnTarget("item.accordion", { kind: "hotspot", tags: ["animal"] }).soundCue, accordionCue);
  const handle = chapter1.scenes.find(s => s.id === "scene.chapter1.archive").interactables.find(t => t.id === "hotspot.archive.handle");
  for (const inspected of [false, true]) {
    game.state.flags.candidateRegistrationStamped = true;
    game.state.flags.archiveHandleInspected = inspected;
    assert.equal(game.useInventoryItemOnTarget("item.accordion", handle).soundCue, undefined);
  }
});

function recordingAudio() {
  const audio = new AudioSystem();
  const sources = [];
  const gains = [];
  audio.enabled = true;
  audio.master = {};
  audio.context = {
    decodeAudioData: async () => ({ duration: 7 }),
    createBufferSource: () => {
      const source = { connect(target) { this.target = target; }, disconnect() {},
        start() { this.started = true; }, stop() { this.stopped = true; this.onended(); } };
      sources.push(source);
      return source;
    },
    createGain: () => {
      const gain = { gain: {}, connect(target) { this.target = target; }, disconnect() {} };
      gains.push(gain);
      return gain;
    }
  };
  return { audio, sources, gains };
}

test("recorded cues share master volume, cache downloads and restart on repeated clicks", async t => {
  let requests = 0;
  t.mock.method(globalThis, "fetch", async () => {
    requests++;
    return { ok: true, arrayBuffer: async () => new ArrayBuffer(0) };
  });
  const { audio, sources, gains } = recordingAudio();
  await audio.play(accordionCue);
  assert.equal(sources[0].buffer.duration, 7);
  assert.equal(sources[0].started, true);
  assert.equal(sources[0].target, gains[0]);
  assert.equal(gains[0].target, audio.master);
  await audio.play(accordionCue);
  assert.equal(requests, 1);
  assert.equal(sources[0].stopped, true);
  assert.equal(audio.voices.size, 1);
  sources[1].onended();
  assert.equal(audio.voices.size, 0);
  audio.enabled = false;
  await audio.play(accordionCue);
  assert.equal(sources.length, 2);
});

test("pending recordings cannot stack or start after audio was disabled", async t => {
  let finish;
  t.mock.method(globalThis, "fetch", () => new Promise(resolve => { finish = resolve; }));
  const { audio, sources } = recordingAudio();
  const first = audio.play(accordionCue);
  const second = audio.play(accordionCue);
  finish({ ok: true, arrayBuffer: async () => new ArrayBuffer(0) });
  await Promise.all([first, second]);
  assert.equal(sources.length, 1);

  const pending = audio.play({ src: "another.wav" });
  audio.master.gain = { setTargetAtTime() {} };
  audio.context.resume = async () => {};
  await audio.setEnabled(false);
  await audio.setEnabled(true);
  finish({ ok: true, arrayBuffer: async () => new ArrayBuffer(0) });
  await pending;
  assert.equal(sources.length, 1);
});

test("a failed recording download is contained and can be retried", async t => {
  let requests = 0;
  t.mock.method(console, "warn", () => {});
  t.mock.method(globalThis, "fetch", async () => ({
    ok: ++requests > 1, status: 503, arrayBuffer: async () => new ArrayBuffer(0)
  }));
  const { audio, sources } = recordingAudio();
  await audio.play(accordionCue);
  assert.equal(sources.length, 0);
  await audio.play(accordionCue);
  assert.equal(sources.length, 1);
});

test("footsteps follow travelled distance and stop when paused, muted or teleported", () => {
  const audio = new AudioSystem();
  audio.enabled = true;
  const surface = { cutoff: 700, pitch: 100, volume: 0.6 };
  let steps = 0;
  audio.playFootstep = () => { steps++; };
  audio.updateFootsteps(20, 300, surface, true);
  audio.updateFootsteps(0, 300, surface, true);
  assert.equal(steps, 0);
  // A 300px character now steps every 63px rather than 42px: 2/3 cadence.
  audio.updateFootsteps(22, 300, surface, true);
  assert.equal(steps, 0);
  audio.updateFootsteps(22, 300, surface, true);
  assert.equal(steps, 1);
  audio.updateFootsteps(30, 300, surface, true);
  audio.updateFootsteps(0, 300, surface, false);
  audio.updateFootsteps(12, 300, surface, true);
  assert.equal(steps, 1);
  audio.updateFootsteps(500, 300, surface, true);
  assert.equal(steps, 1);
  audio.volume = 0;
  audio.updateFootsteps(65, 300, surface, true);
  assert.equal(steps, 1);
  audio.volume = 0.6;
  audio.updateFootsteps(65, 300, surface, true);
  assert.equal(steps, 2);
  audio.enabled = false;
  audio.updateFootsteps(65, 300, surface, true);
  assert.equal(steps, 2);
  audio.enabled = true;
  audio.updateFootsteps(65, 300, undefined, true);
  assert.equal(steps, 2);
});
