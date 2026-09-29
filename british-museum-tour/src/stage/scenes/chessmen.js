// Stop 9: the Lewis Chessmen, Room 40.
Scenes.chessmen = {
  facts: [
    { line: 1, dt: 0.4, label: 'Found', value: '1831 · Isle of Lewis', sub: 'Outer Hebrides, Scotland' },
    { line: 1, dt: 5.0, label: 'Probably made', value: 'Norway, c. 1150–1200', sub: 'Perhaps in the city of Trondheim' },
    { line: 2, dt: 0.4, label: 'Material', value: 'Walrus ivory', sub: 'A few are carved from whale teeth' },
    { line: 4, dt: 6.1, label: 'Film fame', value: 'Wizard’s chess', sub: 'Harry Potter and the Philosopher’s Stone (2001)' },
  ],
  hideFacts(t, S) { return win(t, S.cue(4) - 0.2, S.at('They even inspired') + 0.2, 0.4); },
  build(svg, defs, S) {
    const world = el('g', {}, svg);
    gallery(world, defs, 'cm', { horizon: 900, wall: [[0, '#2d3a44'], [1, '#18212a']], floor: [[0, '#3a3a3c'], [1, '#161618']], lightX: 820, lightY: 260, lightA: 0.2 });
    spotlight(world, defs, 'cmspot', 720, 640, 760, 380, '#fff0d0', 0.26);
    // display plinth with a chequered top
    const BASE = 820;
    el('path', { d: `M 40 ${BASE} L 1480 ${BASE} L 1540 ${BASE + 70} L -20 ${BASE + 70} Z`, fill: '#7b2e2a' }, world);
    for (let i = 0; i < 16; i++) el('path', { d: `M ${40 + i * 90} ${BASE} L ${130 + i * 90} ${BASE} L ${130 + i * 97.5 - 20 + 7.5} ${BASE + 70} L ${i * 97.5 - 20} ${BASE + 70} Z`, fill: i % 2 ? '#e8dcc2' : '#8a3530', opacity: 0.9 }, world);
    el('rect', { x: -20, y: BASE + 70, width: 1560, height: 120, fill: '#1c1a19' }, world);

    const IV = '#efe3c6', IV_D = '#c9b58f', IV_L = '#fbf4e2', LN = '#8a7552';
    const ivoryTex = noisePattern(defs, 'cmivory', { seed: 1831, alpha: 0.3, dark: true, blotch: true, size: 128 });
    linGrad(defs, 'cmiv', [[0, '#d9c9a4'], [0.35, IV_L], [0.7, IV], [1, '#c2ad84']], 0, 0, 1, 0);
    const S0 = { fill: 'url(#cmiv)', stroke: LN, 'stroke-width': 2.5, 'stroke-linejoin': 'round' };
    const face = (g, cx, cy, r, o = {}) => {
      el('circle', { cx, cy, r, ...S0 }, g);
      [-1, 1].forEach(sd => {
        el('ellipse', { cx: cx + sd * r * 0.38, cy: cy - r * 0.05, rx: r * 0.22, ry: r * 0.16, fill: IV_L, stroke: LN, 'stroke-width': 2 }, g);
        el('circle', { cx: cx + sd * r * 0.38, cy: cy - r * 0.03, r: r * 0.08, fill: '#3b2f22' }, g);
        el('path', { d: `M ${cx + sd * r * 0.16} ${cy - r * 0.3} L ${cx + sd * r * 0.62} ${cy - r * (o.worried ? 0.18 : 0.34)}`, stroke: LN, 'stroke-width': 3 }, g);
      });
      el('path', { d: `M ${cx} ${cy - r * 0.1} L ${cx - r * 0.1} ${cy + r * 0.28} L ${cx + r * 0.1} ${cy + r * 0.28}`, fill: 'none', stroke: LN, 'stroke-width': 2 }, g);
      if (!o.noMouth) el('path', { d: `M ${cx - r * 0.2} ${cy + r * 0.52} Q ${cx} ${cy + r * 0.42} ${cx + r * 0.2} ${cy + r * 0.52}`, fill: 'none', stroke: LN, 'stroke-width': 2.5 }, g);
    };
    const throne = (g) => {
      el('path', { d: 'M -84 0 L -84 -236 Q -84 -262 -58 -262 L 58 -262 Q 84 -262 84 -236 L 84 0 Z', ...S0 }, g);
      for (let k = 0; k < 4; k++) el('path', { d: `M ${-70 + k * 36} -250 q 18 -20 36 0`, fill: 'none', stroke: LN, 'stroke-width': 2 }, g);
      el('path', { d: 'M -76 -222 Q -60 -170 -76 -120 M 76 -222 Q 60 -170 76 -120', fill: 'none', stroke: LN, 'stroke-width': 2 }, g);
    };
    const robe = (g) => {
      el('path', { d: 'M -52 -168 Q 0 -182 52 -168 L 72 -6 L -72 -6 Z', ...S0 }, g);
      for (let k = -2; k <= 2; k++) el('path', { d: `M ${k * 16} -120 L ${k * 22} -8`, stroke: LN, 'stroke-width': 1.5 }, g);
    };
    const pieces = [];
    const mk = (x, name, draw) => {
      const g = el('g', { transform: `translate(${x} ${BASE})` }, world);
      el('ellipse', { cx: 0, cy: 6, rx: 100, ry: 14, fill: '#000', opacity: 0.35 }, g);
      draw(g);
      const lab = el('g', {}, world);
      el('rect', { x: x - 86, y: BASE + 100, width: 172, height: 48, rx: 24, fill: 'rgba(14,15,20,0.85)', stroke: '#d8b35a', 'stroke-width': 1.5 }, lab);
      txt(lab, x, BASE + 132, name, { size: 24, weight: 600, anchor: 'middle', fill: '#fff' });
      pieces.push({ g, lab, x });
    };
    // King
    mk(240, 'King', g => {
      throne(g); robe(g);
      el('path', { d: 'M -30 -176 L 30 -176 L 22 -96 Q 0 -86 -22 -96 Z', ...S0 }, g); // beard
      for (let k = -1; k <= 1; k++) el('path', { d: `M ${k * 12} -170 Q ${k * 12 + 6} -130 ${k * 10} -98`, fill: 'none', stroke: LN, 'stroke-width': 2 }, g);
      face(g, 0, -210, 40);
      el('path', { d: 'M -42 -236 L -42 -262 L -24 -248 L 0 -270 L 24 -248 L 42 -262 L 42 -236 Z', ...S0 }, g);
      el('rect', { x: -86, y: -82, width: 150, height: 12, rx: 4, ...S0 }, g); // sword across the knees
      el('rect', { x: 64, y: -92, width: 12, height: 32, rx: 3, ...S0 }, g);
      el('rect', { x: 76, y: -84, width: 22, height: 16, rx: 5, ...S0 }, g);
      el('rect', { x: -62, y: -126, width: 40, height: 22, rx: 10, ...S0 }, g); el('rect', { x: 22, y: -126, width: 40, height: 22, rx: 10, ...S0 }, g);
    });
    // Queen: hand to cheek
    mk(480, 'Queen', g => {
      throne(g); robe(g);
      el('path', { d: 'M -50 -196 Q -56 -262 0 -266 Q 56 -262 50 -196 L 56 -150 L -56 -150 Z', ...S0 }, g); // veil
      face(g, 0, -206, 36, { worried: true });
      el('path', { d: 'M -38 -236 L -38 -256 L -20 -246 L 0 -264 L 20 -246 L 38 -256 L 38 -236 Z', ...S0 }, g);
      el('path', { d: 'M 50 -150 Q 70 -170 44 -196 L 30 -196 Q 50 -170 34 -150 Z', ...S0 }, g);  // arm up to the cheek
      el('ellipse', { cx: 34, cy: -196, rx: 14, ry: 18, ...S0 }, g);
      el('path', { d: 'M -60 -110 Q -20 -96 -8 -126 Q -2 -112 -30 -90 Q -60 -86 -64 -104 Z', ...S0 }, g); // drinking horn
    });
    // Bishop: mitre and crozier
    mk(720, 'Bishop', g => {
      throne(g); robe(g);
      face(g, 0, -206, 38);
      el('path', { d: 'M -34 -234 L -30 -292 L 0 -262 L 30 -292 L 34 -234 Z', ...S0 }, g);
      el('line', { x1: -32, y1: -244, x2: 32, y2: -244, stroke: LN, 'stroke-width': 2 }, g);
      el('rect', { x: -70, y: -300, width: 12, height: 294, rx: 5, ...S0 }, g); // crozier
      el('path', { d: 'M -64 -300 Q -64 -336 -34 -330 Q -16 -320 -30 -304 Q -42 -296 -46 -310', fill: 'none', stroke: LN, 'stroke-width': 10, 'stroke-linecap': 'round' }, g);
      el('path', { d: 'M -64 -300 Q -64 -336 -34 -330 Q -16 -320 -30 -304 Q -42 -296 -46 -310', fill: 'none', stroke: IV_L, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
      el('rect', { x: 14, y: -136, width: 44, height: 50, rx: 4, ...S0 }, g); // book
    });
    // Knight on a small horse
    mk(960, 'Knight', g => {
      el('path', { d: 'M -110 -70 Q -118 -118 -80 -130 L -40 -150 L -30 -120 L 60 -118 Q 100 -114 104 -80 L 100 -60 L -100 -58 Z', ...S0 }, g);
      [-90, -60, 60, 88].forEach(x => el('rect', { x, y: -64, width: 18, height: 62, rx: 4, ...S0 }, g));
      el('path', { d: 'M -80 -130 Q -126 -130 -128 -96 L -110 -92 Q -104 -110 -84 -112 Z', ...S0 }, g); // horse head
      for (let k = 0; k < 4; k++) el('path', { d: `M ${-72 + k * 10} -146 l -6 -12`, stroke: LN, 'stroke-width': 2 }, g);
      el('path', { d: 'M -10 -118 L -18 -210 Q 0 -222 18 -210 L 26 -118 Z', ...S0 }, g); // rider body
      face(g, 4, -236, 30);
      el('path', { d: 'M -26 -252 Q 4 -304 34 -252 Z', ...S0 }, g); // conical helmet
      el('rect', { x: 36, y: -330, width: 10, height: 230, rx: 4, ...S0 }, g); // spear
      el('path', { d: 'M 36 -330 L 41 -356 L 46 -330 Z', ...S0 }, g);
      el('path', { d: 'M -64 -214 Q -20 -224 -18 -190 L -26 -110 L -44 -78 L -60 -110 Z', ...S0 }, g); // kite shield
      el('path', { d: 'M -60 -200 L -32 -104 M -26 -208 L -52 -120', stroke: LN, 'stroke-width': 1.5 }, g);
    });
    // Warder: the berserker biting his shield
    mk(1200, 'Warder', g => {
      el('path', { d: 'M -46 -170 Q 0 -182 46 -170 L 58 -4 L -58 -4 Z', ...S0 }, g);
      el('rect', { x: 50, y: -250, width: 12, height: 190, rx: 4, ...S0 }, g); // sword
      el('rect', { x: 40, y: -176, width: 32, height: 10, rx: 3, ...S0 }, g);
      face(g, 0, -214, 38, { noMouth: true });
      el('path', { d: 'M -34 -236 Q 0 -300 34 -236 Z', ...S0 }, g);
      // shield held up to the mouth
      el('path', { d: 'M -62 -186 Q 0 -196 62 -186 L 52 -86 L 0 -24 L -52 -86 Z', ...S0 }, g);
      el('path', { d: 'M -20 -190 Q 0 -178 20 -190 L 16 -196 Q 0 -186 -16 -196 Z', fill: '#f8f1de', stroke: LN, 'stroke-width': 2 }, g); // teeth on the rim
      for (let k = -2; k <= 2; k++) el('line', { x1: k * 8, y1: -194, x2: k * 8, y2: -186, stroke: LN, 'stroke-width': 1.5 }, g);
      el('path', { d: 'M -50 -160 L 0 -40 L 50 -160', fill: 'none', stroke: LN, 'stroke-width': 2 }, g);
    });
    pieces.forEach(p => el('rect', { x: p.x - 110, y: BASE - 380, width: 220, height: 380, fill: ivoryTex, opacity: 0.35, 'pointer-events': 'none' }, world));
    glassCase(world, 80, 380, 1320, 440);

    // 82 + 11 pictogram
    const pic = el('g', {}, svg);
    el('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: 'rgba(8,9,12,0.6)' }, pic);
    el('rect', { x: 260, y: 170, width: 1400, height: 720, rx: 18, fill: 'rgba(16,18,24,0.95)', stroke: '#d8b35a', 'stroke-width': 2 }, pic);
    txt(pic, 960, 240, '93 PIECES FOUND · TWO HOMES', { size: 22, weight: 600, anchor: 'middle', fill: '#d8b35a', ls: '0.3em' });
    const icons = [];
    for (let i = 0; i < 93; i++) {
      const c = i % 16, r2 = Math.floor(i / 16);
      const x = 440 + c * 66, y = 320 + r2 * 70;
      const g = el('g', { transform: `translate(${x} ${y})` }, pic);
      const col = i < 82 ? '#e9c46a' : '#6fa8dc';
      el('circle', { cx: 0, cy: -16, r: 11, fill: col }, g);
      el('path', { d: 'M -14 18 L -9 -4 L 9 -4 L 14 18 Z', fill: col }, g);
      icons.push(g);
    }
    const lg1 = el('g', {}, pic);
    el('rect', { x: 420, y: 772, width: 26, height: 26, rx: 5, fill: '#e9c46a' }, lg1);
    txt(lg1, 460, 794, '82 in the British Museum, London', { size: 28, weight: 600, fill: '#fff' });
    const lg2 = el('g', {}, pic);
    el('rect', { x: 420, y: 822, width: 26, height: 26, rx: 5, fill: '#6fa8dc' }, lg2);
    txt(lg2, 460, 844, '11 in the National Museum of Scotland, Edinburgh', { size: 28, weight: 600, fill: '#fff' });

    return t => {
      const c2 = S.cue(2), c3 = S.cue(3), c4 = S.cue(4);
      const cQ = S.at('worried-looking queens'), cB = S.at('fierce warriors');
      const cam = keys(t, [
        [0, [760, 560, 0.86]], [S.cue(1), [760, 570, 0.9]], [c2, [760, 580, 0.9]],
        [cQ - 0.3, [760, 580, 0.9]], [cQ + 1.0, [480, 560, 1.7]], [cB - 0.4, [480, 560, 1.72]], [cB + 1.0, [1200, 560, 1.7]],
        [c4 - 0.3, [1200, 560, 1.7]], [c4 + 1.0, [760, 580, 0.9]], [S.dur, [760, 570, 0.93]],
      ]);
      camera(world, cam);
      const cK = S.at('There are kings');
      pieces.forEach((p, i) => setOp(p.lab, prog(t, cK + 0.3 + i * 0.6, cK + 0.6 + i * 0.6) * (1 - prog(t, cQ - 0.2, cQ + 0.2))));
      setOp(pic, win(t, c4 - 0.1, S.at('They even inspired') + 0.3, 0.45));
      icons.forEach((ic, i) => setOp(ic, prog(t, c4 + 0.3 + i * 0.022, c4 + 0.5 + i * 0.022)));
      setOp(lg1, prog(t, c4 + 1.2, c4 + 1.6)); setOp(lg2, prog(t, c4 + 2.8, c4 + 3.2));
    };
  },
};
