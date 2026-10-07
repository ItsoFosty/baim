export const paperRustle = { foley: "paper", duration: 0.42, volume: 0.6 };
export const jarClink = { foley: "glass", duration: 0.35, volume: 0.65 };
export const boxSetDown = { foley: "wood", duration: 0.4, volume: 0.75 };
export const stampImpact = { foley: "stamp", duration: 0.22, volume: 0.85 };
export const waterStarts = { foley: "water", duration: 1.2, volume: 0.65 };
export const oilPour = { foley: "water", duration: 0.5, volume: 0.4 };

// Quiet procedural room/air beds; music and recorded environmental sound remain future work.
export const sceneAmbiences = {
  "scene.chapter1.apartment": { noise: { cutoff: 320 }, volume: 0.055 },
  "scene.chapter1.village_square": { noise: { cutoff: 1100 }, volume: 0.065 },
  "scene.chapter1.mehana": { noise: { cutoff: 480 }, volume: 0.065 },
  "scene.chapter1.municipality": { frequency: 100, volume: 0.012 },
  "scene.chapter1.mayor_office": { noise: { cutoff: 250 }, volume: 0.045 },
  "scene.chapter1.archive": { noise: { cutoff: 200 }, volume: 0.035 }
};
export const repairedFountainAmbience = { noise: { cutoff: 2400 }, volume: 0.09 };
