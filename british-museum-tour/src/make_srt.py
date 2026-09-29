"""Write SubRip captions (and a plain transcript) from build/timeline.json."""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)


def ts(t):
    ms = int(round(t * 1000))
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def main(out_dir):
    tl = json.load(open(os.path.join(ROOT, "build", "timeline.json")))
    script = json.load(open(os.path.join(ROOT, "script.json")))
    rows = []
    for sc in tl["scenes"]:
        for c in sc["captions"]:
            rows.append((sc["start"] + c["start"], sc["start"] + c["end"] + 0.15, c["text"]))
    # hold each caption a moment longer, but never overlap the next one
    rows = [(a, min(b, rows[i + 1][0] - 0.02) if i + 1 < len(rows) else b, text) for i, (a, b, text) in enumerate(rows)]
    with open(os.path.join(out_dir, "british_museum_tour.srt"), "w") as f:
        for i, (a, b, text) in enumerate(rows, 1):
            f.write(f"{i}\n{ts(a)} --> {ts(b)}\n{text}\n\n")
    with open(os.path.join(out_dir, "transcript.md"), "w") as f:
        f.write(f"# {script['title']} — narration transcript\n\n")
        for sc, tsc in zip(script["scenes"], tl["scenes"]):
            m, s = divmod(int(tsc["start"]), 60)
            head = sc["room"] if sc["room"] == sc["gallery"] else f"{sc['room']} · {sc['gallery']}"
            f.write(f"## [{m}:{s:02d}] {head}\n\n")
            f.write(" ".join(l["text"] for l in sc["lines"]) + "\n\n")
    print(f"{len(rows)} captions written")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "output"))
