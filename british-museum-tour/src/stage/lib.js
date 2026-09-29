// Small helper library shared by every scene. Everything is driven by an explicit
// time value, so any frame can be rendered on demand and the output is deterministic.
const NS = 'http://www.w3.org/2000/svg';
const Scenes = {}; // filled in by scenes/*.js

function el(tag, attrs, parent) {
  const e = document.createElementNS(NS, tag);
  if (attrs) for (const k in attrs) {
    if (k === 'text') e.textContent = attrs[k];
    else if (attrs[k] !== undefined && attrs[k] !== null) e.setAttribute(k, attrs[k]);
  }
  if (parent) parent.appendChild(e);
  return e;
}

function txt(parent, x, y, str, o = {}) {
  return el('text', {
    x, y, text: str,
    'font-family': o.family || "'Inter', sans-serif",
    'font-size': o.size || 24, 'font-weight': o.weight || 500,
    'font-style': o.italic ? 'italic' : undefined,
    fill: o.fill || '#fff', 'text-anchor': o.anchor || 'start',
    'letter-spacing': o.ls, opacity: o.opacity, 'dominant-baseline': o.baseline,
  }, parent);
}

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = {
  linear: t => t,
  inOut: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  out: t => 1 - Math.pow(1 - t, 3),
  in: t => t * t * t,
  sine: t => -(Math.cos(Math.PI * t) - 1) / 2,
  back: t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
};
function prog(t, a, b, e = ease.inOut) { return e(clamp((t - a) / (b - a))); }
// visible between a and b with fades of length f
function win(t, a, b, f = 0.5) { return Math.min(prog(t, a, a + f, ease.sine), 1 - prog(t, b - f, b, ease.sine)); }

// keyframes: [[time, value|array], ...]
function keys(t, frames, e = ease.inOut) {
  if (t <= frames[0][0]) return frames[0][1];
  for (let i = 1; i < frames.length; i++) {
    if (t <= frames[i][0]) {
      const [t0, v0] = frames[i - 1], [t1, v1] = frames[i];
      const p = e((t - t0) / (t1 - t0));
      return Array.isArray(v0) ? v0.map((v, j) => lerp(v, v1[j], p)) : lerp(v0, v1, p);
    }
  }
  return frames[frames.length - 1][1];
}

function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

function setOp(e, o) { e.setAttribute('opacity', Math.max(0, Math.min(1, o)).toFixed(3)); e.style.display = o <= 0.001 ? 'none' : ''; }
function setT(e, str) { e.setAttribute('transform', str); }

// Camera: [cx, cy, scale] centred on screen
function camera(g, c) { setT(g, `translate(960 540) scale(${c[2]}) translate(${-c[0]} ${-c[1]})`); }

// Reveal a stroked path progressively (pathLength normalised to 1)
function drawOn(e, p) {
  e.setAttribute('pathLength', 1);
  e.setAttribute('stroke-dasharray', '1 1');
  e.setAttribute('stroke-dashoffset', (1 - clamp(p)).toFixed(4));
}

function linGrad(defs, id, stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1) {
  const g = el('linearGradient', { id, x1, y1, x2, y2 }, defs);
  stops.forEach(([o, c, a]) => el('stop', { offset: o, 'stop-color': c, 'stop-opacity': a === undefined ? 1 : a }, g));
  return g;
}
function radGrad(defs, id, stops, cx = 0.5, cy = 0.5, r = 0.5, extra = {}) {
  const g = el('radialGradient', { id, cx, cy, r, ...extra }, defs);
  stops.forEach(([o, c, a]) => el('stop', { offset: o, 'stop-color': c, 'stop-opacity': a === undefined ? 1 : a }, g));
  return g;
}

// Grain texture drawn once on a canvas, used as an SVG pattern overlay
const _noiseCache = {};
function noisePattern(defs, id, o = {}) {
  const size = o.size || 256, seed = o.seed || 7, alpha = o.alpha || 0.5, scale = o.scale || 1;
  const key = [size, seed, alpha, o.dark, o.blotch].join(':');
  if (!_noiseCache[key]) {
    const c = document.createElement('canvas'); c.width = c.height = size;
    const ctx = c.getContext('2d'); const r = rng(seed);
    const img = ctx.createImageData(size, size);
    for (let i = 0; i < size * size; i++) {
      const v = r();
      const val = o.dark ? 0 : 255;
      img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = val;
      img.data[i * 4 + 3] = Math.floor(Math.pow(v, 3) * 255 * alpha);
    }
    ctx.putImageData(img, 0, 0);
    if (o.blotch) {
      for (let i = 0; i < 40; i++) {
        const x = r() * size, y = r() * size, rad = 8 + r() * 40;
        const gr = ctx.createRadialGradient(x, y, 0, x, y, rad);
        const col = o.dark ? '0,0,0' : '255,255,255';
        gr.addColorStop(0, `rgba(${col},${0.10 * alpha})`); gr.addColorStop(1, `rgba(${col},0)`);
        ctx.fillStyle = gr; ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
      }
    }
    _noiseCache[key] = c.toDataURL('image/png');
  }
  const p = el('pattern', { id, width: size * scale, height: size * scale, patternUnits: 'userSpaceOnUse' }, defs);
  el('image', { href: _noiseCache[key], width: size * scale, height: size * scale }, p);
  return `url(#${id})`;
}

