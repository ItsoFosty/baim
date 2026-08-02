export function requirementsMet(requirements = {}, context = {}) {
  const state = context.state || {};
  const flags = state.flags || {};
  const inventory = context.inventory;

  if ((requirements.items || []).some((itemId) => !inventory?.has(itemId))) return false;
  if ((requirements.flags || []).some((flag) => !flags[flag])) return false;
  if ((requirements.notFlags || []).some((flag) => Boolean(flags[flag]))) return false;
  if (requirements.state && Object.entries(requirements.state).some(([key, value]) => state[key] !== value)) return false;
  return true;
}

export function firstMatchingRule(rules = [], context = {}) {
  return rules.find((rule) => requirementsMet(rule.requirements, context)) || null;
}

export function applyEffects(effects = [], context = {}) {
  const state = context.state || {};
  state.flags ||= {};

  for (const effect of effects) {
    if (effect.type === "setFlag") {
      state.flags[effect.key] = effect.value ?? true;
    } else if (effect.type === "setState") {
      state[effect.key] = effect.value;
    } else if (effect.type === "adjustState") {
      state[effect.key] = (Number(state[effect.key]) || 0) + Number(effect.amount || 0);
    } else if (effect.type === "addItem") {
      context.inventory?.add(effect.itemId);
    } else if (effect.type === "removeItem") {
      context.inventory?.remove(effect.itemId);
    } else if (effect.type === "startQuest") {
      context.quests?.start(effect.questId);
    } else if (effect.type === "completeQuest") {
      context.quests?.complete(effect.questId);
    } else {
      throw new Error(`Unknown content effect type: ${effect.type}`);
    }
  }
}
