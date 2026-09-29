// Stop 7: Egyptian mummies, Rooms 62–63.
Scenes.mummies = {
  facts: [
    { line: 1, dt: 0.5, label: 'Belief', value: 'Life after death', sub: 'The preserved body was a home for the spirit' },
    { line: 3, dt: 0.5, label: 'Coffins', value: 'Painted with spells', sub: 'Prayers, gods and protective symbols' },
    { line: 4, dt: 1.6, label: 'Animal mummies', value: 'Gifts for the gods', sub: 'Cats were linked to the goddess Bastet' },
  ],
  hideFacts(t, S) { return win(t, S.cue(2) - 0.3, S.cue(3) + 0.1, 0.4); },
  build(svg, defs, S) {
    const world = el('g', {}, svg);
    gallery(world, defs, 'mu', { horizon: 900, wall: [[0, '#3b2d22'], [1, '#1f1812']], floor: [[0, '#4a3b2e'], [1, '#1d1611']], lightX: 760, lightY: 200, lightA: 0.18, x0: -600, w: 3600 });
    spotlight(world, defs, 'muspot1', 700, 520, 330, 480, '#ffdca0', 0.28);
    spotlight(world, defs, 'muspot2', 1560, 600, 420, 340, '#ffdca0', 0.22);

    const GOLD = '#e0b04a', OCH = '#c9953c', TURQ = '#3fa39a', RED = '#b3412c', BLUE = '#2d4a8a', WIG = '#1f2d52', BLK = '#1a1410';
    // ------- the coffin -------
    const CX = 700, CY = 150;
    const cof = el('g', { transform: `translate(${CX} ${CY})` }, world);
    const outline = 'M 0 0 C 90 0 135 50 140 130 L 150 230 C 150 300 130 380 120 460 L 100 640 C 98 700 90 740 70 750 L -70 750 C -90 740 -98 700 -100 640 L -120 460 C -130 380 -150 300 -150 230 L -140 130 C -135 50 -90 0 0 0 Z';
    linGrad(defs, 'mubody', [[0, '#a8742c'], [0.3, '#d9a54c'], [0.6, '#cf9a42'], [1, '#98652a']], 0, 0, 1, 0);
    shadow(world, CX, CY + 760, 170, 24, 0.6);
    el('path', { d: outline, fill: 'url(#mubody)' }, cof);
    const cclip = el('clipPath', { id: 'mucclip' }, defs); el('path', { d: outline, transform: `translate(${CX} ${CY})` }, cclip);
    // wig with lappets
    el('path', { d: 'M 0 6 C 86 6 128 52 134 130 L 142 262 L 86 262 L 70 150 C 60 70 -60 70 -70 150 L -86 262 L -142 262 L -134 130 C -128 52 -86 6 0 6 Z', fill: WIG }, cof);
    for (let y = 150; y < 262; y += 14) { el('line', { x1: 88, y1: y, x2: 138, y2: y, stroke: GOLD, 'stroke-width': 4 }, cof); el('line', { x1: -88, y1: y, x2: -138, y2: y, stroke: GOLD, 'stroke-width': 4 }, cof); }
    // face
    el('path', { d: 'M -62 70 Q 0 40 62 70 L 64 150 Q 50 206 0 214 Q -50 206 -64 150 Z', fill: GOLD }, cof);
    el('path', { d: 'M -62 70 Q 0 40 62 70 L 62 80 Q 0 54 -62 80 Z', fill: WIG }, cof);
    [-28, 28].forEach(x => {
      el('path', { d: `M ${x - 20} 116 Q ${x} 102 ${x + 20} 116 Q ${x} 126 ${x - 20} 116 Z`, fill: '#f6efe0', stroke: BLK, 'stroke-width': 3 }, cof);
      el('circle', { cx: x, cy: 115, r: 5, fill: BLK }, cof);
      el('path', { d: `M ${x - 22} 100 Q ${x} 90 ${x + 22} 100`, fill: 'none', stroke: BLK, 'stroke-width': 4 }, cof);
      el('path', { d: `M ${x + (x < 0 ? -20 : 20)} 116 l ${x < 0 ? -12 : 12} 4`, stroke: BLK, 'stroke-width': 3 }, cof);
    });
    el('path', { d: 'M 0 116 L -8 160 L 8 160', fill: 'none', stroke: '#9c6f2a', 'stroke-width': 3 }, cof);
    el('path', { d: 'M -18 180 Q 0 190 18 180 Q 0 176 -18 180 Z', fill: '#a3452c' }, cof);
    // broad collar
    const collar = el('g', {}, cof);
    const bands = [TURQ, GOLD, RED, BLUE, GOLD, TURQ, RED];
    bands.forEach((c, i) => el('path', { d: `M ${-130 + i * 2} 250 Q 0 ${330 + i * 16} ${130 - i * 2} 250`, fill: 'none', stroke: c, 'stroke-width': 14 }, collar));
    for (let k = 0; k < 13; k++) { const a = Math.PI * (0.12 + 0.76 * k / 12); el('ellipse', { cx: Math.cos(a) * -125, cy: 262 + Math.sin(a) * 96, rx: 6, ry: 10, fill: BLUE }, collar); }
    // winged goddess
    const nut = el('g', { transform: 'translate(0 400)' }, cof);
    [-1, 1].forEach(d => {
      for (let row = 0; row < 3; row++) {
        el('path', { d: `M ${d * 16} ${-6 + row * 14} Q ${d * 70} ${-30 + row * 16} ${d * (120 - row * 8)} ${-10 + row * 20} L ${d * (116 - row * 8)} ${2 + row * 20} Q ${d * 70} ${-14 + row * 16} ${d * 16} ${8 + row * 14} Z`, fill: [RED, TURQ, BLUE][row] }, nut);
      }
    });
    el('circle', { cx: 0, cy: -20, r: 12, fill: GOLD, stroke: BLK, 'stroke-width': 2 }, nut);
    el('path', { d: 'M -14 -8 L 14 -8 L 18 40 L -18 40 Z', fill: RED, stroke: BLK, 'stroke-width': 2 }, nut);
    // central column of hieroglyphs and side panels
    const col = el('g', {}, cof);
    el('rect', { x: -24, y: 450, width: 48, height: 270, fill: '#efd99a', stroke: BLK, 'stroke-width': 2 }, col);
    const gr = rng(63);
    for (let y = 456; y < 708; y += 22) drawGlyph(col, GLYPH_FILL[Math.floor(gr() * GLYPH_FILL.length)], -10, y, 20, BLK);
    [[-96, -30], [30, 96]].forEach(([a, b]) => {
      for (let k = 0; k < 3; k++) {
        const y = 452 + k * 88;
        el('rect', { x: a, y, width: b - a, height: 80, fill: k % 2 ? '#d7b36a' : '#e6c67f', stroke: BLK, 'stroke-width': 1.5, 'clip-path': 'url(#mucclip)', transform: '' }, col);
        const fx = (a + b) / 2;
        el('path', { d: `M ${fx - 10} ${y + 72} L ${fx - 6} ${y + 32} Q ${fx} ${y + 18} ${fx + 6} ${y + 32} L ${fx + 10} ${y + 72} Z`, fill: [BLUE, RED, TURQ][k] }, col);
        el('circle', { cx: fx, cy: y + 20, r: 7, fill: k === 1 ? '#2b2b2b' : GOLD }, col);
      }
    });
    el('rect', { x: -110, y: 724, width: 220, height: 26, fill: BLK, 'clip-path': 'url(#mucclip)' }, cof);
    for (let x = -100; x < 100; x += 16) el('path', { d: `M ${x} 744 l 8 -14 l 8 14 Z`, fill: GOLD }, cof);
    el('path', { d: outline, fill: 'none', stroke: '#5d3d15', 'stroke-width': 3 }, cof);
    el('path', { d: outline, fill: noisePattern(defs, 'muage', { seed: 62, alpha: 0.25, dark: true, blotch: true }) }, cof);
    glassCase(world, CX - 190, CY - 50, 380, 860);
    const cGod = callout(world, CX - 90, CY + 400, CX - 330, CY + 420, 'Protective goddess', { size: 28 });
    const cSpell = callout(world, CX - 10, CY + 600, CX - 330, CY + 610, 'Spells and prayers', { size: 28 });
    const cCol = callout(world, CX - 100, CY + 290, CX - 300, CY + 210, 'Broad collar', { size: 28 });

    // ------- case of animal mummies -------
    const AX = 1250;
    const an = el('g', {}, world);
    el('rect', { x: AX, y: 720, width: 640, height: 30, fill: '#2a2019' }, an);
    el('rect', { x: AX, y: 750, width: 640, height: 150, fill: '#1c1510' }, an);
    const linen = '#cdb48a', linenD = '#9c8157';
    const wrap = (g, d, clipId) => {
      const cp = el('clipPath', { id: clipId }, defs); el('path', { d }, cp);
      el('path', { d, fill: linen }, g);
      const w = el('g', { 'clip-path': `url(#${clipId})`, stroke: linenD, 'stroke-width': 3 }, g);
      for (let k = -30; k < 30; k++) { el('line', { x1: AX + k * 26, y1: 300, x2: AX + k * 26 + 400, y2: 720 }, w); el('line', { x1: AX + k * 26 + 400, y1: 300, x2: AX + k * 26, y2: 720 }, w); }
      el('path', { d, fill: 'none', stroke: '#7a6040', 'stroke-width': 2 }, g);
    };
    // cat
    const cat = el('g', {}, an);
    const catD = `M ${AX + 90} 720 L ${AX + 80} 470 Q ${AX + 82} 430 ${AX + 100} 420 L ${AX + 92} 360 L ${AX + 118} 392 L ${AX + 142} 392 L ${AX + 168} 360 L ${AX + 160} 420 Q ${AX + 178} 430 ${AX + 180} 470 L ${AX + 170} 720 Z`;
    wrap(cat, catD, 'mucat');
    el('path', { d: `M ${AX + 100} 420 Q ${AX + 130} 470 ${AX + 160} 420 Q ${AX + 130} 400 ${AX + 100} 420 Z`, fill: '#3b2a1c' }, cat);
    [AX + 116, AX + 144].forEach(x => el('ellipse', { cx: x, cy: 426, rx: 8, ry: 5, fill: '#e9d9a8' }, cat));
    el('path', { d: `M ${AX + 130} 434 l -5 8 l 10 0 Z`, fill: '#e9d9a8' }, cat);
    // bird
    const bird = el('g', {}, an);
    const birdD = `M ${AX + 280} 720 Q ${AX + 250} 560 ${AX + 290} 470 Q ${AX + 320} 420 ${AX + 350} 470 Q ${AX + 390} 560 ${AX + 360} 720 Z`;
    wrap(bird, birdD, 'mubird');
    el('circle', { cx: AX + 320, cy: 490, r: 18, fill: '#3b2a1c' }, bird);
    el('circle', { cx: AX + 320, cy: 488, r: 6, fill: '#e9d9a8' }, bird);
    el('path', { d: `M ${AX + 330} 500 l 20 8 l -18 6 Z`, fill: '#3b2a1c' }, bird);
    // crocodile
    const croc = el('g', {}, an);
    const crocD = `M ${AX + 430} 716 L ${AX + 450} 676 Q ${AX + 480} 660 ${AX + 540} 664 L ${AX + 600} 670 L ${AX + 640} 690 L ${AX + 600} 704 L ${AX + 540} 712 Z`;
    wrap(croc, crocD, 'mucroc');
    el('path', { d: `M ${AX + 540} 664 L ${AX + 640} 690 L ${AX + 600} 700 Z`, fill: '#8d7650' }, croc);
    const alab = el('g', {}, an);
    [['Cat', AX + 130], ['Bird', AX + 320], ['Crocodile', AX + 540]].forEach(([n, x]) => txt(alab, x, 800, n.toUpperCase(), { size: 20, weight: 600, anchor: 'middle', fill: '#e9d49a', ls: '0.2em' }));
    glassCase(world, AX - 20, 320, 680, 420);

    const pp = el('g', {}, world);
    const walk = crowd(pp, [
      { x0: 1060, y: 1000, h: 330, still: true, seed: 1, dir: -1, bun: true },
      { x0: -200, y: 1060, h: 380, v: 26, seed: 2, coat: true },
    ]);

    // ------- how to make a mummy -------
    const info = el('g', {}, svg);
    el('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: 'rgba(8,8,10,0.55)' }, info);
    el('rect', { x: 170, y: 190, width: 1580, height: 680, rx: 18, fill: 'rgba(22,19,16,0.94)', stroke: '#d8b35a', 'stroke-width': 2 }, info);
    txt(info, 960, 262, 'HOW TO MAKE A MUMMY', { size: 22, weight: 600, anchor: 'middle', fill: '#d8b35a', ls: '0.3em' });
    const step = (x, n, title, sub, draw) => {
      const g = el('g', {}, info);
      el('circle', { cx: x, cy: 460, r: 130, fill: '#2b241d', stroke: '#5d4c38', 'stroke-width': 2 }, g);
      draw(el('g', { transform: `translate(${x} 460)` }, g));
      el('circle', { cx: x - 110, cy: 350, r: 26, fill: '#d8b35a' }, g);
      txt(g, x - 110, 360, String(n), { size: 28, weight: 700, anchor: 'middle', fill: '#16171c' });
      txt(g, x, 650, title, { size: 40, weight: 600, family: "'Cormorant Garamond'", anchor: 'middle', fill: '#fff' });
      txt(g, x, 690, sub, { size: 20, weight: 400, anchor: 'middle', fill: '#cfc6b3' });
      return g;
    };
    const s1 = step(520, 1, 'Remove the organs', 'Stored in canopic jars', g => {
      const heads = [
        h => el('circle', { cx: 0, cy: -14, r: 16, fill: '#d9a54c' }, h),
        h => { el('ellipse', { cx: 0, cy: -12, rx: 17, ry: 14, fill: '#8d7a5f' }, h); el('ellipse', { cx: 6, cy: -6, rx: 9, ry: 6, fill: '#6f5f48' }, h); },
        h => { el('path', { d: 'M -14 -2 L -12 -34 L -4 -18 L 4 -18 L 12 -34 L 14 -2 Z', fill: '#2a2a2a' }, h); el('path', { d: 'M 6 -10 L 22 -6 L 6 0 Z', fill: '#2a2a2a' }, h); },
        h => { el('circle', { cx: 0, cy: -14, r: 15, fill: '#6b4f2e' }, h); el('path', { d: 'M 10 -16 L 24 -10 L 10 -6 Z', fill: '#e0b04a' }, h); },
      ];
      heads.forEach((hd, k) => {
        const j = el('g', { transform: `translate(${-78 + k * 52} 20)` }, g);
        el('path', { d: 'M -20 0 Q -26 40 -14 64 L 14 64 Q 26 40 20 0 Z', fill: '#e8dcc0', stroke: '#a39170', 'stroke-width': 2 }, j);
        hd(j);
      });
    });
    const s2 = step(960, 2, 'Dry with natron salt', 'For about 40 days', g => {
      el('path', { d: 'M -100 70 Q -40 -40 0 -50 Q 40 -40 100 70 Z', fill: '#efe9dc' }, g);
      const r2 = rng(40);
      for (let k = 0; k < 40; k++) el('rect', { x: -80 + r2() * 160, y: -20 + r2() * 80, width: 6, height: 6, fill: '#d2c9b6', transform: `rotate(45)` }, g);
    });
    const s3 = step(1400, 3, 'Wrap in linen', 'Hundreds of metres of it', g => {
      el('path', { d: 'M -30 -90 Q 0 -104 30 -90 L 36 60 Q 30 96 0 100 Q -30 96 -36 60 Z', fill: linen, stroke: '#7a6040', 'stroke-width': 2 }, g);
      for (let y = -80; y < 96; y += 12) el('line', { x1: -36, y1: y, x2: 36, y2: y + 8, stroke: linenD, 'stroke-width': 2.5 }, g);
    });
    const bar = el('g', {}, info);
    el('rect', { x: 370, y: 770, width: 1180, height: 18, rx: 9, fill: '#3b3128' }, bar);
    const fill = el('rect', { x: 370, y: 770, width: 0, height: 18, rx: 9, fill: '#d8b35a' }, bar);
    const days = txt(bar, 960, 830, '', { size: 28, weight: 600, anchor: 'middle', fill: '#fff' });

    return t => {
      const c2 = S.cue(2), c3 = S.cue(3), c4 = S.cue(4);
      const cam = keys(t, [
        [0, [960, 560, 0.9]], [S.cue(1), [860, 540, 0.98]], [c2, [760, 520, 1.1]], [c3, [720, 480, 1.25]],
        [c3 + 1.5, [760, 540, 1.3]], [c4 - 0.3, [760, 560, 1.28]], [c4 + 1.8, [1560, 600, 1.2]], [S.dur, [1560, 600, 1.24]],
      ]);
      camera(world, cam);
      walk(t);
      setOp(info, win(t, c2 - 0.2, c3 + 0.1, 0.5));
      const wp = S.at('The whole process');
      setOp(s1, prog(t, c2 + 0.4, c2 + 0.9)); setOp(s2, prog(t, c2 + 2.4, c2 + 2.9)); setOp(s3, prog(t, c2 + 5.0, c2 + 5.5));
      const f = prog(t, wp, wp + 2.4, ease.out);
      fill.setAttribute('width', (1180 * f).toFixed(1));
      const nd = Math.max(1, Math.round(70 * f)); days.textContent = f > 0 ? `${nd} day${nd === 1 ? '' : 's'}` : '';
      cGod.set(prog(t, c3 + 1.4, c3 + 2.4, ease.linear) * (1 - prog(t, c4 - 0.2, c4 + 0.3)));
      cSpell.set(prog(t, c3 + 2.4, c3 + 3.4, ease.linear) * (1 - prog(t, c4 - 0.2, c4 + 0.3)));
      cCol.set(prog(t, c3 + 3.4, c3 + 4.4, ease.linear) * (1 - prog(t, c4 - 0.2, c4 + 0.3)));
      setOp(alab, prog(t, c4 + 1.5, c4 + 2.2));
    };
  },
};
