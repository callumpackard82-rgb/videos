#!/usr/bin/env bash
# Build "A Guided Tour of the British Museum" from source.
#
# Needs: python3 (kokoro-onnx, soundfile, numpy), node + playwright (Chromium), ffmpeg.
# The Kokoro model files are downloaded into ./models on first run.
set -euo pipefail
cd "$(dirname "$0")"

WORKERS=${WORKERS:-4}
FPS=30
CRF_FINAL=${CRF_FINAL:-30}
mkdir -p build output models

if [ ! -f models/kokoro-v1.0.onnx ]; then
  base=https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0
  curl -L -o models/kokoro-v1.0.onnx "$base/kokoro-v1.0.onnx"
  curl -L -o models/voices-v1.0.bin "$base/voices-v1.0.bin"
fi

echo "== narration";  python3 src/tts.py
echo "== music";      python3 src/music.py
echo "== captions";   python3 src/make_srt.py output
echo "== thumbnails"; node src/render.mjs --thumbs

TOTAL=$(python3 -c "import json,math; print(math.ceil(json.load(open('build/timeline.json'))['total']*$FPS))")
echo "== rendering $TOTAL frames with $WORKERS workers"
rm -f build/seg_*.mp4 build/segments.txt
PER=$(( (TOTAL + WORKERS - 1) / WORKERS ))
pids=()
for ((w = 0; w < WORKERS; w++)); do
  from=$(( w * PER )); to=$(( from + PER )); [ $to -gt $TOTAL ] && to=$TOTAL
  node src/render.mjs --from $from --to $to --crf 18 --out build/seg_$w.mp4 > build/seg_$w.log 2>&1 &
  pids+=($!)
  echo "file 'seg_$w.mp4'" >> build/segments.txt
done
for p in "${pids[@]}"; do wait "$p"; done

echo "== mixing and encoding"
ffmpeg -y -loglevel error -f concat -safe 0 -i build/segments.txt -c copy build/video.mp4
ffmpeg -y -loglevel error -i build/video.mp4 -i build/narration.wav -i build/music.wav \
  -filter_complex "[1:a]aresample=48000,pan=stereo|c0=c0|c1=c0[n];[n][2:a]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[a]" \
  -map 0:v -map "[a]" -c:v libx264 -preset slow -crf "$CRF_FINAL" -tune animation -pix_fmt yuv420p \
  -c:a aac -b:a 160k -movflags +faststart \
  -metadata title="A Guided Tour of the British Museum" \
  output/british_museum_tour.mp4
ls -lh output/
