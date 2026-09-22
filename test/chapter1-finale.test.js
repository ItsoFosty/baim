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
  assert.equal(electionExit.debugVisual, undefined);
  const sign = square.foregroundLayers.find(layer => layer.asset === "electionSign");
  assert.equal(sign.visibleWhenTargetId, electionExit.id);
  assert.notEqual(findTargetAt(square, { x: 290, y: 520 }, target =>
    requirementsMet(target.requirements, context))?.id, electionExit.id);
  assert.equal(findTargetAt(square, { x: 290, y: 350 }, (target) => (
    requirementsMet(target.requirements, context)
  )).id, "hotspot.square.election_notice");

  const dialogue = chapter1.dialogues.find((entry) => entry.id === "dialogue.journalist");
  for (const nodeId of ["roads", "complaints", "ballot_box"]) {
    applyEffects(dialogue.nodes[nodeId].choices[0].effect.effects, context);
  }
  assert.equal(context.state.journalistInterviewCompleted, true);
  assert.equal(requirementsMet(electionExit.requirements, context), true);
  assert.equal(findTargetAt(square, { x: 290, y: 520 }, (target) => (
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

test("both supporters guarantee a win across every meter boundary", () => {
  for (const influence of [0, 14, 15, 39, 40, 100]) {
    for (const publicMood of [0, 34, 35, 54, 55, 100]) {
      for (const suspicion of [0, 35, 36, 70, 71, 100]) {
        const ending = selectEnding(chapter1.endings, endingContext({ babaStoyankaVote: true, tonyVote: true, influence, publicMood, suspicion }));
        assert.notEqual(ending.id, "ending.chapter1.loss");
        const convincing = influence >= 40 && publicMood >= 55 && suspicion <= 35;
        assert.equal(ending.id, convincing ? "ending.chapter1.convincing_win" : "ending.chapter1.narrow_win");
      }
    }
  }
});

test("one-supporter thresholds are inclusive; no supporters cannot win through meter farming", () => {
  for (const support of [{ babaStoyankaVote: true }, { tonyVote: true }]) {
    const base = { ...support, influence: 15, publicMood: 35, suspicion: 70 };
    assert.equal(selectEnding(chapter1.endings, endingContext(base)).id, "ending.chapter1.narrow_win");
    for (const change of [{ influence: 14 }, { publicMood: 34 }, { suspicion: 71 }]) {
      assert.equal(selectEnding(chapter1.endings, endingContext({ ...base, ...change })).id, "ending.chapter1.loss");
    }
  }
  assert.equal(selectEnding(chapter1.endings, endingContext({ influence: 100, publicMood: 100 })).id, "ending.chapter1.loss");
});

test("resolved elections retain their exact result, explanation and epilogue on repeated resolution", () => {
  const context = endingContext();
  resolveEnding(chapter1.endings, context);
  const report = [...context.state.endingReportKeys];
  assert.ok(context.state.endingEpilogueKeys.includes("election.epilogue.dry"));
  assert.ok(context.state.endingEpilogueKeys.includes("election.epilogue.mayor_loss"));
  assert.ok(context.state.endingEpilogueKeys.includes("election.epilogue.creditors"));
  Object.assign(context.state, { babaStoyankaVote: true, tonyVote: true, influence: 100, publicMood: 100 });
  context.state.flags.fountainRepaired = true;
  assert.equal(resolveEnding(chapter1.endings, context).id, "ending.chapter1.loss");
  assert.deepEqual(context.state.endingReportKeys, report);
  assert.ok(context.state.endingEpilogueKeys.includes("election.epilogue.dry"));
});

import { electionDialogue, deliverBoxRule, electionReadyRequirements, electionScene } from "../src/content/chapter1/election.js";
import { SaveSystem } from "../src/engine/SaveSystem.js";
import { DEFAULT_SAVE } from "../src/engine/ids.js";
import { isWalkable } from "../src/engine/SceneGeometry.js";
import { electionBg, electionEn } from "../src/content/localization/chapter1Election.js";

test("box handover and objections persist independently, in any order, without requiring supporters", () => {
  for (const order of [["credentials", "evidence", "container"], ["container", "credentials", "evidence"], ["evidence", "container", "credentials"]]) {
    const context = endingContext({ ...structuredClone(DEFAULT_SAVE), journalistInterviewCompleted: true,
      flags: { candidateRegistrationStamped: true, ballotBoxRecovered: true } });
    assert.equal(requirementsMet(electionReadyRequirements, context), false);
    assert.equal(requirementsMet(deliverBoxRule.requirements, context), true);
    applyEffects(deliverBoxRule.effects, context);
    assert.equal(context.inventory.has("item.ballot_box"), false);
    assert.equal(requirementsMet(deliverBoxRule.requirements, context), false);
    for (const name of order) {
      const answer = electionDialogue.nodes[name].choices[0];
      assert.equal(requirementsMet(answer.requirements, context), true);
      applyEffects(answer.effect.effects, context);
      const raw = JSON.stringify(context.state);
      const restored = new SaveSystem({ getItem: () => raw }).load();
      for (const [key, value] of Object.entries(context.state.flags)) assert.equal(restored.flags[key], value);
      assert.equal(restored.ballotBoxDelivered, true);
      Object.assign(context.state, restored);
    }
    assert.equal(requirementsMet(electionReadyRequirements, context), true);
  }
});

test("missing or dropped box and unfinished registration cannot skip the election gate", () => {
  const context = endingContext({ ...structuredClone(DEFAULT_SAVE) });
  assert.equal(requirementsMet(deliverBoxRule.requirements, context), false);
  context.state.flags = { candidateRegistrationStamped: true, ballotBoxRecovered: true };
  context.state.journalistInterviewCompleted = true;
  context.inventory.remove("item.ballot_box");
  context.state.droppedItems = [{ itemId: "item.ballot_box", sceneId: "scene.chapter1.village_square" }];
  assert.equal(requirementsMet(deliverBoxRule.requirements, context), false);
  assert.equal(requirementsMet(electionReadyRequirements, context), false);
  context.inventory.add("item.ballot_box");
  assert.equal(requirementsMet(deliverBoxRule.requirements, context), true);
});

test("new ending snapshots and legacy resolved saves survive loading without reopening", () => {
  const context = endingContext({ ...structuredClone(DEFAULT_SAVE), babaStoyankaVote: true, tonyVote: true, flags: { fountainRepaired: true } });
  resolveEnding(chapter1.endings, context);
  context.state.endingPresentationIndex = 2;
  const raw = JSON.stringify(context.state);
  const restored = new SaveSystem({ getItem: () => raw }).load();
  assert.equal(restored.endingId, "ending.chapter1.narrow_win");
  assert.equal(restored.endingPresentationIndex, 2);
  assert.ok(restored.endingEpilogueKeys.includes("election.epilogue.water"));
  assert.equal(restored.chapter1Completed, true);
  const legacy = new SaveSystem({ getItem: () => JSON.stringify({ chapter1Completed: true, endingId: "ending.chapter1.loss", hasFakeDiploma: true }) }).load();
  assert.equal(legacy.endingId, "ending.chapter1.loss");
  assert.equal(legacy.chapter1Completed, true);
});

test("election staging has reachable floor anchors, conditional supporters and complete bilingual copy", () => {
  assert.equal(isWalkable(electionScene, electionScene.playerStart), true);
  assert.equal(isWalkable(electionScene, electionScene.anchors.commissionTable), true);
  for (const key of Object.keys(electionEn)) {
    assert.equal(typeof electionBg[key], "string", key);
    assert.notEqual(electionBg[key], electionEn[key]);
  }
  const context = endingContext();
  for (const id of ["npc.baba_stoyanka", "npc.tony_fridge"]) {
    assert.equal(requirementsMet(electionScene.npcs.find(npc => npc.id === id).requirements, context), false);
  }
});

import { createReviewSaveSystem } from "../src/engine/ReviewState.js";
test("review presets isolate saves and produce the advertised endings", () => {
  for (const [name, preset] of Object.entries(chapter1.reviewPresets)) {
    const system = createReviewSaveSystem(DEFAULT_SAVE, preset, chapter1);
    const state = system.load();
    assert.equal(state.currentSceneId, "scene.chapter1.election_booth");
    if (name === "election") assert.equal(state.chapter1Completed, false);
    else assert.equal(state.endingId, `ending.chapter1.${name}`);
    system.save({ ...state, language: "en" });
    assert.equal(system.load().language, "en");
    assert.equal(createReviewSaveSystem(DEFAULT_SAVE, preset, chapter1).load().language, "bg");
  }
});

test("square polling exit lands inside the election walk mask", () => {
  const square = chapter1.scenes.find(scene => scene.id === "scene.chapter1.village_square");
  assert.equal(isWalkable(electionScene, square.exits.find(exit => exit.id === "exit.square.to_election_booth").targetPosition), true);
});
