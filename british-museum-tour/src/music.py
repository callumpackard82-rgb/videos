"""Generate a gentle ambient music bed that ducks under the narration.

Writes build/music.wav (48 kHz stereo). Everything is synthesised here, so there
are no third-party music rights to worry about.
"""
import json
import os

import numpy as np
import soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__))
BUILD = os.path.join(os.path.dirname(HERE), "build")
SR = 48000
rng = np.random.default_rng(1753)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


# D major, slow and calm: Dmaj9, Bm9, Gmaj9, Asus4 -> A
CHORDS = [
    [50, 57, 62, 66, 69, 73, 76],
    [47, 54, 62, 66, 69, 73],
    [43, 50, 59, 62, 66, 69],
    [45, 52, 62, 64, 69, 71],
]
BELL_NOTES = [74, 76, 78, 81, 83, 86, 88]
CHORD_LEN = 8.0


def pad_note(freq, n, amp):
    t = np.arange(n) / SR
    out = np.zeros(n)
    for det in (-0.0017, 0.0017):
        f = freq * (1 + det)
        phase = rng.uniform(0, 2 * np.pi)
        for h in range(1, 7):
            out += np.sin(2 * np.pi * f * h * t + phase * h) / h ** 1.7
    # slow tremolo for movement
    out *= 1 + 0.08 * np.sin(2 * np.pi * rng.uniform(0.07, 0.15) * t + rng.uniform(0, 6))
    return out * amp


def envelope(n, attack, release):
    e = np.ones(n)
    a, r = int(attack * SR), int(release * SR)
    e[:a] = np.sin(np.linspace(0, np.pi / 2, a)) ** 2
    e[-r:] = np.cos(np.linspace(0, np.pi / 2, r)) ** 2
    return e


def gentle_lowpass(x, cutoff):
    """First-order low-pass magnitude response applied in the frequency domain."""
    spec = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    return np.fft.irfft(spec / np.sqrt(1 + (f / cutoff) ** 2), len(x))


def fft_convolve(x, ir):
    n = len(x) + len(ir) - 1
    size = 1 << (n - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]


def main():
    tl = json.load(open(os.path.join(BUILD, "timeline.json")))
    total = tl["total"] + 0.5
    n = int(total * SR)
    music = np.zeros(n)

    # pad chords with overlapping envelopes
    step = CHORD_LEN
    k = 0
    t0 = 0.0
    while t0 < total:
        chord = CHORDS[k % len(CHORDS)]
        length = step + 3.0
        a, b = int(t0 * SR), min(n, int((t0 + length) * SR))
        seg_n = b - a
        if seg_n <= 0:
            break
        seg = np.zeros(seg_n)
        for i, note in enumerate(chord):
            amp = 0.9 if i == 0 else 0.55
            seg += pad_note(midi(note), seg_n, amp)
        seg *= envelope(seg_n, 2.5, min(3.0, seg_n / SR / 2))
        music[a:b] += seg
        t0 += step
        k += 1
    music = gentle_lowpass(music / 6.0, 1400.0)

    # sparse bell notes
    bells = np.zeros(n)
    t = 1.0
    while t < total - 3:
        note = BELL_NOTES[rng.integers(len(BELL_NOTES))]
        f = midi(note)
        dur = 3.0
        m = min(int(dur * SR), n - int(t * SR))
        tt = np.arange(m) / SR
        tone = (np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(2 * np.pi * f * 2.76 * tt) * np.exp(-tt * 3))
        tone *= np.exp(-tt * 1.4) * (1 - np.exp(-tt * 200))
        bells[int(t * SR):int(t * SR) + m] += tone * rng.uniform(0.10, 0.16)
        t += rng.uniform(3.5, 7.0)

    dry = music + bells

    # simple stereo reverb from decaying noise
    ir_len = int(3.2 * SR)
    decay = np.exp(-np.arange(ir_len) / SR * (6.9 / 3.2))
    left = fft_convolve(dry, rng.standard_normal(ir_len) * decay * 0.02)
    right = fft_convolve(dry, rng.standard_normal(ir_len) * decay * 0.02)
    stereo = np.stack([dry * 0.6 + left, dry * 0.6 + right], axis=1)
    stereo /= np.max(np.abs(stereo)) + 1e-9

    # duck under narration
    narr, nsr = sf.read(os.path.join(BUILD, "narration.wav"), dtype="float32")
    hop = nsr // 100
    frames = len(narr) // hop
    rms = np.sqrt(np.mean(narr[: frames * hop].reshape(frames, hop) ** 2, axis=1))
    speech = (rms > 0.01).astype(float)
    # hold through short pauses between words/sentences
    hold = np.convolve(speech, np.ones(60), mode="same") > 0
    gain_db = np.where(hold, -24.0, -16.0)
    # smooth (attack/release)
    sm = np.empty_like(gain_db)
    g = gain_db[0]
    for i, v in enumerate(gain_db):
        coef = 0.25 if v < g else 0.03
        g += (v - g) * coef
        sm[i] = g
    times = np.arange(frames) / 100.0
    gain = 10 ** (np.interp(np.arange(n) / SR, times, sm, right=-16.0) / 20)
    # fade in / out
    fade = np.ones(n)
    fi, fo = int(1.5 * SR), int(5.0 * SR)
    fade[:fi] = np.linspace(0, 1, fi)
    fade[-fo:] = np.linspace(1, 0, fo) ** 1.5
    stereo *= (gain * fade)[:, None]
    sf.write(os.path.join(BUILD, "music.wav"), stereo.astype(np.float32), SR)
    print(f"music {total:.1f}s written")


if __name__ == "__main__":
    main()
