export const RAKIA_MAX_GLASSES = 10;
export const RAKIA_SOBER_INTERVAL_MS = 5 * 60 * 1000;

export function clampRakiaGlasses(value) {
  return Math.max(0, Math.min(RAKIA_MAX_GLASSES, Math.round(Number(value) || 0)));
}

export function intoxicationBandKey(value) {
  const glasses = clampRakiaGlasses(value);
  if (glasses <= 1) return "daisy";
  if (glasses <= 4) return "merry";
  if (glasses <= 7) return "tipsy";
  return "plastered";
}

export function intoxicationColor(value) {
  const glasses = clampRakiaGlasses(value);
  if (glasses === 0) return "rgb(116, 105, 75)";
  const progress = (glasses - 1) / (RAKIA_MAX_GLASSES - 1);
  const start = { r: 218, g: 190, b: 82 };
  const end = { r: 211, g: 52, b: 48 };
  const channel = (from, to) => Math.round(from + (to - from) * progress);
  return `rgb(${channel(start.r, end.r)}, ${channel(start.g, end.g)}, ${channel(start.b, end.b)})`;
}

export function intoxicationMovementMultiplier(value) {
  return 1 - clampRakiaGlasses(value) * 0.024;
}

export function intoxicationSway(value, animationTime = 0) {
  const glasses = clampRakiaGlasses(value);
  if (glasses < 2) return { x: 0, y: 0 };
  const strength = (glasses - 1) * 0.55;
  return {
    x: Math.sin(animationTime * 2.15) * strength,
    y: Math.sin(animationTime * 1.35 + 0.8) * strength * 0.22
  };
}

export function applyTimedSobering(state, now = Date.now()) {
  const glasses = clampRakiaGlasses(state?.rakiaGlasses);
  if (!state || glasses === 0) {
    if (state) {
      state.rakiaGlasses = 0;
      state.rakiaLastChangedAt = null;
    }
    return 0;
  }
  const lastChangedAt = Number(state.rakiaLastChangedAt);
  if (!Number.isFinite(lastChangedAt) || lastChangedAt <= 0 || now < lastChangedAt) {
    state.rakiaGlasses = glasses;
    state.rakiaLastChangedAt = now;
    return 0;
  }
  const intervals = Math.floor((now - lastChangedAt) / RAKIA_SOBER_INTERVAL_MS);
  if (intervals <= 0) return 0;
  const reduction = Math.min(glasses, intervals);
  state.rakiaGlasses = glasses - reduction;
  state.rakiaLastChangedAt = state.rakiaGlasses > 0
    ? lastChangedAt + reduction * RAKIA_SOBER_INTERVAL_MS
    : null;
  return reduction;
}
