import { foleySamples } from "./SoundSynthesis.js";

// Content supplies recorded or synthesized cues and ambience.
// All playback shares the same volume/mute output and requires audio enablement.
export class AudioSystem {
  constructor() { this.enabled = false; this.volume = 0.6; this.context = null; this.ambient = null; this.voices = new Set(); this.buffers = new Map(); this.playRequest = 0; }
  setVolume(value) {
    this.volume = Number.isFinite(Number(value)) ? Math.max(0, Math.min(1, Number(value))) : 0.6;
    this.updateVolume();
  }
  updateVolume() {
    if (this.context) this.master.gain.setTargetAtTime(this.enabled ? 0.3 * this.volume : 0, this.context.currentTime, 0.04);
  }
  async setEnabled(enabled) {
    this.enabled = Boolean(enabled);
    if (!this.enabled) this.playRequest++;
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
    if (!this.enabled || !this.context || (!cue?.notes && !cue?.src && !cue?.foley)) return;
    const request = ++this.playRequest;
    // Restart a short phrase instead of stacking melodies on repeated clicks.
    for (const voice of this.voices) voice.stop();
    this.voices.clear();
    if (cue.src) return this.playRecording(cue, request);
    if (cue.foley) return this.playFoley(cue);
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

  async playRecording(cue, request) {
    try {
      let pending = this.buffers.get(cue.src);
      if (!pending) {
        pending = (async () => {
          const response = await fetch(cue.src);
          if (!response.ok) throw new Error(`Audio request failed: ${response.status}`);
          return this.context.decodeAudioData(await response.arrayBuffer());
        })();
        this.buffers.set(cue.src, pending);
        pending.catch(() => this.buffers.delete(cue.src));
      }
      const buffer = await pending;
      // A newer cue or disabling audio cancels playback still waiting on a download.
      if (!this.enabled || request !== this.playRequest) return;
      const source = this.context.createBufferSource();
      const gain = this.context.createGain();
      source.buffer = buffer;
      gain.gain.value = cue.volume ?? 1;
      source.connect(gain);
      gain.connect(this.master);
      this.voices.add(source);
      source.onended = () => {
        this.voices.delete(source);
        source.disconnect();
        gain.disconnect();
      };
      source.start();
    } catch (error) {
      // Audio is optional; a failed download must not interrupt an interaction.
      console.warn(`Could not play audio cue: ${cue.src}`, error);
    }
  }

  playFoley(cue) {
    const context = this.context;
    const duration = Math.max(0.05, Math.min(3, Number(cue.duration) || 0.4));
    const key = `${cue.foley}:${duration}:${context.sampleRate}`;
    this.foleyBuffers ||= new Map();
    if (!this.foleyBuffers.has(key)) {
      const samples = foleySamples(cue.foley, context.sampleRate, duration);
      const buffer = context.createBuffer(1, samples.length, context.sampleRate);
      buffer.copyToChannel(samples, 0);
      this.foleyBuffers.set(key, buffer);
    }
    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = this.foleyBuffers.get(key);
    gain.gain.value = Math.max(0, Math.min(1, cue.volume ?? 0.6));
    source.connect(gain); gain.connect(this.master);
    this.voices.add(source);
    source.onended = () => { this.voices.delete(source); source.disconnect(); gain.disconnect(); };
    source.start();
  }

  resetFootsteps() { this.stepDistance = 0; }
  updateFootsteps(distance, characterHeight, surface, walking) {
    if (!walking || !surface || !this.enabled || this.volume === 0) {
      this.resetFootsteps();
      return;
    }
    const stride = Math.max(12, characterHeight * 0.21);
    if (!Number.isFinite(distance) || distance < 0 || distance > stride * 2) {
      this.resetFootsteps();
      return;
    }
    this.stepDistance = (this.stepDistance || 0) + distance;
    if (this.stepDistance >= stride) {
      this.stepDistance %= stride;
      this.playFootstep(surface);
    }
  }
  playFootstep(surface) {
    if (!this.enabled || !this.context) return;
    const ctx = this.context;
    const now = ctx.currentTime;
    if (!this.stepNoise) {
      this.stepNoise = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * 0.18), ctx.sampleRate);
      const data = this.stepNoise.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = this.stepNoise;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = Math.max(1000, surface.cutoff);
    filter.Q.value = 0.55;
    const gain = ctx.createGain();
    const strength = surface.volume * 0.75 * (this.leftFoot ? 0.9 : 1);
    this.leftFoot = !this.leftFoot;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(strength, now + 0.035);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);
    noise.connect(filter); filter.connect(gain); gain.connect(this.master);
    noise.start(now);
    noise.onended = () => { noise.disconnect(); filter.disconnect(); gain.disconnect(); };
  }

  setAmbience(definition) {
    if (this.enabled && this.ambient && this.ambientDefinition === definition) return;
    if (this.ambient) { this.ambient.stop(); this.ambient.disconnect(); this.ambient = null; }
    this.ambientDefinition = definition;
    if (!this.enabled || !this.context || (!definition?.frequency && !definition?.noise)) return;
    const source = definition.noise ? this.context.createBufferSource() : this.context.createOscillator();
    const gain = this.context.createGain();
    let filter;
    if (definition.noise) {
      if (!this.ambientNoise) {
        this.ambientNoise = this.context.createBuffer(1, this.context.sampleRate * 3, this.context.sampleRate);
        const samples = this.ambientNoise.getChannelData(0);
        for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
      }
      source.buffer = this.ambientNoise;
      source.loop = true;
      filter = this.context.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = definition.noise.cutoff || 600;
      filter.Q.value = 0.5;
      source.connect(filter); filter.connect(gain);
    } else {
      source.type = "sine";
      source.frequency.value = definition.frequency;
      source.connect(gain);
    }
    gain.gain.value = definition.volume ?? 0.025;
    gain.connect(this.master); source.start();
    source.onended = () => { source.disconnect(); filter?.disconnect(); gain.disconnect(); };
    this.ambient = source;
  }
}