// A generic museum gallery: wall, floor with perspective joints, top light
function gallery(g, defs, id, o = {}) {
  const hz = o.horizon || 800;
  linGrad(defs, id + 'wall', o.wall || [[0, '#3b3a3f'], [1, '#26252a']]);
  linGrad(defs, id + 'floor', o.floor || [[0, '#5a5048'], [1, '#2c2723']]);
  const gx0 = o.x0 === undefined ? -400 : o.x0, gw = o.w || 2720;
  el('rect', { x: gx0, y: -300, width: gw, height: hz + 300, fill: `url(#${id}wall)` }, g);
  el('rect', { x: gx0, y: hz, width: gw, height: 1080 - hz + 400, fill: `url(#${id}floor)` }, g);
  // floor joints converge on a vanishing point
  const vp = o.vp || [960, hz - 900];
  const fl = el('g', { stroke: o.joint || 'rgba(0,0,0,0.25)', 'stroke-width': 2 }, g);
  for (let i = Math.floor((gx0 - 960) / 200) - 2; i <= Math.ceil((gx0 + gw - 960) / 200) + 2; i++) {
    const xb = 960 + i * 200;
    const tt = (hz - vp[1]) / (1480 - vp[1]);
    el('line', { x1: lerp(vp[0], xb, tt), y1: hz, x2: xb, y2: 1480 }, fl);
  }
  for (let k = 0; k < 7; k++) {
    const y = hz + (1480 - hz) * Math.pow(k / 7, 1.8);
    el('line', { x1: gx0, y1: y, x2: gx0 + gw, y2: y }, fl);
  }
  // skirting
  el('rect', { x: gx0, y: hz - 16, width: gw, height: 16, fill: o.skirt || 'rgba(0,0,0,0.35)' }, g);
  if (o.light !== false) {
    radGrad(defs, id + 'light', [[0, o.lightColor || '#fff6df', o.lightA || 0.22], [1, '#fff6df', 0]]);
    el('ellipse', { cx: o.lightX || 960, cy: o.lightY || 250, rx: o.lightRx || 900, ry: o.lightRy || 520, fill: `url(#${id}light)` }, g);
  }
}

function spotlight(g, defs, id, cx, cy, rx, ry, color = '#ffe9b8', a = 0.35) {
  radGrad(defs, id, [[0, color, a], [0.55, color, a * 0.35], [1, color, 0]]);
  return el('ellipse', { cx, cy, rx, ry, fill: `url(#${id})` }, g);
}

function shadow(g, cx, cy, rx, ry, a = 0.45) {
  return el('ellipse', { cx, cy, rx, ry, fill: '#000', opacity: a, filter: 'url(#softblur)' }, g);
}

// Soft blur filter shared per scene svg
function commonDefs(defs) {
  const f = el('filter', { id: 'softblur', x: '-50%', y: '-50%', width: '200%', height: '200%' }, defs);
  el('feGaussianBlur', { stdDeviation: 14 }, f);
  const f2 = el('filter', { id: 'glow', x: '-50%', y: '-50%', width: '200%', height: '200%' }, defs);
  el('feGaussianBlur', { stdDeviation: 6, result: 'b' }, f2);
  const m = el('feMerge', {}, f2); el('feMergeNode', { in: 'b' }, m); el('feMergeNode', { in: 'SourceGraphic' }, m);
}

