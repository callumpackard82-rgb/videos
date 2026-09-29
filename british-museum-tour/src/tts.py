"""Synthesise the narration and build the timeline that drives the animation.

Reads ../script.json, speaks every sentence with Kokoro (offline TTS), then writes:
  build/narration.wav   - the full narration track (24 kHz mono)
  build/timeline.json   - scene/line/caption timings in seconds
"""
import json
import os
import re
import sys

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
BUILD = os.path.join(ROOT, "build")
MODELS = os.environ.get("KOKORO_MODELS", os.path.join(ROOT, "models"))

SR = 24000
GAP_SENTENCE = 0.30   # pause between sentences inside a line
GAP_LINE = 0.55       # pause between lines
LEAD_IN = {"intro": 4.2}
LEAD_IN_DEFAULT = 2.1  # time for the doorway walk-through before speech starts
TAIL = {"outro": 7.0}
TAIL_DEFAULT = 1.4
MAX_CAPTION = 66


def split_sentences(s):
    parts = re.split(r"(?<=[.!?])\s+(?=[A-Z'\"‘“])", s.strip())
    return [p for p in parts if p]


def split_caption(s):
    """Split a long sentence into caption chunks at commas/colons near the middle."""
    if len(s) <= MAX_CAPTION:
        return [s]
    best, best_score = None, 1e9
    for m in re.finditer(r"[,:;]\s", s):
        i = m.end()
        if i < 24 or len(s) - i < 24:
            continue
        score = abs(i - len(s) / 2)
        if score < best_score:
            best, best_score = i, score
    if best is None:
        words = s.split(" ")
        mid = len(words) // 2
        a, b = " ".join(words[:mid]), " ".join(words[mid:])
    else:
        a, b = s[:best].strip(), s[best:].strip()
    return split_caption(a) + split_caption(b)


def trim(x, thresh=0.004):
    idx = np.where(np.abs(x) > thresh)[0]
    if len(idx) == 0:
        return x
    a = max(0, idx[0] - int(0.02 * SR))
    b = min(len(x), idx[-1] + int(0.06 * SR))
    return x[a:b]


def main():
    os.makedirs(os.path.join(BUILD, "audio"), exist_ok=True)
    with open(os.path.join(ROOT, "script.json")) as f:
        script = json.load(f)
    kokoro = Kokoro(os.path.join(MODELS, "kokoro-v1.0.onnx"), os.path.join(MODELS, "voices-v1.0.bin"))
    voice, speed = script["voice"], script["speed"]

    cache_path = os.path.join(BUILD, "audio", "cache.json")
    cache = json.load(open(cache_path)) if os.path.exists(cache_path) else {}

    t = 0.0
    chunks = []  # (start_sample, audio)
    timeline = {"title": script["title"], "scenes": []}
    for si, scene in enumerate(script["scenes"]):
        s_start = t
        t += LEAD_IN.get(scene["id"], LEAD_IN_DEFAULT)
        lines_out, captions = [], []
        for li, line in enumerate(scene["lines"]):
            texts = split_sentences(line["text"])
            says = split_sentences(line.get("say", line["text"]))
            if len(texts) != len(says):
                sys.exit(f"sentence mismatch in {scene['id']} line {li}: {texts} vs {says}")
            l_start = t
            for k, (txt, say) in enumerate(zip(texts, says)):
                key = f"{voice}|{speed}|{say}"
                fn = cache.get(key)
                if fn is None or not os.path.exists(os.path.join(BUILD, "audio", fn)):
                    fn = f"{scene['id']}_{li:02d}_{k}.wav"
                    audio, sr = kokoro.create(say, voice=voice, speed=speed, lang="en-gb")
                    assert sr == SR
                    sf.write(os.path.join(BUILD, "audio", fn), trim(np.asarray(audio, dtype=np.float32)), SR)
                    cache[key] = fn
                    print(f"  spoke {fn}: {say[:60]}", flush=True)
                audio, _ = sf.read(os.path.join(BUILD, "audio", fn), dtype="float32")
                dur = len(audio) / SR
                chunks.append((int(round(t * SR)), audio))
                # captions: split long sentences, time chunks by character share
                parts = split_caption(txt)
                total_chars = sum(len(p) for p in parts)
                c = t
                for p in parts:
                    d = dur * len(p) / total_chars
                    captions.append({"start": round(c, 3), "end": round(c + d, 3), "text": p})
                    c += d
                t += dur
                if k < len(texts) - 1:
                    t += GAP_SENTENCE
            lines_out.append({"start": round(l_start - s_start, 3), "end": round(t - s_start, 3)})
            if li < len(scene["lines"]) - 1:
                t += GAP_LINE
        t += TAIL.get(scene["id"], TAIL_DEFAULT)
        timeline["scenes"].append({
            "id": scene["id"], "stop": scene["stop"], "room": scene["room"], "gallery": scene["gallery"],
            "start": round(s_start, 3), "dur": round(t - s_start, 3),
            "lines": lines_out,
            "captions": [{**c, "start": round(c["start"] - s_start, 3), "end": round(c["end"] - s_start, 3)} for c in captions],
        })
    timeline["total"] = round(t, 3)
    json.dump(cache, open(cache_path, "w"), indent=1)

    out = np.zeros(int(np.ceil(t * SR)) + SR, dtype=np.float32)
    for start, audio in chunks:
        out[start:start + len(audio)] += audio
    out = out[: int(np.ceil(t * SR))]
    sf.write(os.path.join(BUILD, "narration.wav"), out, SR)
    with open(os.path.join(BUILD, "timeline.json"), "w") as f:
        json.dump(timeline, f, indent=1, ensure_ascii=False)
    print(f"total {t:.1f}s across {len(timeline['scenes'])} scenes")


if __name__ == "__main__":
    main()
