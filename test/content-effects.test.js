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
  assert.equal(requirementsMet({ stateMin: { cheapOffers: 2 }, stateMax: { cheapOffers: 4 } }, {
    state: { cheapOffers: 3 }
  }), true);
  assert.equal(requirementsMet({ stateMin: { cheapOffers: 4 } }, { state: { cheapOffers: 3 } }), false);
  assert.equal(requirementsMet({ stateMax: { cheapOffers: 2 } }, { state: { cheapOffers: 3 } }), false);
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
  const wineOrder = choices.find((choice) => choice.textKey === "dialogue.waiter.choice.village_wine");
  assert.equal(rakiaOrder.next, "rakia_serving");
  assert.equal(shopskaOrder.next, "shopska_serving");
  assert.equal(soupOrder.next, "tripe_soup_serving");
  assert.equal(wineOrder.next, "village_wine_serving");

  const forHere = (nodeId) => waiterDialogue.nodes[nodeId].choices
    .find((choice) => choice.textKey === "dialogue.waiter.choice.for_here");
  const toGo = (nodeId) => waiterDialogue.nodes[nodeId].choices
    .find((choice) => choice.textKey === "dialogue.waiter.choice.to_go");
  const inventory = inventoryWith();
  const state = { flags: {}, rakiaGlasses: 4 };

  applyEffects(forHere("rakia_serving").effect.effects, { state, inventory });
  applyEffects(forHere("shopska_serving").effect.effects, { state, inventory });
  applyEffects(forHere("tripe_soup_serving").effect.effects, { state, inventory });
  applyEffects(forHere("village_wine_serving").effect.effects, { state, inventory });

  assert.equal(inventory.has("item.rakia"), false);
  assert.equal(inventory.has("item.shopska_salad"), false);
  assert.equal(inventory.has("item.tripe_soup"), false);
  assert.equal(inventory.has("item.village_wine"), false);
  assert.equal(state.flags.mehanaOrderedRakia, true);
  assert.equal(state.flags.mehanaOrderedShopska, true);
  assert.equal(state.flags.mehanaOrderedTripeSoup, true);
  assert.equal(state.rakiaGlasses, 4);

  const takeawayInventory = inventoryWith();
  const takeawayState = { flags: {}, rakiaGlasses: 0 };
  applyEffects(toGo("rakia_serving").effect.effects, { state: takeawayState, inventory: takeawayInventory });
  applyEffects(toGo("shopska_serving").effect.effects, { state: takeawayState, inventory: takeawayInventory });
  applyEffects(toGo("tripe_soup_serving").effect.effects, { state: takeawayState, inventory: takeawayInventory });
  applyEffects(toGo("village_wine_serving").effect.effects, { state: takeawayState, inventory: takeawayInventory });

  assert.equal(takeawayInventory.has("item.rakia"), true);
  assert.equal(takeawayInventory.has("item.shopska_salad"), true);
  assert.equal(takeawayInventory.has("item.tripe_soup"), true);
  assert.equal(takeawayInventory.has("item.village_wine"), true);
  assert.equal(takeawayState.rakiaGlasses, 0);
});

