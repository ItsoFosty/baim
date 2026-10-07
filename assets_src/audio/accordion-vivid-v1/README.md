# Accordion audition v1

Approved seven-second cue, used by the game's accordion performance interactions.
The runtime WAV is copied to `assets/chapter1/audio/accordion-vivid-v1.wav`.
Original D-minor phrase built around the supplied D–F–A motif.

## Files

- `accordion-vivid-7s.wav`: stereo 44.1 kHz, 16-bit PCM master.
- `accordion-vivid-7s.ogg`: compressed listening copy.
- `accordion-vivid-7s.mid`: editable arrangement with expression automation.
- `generate.py`: deterministic composition and rendering script.

## Reproduce

Requires Python 3, mido, FluidSynth, SoX with Vorbis support, and the locally
installed FluidR3_GM SoundFont. The SoundFont is not bundled here.

```bash
python3 -m venv /tmp/baim-accordion-venv
/tmp/baim-accordion-venv/bin/pip install mido
/tmp/baim-accordion-venv/bin/python assets_src/audio/accordion-vivid-v1/generate.py
```

Use `--soundfont /path/to/font.sf2` to audition another GM-compatible font.
The exact sound depends on the font and renderer versions.

## Changes from the supplied process

1. Select program **21** (zero-based). Verified against the installed SoundFont:
   program 20 is `Reed Organ`; program 21 is labeled `Accordian`.
2. Schedule absolute note times, then convert to MIDI deltas. The original script
   inserted another 480 ticks before each new note, adding unintended rests.
3. Compose four bars of 7/8, grouped 2+2+3, at 450,000 microseconds per quarter
   (approximately 133.33 BPM). The performance finishes around 6.3 seconds;
   the rest of the seven-second file holds the release/reverb tail.
4. Add bass/chord accompaniment, grace notes, occasional harmony, restrained
   timing/velocity variation, and CC11 expression swells to suggest bellows.
5. Use modest chorus and room reverb; normalize to -1.5 dBFS and fade the final
   250 ms of the tail. This is a sample-based synth rendition, not a live recording.

## Verification

WAV: exactly 308,700 stereo frames / 7.000 seconds, peak -1.50 dBFS,
RMS approximately -18.97 dBFS, no clipped PCM samples, final frame zero.
FluidSynth 2.4.8 reports GLib warnings in this environment but returns successfully
and produces a decodable WAV. Listening approval remains a creative review step.
