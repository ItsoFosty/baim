import test from "node:test";
import assert from "node:assert/strict";
import { applyEffects, firstMatchingRule, requirementsMet } from "../src/engine/EffectSystem.js";
import { chapter1 } from "../src/content/chapter1/index.js";

function inventoryWith(...initialItems) {
  const items = new Set(initialItems);
  return {
    has: (itemId) => items.has(itemId),
    add: (itemId) => items.add(itemId),
    remove: (itemId) => items.delete(itemId)
  };
}

test("content requirements combine inventory, flags, and state values", () => {
  const context = {
    state: { flags: { challengeStarted: true }, voteWon: false },
    inventory: inventoryWith("item.accordion")
  };
  assert.equal(requirementsMet({
    items: ["item.accordion"],
    flags: ["challengeStarted"],
    notFlags: ["guardAlerted"],
    state: { voteWon: false }
  }, context), true);
  assert.equal(requirementsMet({ items: ["item.missing"] }, context), false);
});

test("content effects update reusable state, inventory, and quest systems", () => {
  const completed = [];
  const inventory = inventoryWith();
  const state = { influence: 2, flags: {} };
  applyEffects([
    { type: "setFlag", key: "npcDistracted" },
    { type: "setState", key: "voteWon", value: true },
    { type: "adjustState", key: "influence", amount: 5 },
    { type: "addItem", itemId: "item.example" },
    { type: "completeQuest", questId: "quest.example" }
  ], {
    state,
    inventory,
    quests: { complete: (questId) => completed.push(questId) }
  });
  assert.equal(state.flags.npcDistracted, true);
  assert.equal(state.voteWon, true);
  assert.equal(state.influence, 7);
  assert.equal(inventory.has("item.example"), true);
  assert.deepEqual(completed, ["quest.example"]);
});

test("unknown content effect types fail loudly", () => {
  assert.throws(
    () => applyEffects([{ type: "misspelledEffect" }], { state: { flags: {} } }),
    /Unknown content effect type/
  );
});

test("Tony vote vertical slice is reachable from authored Chapter 1 data", () => {
  const apartment = chapter1.scenes.find((scene) => scene.id === "scene.chapter1.apartment");
  const mehana = chapter1.scenes.find((scene) => scene.id === "scene.chapter1.mehana");
  const accordion = apartment.interactables.find((target) => target.id === "hotspot.apartment.accordion");
  const tony = mehana.npcs.find((target) => target.id === "npc.tony_fridge");
  const water = mehana.interactables.find((target) => target.id === "hotspot.mehana.water_jug");
  const inventory = inventoryWith(accordion.takeItemId);
  const state = {
    tonyVote: false,
    influence: 0,
    suspicion: 0,
    publicMood: 50,
    flags: { tonyChallengeStarted: true }
  };
  const completed = [];
  const context = {
    state,
    inventory,
    quests: { complete: (questId) => completed.push(questId) }
  };

  const distraction = firstMatchingRule(tony.useRules, context);
  assert.ok(distraction);
  applyEffects(distraction.effects, context);
  const swap = firstMatchingRule(water.useRules, context);
  assert.equal(swap.messageKey, "msg.water_swap_success");
  applyEffects(swap.effects, context);

  assert.equal(state.tonyVote, true);
  assert.equal(state.influence, 25);
  assert.equal(state.suspicion, 10);
  assert.equal(state.publicMood, 55);
  assert.deepEqual(completed, ["quest.chapter1.tony_vote"]);
});