// Walking visitor silhouettes to give a sense of scale and life
function makePerson(parent, o = {}) {
  const h = o.h || 300, col = o.color || '#15161b';
  const g = el('g', { opacity: o.opacity === undefined ? 0.92 : o.opacity }, parent);
  const inner = el('g', {}, g);
  const lw = h * 0.07, aw = h * 0.05;
  const legB = el('line', { x1: 0, y1: -0.5 * h, x2: 0, y2: -0.02 * h, stroke: col, 'stroke-width': lw, 'stroke-linecap': 'round' }, inner);
  const armB = el('line', { x1: 0, y1: -0.8 * h, x2: 0, y2: -0.47 * h, stroke: col, 'stroke-width': aw, 'stroke-linecap': 'round' }, inner);
  // torso
  el('path', { d: `M ${-0.1 * h} ${-0.82 * h} Q 0 ${-0.87 * h} ${0.1 * h} ${-0.82 * h} L ${0.085 * h} ${-0.46 * h} L ${-0.085 * h} ${-0.46 * h} Z`, fill: col }, inner);
  if (o.coat) el('path', { d: `M ${-0.09 * h} ${-0.6 * h} L ${0.09 * h} ${-0.6 * h} L ${0.12 * h} ${-0.3 * h} L ${-0.12 * h} ${-0.3 * h} Z`, fill: col }, inner);
  if (o.pack) el('rect', { x: -0.17 * h, y: -0.8 * h, width: 0.09 * h, height: 0.22 * h, rx: 0.03 * h, fill: col }, inner);
  el('circle', { cx: 0.01 * h, cy: -0.935 * h, r: 0.068 * h, fill: col }, inner);
  if (o.bun) el('circle', { cx: -0.06 * h, cy: -0.96 * h, r: 0.035 * h, fill: col }, inner);
  const legF = el('line', { x1: 0, y1: -0.5 * h, x2: 0, y2: -0.02 * h, stroke: col, 'stroke-width': lw, 'stroke-linecap': 'round' }, inner);
  const armF = el('line', { x1: 0, y1: -0.8 * h, x2: 0, y2: -0.47 * h, stroke: col, 'stroke-width': aw, 'stroke-linecap': 'round' }, inner);
  function limb(line, x0, y0, len, ang) {
    line.setAttribute('x1', x0); line.setAttribute('y1', y0);
    line.setAttribute('x2', x0 + Math.sin(ang) * len); line.setAttribute('y2', y0 + Math.cos(ang) * len);
  }
  return {
    g,
    set(x, y, phase, facing = 1, still = false) {
      const sw = still ? 0.04 * Math.sin(phase * 0.3) : Math.sin(phase) * 0.42;
      limb(legF, 0, -0.5 * h, 0.48 * h, sw);
      limb(legB, 0, -0.5 * h, 0.48 * h, -sw);
      limb(armF, 0, -0.8 * h, 0.33 * h, -sw * 0.8);
      limb(armB, 0, -0.8 * h, 0.33 * h, sw * 0.8);
      const bob = still ? 0 : Math.abs(Math.cos(phase)) * h * 0.012;
      setT(g, `translate(${x} ${y - bob}) scale(${facing} 1)`);
    },
  };
}

// A walking crowd: people crossing the frame at different speeds
function crowd(parent, specs) {
  const people = specs.map(s => ({ ...s, p: makePerson(parent, s) }));
  return t => people.forEach(s => {
    if (s.still) { s.p.set(s.x0, s.y, t * 2 + (s.seed || 0), s.dir || 1, true); return; }
    const x = s.x0 + s.v * (t - (s.t0 || 0));
    s.p.set(x, s.y, (t - (s.t0 || 0)) * s.v / (s.h * 0.2) + (s.seed || 0), Math.sign(s.v) || 1);
  });
}

// Museum label placard
function placard(parent, x, y, title, lines, w = 300) {
  const g = el('g', { transform: `translate(${x} ${y})` }, parent);
  el('rect', { x: 0, y: 0, width: w, height: 40 + lines.length * 22, rx: 3, fill: '#efe8da' }, g);
  txt(g, 16, 30, title, { size: 19, weight: 700, fill: '#222', family: "'Inter'" });
  lines.forEach((l, i) => txt(g, 16, 56 + i * 22, l, { size: 15, weight: 400, fill: '#444' }));
  return g;
}

// Glass display case outline
function glassCase(parent, x, y, w, h, o = {}) {
  const g = el('g', {}, parent);
  el('rect', { x, y, width: w, height: h, fill: o.fill || 'rgba(200,225,235,0.05)', stroke: 'rgba(220,240,255,0.35)', 'stroke-width': 2 }, g);
  el('path', { d: `M ${x + w * 0.08} ${y + 10} L ${x + w * 0.22} ${y + 10} L ${x + w * 0.06} ${y + h * 0.5} L ${x + 4} ${y + h * 0.5} Z`, fill: 'rgba(255,255,255,0.07)' }, g);
  el('path', { d: `M ${x + w * 0.75} ${y + h - 10} L ${x + w * 0.9} ${y + h - 10} L ${x + w - 4} ${y + h * 0.62} L ${x + w * 0.93} ${y + h * 0.62} Z`, fill: 'rgba(255,255,255,0.05)' }, g);
  return g;
}

