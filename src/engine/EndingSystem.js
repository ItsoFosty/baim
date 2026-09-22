import { applyEffects, requirementsMet } from "./EffectSystem.js";

export function selectEnding(endings = [], context = {}) {
  return endings.find((ending) => requirementsMet(ending.requirements, context)) || null;
}

export function resolveEnding(endings = [], context = {}) {
  const previous = endings.find(ending => ending.id === context.state?.endingId);
  if (previous) return previous;
  const ending = selectEnding(endings, context);
  if (!ending) return null;
  applyEffects(ending.effects, context);
  context.state.endingReportKeys = (ending.reportRules || [])
    .filter(rule => requirementsMet(rule.requirements, context)).map(rule => rule.textKey);
  context.state.endingEpilogueKeys = (ending.epilogue || [])
    .filter(rule => requirementsMet(rule.requirements, context)).map(rule => rule.textKey);
  context.state.endingPresentationIndex = 0;
  return ending;
}