test("Baba accepts early oil but requires village wine after three cheap offers", () => {
  const baba = chapter1.dialogues.find((dialogue) => dialogue.id === "dialogue.baba_stoyanka");
  const waiter = chapter1.dialogues.find((dialogue) => dialogue.id === "dialogue.mehana_waiter");
  const choice = (textKey, predicate = () => true) => baba.nodes.start.choices
    .find((candidate) => candidate.textKey === textKey && predicate(candidate));
  const earlyOil = choice("dialogue.baba.choice.offer_oil", (candidate) => candidate.effect.requirements.stateMax);
  const lateOil = choice("dialogue.baba.choice.offer_oil", (candidate) => candidate.effect.requirements.stateMin);
  const earlyWine = choice("dialogue.baba.choice.offer_wine", (candidate) => candidate.effect.requirements.notFlags);
  const repairWine = choice("dialogue.baba.choice.offer_wine", (candidate) => candidate.effect.requirements.flags);

  const earlyInventory = inventoryWith("item.sunflower_oil");
  const earlyState = {
    flags: {}, babaCheapOfferAttempts: 2, babaStoyankaVote: false, babaTrust: "neutral",
    influence: 0, suspicion: 0, publicMood: 50
  };
  const earlyCompleted = [];
  assert.equal(requirementsMet(earlyOil.effect.requirements, { state: earlyState, inventory: earlyInventory }), true);
  applyEffects(earlyOil.effect.effects, {
    state: earlyState,
    inventory: earlyInventory,
    quests: { start() {}, complete: (questId) => earlyCompleted.push(questId) }
  });
  assert.equal(earlyInventory.has("item.sunflower_oil"), false);
  assert.equal(earlyState.babaStoyankaVote, true);
  assert.equal(earlyState.babaTrust, "traditional");
  assert.deepEqual(earlyCompleted, ["quest.chapter1.baba_vote"]);

  const lateInventory = inventoryWith(
    "item.unpaid_bills", "item.glass_of_water", "item.shopska_salad", "item.sunflower_oil"
  );
  const lateState = {
    flags: {}, babaCheapOfferAttempts: 0, babaStoyankaVote: false, babaTrust: "neutral",
    influence: 0, suspicion: 0, publicMood: 50
  };
  const started = [];
  const completed = [];
  const context = {
    state: lateState,
    inventory: lateInventory,
    quests: {
      start: (questId) => started.push(questId),
      complete: (questId) => completed.push(questId)
    }
  };
  for (const textKey of [
    "dialogue.baba.choice.offer_bills",
    "dialogue.baba.choice.offer_water",
    "dialogue.baba.choice.offer_shopska"
  ]) {
    const cheapOffer = choice(textKey);
    assert.equal(requirementsMet(cheapOffer.effect.requirements, context), true);
    applyEffects(cheapOffer.effect.effects, context);
  }
  assert.equal(lateState.babaCheapOfferAttempts, 3);
  assert.equal(requirementsMet(earlyOil.effect.requirements, context), false);
  assert.equal(requirementsMet(lateOil.effect.requirements, context), true);
  applyEffects(lateOil.effect.effects, context);
  assert.equal(lateInventory.has("item.sunflower_oil"), true);
  assert.equal(lateState.flags.babaRequiresBetterGift, true);

  const wineOrder = waiter.nodes.start.choices
    .find((candidate) => candidate.textKey === "dialogue.waiter.choice.village_wine");
  assert.equal(wineOrder.requirements, undefined);
  assert.equal(requirementsMet(wineOrder.requirements, context), true);
  const takeawayWine = waiter.nodes[wineOrder.next].choices
    .find((candidate) => candidate.textKey === "dialogue.waiter.choice.to_go");
  applyEffects(takeawayWine.effect.effects, context);
  assert.equal(lateInventory.has("item.village_wine"), true);

  assert.equal(requirementsMet(earlyWine.effect.requirements, context), false);
  assert.equal(requirementsMet(repairWine.effect.requirements, context), true);
  applyEffects(repairWine.effect.effects, context);
  assert.equal(lateInventory.has("item.village_wine"), false);
  assert.equal(lateState.babaStoyankaVote, true);
  assert.equal(lateState.babaTrust, "transactional");
  assert.deepEqual(completed, ["quest.chapter1.baba_vote"]);
  assert.ok(started.length >= 4);
});

test("Kiro always sells village wine and Baba reacts to early wine and rakia offers", () => {
  const baba = chapter1.dialogues.find((dialogue) => dialogue.id === "dialogue.baba_stoyanka");
  const waiter = chapter1.dialogues.find((dialogue) => dialogue.id === "dialogue.mehana_waiter");
  const choices = baba.nodes.start.choices;
  const rakiaOffer = choices.find((choice) => choice.textKey === "dialogue.baba.choice.offer_rakia");
  const earlyWineOffer = choices.find((choice) => (
    choice.textKey === "dialogue.baba.choice.offer_wine" && choice.effect.requirements.notFlags
  ));
  const wineOrder = waiter.nodes.start.choices
    .find((choice) => choice.textKey === "dialogue.waiter.choice.village_wine");
  const inventory = inventoryWith("item.rakia", "item.village_wine");
  const state = {
    flags: {}, babaStoyankaVote: false, babaCheapOfferAttempts: 0, suspicion: 0
  };
  const context = { state, inventory, quests: { start() {} } };

  assert.equal(wineOrder.requirements, undefined);
  assert.equal(requirementsMet(rakiaOffer.effect.requirements, context), true);
  assert.equal(requirementsMet(earlyWineOffer.effect.requirements, context), true);

  applyEffects(rakiaOffer.effect.effects, context);
  assert.equal(state.flags.babaRejectedRakia, true);
  assert.equal(inventory.has("item.rakia"), true);
  assert.equal(rakiaOffer.effect.messageKey, "msg.baba.reject_rakia");

  applyEffects(earlyWineOffer.effect.effects, context);
  assert.equal(inventory.has("item.village_wine"), true);
  assert.equal(earlyWineOffer.effect.messageKey, "msg.baba.reject_early_wine");
});

test("Baba dialogue exposes a first-conversation choice that starts her vote quest", () => {
  const baba = chapter1.dialogues.find((dialogue) => dialogue.id === "dialogue.baba_stoyanka");
  const startChoice = baba.nodes.start.choices
    .find((choice) => choice.textKey === "dialogue.baba.choice.ask_vote");
  const started = [];
  const state = { flags: {}, babaStoyankaVote: false };

  assert.ok(startChoice);
  assert.equal(requirementsMet(startChoice.requirements, { state }), true);
  applyEffects(startChoice.effect.effects, {
    state,
    quests: { start: (questId) => started.push(questId) }
  });

  assert.deepEqual(started, ["quest.chapter1.baba_vote"]);
  assert.equal(startChoice.next, "vote_terms");
  assert.equal(requirementsMet(startChoice.requirements, { state }), true);
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
