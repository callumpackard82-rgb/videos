// Stop 2: the Rosetta Stone, Room 4.

// Simplified hieroglyph shapes in a 10x10 box (used here and for the cartouche inset)
const Glyphs = {
  stool: g => { el('rect', { x: 1.5, y: 3, width: 7, height: 6, fill: 'none', 'stroke-width': 1.3 }, g); el('line', { x1: 1.5, y1: 6, x2: 8.5, y2: 6, 'stroke-width': 1 }, g); },
  loaf: g => el('path', { d: 'M 1 8.5 Q 5 1.5 9 8.5 Z', 'stroke-width': 1.2 }, g),
  rope: g => el('path', { d: 'M 2.5 9.5 Q 2 6 4.2 5 Q 7.2 3.8 7.4 2.4 Q 7.3 0.9 5.4 1.3 Q 3.6 2 4.6 4.2 Q 6 6.6 8 9.5', fill: 'none', 'stroke-width': 1.3 }, g),
  lion: g => { el('path', { d: 'M 1.2 8.8 L 1.4 5.8 Q 1.4 3 3.2 3.2 Q 4.5 3.4 4.4 4.6 L 8.2 4.6 Q 9.4 5.4 9 8.8 Z', 'stroke-width': 0.8 }, g); el('path', { d: 'M 9 5.2 Q 9.8 3.8 9.2 2.6', fill: 'none', 'stroke-width': 0.8 }, g); },
  board: g => { el('rect', { x: 1, y: 6, width: 8, height: 2.6, 'stroke-width': 0.8 }, g); for (let i = 0; i < 4; i++) el('rect', { x: 1.6 + i * 2, y: 3.6, width: 0.9, height: 2.4, 'stroke-width': 0.4 }, g); },
  reeds: g => { [3.4, 6.4].forEach(x => el('path', { d: `M ${x} 9.5 Q ${x - 1.4} 5 ${x + 0.4} 1 Q ${x + 1.6} 5 ${x} 9.5 Z`, 'stroke-width': 0.6 }, g)); },
  cloth: g => el('path', { d: 'M 3.4 9.6 L 3.4 3.4 Q 3.4 1 5.3 1 Q 7.2 1 7.2 3 L 7.2 4.4 L 5.4 4.4 L 5.4 9.6 Z', 'stroke-width': 0.8 }, g),
  bird: g => { el('path', { d: 'M 2 8.6 L 2.8 5.6 Q 3 2.4 5.2 2.2 Q 6.6 2.2 6.6 3.4 L 8.8 4 L 6.9 4.6 Q 8.2 6.6 7.6 8.6 Z', 'stroke-width': 0.6 }, g); el('line', { x1: 4.6, y1: 8.6, x2: 4.4, y2: 9.8, 'stroke-width': 0.8 }, g); },
  eye: g => { el('path', { d: 'M 1 5 Q 5 1.6 9 5 Q 5 7.4 1 5 Z', fill: 'none', 'stroke-width': 1 }, g); el('circle', { cx: 5, cy: 4.8, r: 1.3, 'stroke-width': 0 }, g); el('path', { d: 'M 3.5 6.4 L 3 9', fill: 'none', 'stroke-width': 0.8 }, g); },
  water: g => el('path', { d: 'M 0.6 6 L 1.8 4.6 L 3 6 L 4.2 4.6 L 5.4 6 L 6.6 4.6 L 7.8 6 L 9.2 4.6', fill: 'none', 'stroke-width': 1 }, g),
  sun: g => { el('circle', { cx: 5, cy: 5, r: 3.6, fill: 'none', 'stroke-width': 1.1 }, g); el('circle', { cx: 5, cy: 5, r: 0.9, 'stroke-width': 0 }, g); },
  snake: g => el('path', { d: 'M 1 8.4 Q 2.5 6.2 4 8.2 Q 5.5 10 7 8 Q 8.2 6.4 8.4 3 L 9.4 2.4', fill: 'none', 'stroke-width': 1.1 }, g),
  ankh: g => { el('ellipse', { cx: 5, cy: 2.8, rx: 1.6, ry: 2, fill: 'none', 'stroke-width': 1 }, g); el('path', { d: 'M 2 5.2 H 8 M 5 4.8 V 9.8', fill: 'none', 'stroke-width': 1.1 }, g); },
  feather: g => el('path', { d: 'M 5 9.6 L 5 1 Q 7.2 2.6 6.4 5.6 Q 6 7.6 5 9.6', 'stroke-width': 0.6 }, g),
  arm: g => el('path', { d: 'M 0.8 6 L 7 6 L 8 4.6 L 9.2 5 L 8.2 7.2 L 0.8 7.2 Z', 'stroke-width': 0.6 }, g),
  owl: g => { el('path', { d: 'M 3 9.4 L 3 4 Q 3 1.8 5 1.8 Q 7.2 1.8 7.4 4.4 L 8.6 8.6 L 3 9.4 Z', 'stroke-width': 0.6 }, g); },
};
const GLYPH_FILL = Object.keys(Glyphs).filter(k => !['stool', 'lion', 'board', 'cloth'].includes(k));

