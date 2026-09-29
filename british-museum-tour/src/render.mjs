// Capture frames of the stage page with headless Chromium and pipe them to ffmpeg.
//
//   node src/render.mjs --out build/seg0.mp4 --from 0 --to 900      (frame range)
//   node src/render.mjs --stills 12.5,40 --outdir build/stills     (PNG previews)
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); }
catch { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(HERE);
const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => {
  if (v.startsWith('--')) a.push([v.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true]);
  return a;
}, []));
const FPS = Number(args.fps || 30);

const timeline = JSON.parse(fs.readFileSync(path.join(ROOT, 'build', 'timeline.json'), 'utf8'));

const browser = await chromium.launch({
  args: ['--force-color-profile=srgb', '--font-render-hinting=none', '--disable-lcd-text', '--allow-file-access-from-files'],
});
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
page.on('pageerror', e => { console.error('PAGE ERROR', e); process.exitCode = 1; });
page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.error('console:', m.text()); });
await page.goto(pathToFileURL(path.join(HERE, 'stage', 'index.html')).href);
await page.evaluate(() => document.fonts.ready);
const total = await page.evaluate(tl => window.init(tl), timeline);
await page.waitForFunction(() => !window.__pending, null, { timeout: 20000 }).catch(() => console.error('some images did not load'));
const cdp = await page.context().newCDPSession(page);

async function grab(format = 'jpeg') {
  const r = await cdp.send('Page.captureScreenshot', format === 'png'
    ? { format: 'png', optimizeForSpeed: true }
    : { format: 'jpeg', quality: 93, optimizeForSpeed: true });
  return Buffer.from(r.data, 'base64');
}

// representative frames of each stop, used by the closing collage
const THUMB_AT = { greatcourt: 9, rosetta: 12.5, lamassu: 5, parthenon: 21, moai: 8, ur: 15, mummies: 8, suttonhoo: 26, chessmen: 19 };

if (args.thumbs) {
  const outdir = path.join(ROOT, 'build', 'thumbs');
  fs.mkdirSync(outdir, { recursive: true });
  await page.evaluate(() => { document.getElementById('hud').style.display = 'none'; });
  for (const [id, sec] of Object.entries(THUMB_AT)) {
    const sc = timeline.scenes.find(x => x.id === id);
    await page.evaluate(t => window.renderFrame(t), sc.start + sec);
    const r = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 85 });
    fs.writeFileSync(path.join(outdir, `${id}.jpg`), Buffer.from(r.data, 'base64'));
  }
  console.log('thumbs written');
} else if (args.stills) {
  const outdir = args.outdir || path.join(ROOT, 'build', 'stills');
  fs.mkdirSync(outdir, { recursive: true });
  for (const s of String(args.stills).split(',')) {
    let T = s;
    // allow "sceneId@seconds"
    if (s.includes('@')) {
      const [id, sec] = s.split('@');
      const sc = timeline.scenes.find(x => x.id === id);
      T = sc.start + Number(sec);
    }
    await page.evaluate(t => window.renderFrame(t), Number(T));
    const buf = await grab('png');
    const fn = path.join(outdir, `still_${s.replace(/[@.]/g, '_')}.png`);
    fs.writeFileSync(fn, buf);
    console.log(fn);
  }
} else {
  const nFrames = Math.ceil(total * FPS);
  const from = Number(args.from || 0), to = Math.min(Number(args.to || nFrames), nFrames);
  const out = args.out || path.join(ROOT, 'build', 'video.mp4');
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', String(args.crf || 19), '-tune', 'animation', '-pix_fmt', 'yuv420p',
    '-r', String(FPS), out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let f = from; f < to; f++) {
    await page.evaluate(t => window.renderFrame(t), f / FPS);
    const buf = await grab();
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if ((f - from) % 300 === 0) console.log(`[${path.basename(out)}] frame ${f - from}/${to - from} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  console.log(`done ${out} in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
await browser.close();
