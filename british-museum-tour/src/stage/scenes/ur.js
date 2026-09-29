// Stop 6: the Royal Game of Ur, Room 56 (seen from above, inside its case).
Scenes.ur = {
  facts: [
    { line: 0, dt: 2.8, label: 'Made', value: 'About 2600–2400 BC', sub: 'One of the oldest game boards known' },
    { line: 1, dt: 1.0, label: 'Found', value: 'Royal Cemetery of Ur', sub: 'Southern Iraq · excavated by Leonard Woolley' },
    { line: 3, dt: 5.0, label: 'The rule book', value: 'A tablet from 177 BC', sub: 'Studied by curator Irving Finkel' },
  ],
  build(svg, defs, S) {
    const world = el('g', {}, svg);
    linGrad(defs, 'urcloth', [[0, '#26324a'], [1, '#141b29']], 0, 0, 1, 1);
    el('rect', { x: -600, y: -400, width: 3200, height: 1900, fill: 'url(#urcloth)' }, world);
    el('rect', { x: -600, y: -400, width: 3200, height: 1900, fill: noisePattern(defs, 'urweave', { seed: 56, alpha: 0.25, size: 96 }) }, world);
    spotlight(world, defs, 'urspot', 760, 470, 760, 420, '#ffe8c0', 0.22);

    const Q = 112, BX = 312, BY = 302;
    const SHELL = '#f1e9d8', LAPIS = '#2c4a9a', RED = '#b84a32', BIT = '#141312';
    const exists = (c, r) => !(r !== 1 && (c === 4 || c === 5));
    // board body
    const board = el('g', {}, world);
    shadow(board, 760 + 20, 470 + 30, 500, 200, 0.6);
    el('path', { d: `M ${BX - 14} ${BY - 14} H ${BX + 4 * Q + 14} V ${BY + Q - 14} H ${BX + 6 * Q - 14} V ${BY - 14} H ${BX + 8 * Q + 14} V ${BY + 3 * Q + 14} H ${BX + 6 * Q - 14} V ${BY + 2 * Q + 14} H ${BX + 4 * Q + 14} V ${BY + 3 * Q + 14} H ${BX - 14} Z`, fill: BIT }, board);
    const pattern = (c, r) => {
      if ((c === 0 && r !== 1) || (c === 7 && r !== 1) || (c === 3 && r === 1)) return 'rosette';
      if (c === 4 || c === 5) return 'eyes5';
      if (c === 6) return 'check';
      if (r === 1) return c % 2 ? 'dots' : 'eyes5';
      return (c + r) % 2 ? 'dots' : 'eyes5';
    };
    const sq = {};
    for (let c = 0; c < 8; c++) for (let r = 0; r < 3; r++) {
      if (!exists(c, r)) continue;
      const x = BX + c * Q, y = BY + r * Q, g = el('g', { transform: `translate(${x} ${y})` }, board);
      const p = pattern(c, r);
      el('rect', { x: 6, y: 6, width: Q - 12, height: Q - 12, fill: p === 'rosette' ? LAPIS : SHELL, rx: 3 }, g);
      if (p === 'rosette') {
        for (let k = 0; k < 8; k++) el('ellipse', { cx: Q / 2, cy: Q / 2 - 22, rx: 11, ry: 22, fill: SHELL, transform: `rotate(${k * 45} ${Q / 2} ${Q / 2})` }, g);
        el('circle', { cx: Q / 2, cy: Q / 2, r: 12, fill: RED }, g);
        el('circle', { cx: Q / 2, cy: Q / 2, r: 5, fill: SHELL }, g);
      } else if (p === 'eyes5') {
        [[28, 28], [84, 28], [56, 56], [28, 84], [84, 84]].forEach(([a, b]) => { el('circle', { cx: a, cy: b, r: 13, fill: RED }, g); el('circle', { cx: a, cy: b, r: 6, fill: LAPIS }, g); });
      } else if (p === 'dots') {
        [[26, 26], [86, 26], [26, 86], [86, 86]].forEach(([a, b]) => el('circle', { cx: a, cy: b, r: 8, fill: LAPIS }, g));
        el('circle', { cx: 56, cy: 56, r: 20, fill: RED }, g); el('circle', { cx: 56, cy: 56, r: 9, fill: SHELL }, g);
      } else {
        for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
          el('rect', { x: 10 + i * 23, y: 10 + j * 23, width: 23, height: 23, fill: (i + j) % 2 ? LAPIS : SHELL }, g);
          if ((i + j) % 2 === 0) el('circle', { cx: 21.5 + i * 23, cy: 21.5 + j * 23, r: 5, fill: RED }, g);
        }
      }
      const hl = el('rect', { x: 4, y: 4, width: Q - 8, height: Q - 8, rx: 4, fill: 'none', stroke: '#ffd873', 'stroke-width': 6, opacity: 0 }, g);
      sq[`${c},${r}`] = { x: x + Q / 2, y: y + Q / 2, hl, p };
    }
    el('rect', { x: BX - 14, y: BY - 14, width: 8 * Q + 28, height: 3 * Q + 28, fill: noisePattern(defs, 'urage', { seed: 7, alpha: 0.25, dark: true, blotch: true }), 'pointer-events': 'none' }, board);
    // square numbering (1..20) for the "twenty squares" moment
    const order = [];
    for (let c = 0; c < 8; c++) for (let r = 0; r < 3; r++) if (exists(c, r)) order.push(`${c},${r}`);

    // pieces and dice
    const piece = (x, y, dark) => {
      const g = el('g', { transform: `translate(${x} ${y})` }, world);
      el('circle', { cx: 4, cy: 6, r: 34, fill: '#000', opacity: 0.4 }, g);
      el('circle', { cx: 0, cy: 0, r: 34, fill: dark ? '#23201d' : SHELL, stroke: dark ? '#4b4540' : '#c9bda4', 'stroke-width': 3 }, g);
      [[0, 0], [-15, -15], [15, -15], [-15, 15], [15, 15]].forEach(([a, b]) => el('circle', { cx: a, cy: b, r: 5, fill: dark ? SHELL : LAPIS }, g));
      return g;
    };
    const blacks = [], whites = [];
    for (let i = 0; i < 7; i++) { blacks.push({ g: piece(BX + 40 + i * 82, BY - 90, true), home: [BX + 40 + i * 82, BY - 90] }); whites.push({ g: piece(BX + 40 + i * 82, BY + 3 * Q + 90, false), home: [BX + 40 + i * 82, BY + 3 * Q + 90] }); }
    const dice = el('g', {}, world);
    [[1260, 170], [1330, 200], [1270, 250], [1345, 275]].forEach(([x, y], k) => {
      const d = el('g', { transform: `translate(${x} ${y}) rotate(${k * 37})` }, dice);
      el('path', { d: 'M 0 -30 L 28 18 L -28 18 Z', fill: '#e8dcc3', stroke: '#9b8c70', 'stroke-width': 2 }, d);
      el('path', { d: 'M 0 -30 L 0 18 M 0 -30 L 28 18', stroke: '#b8a988', 'stroke-width': 1.5 }, d);
      if (k % 2 === 0) el('circle', { cx: 0, cy: -22, r: 5, fill: LAPIS }, d);
    });

    // material callouts
    const cShell = callout(world, sq['1,0'].x - 20, sq['1,0'].y - 20, sq['1,0'].x - 120, BY - 170, 'Shell', { size: 28 });
    const cRed = callout(world, sq['2,1'].x + 8, sq['2,1'].y + 30, sq['2,1'].x + 120, BY + 3 * Q + 180, 'Red limestone', { size: 28 });
    const cLapis = callout(world, sq['0,2'].x - 20, sq['0,2'].y + 30, BX - 20, BY + 3 * Q + 200, 'Lapis lazuli', { size: 28 });
    const nums = order.map((k, i) => {
      const g = el('g', {}, world);
      el('circle', { cx: sq[k].x, cy: sq[k].y, r: 26, fill: '#ffd873', stroke: '#16171c', 'stroke-width': 3 }, g);
      txt(g, sq[k].x, sq[k].y + 10, String(i + 1), { size: 28, weight: 700, anchor: 'middle', fill: '#16171c' });
      return g;
    });

    // the clay tablet
    const tab = el('g', { transform: 'translate(-40 300)' }, world);
    el('rect', { x: 0, y: 0, width: 250, height: 330, rx: 30, fill: '#b98b5c' }, tab);
    el('rect', { x: 0, y: 0, width: 250, height: 330, rx: 30, fill: noisePattern(defs, 'urclay', { seed: 177, alpha: 0.35, dark: true, blotch: true }) }, tab);
    const tr = rng(177);
    for (let row = 0; row < 14; row++) {
      el('line', { x1: 18, y1: 30 + row * 21, x2: 232, y2: 30 + row * 21, stroke: '#8e6a44', 'stroke-width': 1 }, tab);
      for (let x = 24; x < 226; x += 9 + tr() * 8) {
        const y = 22 + row * 21;
        if (tr() < 0.6) el('path', { d: `M ${x} ${y} l 8 -3 l 0 7 Z`, fill: '#7a5634' }, tab);
        else el('path', { d: `M ${x + 3} ${y - 6} l 3 9 l -6 0 Z`, fill: '#7a5634' }, tab);
      }
    }
    txt(tab, 125, 372, 'CLAY TABLET · 177 BC', { size: 17, weight: 600, anchor: 'middle', fill: '#e9d49a', ls: '0.15em' });

    // "another turn" pop
    const pop = el('g', {}, world);
    el('rect', { x: sq['3,1'].x - 150, y: BY - 220, width: 300, height: 76, rx: 38, fill: '#ffd873' }, pop);
    txt(pop, sq['3,1'].x, BY - 170, 'Another turn!', { size: 36, weight: 700, anchor: 'middle', fill: '#16171c' });
    const glow = el('circle', { cx: sq['3,1'].x, cy: sq['3,1'].y, r: 70, fill: 'none', stroke: '#ffd873', 'stroke-width': 8, filter: 'url(#glow)' }, world);

    // a white piece walks its route: along its own row (right to left), then up the middle
    const route = ['3,2', '2,2', '1,2', '0,2', '0,1', '1,1', '2,1', '3,1'];
    const mover = whites[6];
    const blackMover = blacks[5];
    const broute = ['3,0', '2,0', '1,0'];

    return t => {
      const c2 = S.cue(2), c3 = S.cue(3), c4 = S.cue(4);
      const cRace = S.at('Two players raced');
      const cam = keys(t, [
        [0, [760, 480, 0.82]], [S.cue(1), [760, 470, 0.9]], [c2, [760, 470, 0.95]], [cRace, [760, 480, 0.9]],
        [c3 - 0.3, [760, 480, 0.9]], [c3 + 1.5, [720, 480, 0.88]], [c4 - 0.5, [720, 480, 0.88]], [c4 + 1.0, [760, 440, 1.0]], [S.dur, [760, 430, 1.02]],
      ]);
      camera(world, cam);
      cShell.set(prog(t, c2 + 1.2, c2 + 2.0, ease.linear) * (1 - prog(t, cRace, cRace + 0.4)));
      cRed.set(prog(t, c2 + 2.0, c2 + 2.8, ease.linear) * (1 - prog(t, cRace, cRace + 0.4)));
      cLapis.set(prog(t, c2 + 2.8, c2 + 3.6, ease.linear) * (1 - prog(t, cRace, cRace + 0.4)));
      nums.forEach((n, i) => setOp(n, prog(t, cRace + 1.2 + i * 0.09, cRace + 1.35 + i * 0.09) * (1 - prog(t, c3 - 0.3, c3 + 0.2))));
      setOp(tab, prog(t, c3 + 0.8, c3 + 1.8));
      // white piece moves one square at a time, pausing on each
      const t0 = cRace + 1.0;
      let pos = mover.home;
      const steps = t < c4 ? route.slice(0, 4) : route;
      const tt = t < c4 ? t - t0 : t - (c4 + 0.6);
      const baseIdx = t < c4 ? -1 : 3;
      if (t >= t0) {
        const k = Math.floor(tt / 0.55);
        const f = clamp((tt - k * 0.55) / 0.35);
        const from = k + baseIdx < 0 ? mover.home : (() => { const s = sq[steps[Math.min(k + baseIdx, steps.length - 1)]]; return [s.x, s.y]; })();
        const idxTo = Math.min(k + baseIdx + 1, steps.length - 1);
        const to = [sq[steps[idxTo]].x, sq[steps[idxTo]].y];
        pos = k + baseIdx + 1 > steps.length - 1 ? to : [lerp(from[0], to[0], ease.inOut(f)), lerp(from[1], to[1], ease.inOut(f)) - Math.sin(f * Math.PI) * 30];
      }
      setT(mover.g, `translate(${pos[0]} ${pos[1]})`);
      // a black piece enters on its own row
      let bpos = blackMover.home;
      const bt = t - (cRace + 2.2);
      if (bt > 0) {
        const k = Math.floor(bt / 0.6), f = clamp((bt - k * 0.6) / 0.35);
        const from = k === 0 ? blackMover.home : [sq[broute[Math.min(k - 1, 2)]].x, sq[broute[Math.min(k - 1, 2)]].y];
        const to = [sq[broute[Math.min(k, 2)]].x, sq[broute[Math.min(k, 2)]].y];
        bpos = k > 2 ? to : [lerp(from[0], to[0], ease.inOut(f)), lerp(from[1], to[1], ease.inOut(f)) - Math.sin(f * Math.PI) * 30];
      }
      setT(blackMover.g, `translate(${bpos[0]} ${bpos[1]})`);
      const land = c4 + 0.6 + 4 * 0.55;
      setOp(glow, prog(t, land, land + 0.3) * (0.6 + 0.4 * Math.sin(t * 6)));
      setOp(pop, prog(t, land + 0.1, land + 0.5, ease.back));
      ['0,0', '0,2', '3,1', '7,0', '7,2'].forEach(k => sq[k].hl.setAttribute('opacity', (win(t, c4 + 0.2, land, 0.3) * (0.5 + 0.5 * Math.sin(t * 5))).toFixed(3)));
    };
  },
  hideFacts(t, S) { return win(t, S.cue(3) + 0.5, S.cue(3) + 5.0, 0.4); },
};
