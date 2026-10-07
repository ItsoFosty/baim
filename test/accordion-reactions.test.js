import test from 'node:test';
import assert from 'node:assert/strict';
import { MessageVariationSystem } from '../src/engine/MessageVariationSystem.js';
import { Game } from '../src/engine/Game.js';
import { DEFAULT_SAVE } from '../src/engine/ids.js';
import { findTargetAt, nearestReachableWalkablePoint, findWalkPath } from '../src/engine/SceneGeometry.js';
import { chapter1 } from '../src/content/chapter1/index.js';
import { accordionReactions, accordionCharacterReactions } from '../src/content/chapter1/accordionReactions.js';
import { accordionCue } from '../src/content/chapter1/audio.js';
import { strings } from '../src/content/localization/index.js';

const square = chapter1.scenes.find(s => s.id === 'scene.chapter1.village_square');
const oldMen = square.npcs.find(t => t.id === 'hotspot.square.old_men_bench');

function harness(language = 'bg') {
  const game = Object.create(Game.prototype);
  Object.assign(game, {
    state: structuredClone(DEFAULT_SAVE), player: {}, currentScene: square,
    content: { items: Object.fromEntries(chapter1.items.map(i => [i.id, i])) },
    inventory: { has: id => id === 'item.accordion' },
    audio: { play(cue) { assert.equal(cue, accordionCue); } },
    messageVariations: new MessageVariationSystem(() => 0.25),
    t: key => strings[language][key],
    sceneMovementSpeed: () => 1, save() {}, renderUi() {},
    setNpcSpeechMessage(target, text) { this.reaction = { target, text }; },
    setStatusMessage(text) { this.reaction = { text }; }
  });
  return game;
}

test('shuffled pools exhaust every line and avoid repeats across cycles without sharing speaker history', () => {
  for (const random of [() => 0, () => 0.5, () => 0.999]) {
    const variations = new MessageVariationSystem(random);
    const keys = ['a', 'b', 'c', 'd'];
    let last;
    for (let cycle = 0; cycle < 8; cycle++) {
      const heard = [];
      for (let i = 0; i < keys.length; i++) {
        const key = variations.next(keys);
        assert.notEqual(key, last);
        heard.push(key); last = key;
        assert.equal(variations.next(['other']), 'other');
      }
      assert.deepEqual([...heard].sort(), keys);
    }
    assert.equal(variations.next([]), undefined);
    assert.equal(variations.next(['solo', 'solo']), 'solo');
  }
});

test('every accordion reaction pool is fully bilingual, unique, and covers every authored person', () => {
  const used = new Set();
  for (const keys of Object.values(accordionReactions)) {
    assert.ok(keys.length >= 3);
    for (const key of keys) {
      assert.ok(!used.has(key), `shared character reaction: ${key}`);
      used.add(key);
      for (const language of ['bg', 'en']) {
        assert.equal(typeof strings[language][key], 'string', `${language}: ${key}`);
        assert.ok(strings[language][key].trim().length > 0);
      }
    }
  }
  const targets = new Set(accordionCharacterReactions.flatMap(r => r.targetIds));
  targets.add('npc.baba_stoyanka');
  for (const scene of chapter1.scenes) for (const target of [...scene.npcs, ...scene.interactables]) {
    if (target.kind === 'npc' || target.id === 'hotspot.square.kiosk') assert.ok(targets.has(target.id), target.id);
  }
});

test('both old men are clickable NPCs with the existing stable ID and a reachable approach', () => {
  assert.equal(oldMen.kind, 'npc');
  assert.equal(strings.en[oldMen.nameKey], 'The Two Old Men');
  for (const point of [{ x: 514, y: 334 }, { x: 558, y: 342 }, { x: 580, y: 391 }]) {
    assert.equal(findTargetAt(square, point)?.id, oldMen.id);
  }
  assert.notEqual(findTargetAt(square, { x: 610, y: 430 })?.id, oldMen.id);
  const from = { x: 300, y: 540 };
  const approach = nearestReachableWalkablePoint(square, from, { x: 543, y: 415 });
  assert.ok(approach);
  assert.ok(findWalkPath(square, from, approach).length);
});

test('old men react in their own voice, all variants play, and music does not advance fountain progress', () => {
  for (const language of ['bg', 'en']) {
    const game = harness(language);
    const before = structuredClone(game.state);
    const heard = new Set();
    for (let i = 0; i < 4; i++) {
      game.useInventoryItemOnTarget('item.accordion', oldMen);
      assert.equal(game.reaction.target, oldMen);
      heard.add(game.reaction.text);
    }
    assert.equal(heard.size, 4);
    assert.deepEqual(game.state, before);
    assert.deepEqual(heard, new Set(accordionReactions.oldMen.map(key => strings[language][key])));
  }
});

test('Baba state and Toni distraction effects stay correct when reaction text varies', () => {
  const game = harness();
  const baba = square.npcs.find(n => n.id === 'npc.baba_stoyanka');
  for (const supported of [false, true]) {
    game.state.babaStoyankaVote = supported;
    const keys = supported ? accordionReactions.babaAfter : accordionReactions.babaBefore;
    const heard = new Set();
    for (let i = 0; i < keys.length; i++) {
      game.useInventoryItemOnTarget('item.accordion', baba);
      heard.add(game.reaction.text);
      assert.equal(game.state.babaStoyankaVote, supported);
    }
    assert.deepEqual(heard, new Set(keys.map(key => strings.bg[key])));
  }
  const tony = chapter1.scenes.find(s => s.id === 'scene.chapter1.mehana').npcs.find(n => n.id === 'npc.tony_fridge');
  game.state.flags.tonyChallengeStarted = true;
  game.useInventoryItemOnTarget('item.accordion', tony);
  assert.equal(game.state.flags.tonyDistracted, true);
  assert.ok(accordionReactions.tonyDistracted.some(key => strings.bg[key] === game.reaction.text));
  game.useInventoryItemOnTarget('item.accordion', tony);
  assert.ok(accordionReactions.tony.some(key => strings.bg[key] === game.reaction.text));
  assert.equal(game.state.tonyVote, false);
});

test('state-specific message selection takes precedence over generic shuffled flavor', () => {
  const game = harness();
  const definition = { soundCue: accordionCue, messageKeys: accordionReactions.self,
    messageByState: { key: 'suspicion', ranges: [{ min: 0, messageKey: 'msg.self.accordion' }] } };
  game.applyContentEffect(definition);
  assert.equal(game.reaction.text, strings.bg['msg.self.accordion']);
});
