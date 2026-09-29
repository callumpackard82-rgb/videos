// Stop 3: the lamassu of Sargon II, Room 10.
Scenes.lamassu = {
  facts: [
    { line: 1, dt: 0.5, label: 'Lamassu', value: 'Protective spirits', sub: 'Guardians against evil and chaos' },
    { line: 2, dt: 0.5, label: 'From', value: 'Khorsabad, Iraq', sub: 'Palace of Sargon II, about 710 BC' },
    { line: 4, dt: 1.0, label: 'Room 10a', value: 'The lion hunts', sub: 'Carved for Ashurbanipal, about 645 BC' },
  ],
  hideFacts(t, S) { return win(t, S.cue(3) - 0.3, S.cue(4) + 0.6, 0.4); },
  build(svg, defs, S) {
    const world = el('g', {}, svg);
    gallery(world, defs, 'lm', {
      horizon: 890, wall: [[0, '#6e6558'], [1, '#4b443a']], floor: [[0, '#7b6f60'], [1, '#3a332b']],
      lightX: 900, lightY: 200, lightRx: 1400, lightA: 0.22, x0: -600, w: 4200,
    });
    const GYP = '#d3c5a6', GYP_D = '#b4a585', LINE = '#7d6e55', HI = '#e6dac0';
    linGrad(defs, 'lmblock', [[0, '#cdbf9f'], [1, '#b7a887']]);
    const grain = noisePattern(defs, 'lmgrain', { seed: 9, alpha: 0.3, dark: true, blotch: true });
    // wall relief panels in the background
    const wallp = el('g', { opacity: 0.45 }, world);
    [[-340, 560], [1880, 560], [2620, 560]].forEach(([x, w]) => {
      el('rect', { x, y: 250, width: w, height: 520, fill: '#9d9077' }, wallp);
      for (let k = 0; k < 7; k++) {
        const fx = x + 40 + k * 75;
        el('path', { d: `M ${fx} 740 L ${fx + 8} 480 Q ${fx + 22} 440 ${fx + 36} 480 L ${fx + 44} 740 Z`, fill: '#8a7d65' }, wallp);
        el('circle', { cx: fx + 22, cy: 450, r: 18, fill: '#8a7d65' }, wallp);
      }
      el('line', { x1: x, y1: 505, x2: x + w, y2: 505, stroke: '#8a7d65', 'stroke-width': 3 }, wallp);
    });

    // ------------- side view -------------
    const side = el('g', { transform: 'translate(250 170)' }, world);
    el('rect', { x: -20, y: 700, width: 1040, height: 30, fill: '#8d7f66' }, side);
    el('rect', { x: 0, y: 0, width: 1000, height: 710, fill: 'url(#lmblock)' }, side);
    const fig = el('g', { stroke: LINE, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, side);
    // tail
    el('path', { d: 'M 955 380 Q 985 480 978 610', fill: 'none', 'stroke-width': 9 }, fig);
    for (let k = 0; k < 6; k++) el('circle', { cx: 970 + (k % 2) * 16, cy: 615 + k * 12, r: 9, fill: GYP_D }, fig);
    // legs (A corner, B front stride, C/D hind)
    const legs = {};
    const leg = (id, x1, x2, top, xb, w) => {
      const g = el('g', {}, fig);
      el('path', { d: `M ${x1} ${top} L ${x2} ${top} Q ${x2 + 6} ${top + 70} ${xb + w / 2 + 2} ${612} L ${xb + w / 2} 668 L ${xb - w / 2} 668 L ${xb - w / 2 - 2} 612 Q ${x1 - 4} ${top + 80} ${x1} ${top} Z`, fill: GYP }, g);
      el('path', { d: `M ${xb - w / 2 - 6} 668 L ${xb + w / 2 + 6} 668 L ${xb + w / 2 + 12} 700 L ${xb - w / 2 - 12} 700 Z`, fill: GYP_D }, g);
      el('path', { d: `M ${xb - w / 2 + 4} 620 Q ${xb} 630 ${xb + w / 2 - 4} 620`, fill: 'none', 'stroke-width': 2 }, g);
      legs[id] = { g, x: xb, top };
      return g;
    };
    leg('D', 870, 930, 480, 935, 46);
    leg('C', 760, 830, 500, 790, 48);
    leg('B', 300, 370, 500, 360, 48);
    leg('A', 165, 245, 480, 205, 52);
    // cuneiform inscription between the legs
    const cun = el('g', { fill: '#8b7c62', stroke: 'none' }, side);
    const r = rng(710);
    for (let row = 0; row < 7; row++) for (let x = 420; x < 730; x += 11 + r() * 6) {
      const y = 590 + row * 15;
      if (r() < 0.75) el('path', { d: `M ${x} ${y} l 7 -3 l 0 6 Z` }, cun);
      if (r() < 0.4) el('path', { d: `M ${x + 3} ${y - 6} l 3 7 l -6 0 Z` }, cun);
    }
    // body
    el('path', { d: 'M 160 300 Q 138 420 180 505 L 300 548 L 830 548 L 905 510 Q 975 440 962 330 Q 950 275 880 265 L 250 265 Z', fill: GYP }, fig);
    // belly curls
    for (let x = 330; x < 820; x += 26) { el('circle', { cx: x, cy: 552, r: 10, fill: HI }, fig); el('circle', { cx: x, cy: 552, r: 4, fill: 'none', 'stroke-width': 1.5 }, fig); }
    // chest hair
    for (let k = 0; k < 5; k++) el('path', { d: `M ${170 + k * 4} ${340 + k * 34} q 20 10 40 0`, fill: 'none', 'stroke-width': 2 }, fig);
    // wing
    el('path', { d: 'M 225 310 Q 205 130 330 45 L 995 32 L 995 250 Q 610 285 260 330 Z', fill: HI }, fig);
    for (let row = 0; row < 4; row++) for (let x = 270 + row * 18; x < 520; x += 30) {
      const y = 90 + row * 38;
      el('path', { d: `M ${x} ${y} q 15 22 30 0`, fill: 'none', 'stroke-width': 2 }, fig);
    }
    for (let k = 0; k < 5; k++) {
      const y0 = 60 + k * 40;
      el('path', { d: `M ${520 - k * 30} ${y0 + 30} Q 700 ${y0 + 8} 985 ${y0}`, fill: 'none', 'stroke-width': 2.5 }, fig);
      for (let x = 560; x < 990; x += 42) el('path', { d: `M ${x} ${y0 + 4} q 16 12 36 -2`, fill: 'none', 'stroke-width': 1.5, stroke: '#9b8b70' }, fig);
    }
    // hair falling behind the head
    el('path', { d: 'M 140 128 L 232 132 Q 252 220 240 305 L 160 305 Z', fill: GYP }, fig);
    for (let yy = 150; yy < 300; yy += 22) for (let xx = 170; xx < 236; xx += 22) el('circle', { cx: xx, cy: yy, r: 8, fill: HI, 'stroke-width': 1.5 }, fig);
    // beard
    el('path', { d: 'M 58 222 L 162 222 L 178 330 Q 120 352 66 330 Z', fill: GYP }, fig);
    for (let yy = 240; yy < 335; yy += 20) for (let xx = 72 + ((yy / 20) % 2) * 10; xx < 170; xx += 20) el('circle', { cx: xx, cy: yy, r: 7.5, fill: HI, 'stroke-width': 1.5 }, fig);
    // face
    el('path', { d: 'M 72 128 L 150 128 L 150 226 L 60 226 L 58 214 L 52 208 L 58 200 L 40 190 L 60 150 Z', fill: HI }, fig);
    el('path', { d: 'M 80 164 Q 97 152 116 164 Q 97 174 80 164 Z', fill: '#fff8e6', 'stroke-width': 2 }, fig);
    el('circle', { cx: 98, cy: 164, r: 5, fill: '#3e3627', stroke: 'none' }, fig);
    el('path', { d: 'M 76 148 Q 98 138 122 150', fill: 'none', 'stroke-width': 4 }, fig);
    // ear + earring
    el('ellipse', { cx: 150, cy: 176, rx: 14, ry: 24, fill: GYP }, fig);
    el('circle', { cx: 152, cy: 214, r: 8, fill: GYP_D }, fig);
    // horned crown
    el('rect', { x: 68, y: 26, width: 124, height: 104, rx: 6, fill: GYP }, fig);
    for (let k = 0; k < 3; k++) el('path', { d: `M 70 ${118 - k * 28} Q 130 ${104 - k * 28} 190 ${70 - k * 20}`, fill: 'none', 'stroke-width': 4 }, fig);
    for (let x = 76; x < 190; x += 12) el('ellipse', { cx: x, cy: 22, rx: 5, ry: 12, fill: HI, 'stroke-width': 1.5 }, fig);
    el('rect', { x: 0, y: 0, width: 1000, height: 710, fill: grain, stroke: 'none' }, side);
    // leg highlights for counting
    const legHL = {};
    Object.entries(legs).forEach(([id, l]) => {
      legHL[id] = el('rect', { x: l.x - 38, y: l.top + 20, width: 76, height: 700 - l.top - 10, rx: 30, fill: '#ffd873', opacity: 0 }, side);
    });

    // ------------- front view (appears for the "five legs" moment) -------------
    const FX = 1420, FY = 170;
    const front = el('g', { transform: `translate(${FX} ${FY})` }, world);
    el('rect', { x: -20, y: 700, width: 380, height: 30, fill: '#8d7f66' }, front);
    el('rect', { x: 0, y: 0, width: 340, height: 710, fill: 'url(#lmblock)' }, front);
    const ff = el('g', { stroke: LINE, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, front);
    // wings seen edge-on at the sides
    [[18, 92], [248, 322]].forEach(([a, b]) => {
      el('path', { d: `M ${a} 40 L ${b} 40 L ${b} 470 L ${a} 470 Z`, fill: HI }, ff);
      for (let y = 70; y < 470; y += 30) el('path', { d: `M ${a + 4} ${y} q ${(b - a) / 2} 16 ${b - a - 8} 0`, fill: 'none', 'stroke-width': 1.5 }, ff);
    });
    // chest and front legs
    el('path', { d: 'M 92 320 L 248 320 L 240 520 L 100 520 Z', fill: GYP }, ff);
    for (let y = 350; y < 510; y += 26) for (let x = 112; x < 232; x += 26) el('circle', { cx: x, cy: y, r: 9, fill: HI, 'stroke-width': 1.5 }, ff);
    const fLegs = {};
    [['E', 132], ['A', 208]].forEach(([id, x]) => {
      const g = el('g', {}, ff);
      el('path', { d: `M ${x - 30} 510 L ${x + 30} 510 L ${x + 26} 668 L ${x - 26} 668 Z`, fill: GYP }, g);
      el('path', { d: `M ${x - 32} 668 L ${x + 32} 668 L ${x + 38} 700 L ${x - 38} 700 Z`, fill: GYP_D }, g);
      fLegs[id] = { g, x, hl: el('rect', { x: x - 38, y: 510, width: 76, height: 196, rx: 30, fill: '#ffd873', opacity: 0 }, front) };
    });
    // head from the front
    el('path', { d: 'M 108 220 L 232 220 L 244 330 Q 170 356 96 330 Z', fill: GYP }, ff);
    for (let y = 238; y < 336; y += 20) for (let x = 112 + ((y / 20) % 2) * 10; x < 232; x += 20) el('circle', { cx: x, cy: y, r: 7.5, fill: HI, 'stroke-width': 1.5 }, ff);
    el('rect', { x: 118, y: 128, width: 104, height: 98, rx: 10, fill: HI }, ff);
    [146, 194].forEach(x => { el('path', { d: `M ${x - 15} 166 Q ${x} 156 ${x + 15} 166 Q ${x} 174 ${x - 15} 166 Z`, fill: '#fff8e6', 'stroke-width': 2 }, ff); el('circle', { cx: x, cy: 166, r: 4.5, fill: '#3e3627', stroke: 'none' }, ff); });
    el('path', { d: 'M 170 170 L 164 200 L 176 200', fill: 'none', 'stroke-width': 2.5 }, ff);
    el('path', { d: 'M 158 212 Q 170 218 182 212', fill: 'none', 'stroke-width': 2.5 }, ff);
    [104, 236].forEach(x => { el('ellipse', { cx: x, cy: 178, rx: 12, ry: 22, fill: GYP }, ff); el('circle', { cx: x, cy: 214, r: 7, fill: GYP_D }, ff); });
    el('rect', { x: 112, y: 26, width: 116, height: 104, rx: 6, fill: GYP }, ff);
    for (let k = 0; k < 3; k++) el('path', { d: `M 114 ${118 - k * 30} Q 170 ${96 - k * 30} 226 ${118 - k * 30}`, fill: 'none', 'stroke-width': 4 }, ff);
    for (let x = 120; x < 226; x += 12) el('ellipse', { cx: x, cy: 22, rx: 5, ry: 12, fill: HI, 'stroke-width': 1.5 }, ff);
    el('rect', { x: 0, y: 0, width: 340, height: 710, fill: grain, stroke: 'none' }, front);

    // view labels and leg numbers
    const labels = el('g', {}, world);
    const lab = (x, y, a, b) => {
      const g = el('g', {}, labels);
      el('rect', { x: x - 170, y: y - 44, width: 340, height: 70, rx: 10, fill: 'rgba(14,15,20,0.85)' }, g);
      txt(g, x, y - 10, a, { size: 30, weight: 600, family: "'Cormorant Garamond'", anchor: 'middle', fill: '#fff' });
      txt(g, x, y + 16, b, { size: 15, weight: 600, anchor: 'middle', fill: '#d8b35a', ls: '0.2em' });
      return g;
    };
    const labFront = lab(FX + 170, 140, 'From the front', 'STANDING STILL');
    const labSide = lab(750, 140, 'From the side', 'STRIDING FORWARD');
    const nums = [];
    const num = (x, y, n) => {
      const g = el('g', {}, labels);
      el('circle', { cx: x, cy: y, r: 30, fill: '#ffd873', stroke: '#16171c', 'stroke-width': 3 }, g);
      txt(g, x, y + 12, String(n), { size: 34, weight: 700, anchor: 'middle', fill: '#16171c' });
      nums.push(g);
      return g;
    };
    num(250 + 205, 770, 1); num(250 + 360, 770, 2); num(250 + 790, 770, 3); num(250 + 935, 770, 4);
    const numShared = num(FX + 208, 770, 1); const num5 = num(FX + 132, 770, 5);

    // callouts: head, body, wings
    const cHead = callout(world, 110 + 250, 190 + 170, 200, 250, 'Human head', { size: 30 });
    const cBody = callout(world, 600 + 250, 450 + 170, 1000, 830, 'Bull’s body', { size: 30 });
    const cWing = callout(world, 700 + 250, 120 + 170, 1150, 150, 'Bird’s wings', { size: 30 });

    // lion hunt relief (next room)
    const LX = 2000, LY = 230;
    const lion = el('g', { transform: `translate(${LX} ${LY})` }, world);
    el('rect', { x: 0, y: 0, width: 760, height: 470, fill: 'url(#lmblock)' }, lion);
    el('rect', { x: 0, y: 0, width: 760, height: 470, fill: grain }, lion);
    const lg = el('g', { fill: GYP, stroke: LINE, 'stroke-width': 2.5, 'stroke-linejoin': 'round', transform: 'translate(120 90) scale(1.25)' }, lion);
    // legs behind the body
    el('path', { d: 'M 310 150 L 352 200 L 372 226 L 350 228 L 318 196 L 292 162 Z', fill: GYP_D }, lg);
    el('path', { d: 'M 190 150 L 150 208 L 128 230 L 150 232 L 182 200 L 214 160 Z', fill: GYP_D }, lg);
    // tail
    el('path', { d: 'M 372 112 Q 420 90 412 44', fill: 'none', 'stroke-width': 7 }, lg);
    el('ellipse', { cx: 410, cy: 36, rx: 10, ry: 16, fill: GYP_D }, lg);
    // body
    el('path', { d: 'M 150 86 Q 240 64 322 80 Q 380 92 382 132 Q 378 166 334 170 L 190 172 Q 140 160 150 86 Z' }, lg);
    el('path', { d: 'M 300 100 Q 330 130 318 165 M 200 110 Q 215 135 205 165', fill: 'none', 'stroke-width': 2 }, lg);
    // front legs
    el('path', { d: 'M 200 150 L 168 206 L 132 236 L 164 240 L 196 212 L 232 162 Z' }, lg);
    el('path', { d: 'M 330 150 L 360 196 L 398 222 L 372 232 L 336 206 L 306 164 Z' }, lg);
    // mane
    const mane = [];
    for (let k = 0; k <= 26; k++) { const a = k / 26 * Math.PI * 2; const rr = k % 2 ? 62 : 80; mane.push(`${(140 + Math.cos(a) * rr).toFixed(1)},${(100 + Math.sin(a) * rr * 0.85).toFixed(1)}`); }
    el('polygon', { points: mane.join(' '), fill: GYP_D }, lg);
    for (let k = 0; k < 9; k++) { const a = -1.2 + k * 0.3; el('path', { d: `M ${140 + Math.cos(a) * 20} ${100 + Math.sin(a) * 18} Q ${140 + Math.cos(a) * 45} ${100 + Math.sin(a) * 40} ${140 + Math.cos(a) * 64} ${100 + Math.sin(a) * 52}`, fill: 'none', 'stroke-width': 2 }, lg); }
    // roaring head
    el('path', { d: 'M 120 66 L 70 62 L 40 80 L 34 92 L 68 100 L 42 128 L 50 136 L 92 126 L 122 118 Z' }, lg);
    el('path', { d: 'M 40 92 L 66 98 L 44 124', fill: '#6d5f48', 'stroke-width': 1.5 }, lg);
    [[46, 92], [54, 94], [50, 122], [58, 118]].forEach(([x, y]) => el('path', { d: `M ${x} ${y} l 3 5 l 3 -5 Z`, fill: '#f4ecda', 'stroke-width': 0.8 }, lg));
    el('path', { d: 'M 78 74 Q 88 70 96 76', fill: 'none', 'stroke-width': 2.5 }, lg);
    el('circle', { cx: 86, cy: 78, r: 3.5, fill: '#3e3627', stroke: 'none' }, lg);
    // arrows
    [[240, 92, -48], [285, 96, -62], [330, 102, -35]].forEach(([x, y, a]) => {
      const rad = a * Math.PI / 180, ex = x + Math.cos(rad) * 80, ey = y + Math.sin(rad) * 80;
      el('line', { x1: x, y1: y, x2: ex, y2: ey, 'stroke-width': 3 }, lg);
      el('path', { d: `M ${ex} ${ey} l -10 -2 l 4 8 Z`, fill: LINE, 'stroke-width': 1 }, lg);
    });
    txt(lion, 380, 440, 'ROOM 10a · LION HUNT RELIEF', { size: 18, weight: 600, anchor: 'middle', fill: '#5a4f3e', ls: '0.2em' });

    const pp = el('g', {}, world);
    const walk = crowd(pp, [
      { x0: 1310, y: 1000, h: 300, still: true, seed: 1, dir: -1, pack: true },
      { x0: 1375, y: 1000, h: 190, still: true, seed: 2, dir: -1 },
      { x0: 1700, y: 1050, h: 340, v: 26, t0: 30, seed: 3, coat: true },
    ]);

    return t => {
      const cFront = S.at('From the front'), cSide = S.at('From the side'), cFive = S.at('To make both views work');
      const c1 = S.cue(1), c4 = S.cue(4);
      const cam = keys(t, [
        [0, [800, 560, 0.92]], [c1, [780, 540, 0.95]], [S.cue(2), [700, 480, 1.05]], [S.cue(3) - 0.3, [560, 440, 1.3]],
        [S.cue(3) + 1.2, [1010, 560, 0.8]], [c4 - 0.4, [1010, 560, 0.8]], [c4 + 1.6, [2380, 470, 1.25]], [S.dur, [2380, 470, 1.3]],
      ]);
      camera(world, cam);
      walk(t);
      const cc = S.at('Each has the head');
      cHead.set(prog(t, cc + 0.2, cc + 1.2, ease.linear) * (1 - prog(t, S.cue(2) + 3, S.cue(2) + 3.5)));
      cBody.set(prog(t, cc + 1.2, cc + 2.2, ease.linear) * (1 - prog(t, S.cue(2) + 3, S.cue(2) + 3.5)));
      cWing.set(prog(t, cc + 2.2, cc + 3.2, ease.linear) * (1 - prog(t, S.cue(2) + 3, S.cue(2) + 3.5)));
      const fv = prog(t, S.cue(3) - 0.3, S.cue(3) + 1.0) * (1 - prog(t, c4 + 0.5, c4 + 1.5));
      setOp(front, 0.25 + 0.75 * prog(t, S.cue(3) - 0.3, S.cue(3) + 1.0));
      setOp(labels, fv);
      setOp(labFront, prog(t, cFront, cFront + 0.4)); setOp(labSide, prog(t, cSide, cSide + 0.4));
      const pulse = 0.35 + 0.15 * Math.sin(t * 6);
      fLegs.E.hl.setAttribute('opacity', (pulse * win(t, cFront, c4, 0.3)).toFixed(3));
      fLegs.A.hl.setAttribute('opacity', (pulse * win(t, cFront, c4, 0.3)).toFixed(3));
      ['A', 'B', 'C', 'D'].forEach(id => legHL[id].setAttribute('opacity', (pulse * win(t, cSide, c4, 0.3)).toFixed(3)));
      nums.forEach((n, k) => setOp(n, 0));
      [0, 1, 2, 3].forEach(k => setOp(nums[k], prog(t, cSide + 0.3 + k * 0.25, cSide + 0.5 + k * 0.25)));
      setOp(numShared, prog(t, cFive, cFive + 0.4));
      setOp(num5, prog(t, cFive + 1.0, cFive + 1.4));
    };
  },
};
