// Opening: the Greek Revival south front on Great Russell Street.
Scenes.intro = {
  noDoor: true,
  badgeTop: 'Welcome',
  badgeRoom: 'Great Russell Street · <em>London</em>',
  badgeFrom: 5.2,
  facts: [
    { line: 1, dt: 1.2, label: 'Founded', value: '1753', sub: 'Sir Hans Sloane’s collection of over 71,000 objects' },
    { line: 2, dt: 1.0, label: 'Opened', value: '15 January 1759', sub: 'The first free national public museum' },
    { line: 3, dt: 1.4, label: 'Architect', value: 'Sir Robert Smirke', sub: 'Greek Revival front with 44 Ionic columns' },
    { line: 4, dt: 0.8, label: 'The collection', value: 'About 8 million objects', sub: 'Two million years of human history' },
  ],
  build(svg, defs, S) {
    const STONE = '#ece3cf', STONE_D = '#cdbfa3', SHADE = '#a8987b';
    linGrad(defs, 'isky', [[0, '#6f9cc6'], [0.55, '#b9cfe0'], [1, '#f4dcb4']]);
    radGrad(defs, 'isun', [[0, '#fff4d6', 0.9], [0.3, '#ffe7b0', 0.35], [1, '#ffe7b0', 0]]);
    linGrad(defs, 'icol', [[0, '#d9ccb0'], [0.35, '#f6efe0'], [0.6, '#efe5d0'], [1, '#bfae8e']], 0, 0, 1, 0);
    linGrad(defs, 'iwall', [[0, '#b6a78a'], [1, '#9d8e72']]);
    linGrad(defs, 'ilawn', [[0, '#7f9a55'], [1, '#56733a']]);
    linGrad(defs, 'ipave', [[0, '#d7cdb8'], [1, '#b3a78f']]);
    linGrad(defs, 'ivig', [[0, '#000', 0.55], [0.35, '#000', 0], [0.75, '#000', 0], [1, '#000', 0.45]]);
    const grain = noisePattern(defs, 'igrain', { seed: 3, alpha: 0.18, dark: true, blotch: true });

    const world = el('g', {}, svg);
    el('rect', { x: -500, y: -400, width: 2920, height: 1400, fill: 'url(#isky)' }, world);
    el('circle', { cx: 1560, cy: 120, r: 420, fill: 'url(#isun)' }, world);

    // clouds
    const clouds = el('g', { fill: '#fff', filter: 'url(#softblur)' }, world);
    const cl = [];
    const r = rng(42);
    for (let i = 0; i < 9; i++) {
      const g = el('g', { opacity: 0.55 + r() * 0.3 }, clouds);
      const w = 180 + r() * 260;
      for (let k = 0; k < 4; k++) el('ellipse', { cx: k * w * 0.28, cy: (k % 2) * -18, rx: w * 0.3, ry: 26 + r() * 22 }, g);
      cl.push({ g, x: -300 + r() * 2500, y: -80 + r() * 300, v: 6 + r() * 10 });
    }

    // birds
    const birds = el('g', { stroke: '#2b2f38', 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, world);
    const bl = [];
    for (let i = 0; i < 5; i++) bl.push({ p: el('path', {}, birds), x: -200 - i * 90, y: 200 + (i % 3) * 40, s: 0.8 + (i % 2) * 0.4, ph: i });

    // ---- the building ----
    const b = el('g', {}, world);
    const GROUND = 860;
    // back wall of colonnade
    el('rect', { x: 60, y: 470, width: 1800, height: GROUND - 470, fill: 'url(#iwall)' }, b);
    // windows / doors in the wall
    for (let i = 0; i < 22; i++) {
      const x = 105 + i * 80;
      if (x > 560 && x < 1360) continue;
      el('rect', { x, y: 600, width: 30, height: 150, fill: '#3b3a37', opacity: 0.55 }, b);
    }
    // central doorway with warm light
    radGrad(defs, 'idoor', [[0, '#ffd99a'], [1, '#b4814a']], 0.5, 0.8, 0.8);
    el('rect', { x: 890, y: 560, width: 140, height: GROUND - 560 - 40, fill: 'url(#idoor)' }, b);
    el('path', { d: `M 880 ${GROUND - 40} V 552 H 1040 V ${GROUND - 40}`, fill: 'none', stroke: STONE_D, 'stroke-width': 10 }, b);

    // side wings (projecting end pavilions) and recessed colonnades
    function column(g, x, top, bottom, w) {
      const cg = el('g', {}, g);
      const h = bottom - top;
      el('rect', { x: x - w * 0.62, y: bottom - 16, width: w * 1.24, height: 16, fill: STONE_D }, cg);
      el('rect', { x: x - w * 0.56, y: bottom - 28, width: w * 1.12, height: 12, rx: 6, fill: STONE }, cg);
      el('path', { d: `M ${x - w / 2} ${bottom - 28} L ${x - w * 0.43} ${top + 20} L ${x + w * 0.43} ${top + 20} L ${x + w / 2} ${bottom - 28} Z`, fill: 'url(#icol)' }, cg);
      for (let k = -2; k <= 2; k++) el('line', { x1: x + k * w * 0.16, y1: bottom - 30, x2: x + k * w * 0.14, y2: top + 22, stroke: 'rgba(120,100,70,0.25)', 'stroke-width': 1.5 }, cg);
      // Ionic capital: abacus + two volutes
      el('rect', { x: x - w * 0.75, y: top, width: w * 1.5, height: 8, fill: STONE }, cg);
      el('path', { d: `M ${x - w * 0.62} ${top + 8} Q ${x} ${top + 24} ${x + w * 0.62} ${top + 8} Z`, fill: STONE_D }, cg);
      [-1, 1].forEach(sd => {
        el('circle', { cx: x + sd * w * 0.58, cy: top + 17, r: w * 0.22, fill: STONE, stroke: SHADE, 'stroke-width': 1.5 }, cg);
        el('circle', { cx: x + sd * w * 0.58, cy: top + 17, r: w * 0.09, fill: 'none', stroke: SHADE, 'stroke-width': 1.5 }, cg);
      });
      return cg;
    }
    const cols = [];
    // recessed colonnades (set back, in light shade)
    const rec = el('g', {}, b);
    for (let i = 0; i < 5; i++) cols.push({ x: 300 + i * 52, g: column(rec, 300 + i * 52, 492, GROUND - 6, 30) });
    for (let i = 0; i < 5; i++) cols.push({ x: 1412 + i * 52, g: column(rec, 1412 + i * 52, 492, GROUND - 6, 30) });
    el('rect', { x: 250, y: 462, width: 1420, height: 30, fill: STONE_D }, rec);
    el('rect', { x: 250, y: 452, width: 1420, height: 12, fill: STONE }, rec);
    el('rect', { x: 250, y: 492, width: 1420, height: GROUND - 492, fill: '#000', opacity: 0.12 }, rec);
    // end pavilions
    [[60, 250], [1670, 1860]].forEach(([x0, x1]) => {
      const g = el('g', {}, b);
      el('rect', { x: x0, y: 440, width: x1 - x0, height: GROUND - 440, fill: '#b9aa8d' }, g);
      for (let i = 0; i < 3; i++) cols.push({ x: x0 + 40 + i * 55, g: column(g, x0 + 40 + i * 55, 470, GROUND, 34) });
      el('rect', { x: x0 - 10, y: 420, width: x1 - x0 + 20, height: 50, fill: STONE }, g);
      el('rect', { x: x0 - 16, y: 412, width: x1 - x0 + 32, height: 12, fill: '#f4ecdb' }, g);
      el('rect', { x: x0 - 10, y: 360, width: x1 - x0 + 20, height: 52, fill: STONE_D }, g);
    });
    // central portico
    const por = el('g', {}, b);
    el('rect', { x: 540, y: 470, width: 840, height: GROUND - 470, fill: '#000', opacity: 0.18 }, por);
    for (let i = 0; i < 8; i++) cols.push({ x: 590 + i * 106, g: column(por, 590 + i * 106, 468, GROUND, 50), main: true });
    // entablature
    el('rect', { x: 522, y: 424, width: 876, height: 44, fill: STONE }, por);
    el('rect', { x: 522, y: 440, width: 876, height: 3, fill: SHADE, opacity: 0.6 }, por);
    el('rect', { x: 510, y: 404, width: 900, height: 22, fill: '#f6efdf' }, por);
    for (let i = 0; i < 44; i++) el('rect', { x: 516 + i * 20.3, y: 426, width: 8, height: 6, fill: SHADE, opacity: 0.6 }, por);
    // pediment
    el('path', { d: 'M 500 404 L 960 236 L 1420 404 Z', fill: '#f4ecdb' }, por);
    el('path', { d: 'M 540 394 L 960 252 L 1380 394 Z', fill: '#d9cdb2' }, por);
    // sculpture group in the tympanum (The Progress of Civilisation, suggested)
    pedimentFigures(por, 960, 394, 420, 142, '#efe6d2', '#c8bb9f');
    el('path', { d: 'M 500 404 L 960 236 L 1420 404', fill: 'none', stroke: '#fbf6ea', 'stroke-width': 8 }, por);
    // steps
    for (let i = 0; i < 5; i++) el('rect', { x: 520 - i * 14, y: GROUND + i * 10, width: 880 + i * 28, height: 10, fill: i % 2 ? '#d8cdb5' : '#e6dcc6' }, b);
    el('rect', { x: -500, y: GROUND + 50, width: 2920, height: 400, fill: 'url(#ipave)' }, b);
    el('rect', { x: 60, y: 470, width: 1800, height: GROUND - 470, fill: grain }, b);

    // column highlight overlays (for the "44 columns" moment)
    const hl = el('g', {}, b);
    cols.sort((a, c) => a.x - c.x);
    const hlCols = cols.map((c, i) => {
      const w = c.main ? 56 : (c.x < 560 && c.x > 280) || (c.x > 1380 && c.x < 1680) ? 34 : 38;
      const top = c.main ? 470 : 480;
      return el('rect', { x: c.x - w / 2, y: top, width: w, height: GROUND - top, rx: 6, fill: '#ffd873', opacity: 0 }, hl);
    });

    // lawns and forecourt
    el('path', { d: 'M -500 930 L 700 930 L 560 1100 L -500 1100 Z', fill: 'url(#ilawn)' }, world);
    el('path', { d: 'M 2420 930 L 1220 930 L 1360 1100 L 2420 1100 Z', fill: 'url(#ilawn)' }, world);

    // visitors
    const people = el('g', {}, world);
    const walk = crowd(people, [
      { x0: 420, y: 925, h: 120, v: 26, seed: 1, coat: true },
      { x0: 1500, y: 935, h: 130, v: -30, seed: 2, pack: true },
      { x0: 1150, y: 915, h: 110, v: -18, seed: 3, bun: true },
      { x0: 760, y: 905, h: 104, v: 14, seed: 4 },
      { x0: 820, y: 900, h: 72, v: 14, seed: 5 },
      { x0: 200, y: 1010, h: 190, v: 40, seed: 6, coat: true, opacity: 0.95 },
      { x0: 1850, y: 1030, h: 200, v: -46, seed: 7, pack: true, opacity: 0.95 },
    ]);

    // railings in the foreground
    const rail = el('g', {}, world);
    const RY = 1000;
    el('rect', { x: -500, y: RY - 80, width: 1340, height: 6, fill: '#15161a' }, rail);
    el('rect', { x: -500, y: RY + 30, width: 1340, height: 8, fill: '#15161a' }, rail);
    el('rect', { x: 1080, y: RY - 80, width: 1340, height: 6, fill: '#15161a' }, rail);
    el('rect', { x: 1080, y: RY + 30, width: 1340, height: 8, fill: '#15161a' }, rail);
    for (let x = -500; x < 2420; x += 26) {
      if (x > 830 && x < 1090) continue;
      el('rect', { x, y: RY - 110, width: 6, height: 200, fill: '#15161a' }, rail);
      el('path', { d: `M ${x - 3} ${RY - 108} L ${x + 3} ${RY - 128} L ${x + 9} ${RY - 108} Z`, fill: '#c9a44e' }, rail);
    }
    // gate piers and lamps
    [800, 1090].forEach(x => {
      el('rect', { x: x - 30, y: RY - 190, width: 60, height: 290, fill: '#d8ccb3' }, rail);
      el('rect', { x: x - 38, y: RY - 200, width: 76, height: 20, fill: '#e8dfcb' }, rail);
      el('rect', { x: x - 4, y: RY - 290, width: 8, height: 90, fill: '#15161a' }, rail);
      el('path', { d: `M ${x - 22} ${RY - 290} L ${x + 22} ${RY - 290} L ${x + 14} ${RY - 340} L ${x - 14} ${RY - 340} Z`, fill: '#2a2a2a' }, rail);
      el('rect', { x: x - 12, y: RY - 332, width: 24, height: 36, fill: '#ffe6a6', opacity: 0.9 }, rail);
    });

    // vignette + title
    const vig = el('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: 'url(#ivig)' }, svg);
    const title = el('g', {}, svg);
    el('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: '#0b0c10', opacity: 0.35 }, title);
    const t1 = txt(title, 960, 470, 'The British Museum', { size: 150, weight: 600, family: "'Cormorant Garamond'", anchor: 'middle', fill: '#fff' });
    const tl = el('line', { x1: 760, y1: 520, x2: 1160, y2: 520, stroke: '#d8b35a', 'stroke-width': 3 }, title);
    const t2 = txt(title, 960, 600, 'A Guided Tour', { size: 60, weight: 500, italic: true, family: "'Cormorant Garamond'", anchor: 'middle', fill: '#e9d49a' });
    const t3 = txt(title, 960, 660, 'LONDON', { size: 22, weight: 600, anchor: 'middle', fill: '#e8e2d4', ls: '0.5em' });
    const black = el('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: '#000' }, svg);

    return t => {
      const c1 = S.cue(3), c4 = S.cue(4);
      const cam = keys(t, [
        [0, [960, 560, 1.06]], [6, [960, 540, 1.0]],
        [c1 + 1.5, [960, 560, 1.12]], [c1 + 7.5, [960, 580, 1.12]],
        [c4, [960, 590, 1.05]], [S.dur - 2.2, [960, 640, 1.2]], [S.dur, [960, 720, 2.6]],
      ]);
      camera(world, cam);
      cl.forEach(c => setT(c.g, `translate(${((c.x + c.v * t + 400) % 2900) - 400} ${c.y})`));
      bl.forEach(bd => {
        const x = bd.x + t * 120, y = bd.y - t * 6 + Math.sin(t + bd.ph) * 6;
        const f = Math.sin(t * 9 + bd.ph) * 8 * bd.s;
        bd.p.setAttribute('d', `M ${x - 14 * bd.s} ${y - f} Q ${x - 6 * bd.s} ${y - 6} ${x} ${y} Q ${x + 6 * bd.s} ${y - 6} ${x + 14 * bd.s} ${y - f}`);
      });
      walk(t);
      // column count sweep
      const sweepA = c1 + 3.4;
      hlCols.forEach((h, i) => {
        const at = sweepA + i * 0.06;
        h.setAttribute('opacity', (0.32 * prog(t, at, at + 0.2) * (1 - prog(t, c1 + 7.2, c1 + 8.0))).toFixed(3));
      });
      setOp(title, 1 - prog(t, 4.4, 5.4));
      setOp(t1, prog(t, 0.4, 1.4));
      drawOn(tl, prog(t, 0.9, 1.9));
      setOp(t2, prog(t, 1.3, 2.3));
      setOp(t3, prog(t, 1.8, 2.8));
      setOp(vig, 0.45);
      setOp(black, 1 - prog(t, 0, 1.2, ease.sine) + prog(t, S.dur - 0.6, S.dur, ease.in) * 0.0);
    };
  },
};
