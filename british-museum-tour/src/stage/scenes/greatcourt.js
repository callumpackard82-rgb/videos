// Stop 1: the Great Court, its glass roof and the round Reading Room.
Scenes.greatcourt = {
  noDoor: true,
  facts: [
    { line: 1, dt: 6.5, label: 'Glass roof opened', value: 'December 2000', sub: 'Designed by Foster + Partners' },
    { line: 2, dt: 0.6, label: 'Covered area', value: 'About two acres', sub: 'Europe’s largest covered public square' },
    { line: 3, dt: 0.4, label: 'Reading Room', value: 'Opened 1857', sub: 'Readers included Karl Marx, Bram Stoker and Mahatma Gandhi' },
  ],
  hideFacts(t) { return 0; },
  build(svg, defs, S) {
    // ---------------- View A: inside the court, looking at the Reading Room ----------------
    const A = el('g', {}, svg);
    const HOR = 640, F = 700, EYE = 1.6, ROOF = 20;
    const P = (X, Y, Z) => [960 + F * X / Z, HOR - F * (Y - EYE) / Z];
    linGrad(defs, 'gcsky', [[0, '#eaf3f8'], [1, '#c9dbe6']]);
    linGrad(defs, 'gcfloor', [[0, '#d9d3c6'], [1, '#bdb4a3']]);
    linGrad(defs, 'gcdrum', [[0, '#b9ae98'], [0.25, '#e9e2d3'], [0.55, '#f3eee3'], [0.8, '#ddd4c2'], [1, '#aa9f88']], 0, 0, 1, 0);
    linGrad(defs, 'gcwall', [[0, '#e6dfcf'], [1, '#cfc6b2']]);
    radGrad(defs, 'gcbright', [[0, '#ffffff', 0.9], [1, '#ffffff', 0]]);
    const aw = el('g', {}, A);
    el('rect', { x: -300, y: -300, width: 2520, height: 1100, fill: 'url(#gcsky)' }, aw);
    el('ellipse', { cx: 960, cy: 120, rx: 900, ry: 380, fill: 'url(#gcbright)' }, aw);
    // floor
    el('rect', { x: -300, y: 600, width: 2520, height: 800, fill: 'url(#gcfloor)' }, aw);
    const fj = el('g', { stroke: 'rgba(120,110,95,0.35)', 'stroke-width': 1.5 }, aw);
    for (let z = 4; z < 80; z *= 1.18) { const a = P(-80, 0, z), b = P(80, 0, z); el('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1] }, fj); }
    for (let X = -40; X <= 40; X += 2.5) { const a = P(X, 0, 3), b = P(X, 0, 75); el('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1] }, fj); }
    // side facades of the old courtyard (receding walls with windows and a portico)
    [-1, 1].forEach(sd => {
      const X = 36 * sd;
      const q = [P(X, ROOF, 8), P(X, ROOF, 75), P(X, 0, 75), P(X, 0, 8)];
      el('path', { d: `M ${q.map(p => p.join(' ')).join(' L ')} Z`, fill: 'url(#gcwall)' }, aw);
      const w = el('g', {}, aw);
      for (let z = 12; z < 72; z += 5) {
        const a = P(X, 13, z), b = P(X, 13, z + 2.2), c = P(X, 5, z + 2.2), d = P(X, 5, z);
        el('path', { d: `M ${a.join(' ')} L ${b.join(' ')} L ${c.join(' ')} L ${d.join(' ')} Z`, fill: '#8f8676', opacity: 0.5 }, w);
        const e = P(X, 17.5, z), f2 = P(X, 17.5, z + 2.2), g = P(X, 15.5, z + 2.2), h = P(X, 15.5, z);
        el('path', { d: `M ${e.join(' ')} L ${f2.join(' ')} L ${g.join(' ')} L ${h.join(' ')} Z`, fill: '#8f8676', opacity: 0.4 }, w);
      }
      // cornice line
      const c1 = P(X, 18.8, 8), c2 = P(X, 18.8, 75);
      el('line', { x1: c1[0], y1: c1[1], x2: c2[0], y2: c2[1], stroke: '#b5aa94', 'stroke-width': 6 }, w);
    });
    // roof lattice (a plane above us, drawn in perspective)
    const roof = el('g', { stroke: '#66727c', 'stroke-width': 1.8, 'stroke-linecap': 'round' }, aw);
    // clip each roof bar to the courtyard (|X| <= 36, 6 <= Z <= 72) before projecting
    const seg = (X1, Z1, X2, Z2) => {
      let t0 = 0, t1 = 1;
      const dx = X2 - X1, dz = Z2 - Z1;
      for (const [p, q] of [[-dx, X1 + 36], [dx, 36 - X1], [-dz, Z1 - 6], [dz, 72 - Z1]]) {
        if (Math.abs(p) < 1e-9) { if (q < 0) return; continue; }
        const r = q / p;
        if (p < 0) t0 = Math.max(t0, r); else t1 = Math.min(t1, r);
      }
      if (t0 >= t1) return;
      const a = P(X1 + dx * t0, ROOF, Z1 + dz * t0), b = P(X1 + dx * t1, ROOF, Z1 + dz * t1);
      el('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1] }, roof);
    };
    for (let z = 6; z <= 72; z += 3) seg(-40, z, 40, z);
    seg(-36, 6, -36, 72); seg(36, 6, 36, 72);
    for (let k = -120; k <= 120; k += 3) {
      // X = z + k and X = -z + k, clipped to z in [6, 72]
      seg(6 + k, 6, 72 + k, 72); seg(-6 + k, 6, -72 + k, 72);
    }
    // roof edge where it meets the old facades
    // the Reading Room drum
    const drum = el('g', {}, A);
    const DL = 430, DR = 1490;
    el('path', { d: `M ${DL} 360 Q 960 250 ${DR} 360 L ${DR} 770 Q 960 830 ${DL} 770 Z`, fill: 'url(#gcdrum)' }, drum);
    const dj = el('g', { stroke: 'rgba(130,118,98,0.35)', 'stroke-width': 1.5, fill: 'none' }, drum);
    for (let k = 1; k < 9; k++) {
      const y0 = lerp(360, 770, k / 9), yc = lerp(290, 800, k / 9);
      el('path', { d: `M ${DL} ${y0} Q 960 ${yc} ${DR} ${y0}` }, dj);
    }
    // top ring where the roof lands
    el('path', { d: `M ${DL - 10} 362 Q 960 246 ${DR + 10} 362`, fill: 'none', stroke: '#d7cfbf', 'stroke-width': 18 }, drum);
    el('path', { d: `M ${DL - 10} 350 Q 960 234 ${DR + 10} 350`, fill: 'none', stroke: '#6b7780', 'stroke-width': 4 }, drum);
    // reading room entrance
    radGrad(defs, 'gcdoor', [[0, '#ffe2ae'], [1, '#c79a5d']], 0.5, 0.9, 0.9);
    el('rect', { x: 892, y: 612, width: 136, height: 190, fill: 'url(#gcdoor)' }, drum);
    el('path', { d: 'M 880 806 V 600 H 1040 V 806', fill: 'none', stroke: '#cfc6b3', 'stroke-width': 12 }, drum);
    txt(drum, 960, 585, 'READING ROOM', { size: 20, weight: 600, anchor: 'middle', fill: '#8a7f6b', ls: '0.3em' });
    // staircases wrapping around the drum
    [-1, 1].forEach(sd => {
      const m = x => 960 + sd * (x - 960);
      const st = el('g', {}, drum);
      el('path', { d: `M ${m(800)} 812 C ${m(640)} 790, ${m(520)} 690, ${m(430)} 560 L ${m(430)} 610 C ${m(520)} 730, ${m(640)} 838, ${m(800)} 860 Z`, fill: '#9f9583', opacity: 0.55 }, st);
      el('path', { d: `M ${m(820)} 760 C ${m(650)} 740, ${m(520)} 640, ${m(420)} 500 L ${m(420)} 560 C ${m(520)} 700, ${m(650)} 800, ${m(820)} 818 Z`, fill: '#f4efe5' }, st);
      el('path', { d: `M ${m(820)} 760 C ${m(650)} 740, ${m(520)} 640, ${m(420)} 500`, fill: 'none', stroke: '#fffdf7', 'stroke-width': 4 }, st);
      el('path', { d: `M ${m(820)} 818 C ${m(650)} 800, ${m(520)} 700, ${m(420)} 560`, fill: 'none', stroke: '#b8ad98', 'stroke-width': 3 }, st);
    });
    // dappled shadow of the roof grid on the drum and floor
    const dp = el('pattern', { id: 'gcdapple', width: 90, height: 60, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(8)' }, defs);
    el('path', { d: 'M 0 0 L 90 60 M 90 0 L 0 60 M 0 30 H 90', stroke: '#6d6353', 'stroke-width': 2, fill: 'none' }, dp);
    el('path', { d: `M ${DL} 360 Q 960 250 ${DR} 360 L ${DR} 770 Q 960 830 ${DL} 770 Z`, fill: 'url(#gcdapple)', opacity: 0.09 }, A);
    el('rect', { x: -300, y: 820, width: 2520, height: 600, fill: 'url(#gcdapple)', opacity: 0.06 }, A);
    // visitors
    const pp = el('g', {}, A);
    const walkA = crowd(pp, [
      { x0: 300, y: 830, h: 110, v: 22, seed: 1, coat: true },
      { x0: 1200, y: 822, h: 100, v: -16, seed: 2, pack: true },
      { x0: 700, y: 860, h: 130, v: 12, seed: 3, bun: true },
      { x0: 1500, y: 880, h: 150, v: -24, seed: 4 },
      { x0: 1100, y: 815, h: 90, v: 10, seed: 5 },
      { x0: 400, y: 950, h: 220, v: 30, seed: 6, coat: true },
      { x0: 1680, y: 990, h: 250, v: -34, seed: 7, pack: true },
      { x0: 1000, y: 812, h: 60, v: -8, seed: 8 },
      { x0: 850, y: 1040, h: 300, v: 20, seed: 9, bun: true },
      { x0: 560, y: 805, h: 80, still: true, seed: 10 },
      { x0: 1380, y: 808, h: 84, still: true, seed: 11, dir: -1 },
    ]);

    // ---------------- View B: the roof from above ----------------
    const B = el('g', {}, svg);
    const bw = el('g', {}, B);
    const X0 = 250, X1 = 1670, Y0 = 30, Y1 = 1050, CX = 960, CY = 510, RR = 250;
    linGrad(defs, 'gcroofs', [[0, '#4a4e57'], [1, '#353841']]);
    el('rect', { x: -400, y: -400, width: 2720, height: 1880, fill: 'url(#gcroofs)' }, bw);
    const slate = noisePattern(defs, 'gcslate', { seed: 21, alpha: 0.25, blotch: true });
    el('rect', { x: -400, y: -400, width: 2720, height: 1880, fill: slate }, bw);
    // surrounding building ranges
    const rg = el('g', { fill: '#5b5f69', stroke: '#2b2d33', 'stroke-width': 3 }, bw);
    el('rect', { x: X0 - 150, y: Y0 - 150, width: X1 - X0 + 300, height: 150 }, rg);
    el('rect', { x: X0 - 150, y: Y1, width: X1 - X0 + 300, height: 150 }, rg);
    el('rect', { x: X0 - 150, y: Y0, width: 150, height: Y1 - Y0 }, rg);
    el('rect', { x: X1, y: Y0, width: 150, height: Y1 - Y0 }, rg);
    // glass lattice
    const dist = phi => {
      const c = Math.cos(phi), s = Math.sin(phi);
      const cand = [];
      if (c > 1e-6) cand.push((X1 - CX) / c); if (c < -1e-6) cand.push((X0 - CX) / c);
      if (s > 1e-6) cand.push((Y1 - CY) / s); if (s < -1e-6) cand.push((Y0 - CY) / s);
      return Math.min(...cand);
    };
    const M = 72, N = 12;
    const V = (i, j) => {
      const phi = (i + 0.5 * j) * 2 * Math.PI / M;
      const sj = Math.pow(j / N, 1.08);
      const d = RR + sj * (dist(phi) - RR);
      return [CX + Math.cos(phi) * d, CY + Math.sin(phi) * d];
    };
    const r = rng(3312);
    const rings = [];
    el('rect', { x: X0, y: Y0, width: X1 - X0, height: Y1 - Y0, fill: '#cddde6' }, bw);
    const glass = el('g', { stroke: '#48535c', 'stroke-width': 1.6, 'stroke-linejoin': 'round' }, bw);
    const cells = [];
    for (let j = 0; j < N; j++) {
      const ring = el('g', {}, glass); rings.push(ring);
      for (let i = 0; i < M; i++) {
        const a = V(i, j), b = V(i + 1, j), c = V(i, j + 1), d = V(i + 1, j + 1);
        const l1 = 80 + r() * 12, l2 = 80 + r() * 12;
        const p1 = el('path', { d: `M ${a} L ${b} L ${c} Z`, fill: `hsl(200, 30%, ${l1}%)` }, ring);
        const p2 = el('path', { d: `M ${b} L ${d} L ${c} Z`, fill: `hsl(205, 28%, ${l2}%)` }, ring);
        cells.push(p1, p2);
      }
    }
    // glints moving across the glass
    radGrad(defs, 'gcglint', [[0, '#ffffff', 0.55], [1, '#ffffff', 0]]);
    const glint = el('ellipse', { rx: 420, ry: 180, fill: 'url(#gcglint)' }, bw);
    // reading room dome
    radGrad(defs, 'gcdome', [[0, '#9aa4ad'], [0.8, '#6d767f'], [1, '#555c64']], 0.45, 0.4, 0.6);
    el('circle', { cx: CX, cy: CY, r: RR, fill: 'url(#gcdome)', stroke: '#e8e1d2', 'stroke-width': 10 }, bw);
    for (let k = 0; k < 20; k++) {
      const a = k / 20 * Math.PI * 2;
      el('line', { x1: CX + Math.cos(a) * 60, y1: CY + Math.sin(a) * 60, x2: CX + Math.cos(a) * (RR - 8), y2: CY + Math.sin(a) * (RR - 8), stroke: '#4b525a', 'stroke-width': 3 }, bw);
    }
    el('circle', { cx: CX, cy: CY, r: 60, fill: '#bfc6cc', stroke: '#4b525a', 'stroke-width': 3 }, bw);
    // highlighted "unique" panes
    const uniq = [[3, 1], [20, 5], [41, 9], [58, 3], [12, 10], [33, 7]].map(([i, j]) => {
      const a = V(i, j), b = V(i + 1, j), c = V(i, j + 1);
      return el('path', { d: `M ${a} L ${b} L ${c} Z`, fill: '#ffd873', 'fill-opacity': 0.55, stroke: '#ffd873', 'stroke-width': 5, opacity: 0 }, bw);
    });
    // counter
    const cnt = el('g', {}, B);
    el('rect', { x: CX - 230, y: CY - 105, width: 460, height: 200, rx: 18, fill: 'rgba(14,16,22,0.8)' }, cnt);
    const num = txt(cnt, CX, CY + 20, '0', { size: 120, weight: 600, family: "'Cormorant Garamond'", anchor: 'middle', fill: '#fff' });
    txt(cnt, CX, CY + 70, 'PANES OF GLASS', { size: 22, weight: 600, anchor: 'middle', fill: '#d8b35a', ls: '0.3em' });
    const uLab = el('g', {}, B);
    el('rect', { x: CX - 300, y: CY + 128, width: 600, height: 64, rx: 12, fill: 'rgba(14,16,22,0.85)', stroke: '#ffd873', 'stroke-width': 2 }, uLab);
    txt(uLab, CX, CY + 170, 'No two panes are the same shape', { size: 30, weight: 600, anchor: 'middle', fill: '#fff' });

    return t => {
      const bIn = S.cue(1) + 4.2, bOut = S.cue(3) - 0.3;
      const bo = Math.min(prog(t, bIn, bIn + 1.2, ease.sine), 1 - prog(t, bOut, bOut + 1.0, ease.sine));
      setOp(B, bo);
      setOp(A, 1 - Math.min(prog(t, bIn + 0.2, bIn + 1.2), 1 - prog(t, bOut - 0.1, bOut + 0.9)));
      if (bo < 1) {
        const cam = keys(t, [
          [0, [960, 500, 1.02]], [S.cue(1) + 4, [960, 470, 1.1]],
          [S.cue(3), [960, 560, 1.08]], [S.cue(3) + 5, [960, 640, 1.3]],
          [S.cue(4) - 0.5, [960, 620, 1.2]], [S.dur, [560, 640, 1.5]],
        ]);
        camera(A, cam);
        walkA(t);
      }
      if (bo > 0) {
        const cb = keys(t, [[bIn, [960, 540, 1.25]], [S.cue(2), [960, 540, 1.0]], [bOut + 1, [960, 520, 0.95]]]);
        const rot = (t - bIn) * 0.6;
        setT(bw, `translate(960 540) rotate(${rot}) scale(${cb[2]}) translate(-960 -540)`);
        rings.forEach((g, j) => setOp(g, prog(t, bIn + 0.6 + j * 0.28, bIn + 1.2 + j * 0.28)));
        const gx = lerp(200, 1700, prog(t, bIn, bOut, ease.linear));
        glint.setAttribute('cx', gx); glint.setAttribute('cy', lerp(900, 200, prog(t, bIn, bOut, ease.linear)));
        const c2 = S.cue(2);
        const n = Math.round(3312 * prog(t, c2 + 0.3, c2 + 3.6, ease.out));
        num.textContent = n.toLocaleString('en-GB');
        setOp(cnt, prog(t, c2, c2 + 0.5));
        uniq.forEach((u, k) => setOp(u, prog(t, c2 + 4.2 + k * 0.15, c2 + 4.6 + k * 0.15) * (0.6 + 0.4 * Math.sin(t * 4 + k))));
        setOp(uLab, prog(t, c2 + 4.4, c2 + 5.0));
      }
    };
  },
};
