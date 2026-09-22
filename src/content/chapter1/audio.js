export const paperCue = { notes: [220, 165], interval: 0.06, duration: 0.09, volume: 0.18 };
export const stampCue = { notes: [110, 65], interval: 0.045, duration: 0.12, volume: 0.35 };
export const winCue = { notes: [262, 330, 392, 523], interval: 0.16, duration: 0.32 };
export const narrowCue = { notes: [262, 311, 392], interval: 0.2, duration: 0.3 };
export const lossCue = { notes: [294, 262, 196], interval: 0.23, duration: 0.35 };

// Original two-second village-dance phrase; no borrowed tune or recording.
export const accordionCue = {
  instrument: "accordion", volume: 0.19,
  notes: [
    { frequency: 293.66, at: 0, duration: 0.25 },
    { frequency: 349.23, at: 0.24, duration: 0.25 },
    { frequency: 440, at: 0.48, duration: 0.36 },
    { frequency: 392, at: 0.84, duration: 0.24 },
    { frequency: 349.23, at: 1.08, duration: 0.24 },
    { frequency: 329.63, at: 1.32, duration: 0.24 },
    { frequency: 293.66, at: 1.56, duration: 0.54 },
    { frequency: 146.83, at: 1.56, duration: 0.54 }
  ]
};

export const footstepSurfaces = {
  "scene.chapter1.apartment": { cutoff: 700, volume: 0.65 },
  "scene.chapter1.village_square": { cutoff: 1800, volume: 0.55 },
  "scene.chapter1.mehana": { cutoff: 650, volume: 0.65 },
  "scene.chapter1.municipality": { cutoff: 1400, volume: 0.55 },
  "scene.chapter1.mayor_office": { cutoff: 700, volume: 0.6 },
  "scene.chapter1.election_booth": { cutoff: 750, volume: 0.6 }
};
