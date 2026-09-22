// Optional synthesized cues; no network assets or autoplay dependency.
// Content supplies notes and ambience. Muting ramps the shared output to silence.
export class AudioSystem {
  constructor() { this.enabled = false; this.context = null; this.ambient = null; }
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
    this.master.gain.setTargetAtTime(this.enabled ? 0.18 : 0, this.context.currentTime, 0.04);
  }
  play(cue) {
    if (!this.enabled || !this.context || !cue?.notes) return;
    const now = this.context.currentTime;
    for (const [index, frequency] of cue.notes.entries()) {
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      const start = now + index * (cue.interval ?? 0.11);
      const duration = cue.duration ?? 0.18;
      oscillator.type = cue.wave ?? "triangle";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(cue.volume ?? 0.3, start + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      oscillator.connect(gain); gain.connect(this.master);
      oscillator.start(start); oscillator.stop(start + duration + 0.02);
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
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
