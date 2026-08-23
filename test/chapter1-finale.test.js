import test from "node:test";
import assert from "node:assert/strict";
import { chapter1 } from "../src/content/chapter1/index.js";
import { applyEffects, requirementsMet } from "../src/engine/EffectSystem.js";
import { resolveEnding, selectEnding } from "../src/engine/EndingSystem.js";
import { QuestSystem } from "../src/engine/QuestSystem.js";
import { findTargetAt } from "../src/engine/SceneGeometry.js";
import { bg } from "../src/content/localization/bg.js";
import { en } from "../src/content/localization/en.js";

function endingContext(overrides = {}) {
  const inventoryItems = new Set(["item.ballot_box"]);
  const state = {
    flags: {},
    babaStoyankaVote: false,
    tonyVote: false,
    influence: 0,
    publicMood: 50,
    suspicion: 0,
    chapter1Completed: false,
    activeQuests: [
      "quest.chapter1.main",
      "quest.chapter1.baba_vote",
      "quest.chapter1.tony_vote"
    ],
    completedQuests: [],
    expiredQuests: [],
    ...overrides
  };
  const quests = new QuestSystem(Object.fromEntries(chapter1.quests.map((quest) => [quest.id, quest])), state);
  const inventory = {
    has: (itemId) => inventoryItems.has(itemId),
    add: (itemId) => inventoryItems.add(itemId),
    remove: (itemId) => inventoryItems.delete(itemId)
  };
  return { state, quests, inventory };
}

test("Chapter 1 selects convincing, narrow, and loss endings in authored priority order", () => {
  assert.equal(selectEnding(chapter1.endings, endingContext({
    babaStoyankaVote: true,
    tonyVote: true,
    influence: 40,
    publicMood: 55,
    suspicion: 35
  })).id, "ending.chapter1.convincing_win");

  assert.equal(selectEnding(chapter1.endings, endingContext({
    babaStoyankaVote: true,
    influence: 15,
    publicMood: 35,
    suspicion: 70
  })).id, "ending.chapter1.narrow_win");

  assert.equal(selectEnding(chapter1.endings, endingContext()).id, "ending.chapter1.loss");
});

test("resolving the finale persists the outcome and closes unfinished campaign quests", () => {
  const context = endingContext({
    tonyVote: true,
    influence: 25,
    publicMood: 50,
    suspicion: 10
  });
  const ending = resolveEnding(chapter1.endings, context);
  assert.equal(ending.id, "ending.chapter1.narrow_win");
  assert.equal(context.state.chapter1Completed, true);
  assert.equal(context.state.wonMunicipalSeat, true);
  assert.equal(context.state.ballotBoxDelivered, true);
  assert.equal(context.inventory.has("item.ballot_box"), false);
  assert.deepEqual(context.state.completedQuests, ["quest.chapter1.main"]);
  assert.deepEqual(context.state.expiredQuests.sort(), [
    "quest.chapter1.baba_vote",
    "quest.chapter1.tony_vote"
  ]);
});

test("the recovered ballot box reveals a completable journalist encounter and polling station", () => {
  const square = chapter1.scenes.find((scene) => scene.id === "scene.chapter1.village_square");
  const journalist = square.npcs.find((npc) => npc.id === "npc.journalist");
  const electionExit = square.exits.find((exit) => exit.id === "exit.square.to_election_booth");
  const context = {
    state: {
      flags: { ballotBoxRecovered: true },
      chapter1Completed: false,
      journalistInterviewCompleted: false,
      influence: 0,
      publicMood: 50,
      suspicion: 0
    }
  };
  assert.equal(requirementsMet(journalist.requirements, context), true);
  assert.equal(requirementsMet(electionExit.requirements, context), false);
  assert.equal(findTargetAt(square, { x: 290, y: 350 }, (target) => (
    requirementsMet(target.requirements, context)
  )).id, "hotspot.square.election_notice");

  const dialogue = chapter1.dialogues.find((entry) => entry.id === "dialogue.journalist");
  for (const nodeId of ["roads", "complaints", "ballot_box"]) {
    applyEffects(dialogue.nodes[nodeId].choices[0].effect.effects, context);
  }
  assert.equal(context.state.journalistInterviewCompleted, true);
  assert.equal(requirementsMet(electionExit.requirements, context), true);
  assert.equal(findTargetAt(square, { x: 290, y: 350 }, (target) => (
    requirementsMet(target.requirements, context)
  )).id, "exit.square.to_election_booth");
});

test("every finale localization key is authored naturally in Bulgarian and English", () => {
  const keys = [
    "scene.chapter1.election_booth.title",
    "npc.journalist.name",
    "dialogue.journalist.start",
    "ui.election.commit_confirm",
    ...chapter1.endings.flatMap((ending) => [ending.titleKey, ending.bodyKey])
  ];
  for (const key of keys) {
    assert.equal(typeof bg[key], "string", `missing Bulgarian ${key}`);
    assert.equal(typeof en[key], "string", `missing English ${key}`);
    assert.notEqual(bg[key], en[key], `localizations should be independently authored: ${key}`);
  }
});