// Callout: a line from a point to a label, drawn on over time
function callout(parent, x1, y1, x2, y2, label, o = {}) {
  const g = el('g', {}, parent);
  const line = el('path', { d: `M ${x1} ${y1} L ${x2} ${y2}`, stroke: o.color || '#e9d49a', 'stroke-width': o.sw || 3, fill: 'none' }, g);
  const dot = el('circle', { cx: x1, cy: y1, r: o.r || 8, fill: o.color || '#e9d49a' }, g);
  const lab = el('g', {}, g);
  const tw = (o.size || 30) * 0.56 * label.length + 36;
  const anchorRight = x2 < x1;
  const bx = anchorRight ? x2 - tw : x2;
  el('rect', { x: bx, y: y2 - (o.size || 30) * 0.95, width: tw, height: (o.size || 30) * 1.6, rx: 8, fill: 'rgba(15,16,22,0.82)', stroke: o.color || '#e9d49a', 'stroke-width': 1.5 }, lab);
  txt(lab, bx + tw / 2, y2 + (o.size || 30) * 0.2, label, { size: o.size || 30, weight: 600, anchor: 'middle', fill: '#fff', family: o.family });
  return {
    g,
    set(p) {
      setOp(g, p > 0 ? 1 : 0);
      drawOn(line, prog(p, 0, 0.6, ease.linear));
      setOp(dot, prog(p, 0, 0.15));
      setOp(lab, prog(p, 0.5, 1));
    },
  };
}

// Sculpture group for a triangular pediment: reclining figures in the corners,
// seated and standing figures rising towards the centre.
function pedimentFigures(g, cx, baseY, halfW, peakH, fill, stroke) {
  const f = el('g', { fill, stroke: stroke || 'none', 'stroke-width': 1 }, g);
  const n = 13;
  for (let i = 0; i < n; i++) {
    const u = (i + 0.5) / n * 2 - 1;           // -1 .. 1 across the pediment
    const x = cx + u * halfW * 0.9;
    const room = peakH * (1 - Math.abs(u)) * 0.86;
    const s = room / 100;
    const dir = u < 0 ? 1 : -1;
    if (room < 26) {        // reclining figure
      const w = 46 * Math.max(0.6, s * 2.2), h = Math.max(8, room * 0.8);
      el('path', { d: `M ${x - w / 2} ${baseY} Q ${x - w / 2} ${baseY - h * 0.7} ${x} ${baseY - h * 0.6} Q ${x + dir * w * 0.3} ${baseY - h} ${x + dir * w * 0.45} ${baseY - h * 0.75} L ${x + w / 2} ${baseY} Z` }, f);
      el('circle', { cx: x + dir * w * 0.42, cy: baseY - h * 0.95, r: h * 0.28 }, f);
    } else if (room < 60 || i % 3 === 0) {   // seated figure
      const w = 16 + s * 18, h = room * 0.82;
      el('path', { d: `M ${x - w * 0.7} ${baseY} L ${x - w * 0.6} ${baseY - h * 0.45} L ${x - w * 0.3} ${baseY - h * 0.5} L ${x - w * 0.35} ${baseY - h * 0.85} Q ${x} ${baseY - h * 0.95} ${x + w * 0.35} ${baseY - h * 0.85} L ${x + w * 0.4} ${baseY - h * 0.4} L ${x + w * 0.7} ${baseY} Z` }, f);
      el('circle', { cx: x, cy: baseY - h * 0.97, r: w * 0.26 }, f);
    } else {                // standing draped figure
      const w = 14 + s * 10, h = room * 0.86;
      el('path', { d: `M ${x - w * 0.62} ${baseY} Q ${x - w * 0.5} ${baseY - h * 0.5} ${x - w * 0.45} ${baseY - h * 0.82} Q ${x} ${baseY - h * 0.9} ${x + w * 0.45} ${baseY - h * 0.82} Q ${x + w * 0.5} ${baseY - h * 0.5} ${x + w * 0.62} ${baseY} Z` }, f);
      el('circle', { cx: x, cy: baseY - h * 0.93, r: w * 0.3 }, f);
    }
  }
  return f;
}
