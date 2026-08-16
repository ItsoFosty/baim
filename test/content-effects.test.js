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

test("bounded state effects clamp counters and record a deterministic change time", () => {
  const state = { rakiaGlasses: 9, flags: {} };
  applyEffects([
    { type: "adjustState", key: "rakiaGlasses", amount: 4, min: 0, max: 10, timestampKey: "rakiaLastChangedAt" }
  ], { state, now: () => 123456 });
  assert.equal(state.rakiaGlasses, 10);
  assert.equal(state.rakiaLastChangedAt, 123456);

  applyEffects([
    { type: "adjustState", key: "rakiaGlasses", amount: -20, min: 0, max: 10, timestampKey: "rakiaLastChangedAt" }
  ], { state, now: () => 789000 });
  assert.equal(state.rakiaGlasses, 0);
  assert.equal(state.rakiaLastChangedAt, null);
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

test("Mehana waiter asks for here or to go before serving every order", () => {
  const waiterDialogue = chapter1.dialogues.find((dialogue) => dialogue.id === "dialogue.mehana_waiter");
  const choices = waiterDialogue.nodes.start.choices;
  const rakiaOrder = choices.find((choice) => choice.textKey === "dialogue.waiter.choice.rakia");
  const shopskaOrder = choices.find((choice) => choice.textKey === "dialogue.waiter.choice.shopska");
  const soupOrder = choices.find((choice) => choice.textKey === "dialogue.waiter.choice.tripe_soup");
  assert.equal(rakiaOrder.next, "rakia_serving");
  assert.equal(shopskaOrder.next, "shopska_serving");
  assert.equal(soupOrder.next, "tripe_soup_serving");

  const forHere = (nodeId) => waiterDialogue.nodes[nodeId].choices
    .find((choice) => choice.textKey === "dialogue.waiter.choice.for_here");
  const toGo = (nodeId) => waiterDialogue.nodes[nodeId].choices
    .find((choice) => choice.textKey === "dialogue.waiter.choice.to_go");
  const inventory = inventoryWith();
  const state = { flags: {}, rakiaGlasses: 4 };

  applyEffects(forHere("rakia_serving").effect.effects, { state, inventory });
  applyEffects(forHere("shopska_serving").effect.effects, { state, inventory });
  applyEffects(forHere("tripe_soup_serving").effect.effects, { state, inventory });

  assert.equal(inventory.has("item.rakia"), false);
  assert.equal(inventory.has("item.shopska_salad"), false);
  assert.equal(inventory.has("item.tripe_soup"), false);
  assert.equal(state.flags.mehanaOrderedRakia, true);
  assert.equal(state.flags.mehanaOrderedShopska, true);
  assert.equal(state.flags.mehanaOrderedTripeSoup, true);
  assert.equal(state.rakiaGlasses, 3);

  const takeawayInventory = inventoryWith();
  const takeawayState = { flags: {}, rakiaGlasses: 0 };
  applyEffects(toGo("rakia_serving").effect.effects, { state: takeawayState, inventory: takeawayInventory });
  applyEffects(toGo("shopska_serving").effect.effects, { state: takeawayState, inventory: takeawayInventory });
  applyEffects(toGo("tripe_soup_serving").effect.effects, { state: takeawayState, inventory: takeawayInventory });

  assert.equal(takeawayInventory.has("item.rakia"), true);
  assert.equal(takeawayInventory.has("item.shopska_salad"), true);
  assert.equal(takeawayInventory.has("item.tripe_soup"), true);
  assert.equal(takeawayState.rakiaGlasses, 0);
});

test("apartment bottle, sofa-bed, water, and tripe soup author the intoxication loop", () => {
  const apartment = chapter1.scenes.find((scene) => scene.id === "scene.chapter1.apartment");
  const mehana = chapter1.scenes.find((scene) => scene.id === "scene.chapter1.mehana");
  const waiter = chapter1.dialogues.find((dialogue) => dialogue.id === "dialogue.mehana_waiter");
  const bottle = apartment.interactables.find((target) => target.id === "hotspot.apartment.rakia_bottle");
  const bed = apartment.interactables.find((target) => target.id === "hotspot.apartment.bed");
  const water = mehana.interactables.find((target) => target.id === "hotspot.mehana.water_jug");
  const soup = waiter.nodes.tripe_soup_serving.choices
    .find((choice) => choice.textKey === "dialogue.waiter.choice.for_here");
  const inventory = inventoryWith("item.glass_of_water");
  const state = { rakiaGlasses: 5, tonyVote: false, flags: {} };
  const context = { state, inventory, now: () => 9000 };

  applyEffects(bottle.useRules[0].effects, context);
  assert.equal(state.rakiaGlasses, 6);
  applyEffects(bed.useRules[0].effects, context);
  assert.equal(state.rakiaGlasses, 3);
  applyEffects(firstMatchingRule(water.useRules, context).effects, context);
  assert.equal(state.rakiaGlasses, 2);
  assert.equal(inventory.has("item.glass_of_water"), false);
  applyEffects(soup.effect.effects, context);
  assert.equal(state.rakiaGlasses, 0);
});
