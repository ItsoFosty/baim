// Optional synthesized cues; no network assets or autoplay dependency.
// Content supplies notes and ambience. Muting ramps the shared output to silence.
export class AudioSystem {
  constructor() { this.enabled = false; this.volume = 0.6; this.context = null; this.ambient = null; this.voices = new Set(); }
  setVolume(value) {
    this.volume = Number.isFinite(Number(value)) ? Math.max(0, Math.min(1, Number(value))) : 0.6;
    this.updateVolume();
  }
  updateVolume() {
    if (this.context) this.master.gain.setTargetAtTime(this.enabled ? 0.3 * this.volume : 0, this.context.currentTime, 0.04);
  }
  async setEnabled(enabled) {
    this.enabled = Boolean(enabled);
    const Context = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!this.context && this.enabled && Context) {
      this.context = new Context();
      this.master = this.context.createGain();
      this.master.gain.value = 0;
      this.master.connect(this.context.destination);
    }
    if (!this.context) return;
    if (this.enabled) await this.context.resume().catch(() => {});
    this.updateVolume();
  }
  play(cue) {
    if (!this.enabled || !this.context || !cue?.notes) return;
    // Restart a short phrase instead of stacking melodies on repeated clicks.
    for (const voice of this.voices) voice.stop();
    this.voices.clear();
    const now = this.context.currentTime;
    const reed = cue.instrument === "accordion";
    if (reed && !this.reedWave) {
      // Rich reed harmonics, with two slightly detuned ranks for bellows colour.
      this.reedWave = this.context.createPeriodicWave(new Float32Array(9),
        new Float32Array([0, 1, 0.42, 0.3, 0.18, 0.13, 0.09, 0.06, 0.04]));
    }
    for (const [index, note] of cue.notes.entries()) {
      const frequency = typeof note === "number" ? note : note.frequency;
      const start = now + (note.at ?? index * (cue.interval ?? 0.11));
      const duration = note.duration ?? cue.duration ?? 0.18;
      const gain = this.context.createGain();
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(cue.volume ?? 0.3, start + (reed ? 0.035 : 0.008));
      if (reed) gain.gain.linearRampToValueAtTime((cue.volume ?? 0.3) * 0.75, start + duration * 0.7);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      gain.connect(this.master);
      const ranks = reed ? [-5, 5] : [0];
      let remaining = ranks.length;
      for (const detune of ranks) {
        const oscillator = this.context.createOscillator();
        if (reed) oscillator.setPeriodicWave(this.reedWave);
        else oscillator.type = cue.wave ?? "triangle";
        oscillator.frequency.value = frequency;
        oscillator.detune.value = detune;
        oscillator.connect(gain);
        this.voices.add(oscillator);
        oscillator.onended = () => {
          this.voices.delete(oscillator);
          oscillator.disconnect();
          if (--remaining === 0) gain.disconnect();
        };
        oscillator.start(start); oscillator.stop(start + duration + 0.02);
      }
    }
  }

  setAmbience(definition) {
    if (this.ambient) { this.ambient.stop(); this.ambient.disconnect(); this.ambient = null; }
    if (!this.enabled || !this.context || !definition?.frequency) return;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = definition.frequency;
    gain.gain.value = definition.volume ?? 0.025;
    oscillator.connect(gain); gain.connect(this.master); oscillator.start();
    oscillator.onended = () => gain.disconnect();
    this.ambient = oscillator;
  }
}
