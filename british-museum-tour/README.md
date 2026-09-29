# A Guided Tour of the British Museum

An 8-minute narrated video tour of the British Museum in London, written for a general audience including school
students. It visits nine famous objects and galleries, with on-screen captions, fact cards, a floor plan showing the
route, and questions to discuss at the end.

**Watch:** [`output/british_museum_tour.mp4`](output/british_museum_tour.mp4) (1920×1080, 30 fps, H.264/AAC, 7:58)

Also included:

- [`output/british_museum_tour.srt`](output/british_museum_tour.srt): captions as a separate subtitle file
  (they are already burned into the video)
- [`output/transcript.md`](output/transcript.md): the full narration as text, split by stop

## The route

| Time | Stop | Where | What you see |
|-----:|------|-------|--------------|
| 0:00 | Welcome | Great Russell Street | Smirke's Greek Revival front; founding in 1753 from Sir Hans Sloane's collection |
| 0:42 | 1 | Great Court | The 3,312-pane glass roof (2000) and the round Reading Room (1857) |
| 1:25 | 2 | Room 4 | The Rosetta Stone: three scripts, and how Champollion read the name *Ptolemy* |
| 2:25 | 3 | Room 10 | The lamassu of Sargon II, and why they have five legs; the lion hunt reliefs in Room 10a |
| 3:04 | 4 | Room 18 | The Parthenon sculptures and the continuing debate about where they belong |
| 3:48 | 5 | Room 24 | Hoa Hakananai‘a from Rapa Nui (Easter Island), front and back |
| 4:28 | 6 | Room 56 | The Royal Game of Ur and the clay tablet that explains the rules |
| 5:13 | 7 | Rooms 62–63 | Egyptian mummies: how a mummy was made, painted coffins and animal mummies |
| 5:54 | 8 | Room 41 | The Sutton Hoo ship burial and the helmet's hidden dragon |
| 6:44 | 9 | Room 40 | The Lewis Chessmen: 82 in London, 11 in Edinburgh |
| 7:25 | End | | A recap, "about 1% on display", and two questions to discuss |

## Classroom notes

- The ending asks: *Whose stories are being told?* and *Where should these objects belong?* The Parthenon
  sculptures (stop 4) and Hoa Hakananai‘a (stop 5) are both objects whose return has been requested, and the video
  says so neutrally. They work well as starting points for a discussion.
- The pictures are illustrations drawn for this video, not photographs. They are artistic impressions and are not to
  scale, and the floor plan is simplified. For real photographs of each object, use the British Museum's online collection.
- Room numbers and displays change from time to time. Check the British Museum website before planning a visit.
- The narration uses a synthetic British English voice.

## How it was made

Everything is generated from the source in this folder. No stock footage, photographs or music are used.

| Step | Tool | Source |
|------|------|--------|
| Script | Hand-written, with facts checked against British Museum and other published sources | [`script.json`](script.json) |
| Narration | [Kokoro](https://github.com/thewh1teagle/kokoro-onnx) text-to-speech, voice `bf_emma`, run offline | [`src/tts.py`](src/tts.py) |
| Music | Ambient pad and bells synthesised with NumPy, lowered under the narration | [`src/music.py`](src/music.py) |
| Pictures | Hand-coded SVG scenes, animated frame by frame from the narration timings | [`src/stage/`](src/stage) |
| Rendering | Headless Chromium (Playwright) screenshots piped into ffmpeg | [`src/render.mjs`](src/render.mjs) |
| Captions | Generated from the same timings | [`src/make_srt.py`](src/make_srt.py) |

Every animation is keyed to when a sentence is spoken. For example, the hieroglyph band on the Rosetta Stone
lights up when the narrator says "hieroglyphs". If you edit `script.json` and rebuild, the pictures stay in sync.

### Rebuilding

```bash
pip install kokoro-onnx soundfile numpy
npm install -g playwright          # plus a Chromium build that Playwright can launch
sudo apt-get install ffmpeg
./build.sh                         # downloads the voice model on first run; WORKERS=4 by default
```

To preview single frames while editing a scene:

```bash
node src/render.mjs --stills "rosetta@25,ur@42" --outdir build/stills
```

## Credits and licences

- Illustrations, animation code and music: original work created for this video.
- Fonts: Cormorant Garamond and Inter (SIL Open Font License 1.1), in `assets/fonts/`.
- Voice: Kokoro-82M model (Apache 2.0), via `kokoro-onnx`.
- This video is an independent educational resource. It is not made by, or endorsed by, the British Museum.
