import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { DialogueSystem } from '../src/engine/DialogueSystem.js';
import { Renderer, npcReactionPlaybackFrame } from '../src/engine/Renderer.js';
import { chapter1 } from '../src/content/chapter1/index.js';
import { assetManifest } from '../src/content/art/assetManifest.js';
import { imageAssetPaths } from '../src/engine/AssetLoader.js';
const scene = chapter1.scenes.find(s => s.id === 'scene.chapter1.mehana');
const layer = scene.foregroundLayers.find(l => l.id === 'layer.mehana.tony_fridge_seated');
const reaction = layer.reactionAnimations.confident_chuckle;
const dialogues = Object.fromEntries(chapter1.dialogues.map(d => [d.id, d]));
function fixture() {
  const dialogue = new DialogueSystem(dialogues, null);
  const images = { reaction: {}, talk: {}, idle: {}, static: { naturalWidth: 914, naturalHeight: 1166 } };
  const loaded = new Set(Object.values(images));
  const draws = [];
  const game = { lastTime: 0, dialogue, content: { dialogues }, speech: 0,
    npcSpeechAnimationTime() { return dialogue.current ? this.speech : null; },
    assets: { getSceneImage: (_id, alias) => alias === reaction.asset ? images.reaction : alias === layer.talkAnimation.asset ? images.talk : alias === layer.animation.asset ? images.idle : images.static, isLoaded: image => loaded.has(image) } };
  const renderer = Object.assign(Object.create(Renderer.prototype), { ctx: { drawImage: (...args) => draws.push(args) }, game });
  const draw = (time, drawingScene = scene, drawingLayer = layer) => { game.lastTime = time; renderer.drawSceneRasterLayer(drawingScene, drawingLayer); return draws.at(-1); };
  dialogue.start('dialogue.tony_fridge');
  draw(0); draw(1000);
  const accept = () => { dialogue.choose(dialogue.getNode().choices.find(c => c.next === 'challenge')); dialogue.choose(dialogue.getNode().choices.find(c => c.next === 'challenge_accepted')); };
  return { dialogue, game, images, loaded, renderer, draw, accept };
}
function frame(draw) { return Math.floor(draw[2] / 384) * 5 + Math.floor(draw[1] / 384); }
test('dialogue entry identity changes only on real entries; quest effects retain their original order', () => {
  const calls = [];
  const dialogue = new DialogueSystem(dialogues, null, effect => calls.push(effect));
  dialogue.start('dialogue.tony_fridge');
  const start = dialogue.entry;
  dialogue.getNode(); assert.equal(dialogue.entry, start);
  dialogue.choose(dialogue.getNode().choices.find(c => c.next === 'challenge'));
  const accept = dialogue.getNode().choices.find(c => c.next === 'challenge_accepted');
  dialogue.choose(accept);
  assert.deepEqual(calls, [accept.effect]);
  assert.equal(dialogue.entry.reactionId, 'confident_chuckle');
  assert.equal(dialogue.entry.session, dialogue.current);
  const entry = dialogue.entry;
  dialogue.choose({ next: 'challenge_accepted' });
  assert.notEqual(dialogue.entry, entry);
  dialogue.close(); assert.equal(dialogue.entry, null);
  dialogue.start('dialogue.tony_fridge'); assert.notEqual(dialogue.entry.session, start.session);
});
test('reaction plays all 25 frames once, consumes the entry and allows deliberate fresh entry', () => {
  const entry = {};
  let r = npcReactionPlaybackFrame(reaction, entry, 0);
  for (let index = 0; index < 25; index++) {
    r = npcReactionPlaybackFrame(reaction, entry, index * 112, r.state);
    assert.equal(r.frameIndex, index);
  }
  r = npcReactionPlaybackFrame(reaction, entry, 2800, r.state);
  assert.equal(r.frameIndex, null); assert.equal(r.state.phase, 'done');
  r = npcReactionPlaybackFrame(reaction, entry, 50000, r.state);
  assert.equal(r.frameIndex, null);
  r = npcReactionPlaybackFrame(reaction, {}, 50016, r.state);
  assert.equal(r.frameIndex, 0);
});
test('reaction waits for the left pose, freezes in menus and cancels pending or missing-asset entries', () => {
  const entry = {};
  let r = npcReactionPlaybackFrame(reaction, entry, 0, {}, false, false);
  r = npcReactionPlaybackFrame(reaction, entry, 1000, r.state, false, true);
  assert.equal(r.frameIndex, 0);
  r = npcReactionPlaybackFrame(reaction, entry, 1224, r.state); assert.equal(r.frameIndex, 2);
  r = npcReactionPlaybackFrame(reaction, entry, 5000, r.state, true); assert.equal(r.frameIndex, 2);
  r = npcReactionPlaybackFrame(reaction, entry, 5112, r.state); assert.equal(r.frameIndex, 3);
  r = npcReactionPlaybackFrame(null, {}, 5128, r.state); assert.equal(r.frameIndex, null);
  r = npcReactionPlaybackFrame(reaction, {}, 5144, r.state, false, true, false);
  const missingEntry = r.state.entry;
  r = npcReactionPlaybackFrame(reaction, missingEntry, 5160, r.state, false, true, true);
  assert.equal(r.frameIndex, null); assert.equal(r.state.phase, 'done');
});
test('renderer prioritizes chuckle, preserves registration, then resumes speech without another turn', () => {
  const f = fixture(); f.accept();
  let draw = f.draw(1016); assert.equal(draw[0], f.images.reaction); assert.equal(frame(draw), 0);
  const scale = 244 / 198;
  assert.deepEqual(draw.slice(5), [861, 310 + scale, 152 * scale, 196 * scale]);
  draw = f.draw(1016 + 24 * 112); assert.equal(frame(draw), 24);
  draw = f.draw(3816); assert.equal(draw[0], f.images.talk); assert.ok(frame(draw) >= 4 && frame(draw) <= 21);
  draw = f.draw(5000); assert.equal(draw[0], f.images.talk);
  f.game.speech = null;
  draw = f.draw(5016); assert.equal(draw[0], f.images.talk); assert.equal(frame(draw), 4);
});
test('reaction returns to quiet frame during choices and close/reopen uses approved return and intro', () => {
  const f = fixture(); f.accept(); f.game.speech = null;
  assert.equal(f.draw(1016)[0], f.images.reaction);
  assert.equal(frame(f.draw(3816)), 4);
  f.dialogue.close(); assert.equal(frame(f.draw(3832)), 22);
  assert.equal(f.draw(4393)[0], f.images.idle);
  f.dialogue.start('dialogue.tony_fridge');
  assert.equal(frame(f.draw(4409)), 0);
  assert.equal(frame(f.draw(5409)), 4);
});
test('skipping cancels a chuckle and same-node UI refresh cannot retrigger it', () => {
  const f = fixture(); f.accept();
  f.draw(1016); f.dialogue.getNode();
  assert.equal(frame(f.draw(1128)), 1);
  f.dialogue.choose({ next: 'challenge_waiting' });
  assert.equal(f.draw(1144)[0], f.images.talk);
  f.dialogue.choose({ next: 'challenge_accepted' });
  assert.equal(frame(f.draw(1160)), 0);
  f.game.menuOpen = true; assert.equal(frame(f.draw(5000)), 0);
  f.game.menuOpen = false; assert.equal(frame(f.draw(5112)), 1);
});
test('scene change consumes the old entry, and missing reaction falls back without late replay', () => {
  const f = fixture(); f.accept(); f.draw(1016);
  f.draw(1032, { id: 'other' }, { ...layer, talkAnimation: undefined, reactionAnimations: undefined });
  f.draw(1048);
  assert.equal(f.draw(2048)[0], f.images.talk);
  f.dialogue.choose({ next: 'challenge_accepted' });
  f.loaded.delete(f.images.reaction);
  assert.equal(f.draw(2064)[0], f.images.talk);
  f.loaded.add(f.images.reaction); assert.equal(f.draw(2080)[0], f.images.talk);
  f.loaded.delete(f.images.talk); assert.equal(f.draw(2096)[0], f.images.idle);
  f.loaded.delete(f.images.idle); assert.equal(f.draw(2112)[0], f.images.static);
});
test('fast acceptance defers chuckle until intro finishes and closes without a delayed reaction', () => {
  const f = fixture(); f.dialogue.close(); f.dialogue.start('dialogue.tony_fridge');
  assert.equal(frame(f.draw(2000)), 0); f.accept();
  assert.equal(f.draw(2016)[0], f.images.talk);
  assert.equal(f.draw(2748)[0], f.images.reaction);
  f.dialogue.close(); assert.equal(f.draw(2764)[0], f.images.talk);
  assert.equal(frame(f.draw(2764)), 22);
});
test('chuckle preloads only in Mehana and keeps approved idle/talk/reference and election assets intact', () => {
  assert.ok(imageAssetPaths(assetManifest.scenes[scene.id]).includes(assetManifest.scenes[scene.id].tonyFridgeChuckleSeated));
  assert.deepEqual([layer.left, layer.top, layer.height, layer.zIndex], [861, 310, 244, 35]);
  assert.deepEqual(reaction.registrationBounds, layer.animation.contentBounds);
  assert.equal(reaction.loop, false);
  const election = chapter1.scenes.find(s => s.id === 'scene.chapter1.election_booth');
  assert.ok(election.foregroundLayers.every(l => !l.reactionAnimations));
  assert.equal(assetManifest.scenes[election.id].tonyFridgeChuckleSeated, undefined);
  const sha = p => createHash('sha256').update(readFileSync(p)).digest('hex');
  for (const [name, hash] of [['seated-v1.png','b1d088b7d120490bcf5a4dcabcbab9531462a36e467661cff7242ae2c911bde8'],['idle-seated-v1.webp','1cca1e9231c9401f01625f16913e124c0ac3728c2d10f05b862e2836f6e2fd7e'],['talk-seated-v1.webp','9ad05841d2f274e9c66574dca99cf802a41207c7468b7db4bad4ed77436c3ac0']]) assert.equal(sha('assets/chapter1/characters/tony_fridge/'+name),hash);
});
