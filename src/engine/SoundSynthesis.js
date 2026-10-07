// Small deterministic sound effects. No audio files, network requests or timers.
export function foleySamples(kind, sampleRate, duration) {
  const samples = new Float32Array(Math.ceil(sampleRate * duration));
  let seed = 1979;
  let low = 0;
  for (let i = 0; i < samples.length; i++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const noise = seed / 2147483648 - 1;
    const time = i / sampleRate;
    const progress = i / samples.length;
    low += (noise - low) * (1 - Math.exp(-2 * Math.PI * 650 / sampleRate));
    const fade = Math.min(1, time / 0.008, (duration - time) / 0.025);
    let value;
    if (kind === "paper") {
      const rustle = 0.25 + 0.75 * Math.sin(progress * Math.PI * 3) ** 2;
      value = (noise - low) * rustle * Math.sin(progress * Math.PI) * 0.35;
    } else if (kind === "glass") {
      value = (Math.sin(2 * Math.PI * 1270 * time) * 0.32
        + Math.sin(2 * Math.PI * 2113 * time) * 0.14) * Math.exp(-time * 18)
        + low * Math.exp(-time * 45) * 0.35;
    } else if (kind === "water") {
      value = low * (0.6 + Math.sin(time * 31) * 0.15) * Math.sin(progress * Math.PI);
    } else if (kind === "wood" || kind === "stamp") {
      value = (low * 0.6 + Math.sin(2 * Math.PI * (kind === "wood" ? 135 : 185) * time) * 0.28)
        * Math.exp(-time * (kind === "wood" ? 17 : 29));
    } else {
      throw new Error(`Unknown foley sound: ${kind}`);
    }
    samples[i] = value * Math.max(0, fade);
  }
  return samples;
}