function drawGlyph(parent, name, x, y, s, color) {
  const g = el('g', { transform: `translate(${x} ${y}) scale(${s / 10})`, fill: color, stroke: color }, parent);
  Glyphs[name](g);
  return g;
}

Scenes.rosetta = {
  facts: [
    { line: 1, dt: 0.6, label: 'Carved', value: '196 BC', sub: 'A priestly decree about King Ptolemy&nbsp;V' },
    { line: 1, dt: 5.5, label: 'Material', value: 'Granodiorite', sub: 'About 112 cm tall, weighing around 760 kg' },
    { line: 4, dt: 0.4, label: 'Found', value: '1799 · Rashid (Rosetta)', sub: 'By French soldiers in the Nile Delta' },
    { line: 4, dt: 5.2, label: 'At the museum since', value: '1802' },
    { line: 5, dt: 5.0, label: 'Deciphered', value: '1822', sub: 'Jean-François Champollion' },
  ],
  build(svg, defs, S) {
    const world = el('g', {}, svg);
    gallery(world, defs, 'rs', {
      horizon: 820, wall: [[0, '#5c5448'], [1, '#3a342c']], floor: [[0, '#6a5e4f'], [1, '#2e2822']],
      lightX: 720, lightY: 300, lightA: 0.25,
    });
    // background sculpture: a colossal pharaoh bust (suggested, out of focus)
    const bg = el('g', { opacity: 0.35, filter: 'url(#softblur)' }, world);
    el('path', { d: 'M 1380 820 L 1400 520 Q 1330 470 1360 380 L 1420 300 Q 1520 230 1620 300 L 1680 380 Q 1710 470 1640 520 L 1660 820 Z', fill: '#1f1b17' }, bg);
    el('rect', { x: 1330, y: 820, width: 380, height: 120, fill: '#1c1915' }, bg);
    el('path', { d: 'M 60 900 L 90 380 L 150 330 L 210 380 L 240 900 Z', fill: '#1c1915' }, bg);

    // plinth and case
    const CX = 720, TOPY = 300, W = 380, H = 560;
    const X0 = CX - W / 2;
    spotlight(world, defs, 'rsspot', CX, 640, 420, 460, '#ffe6b0', 0.28);
    el('rect', { x: CX - 250, y: TOPY + H + 10, width: 500, height: 170, fill: '#262320' }, world);
    el('rect', { x: CX - 250, y: TOPY + H + 10, width: 500, height: 10, fill: '#3b3632' }, world);
    shadow(world, CX, TOPY + H + 180, 330, 30, 0.5);

    // the stone
    const pts = [[0, 560], [0, 150], [22, 128], [40, 96], [76, 70], [110, 40], [150, 24], [178, 8], [214, 14], [252, 2], [292, 10], [322, 36], [350, 58], [380, 92], [378, 330], [380, 470], [362, 500], [344, 540], [336, 560]];
    const poly = pts.map(([x, y]) => `${X0 + x},${TOPY + y}`).join(' ');
    const cp = el('clipPath', { id: 'rsclip' }, defs);
    el('polygon', { points: poly }, cp);
    linGrad(defs, 'rsstone', [[0, '#3a3b3f'], [0.5, '#2a2b2e'], [1, '#1d1e21']], 0, 0, 1, 1);
    const stone = el('g', {}, world);
    el('polygon', { points: poly, fill: 'url(#rsstone)' }, stone);
    const speck = noisePattern(defs, 'rsspeck', { seed: 5, alpha: 0.28, size: 128 });
    el('polygon', { points: poly, fill: speck, opacity: 0.5 }, stone);
    const ins = el('g', { 'clip-path': 'url(#rsclip)' }, stone);
    const INK = '#a3a39f';
    const r = rng(196);
    // hieroglyphs: 14 partial lines at the top
    const hiero = el('g', { opacity: 0.85 }, ins);
    const cartouches = [];
    for (let row = 0; row < 14; row++) {
      const y = TOPY + 20 + row * 11;
      let x = X0 + 8;
      while (x < X0 + W - 10) {
        if (r() < 0.018 && cartouches.length < 6 && x < X0 + W - 70 && row > 3) {
          // a cartouche (royal name) with glyphs inside
          const cw = 52;
          const c = el('rect', { x: x, y: y - 0.5, width: cw, height: 10.5, rx: 5, fill: 'none', stroke: INK, 'stroke-width': 1 }, hiero);
          el('line', { x1: x + cw, y1: y - 1, x2: x + cw, y2: y + 11, stroke: INK, 'stroke-width': 1.2 }, hiero);
          ['stool', 'loaf', 'rope', 'lion'].forEach((n, k) => drawGlyph(hiero, n, x + 4 + k * 11.5, y + 0.8, 8.5, INK));
          cartouches.push({ x, y, w: cw });
          x += cw + 6;
          continue;
        }
        const n = GLYPH_FILL[Math.floor(r() * GLYPH_FILL.length)];
        drawGlyph(hiero, n, x, y, 9, INK);
        x += 9.8 + r() * 1.5;
      }
    }
    // demotic: cursive strokes
    const dem = el('g', { stroke: INK, 'stroke-width': 1.1, fill: 'none', 'stroke-linecap': 'round', opacity: 0.8 }, ins);
    for (let row = 0; row < 16; row++) {
      const y = TOPY + 190 + row * 8.8;
      let x = X0 + 10;
      let d = '';
      while (x < X0 + W - 10) {
        const w = 3 + r() * 6;
        const h = 2 + r() * 4;
        d += `M ${x.toFixed(1)} ${(y + r() * 2).toFixed(1)} q ${(w / 2).toFixed(1)} ${(-h).toFixed(1)} ${w.toFixed(1)} ${(r() * 3 - 1).toFixed(1)} `;
        if (r() < 0.4) d += `M ${(x + w * 0.3).toFixed(1)} ${(y - 3).toFixed(1)} l ${(r() * 2).toFixed(1)} 4 `;
        x += w + 1 + r() * 2;
      }
      el('path', { d }, dem);
    }
    // Greek: uppercase text from the start of the decree
    const GREEK = 'ΒΑΣΙΛΕΥΟΝΤΟΣ ΤΟΥ ΝΕΟΥ ΚΑΙ ΠΑΡΑΛΑΒΟΝΤΟΣ ΤΗΝ ΒΑΣΙΛΕΙΑΝ ΠΑΡΑ ΤΟΥ ΠΑΤΡΟΣ ΚΥΡΙΟΥ ΒΑΣΙΛΕΙΩΝ ΜΕΓΑΛΟΔΟΞΟΥ ΤΟΥ ΤΗΝ ΑΙΓΥΠΤΟΝ ΚΑΤΑΣΤΗΣΑΜΕΝΟΥ ΚΑΙ ΤΑ ΠΡΟΣ ΤΟΥΣ ΘΕΟΥΣ ΕΥΣΕΒΟΥΣ ΑΝΤΙΠΑΛΩΝ ΥΠΕΡΤΕΡΟΥ ΤΟΥ ΤΟΝ ΒΙΟΝ ΤΩΝ ΑΝΘΡΩΠΩΝ ΕΠΑΝΟΡΘΩΣΑΝΤΟΣ ΚΥΡΙΟΥ ΤΡΙΑΚΟΝΤΑΕΤΗΡΙΔΩΝ ΚΑΘΑΠΕΡ Ο ΗΦΑΙΣΤΟΣ Ο ΜΕΓΑΣ ΒΑΣΙΛΕΩΣ ΚΑΘΑΠΕΡ Ο ΗΛΙΟΣ ΜΕΓΑΣ ΒΑΣΙΛΕΥΣ ΤΩΝ ΤΕ ΑΝΩ ΚΑΙ ΤΩΝ ΚΑΤΩ ΧΩΡΩΝ ΕΚΓΟΝΟΥ ΘΕΩΝ ΦΙΛΟΠΑΤΟΡΩΝ ΟΝ Ο ΗΦΑΙΣΤΟΣ ΕΔΟΚΙΜΑΣΕΝ Ω Ο ΗΛΙΟΣ ΕΔΩΚΕΝ ΤΗΝ ΝΙΚΗΝ ΕΙΚΟΝΟΣ ΖΩΣΗΣ ΤΟΥ ΔΙΟΣ ΥΙΟΥ ΤΟΥ ΗΛΙΟΥ ΠΤΟΛΕΜΑΙΟΥ ΑΙΩΝΟΒΙΟΥ ΗΓΑΠΗΜΕΝΟΥ ΥΠΟ ΤΟΥ ΦΘΑ ';
    const grk = el('g', { opacity: 0.85 }, ins);
    let off = 0;
    for (let row = 0; row < 26; row++) {
      const y = TOPY + 350 + row * 7.8;
      const line = (GREEK + GREEK).slice(off, off + 92);
      off = (off + 92) % GREEK.length;
      txt(grk, X0 + 8, y, line, { size: 7.2, weight: 400, family: "'DejaVu Serif', serif", fill: INK, ls: '0.4' });
    }
    // rim light on the broken top edge
    el('polyline', { points: pts.slice(1, 14).map(([x, y]) => `${X0 + x},${TOPY + y}`).join(' '), fill: 'none', stroke: '#6b6c70', 'stroke-width': 2 }, stone);

    // band highlights and labels
    const bands = [
      { y0: TOPY, y1: TOPY + 178, name: 'Hieroglyphic', sub: 'sacred script' },
      { y0: TOPY + 180, y1: TOPY + 335, name: 'Demotic', sub: 'everyday script' },
      { y0: TOPY + 338, y1: TOPY + H, name: 'Ancient Greek', sub: 'language of the rulers' },
    ].map(b => {
      const g = el('g', {}, world);
      const hl = el('rect', { x: X0 - 10, y: b.y0, width: W + 20, height: b.y1 - b.y0, fill: '#ffd873', opacity: 0.16, 'clip-path': 'url(#rsclip)' }, g);
      const br = el('path', { d: `M ${X0 - 24} ${b.y0 + 6} h -14 V ${b.y1 - 6} h 14`, fill: 'none', stroke: '#e9d49a', 'stroke-width': 4 }, g);
      const lab = el('g', {}, g);
      txt(lab, X0 - 58, (b.y0 + b.y1) / 2 + 6, b.name, { size: 34, weight: 600, family: "'Cormorant Garamond'", fill: '#fff', anchor: 'end' });
      txt(lab, X0 - 60, (b.y0 + b.y1) / 2 + 32, b.sub.toUpperCase(), { size: 13, weight: 600, fill: '#d8b35a', ls: '0.2em', anchor: 'end' });
      return { g, hl, br, lab, mid: (b.y0 + b.y1) / 2 };
    });

    // glass case
    glassCase(world, CX - 240, TOPY - 60, 480, H + 70);

    // visitors
    const pp = el('g', {}, world);
    const walk = crowd(pp, [
      { x0: 1020, y: 1000, h: 300, still: true, seed: 2, dir: -1, bun: true, opacity: 0.9 },
      { x0: 330, y: 990, h: 290, still: true, seed: 3, pack: true, opacity: 0.9 },
      { x0: 1500, y: 1060, h: 360, v: -40, seed: 4, coat: true },
      { x0: -100, y: 1070, h: 380, v: 38, t0: 20, seed: 5 },
    ]);

    // cartouche inset: how Champollion read "Ptolemy"
    const inset = el('g', {}, svg);
    el('rect', { x: 70, y: 250, width: 760, height: 520, rx: 16, fill: 'rgba(14,15,20,0.9)', stroke: '#d8b35a', 'stroke-width': 2 }, inset);
    txt(inset, 110, 312, 'READING A CARTOUCHE', { size: 18, weight: 600, fill: '#d8b35a', ls: '0.25em' });
    txt(inset, 110, 364, 'The name of Ptolemy', { size: 46, weight: 600, family: "'Cormorant Garamond'", fill: '#fff' });
    const ring = el('rect', { x: 120, y: 420, width: 660, height: 150, rx: 75, fill: '#2b2a28', stroke: '#e9d49a', 'stroke-width': 5 }, inset);
    el('line', { x1: 800, y1: 410, x2: 800, y2: 580, stroke: '#e9d49a', 'stroke-width': 6 }, inset);
    const sounds = [['stool', 'P'], ['loaf', 'T'], ['rope', 'O'], ['lion', 'L'], ['board', 'M'], ['reeds', 'Y'], ['cloth', 'S']];
    const sGl = sounds.map(([n, l], k) => {
      const x = 170 + k * 84;
      const gl = drawGlyph(inset, n, x, 450, 64, '#e8dcc0');
      const lt = txt(inset, x + 32, 640, l, { size: 52, weight: 600, family: "'Cormorant Garamond'", anchor: 'middle', fill: '#ffd873' });
      return { gl, lt };
    });
    txt(inset, 450, 720, 'Each sign stands for a sound (simplified)', { size: 20, weight: 400, anchor: 'middle', fill: '#bdb6a6' });

    const cartHL = el('rect', { fill: 'none', stroke: '#ffd873', 'stroke-width': 3, rx: 7, filter: 'url(#glow)' }, world);
    return t => {
      const cH = S.at('At the top'), cD = S.at('In the middle'), cG = S.at('And at the bottom');
      const c5 = S.cue(5), cCart = S.at('starting with royal names');
      const cart = cartouches[1] || cartouches[0];
      const cam = keys(t, [
        [0, [760, 560, 1.0]], [S.cue(1), [760, 560, 1.05]], [S.cue(2) - 0.5, [760, 580, 1.2]],
        [cH - 0.2, [760, 580, 1.15]], [cH + 1.0, [700, bands[0].mid + 40, 1.75]], [cD - 0.3, [700, bands[0].mid + 50, 1.8]],
        [cD + 0.9, [700, bands[1].mid + 30, 1.75]], [cG - 0.3, [700, bands[1].mid + 30, 1.8]],
        [cG + 0.9, [700, bands[2].mid, 1.7]], [S.cue(4) - 0.2, [700, bands[2].mid, 1.75]],
        [S.cue(4) + 1.4, [760, 580, 1.05]], [c5, [760, 560, 1.1]],
        [cCart - 0.5, [cart.x + 30, cart.y + 40, 2.6]], [cCart + 1.5, [cart.x + 30 - 69, cart.y + 40, 2.6]],
        [S.dur, [cart.x + 30 - 70, cart.y + 40, 2.7]],
      ]);
      camera(world, cam);
      walk(t);
      cartHL.setAttribute('x', cart.x - 4); cartHL.setAttribute('y', cart.y - 4); cartHL.setAttribute('width', cart.w + 10); cartHL.setAttribute('height', 18.5);
      setOp(cartHL, prog(t, cCart - 0.6, cCart) * (0.7 + 0.3 * Math.sin(t * 5)));
      const all = win(t, S.cue(2) + 1.2, cH, 0.4);
      bands.forEach((b, i) => {
        const own = [win(t, cH, cD + 0.1, 0.35), win(t, cD, cG + 0.1, 0.35), win(t, cG, S.cue(4) + 0.3, 0.35)][i];
        const v = Math.max(all * 0.8, own);
        setOp(b.g, v);
        setOp(b.lab, Math.max(own, all));
      });
      const ins = win(t, cCart + 0.8, S.dur + 1, 0.6);
      setOp(inset, ins);
      setT(inset, `translate(${(1 - prog(t, cCart + 0.8, cCart + 1.6, ease.out)) * -60} 0)`);
      sGl.forEach((s, k) => { const a = cCart + 1.8 + k * 0.45; setOp(s.lt, prog(t, a, a + 0.3)); setOp(s.gl, 0.45 + 0.55 * prog(t, a - 0.2, a + 0.1)); });
    };
  },
  hideFacts(t) { return 0; },
};
