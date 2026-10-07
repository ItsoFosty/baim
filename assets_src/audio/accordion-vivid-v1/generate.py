"""Render a standalone accordion audition. Requires mido, FluidSynth and SoX.

Run: python generate.py [--soundfont /path/to/font.sf2]
No runtime game assets are replaced. Outputs are written beside this script.
"""
import argparse
import math
from pathlib import Path
import random
import subprocess
import tempfile

import mido


ROOT = Path(__file__).resolve().parent
TPB = 480
TEMPO = 450_000  # Eighth note = 225 ms; four 7/8 bars = 6.3 seconds.


def compose():
    rng = random.Random(17)
    events = []

    def event(beat, message, priority=1):
        events.append((round(beat * TPB), priority, message))

    def note(channel, pitch, beat, length, velocity):
        event(beat, mido.Message('note_on', channel=channel, note=pitch,
                                 velocity=velocity), 2)
        event(beat + length, mido.Message('note_off', channel=channel,
                                        note=pitch, velocity=0))

    event(0, mido.MetaMessage('set_tempo', tempo=TEMPO), 0)
    event(0, mido.MetaMessage('time_signature', numerator=7, denominator=8), 0)
    # All voices use the accordion patch; the quieter left hand supplies bass/chords.
    for channel, volume, pan in [(0, 105, 70), (1, 77, 52), (2, 65, 57)]:
        event(0, mido.Message('program_change', channel=channel, program=21), 0)
        # GM accordion is 22 in one-based lists, 21 in MIDI. Program 20 is reed organ.
        for control, value in [(7, volume), (10, pan), (91, 23), (93, 24)]:
            event(0, mido.Message('control_change', channel=channel,
                                  control=control, value=value), 0)

    # D-minor motif, a higher answering phrase, dominant turn, and tonic cadence.
    # Values are (pitch, duration in eighth notes); each bar totals seven eighths.
    bars = [
        [(62, 1), (65, 1), (69, 2), (67, 1), (65, 1), (64, 1)],
        [(65, 1), (69, 1), (74, 2), (72, 1), (69, 1), (67, 1)],
        [(64, 1), (67, 1), (73, 1), (74, 1), (73, 1), (69, 1), (64, 1)],
        [(65, 1), (64, 1), (62, 5)],
    ]
    for bar_index, bar in enumerate(bars):
        eighth = 0
        for index, (pitch, duration) in enumerate(bar):
            at = bar_index * 3.5 + eighth * .5
            at += 0 if at == 0 else rng.uniform(-.009, .009)
            length = duration * .5 - (.045 if duration == 1 else .025)
            velocity = (105 if eighth in (0, 2, 4) else 90) + rng.randrange(-4, 5)
            if (bar_index, index) in [(0, 2), (1, 2)]:
                note(0, pitch - 2, at, .075, 78)
                at += .085
                length -= .085
            note(0, pitch, at, length, velocity)
            if (bar_index, index) in [(1, 2), (3, 2)]:
                note(2, pitch - (3 if bar_index == 1 else 9), at, length, 60)
            eighth += duration

        bass, chord = ((45, [57, 61, 64]) if bar_index == 2
                       else (38, [57, 62, 65]))
        if bar_index == 3:
            note(1, bass, 10.5, .35, 85)
            note(1, bass, 11.5, 2.45, 86)
            for pitch in chord:
                note(2, pitch, 11.5, 2.45, 69)
        else:
            # Short bass/chord gestures articulate the 2+2+3 eighth-note grouping.
            for offset, pitches, length in [(0, [bass], .34), (.5, chord, .28),
                                            (1, [bass + 7], .33), (1.5, chord, .28),
                                            (2, [bass], .34), (2.5, chord, .62)]:
                for pitch in pitches:
                    note(1, pitch, bar_index * 3.5 + offset, length,
                         85 if len(pitches) == 1 else 68)

    # CC11 produces bellows-like swells independent of note attack velocity.
    for step in range(281):
        beat = step * .05
        pulse = .5 - .5 * math.cos(2 * math.pi * (beat % 3.5) / 3.5)
        value = int(88 + 27 * pulse)
        if beat > 12.2:
            value = round(108 - (beat - 12.2) * 18)
        for channel in (0, 1, 2):
            event(beat, mido.Message('control_change', channel=channel,
                                     control=11, value=value))

    midi = mido.MidiFile(type=0, ticks_per_beat=TPB)
    track = mido.MidiTrack()
    midi.tracks.append(track)
    previous = 0
    for tick, _, message in sorted(events, key=lambda item: item[:2]):
        track.append(message.copy(time=tick - previous))
        previous = tick
    track.append(mido.MetaMessage('end_of_track', time=0))
    midi.save(ROOT / 'accordion-vivid-7s.mid')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--soundfont', default='/usr/share/sounds/sf2/FluidR3_GM.sf2')
    args = parser.parse_args()
    compose()
    with tempfile.TemporaryDirectory() as temporary:
        raw = Path(temporary) / 'render.wav'
        subprocess.run([
            'fluidsynth', '-ni', '-q', '-r', '44100', '-g', '0.65',
            '-o', 'synth.reverb.room-size=0.28', '-o', 'synth.reverb.damp=0.6',
            '-o', 'synth.reverb.level=0.18', '-o', 'synth.chorus.level=0.35',
            '-F', str(raw), args.soundfont, str(ROOT / 'accordion-vivid-7s.mid'),
        ], check=True)
        subprocess.run([
            'sox', str(raw), '-b', '16', str(ROOT / 'accordion-vivid-7s.wav'),
            'trim', '0', '7', 'fade', 't', '0.008', '7', '0.25', 'gain', '-n', '-1.5',
        ], check=True)
    subprocess.run(['sox', str(ROOT / 'accordion-vivid-7s.wav'),
                    str(ROOT / 'accordion-vivid-7s.ogg')], check=True)


if __name__ == '__main__':
    main()
