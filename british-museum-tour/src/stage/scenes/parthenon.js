// Stop 4: sculptures from the Parthenon, Room 18.
Scenes.parthenon = {
  facts: [
    { line: 1, dt: 0.4, label: 'Carved', value: '447–432 BC', sub: 'Overseen by the sculptor Phidias' },
    { line: 2, dt: 1.2, label: 'The frieze', value: 'About 75 m in the museum', sub: 'Plus 15 metopes and 17 pediment figures' },
    { line: 3, dt: 0.6, label: 'Removed', value: '1801–1812', sub: 'By agents of Lord Elgin' },
    { line: 3, dt: 5.6, label: 'Bought by Parliament', value: '1816', sub: 'For the British Museum' },
  ],
  hideFacts(t, S) { return win(t, S.cue(4) - 0.2, S.dur + 1, 0.5); },
  build(svg, defs, S) {
    const MARBLE = '#ece6d8', MARBLE_D = '#c9c0ad', MLINE = '#a79d88';
    // ---------------- Athens ----------------
    const A = el('g', {}, svg);
    const aw = el('g', {}, A);
    linGrad(defs, 'ptsky', [[0, '#4d6f9c'], [0.55, '#e8b98a'], [1, '#f6d8a8']]);
    linGrad(defs, 'ptrock', [[0, '#b58e62'], [1, '#6f5438']]);
    linGrad(defs, 'pthill', [[0, '#7e7a6b'], [1, '#4f4c42']]);
    el('rect', { x: -400, y: -300, width: 2720, height: 1700, fill: 'url(#ptsky)' }, aw);
    radGrad(defs, 'ptsun', [[0, '#fff1c8', 0.95], [0.25, '#ffd89a', 0.5], [1, '#ffd89a', 0]]);
    el('circle', { cx: 1550, cy: 640, r: 380, fill: 'url(#ptsun)' }, aw);
    el('path', { d: 'M -400 760 Q 100 640 500 720 T 1300 700 T 2320 740 L 2320 1400 L -400 1400 Z', fill: 'url(#pthill)', opacity: 0.6 }, aw);
    // the Acropolis rock
    el('path', { d: 'M 150 1100 L 260 760 L 420 690 L 600 660 L 1320 650 L 1520 690 L 1680 760 L 1800 1100 Z', fill: 'url(#ptrock)' }, aw);
    const cr = el('g', { stroke: '#5b442c', 'stroke-width': 3, fill: 'none', opacity: 0.5 }, aw);
    [[320, 760, 290, 900], [700, 680, 680, 820], [1100, 670, 1130, 830], [1500, 700, 1560, 880], [900, 690, 880, 760]].forEach(([a, b, c, d]) => el('path', { d: `M ${a} ${b} L ${c} ${d}` }, cr));
    el('path', { d: 'M 420 690 L 600 660 L 1320 650 L 1520 690 L 1520 700 L 420 700 Z', fill: '#c8a57a' }, aw);
    // temple (front elevation, 8 Doric columns)
    const tp = el('g', {}, aw);
    const TX = 960, BASE = 650, CW = 30, GAP = 64;
    el('rect', { x: TX - 290, y: BASE - 20, width: 580, height: 20, fill: MARBLE_D }, tp);
    el('rect', { x: TX - 275, y: BASE - 34, width: 550, height: 14, fill: MARBLE }, tp);
    el('rect', { x: TX - 230, y: BASE - 230, width: 460, height: 196, fill: '#b9ad95' }, tp); // cella wall
    const friezeBand = el('rect', { x: TX - 230, y: BASE - 230, width: 460, height: 26, fill: '#d2c7ae' }, tp);
    for (let i = 0; i < 8; i++) {
      const x = TX - 7 * GAP / 2 + i * GAP;
      el('path', { d: `M ${x - CW / 2} ${BASE - 34} L ${x - CW * 0.42} ${BASE - 236} L ${x + CW * 0.42} ${BASE - 236} L ${x + CW / 2} ${BASE - 34} Z`, fill: MARBLE }, tp);
      el('rect', { x: x - CW * 0.62, y: BASE - 246, width: CW * 1.24, height: 10, fill: MARBLE_D }, tp);
      for (let k = -1; k <= 1; k++) el('line', { x1: x + k * 7, y1: BASE - 36, x2: x + k * 6, y2: BASE - 234, stroke: MLINE, 'stroke-width': 1 }, tp);
    }
    el('rect', { x: TX - 262, y: BASE - 276, width: 524, height: 30, fill: MARBLE }, tp); // architrave
    const metopes = el('g', {}, tp);
    el('rect', { x: TX - 262, y: BASE - 312, width: 524, height: 36, fill: MARBLE_D }, tp);
    for (let i = 0; i < 15; i++) {
      const x = TX - 262 + i * 35;
      el('rect', { x: x + 2, y: BASE - 310, width: 10, height: 32, fill: '#9c927e' }, tp);
      if (i < 14) el('rect', { x: x + 14, y: BASE - 308, width: 20, height: 28, fill: '#e2dac8' }, metopes);
    }
    el('rect', { x: TX - 272, y: BASE - 324, width: 544, height: 12, fill: MARBLE }, tp);
    el('path', { d: `M ${TX - 280} ${BASE - 324} L ${TX} ${BASE - 404} L ${TX + 280} ${BASE - 324} Z`, fill: MARBLE }, tp);
    const pedi = el('path', { d: `M ${TX - 250} ${BASE - 330} L ${TX} ${BASE - 396} L ${TX + 250} ${BASE - 330} Z`, fill: '#ddd3be' }, tp);
    pedimentFigures(tp, TX, BASE - 330, 250, 66, '#f3eee2', '#c9c0ad');
    // callouts on the temple
    const coPed = callout(aw, TX + 60, BASE - 352, TX + 200, BASE - 430, 'Pediments', { size: 26 });
    const coMet = callout(aw, TX - 176, BASE - 294, TX - 300, BASE - 200, 'Metopes', { size: 26 });
    const coFri = callout(aw, TX - 150, BASE - 218, TX - 300, BASE - 120, 'Frieze', { size: 26 });

    // ---------------- Duveen Gallery: the frieze ----------------
    const B = el('g', {}, svg);
    const bw = el('g', {}, B);
    gallery(bw, defs, 'ptg', { horizon: 860, wall: [[0, '#6f6b66'], [1, '#4f4b46']], floor: [[0, '#8b8378'], [1, '#48433d']], lightA: 0.3, x0: -600, w: 5200 });
    linGrad(defs, 'ptfriezebg', [[0, '#cfc7b6'], [1, '#bdb4a2']]);
    const FY = 330, FH = 250;
    el('rect', { x: -600, y: FY - 16, width: 5200, height: 16, fill: '#d9d2c3' }, bw);
    el('rect', { x: -600, y: FY, width: 5200, height: FH, fill: 'url(#ptfriezebg)' }, bw);
    el('rect', { x: -600, y: FY + FH, width: 5200, height: 12, fill: '#a9a08e' }, bw);
    const horse = (g, x, y, s, rider, flip) => {
      const h = el('g', { transform: `translate(${x} ${y}) scale(${s * (flip ? -1 : 1)} ${s})` }, g);
      const body = 'M 40 72 Q 42 52 80 52 L 128 50 Q 142 30 158 14 L 166 10 L 188 36 L 180 44 L 164 38 Q 156 60 150 78 Q 146 96 130 98 L 128 140 L 118 140 L 116 104 L 76 104 L 64 140 L 54 140 L 58 100 Q 38 96 40 72 Z';
      el('path', { d: body, fill: '#a99f8b', transform: 'translate(4 4)' }, h);
      el('path', { d: body, fill: MARBLE, stroke: MLINE, 'stroke-width': 1.5 }, h);
      el('path', { d: 'M 146 82 L 170 66 L 176 72 L 154 96 Z', fill: MARBLE, stroke: MLINE, 'stroke-width': 1.5 }, h); // raised foreleg
      el('path', { d: 'M 42 70 Q 18 80 22 116', fill: 'none', stroke: MLINE, 'stroke-width': 5 }, h);
      el('path', { d: 'M 150 22 Q 136 30 128 50', fill: 'none', stroke: MLINE, 'stroke-width': 1.5 }, h);
      if (rider) {
        el('path', { d: 'M 92 56 L 98 14 Q 104 6 110 14 L 112 56 Z', fill: '#b1a793', transform: 'translate(3 3)' }, h);
        el('path', { d: 'M 92 56 L 98 14 Q 104 6 110 14 L 112 56 Z', fill: MARBLE, stroke: MLINE, 'stroke-width': 1.5 }, h);
        el('circle', { cx: 104, cy: 2, r: 9, fill: MARBLE, stroke: MLINE, 'stroke-width': 1.5 }, h);
        el('path', { d: 'M 100 58 L 108 90 L 116 88 L 110 56 Z', fill: MARBLE, stroke: MLINE, 'stroke-width': 1.5 }, h);
        el('path', { d: 'M 108 24 L 140 34', fill: 'none', stroke: MLINE, 'stroke-width': 4 }, h);
        el('path', { d: 'M 96 18 Q 70 10 60 34', fill: 'none', stroke: MLINE, 'stroke-width': 3 }, h);
      }
    };
    const walker = (g, x, y, s) => {
      const h = el('g', { transform: `translate(${x} ${y}) scale(${s})` }, g);
      el('path', { d: 'M 0 150 L 8 60 Q 10 40 20 40 Q 30 40 32 60 L 40 150 Z', fill: MARBLE, stroke: MLINE, 'stroke-width': 1.5 }, h);
      el('circle', { cx: 20, cy: 28, r: 11, fill: MARBLE, stroke: MLINE, 'stroke-width': 1.5 }, h);
      for (let k = 0; k < 4; k++) el('path', { d: `M ${10 + k * 6} 70 L ${6 + k * 8} 148`, stroke: MLINE, 'stroke-width': 1, fill: 'none' }, h);
    };
    const fr = el('g', {}, bw);
    const r = rng(447);
    let fx = -500;
    while (fx < 4500) {
      if (r() < 0.2) { walker(fr, fx, FY + 80, 1.05); fx += 70; continue; }
      horse(fr, fx, FY + 72, 1.05 + r() * 0.1, true, false);
      if (r() < 0.6) horse(fr, fx + 60, FY + 78, 1.0, true, false);
      fx += 150 + r() * 40;
    }
    // pediment figures on plinths below the frieze
    const ped = el('g', {}, bw);
    const recl = (x, y, s) => {
      const h = el('g', { transform: `translate(${x} ${y}) scale(${s})` }, ped);
      el('path', { d: 'M 0 90 Q 10 50 60 46 Q 90 20 110 30 Q 130 44 112 60 L 200 62 Q 240 64 250 90 Z', fill: MARBLE, stroke: MLINE, 'stroke-width': 2 }, h);
      for (let k = 0; k < 5; k++) el('path', { d: `M ${120 + k * 22} 66 Q ${130 + k * 22} 78 ${126 + k * 22} 88`, stroke: MLINE, 'stroke-width': 1.5, fill: 'none' }, h);
    };
    el('rect', { x: 200, y: 780, width: 2600, height: 70, fill: '#8f887b' }, ped);
    recl(300, 690, 1.0); recl(700, 690, 1.1);
    // horse head of Selene's chariot
    const hh = el('g', { transform: 'translate(1200 640)' }, ped);
    el('path', { d: 'M 0 140 L 20 60 Q 40 0 90 10 L 150 40 Q 170 60 160 80 L 110 80 Q 90 110 90 140 Z', fill: MARBLE, stroke: MLINE, 'stroke-width': 2 }, hh);
    el('circle', { cx: 80, cy: 40, r: 6, fill: MLINE }, hh);
    recl(1500, 690, 1.0); recl(1950, 690, 1.05);

    const pp = el('g', {}, bw);
    const walk = crowd(pp, [
      { x0: 400, y: 1010, h: 300, v: 20, seed: 1, coat: true },
      { x0: 1500, y: 1020, h: 320, v: -18, seed: 2, pack: true },
      { x0: 2300, y: 1000, h: 280, still: true, seed: 3, dir: -1 },
    ]);

    // ---------------- the debate ----------------
    const C = el('g', {}, svg);
    el('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: 'rgba(10,11,15,0.78)' }, C);
    const pin = (x, city, place) => {
      const g = el('g', {}, C);
      el('circle', { cx: x, cy: 470, r: 22, fill: '#ffd873' }, g);
      el('circle', { cx: x, cy: 470, r: 44, fill: 'none', stroke: '#ffd873', 'stroke-width': 3, opacity: 0.5 }, g);
      txt(g, x, 580, city, { size: 64, weight: 600, family: "'Cormorant Garamond'", anchor: 'middle', fill: '#fff' });
      txt(g, x, 624, place.toUpperCase(), { size: 18, weight: 600, anchor: 'middle', fill: '#d8b35a', ls: '0.25em' });
      return g;
    };
    pin(560, 'London', 'British Museum');
    pin(1360, 'Athens', 'Acropolis Museum');
    const arc = el('path', { d: 'M 600 440 Q 960 250 1320 440', fill: 'none', stroke: '#e9d49a', 'stroke-width': 4, 'stroke-dasharray': '14 12' }, C);
    txt(C, 960, 300, '?', { size: 90, weight: 600, family: "'Cormorant Garamond'", anchor: 'middle', fill: '#e9d49a' });
    txt(C, 960, 180, 'Where should they be displayed?', { size: 48, weight: 600, family: "'Cormorant Garamond'", anchor: 'middle', fill: '#fff' });
    txt(C, 960, 740, 'Greece has asked for their return. The museum and Greece continue to discuss them.', { size: 26, weight: 400, anchor: 'middle', fill: '#cfc9bb' });

    return t => {
      const c1 = S.cue(1), c2 = S.cue(2), c3 = S.cue(3), c4 = S.cue(4);
      const aOut = c2 - 0.2;
      setOp(A, 1 - prog(t, aOut, aOut + 1.0, ease.sine));
      setOp(B, prog(t, aOut, aOut + 1.0, ease.sine));
      setOp(C, prog(t, c4 - 0.2, c4 + 0.8));
      if (t < aOut + 1.2) {
        camera(aw, keys(t, [[0, [960, 640, 0.95]], [c1 - 0.5, [960, 560, 1.15]], [c1 + 1.5, [960, 470, 1.6]], [aOut + 1.2, [960, 450, 1.75]]]));
        coPed.set(prog(t, c1 + 2.0, c1 + 3.0, ease.linear));
        coMet.set(prog(t, c1 + 2.8, c1 + 3.8, ease.linear));
        coFri.set(prog(t, c1 + 3.6, c1 + 4.6, ease.linear));
        friezeBand.setAttribute('fill', t > c1 + 3.6 ? '#f0d58a' : '#d2c7ae');
      }
      if (t > aOut - 0.1) {
        camera(bw, keys(t, [[aOut, [300, 450, 1.35]], [c3 - 0.2, [1700, 450, 1.35]], [c3 + 1.8, [1300, 560, 0.85]], [S.dur, [1500, 560, 0.9]]], ease.inOut));
        walk(t);
      }
      setT(arc, '');
      arc.setAttribute('stroke-dashoffset', (-t * 30).toFixed(1));
    };
  },
};
