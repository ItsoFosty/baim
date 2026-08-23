import { applyEffects, requirementsMet } from "./EffectSystem.js";

export function selectEnding(endings = [], context = {}) {
  return endings.find((ending) => requirementsMet(ending.requirements, context)) || null;
}

export function resolveEnding(endings = [], context = {}) {
  const ending = selectEnding(endings, context);
  if (!ending) return null;
  applyEffects(ending.effects, context);
  return ending;
}
