// Stop 8: the Sutton Hoo ship burial, Room 41.
Scenes.suttonhoo = {
  facts: [
    { line: 1, dt: 0.5, label: 'Discovered', value: '1939', sub: 'By Basil Brown, on Edith Pretty’s land' },
    { line: 2, dt: 0.5, label: 'The ship', value: '27 metres long', sub: 'Only the iron rivets survived' },
    { line: 3, dt: 0.5, label: 'Probably buried', value: 'King Rædwald', sub: 'Ruler of East Anglia, died around AD 624' },
    { line: 5, dt: 0.3, label: 'A gift to the nation', value: '1939', sub: 'Edith Pretty gave the finds to the museum' },
  ],
  build(svg, defs, S) {
    // ---------------- A: the burial mounds at dusk ----------------
    const A = el('g', {}, svg);
    const aw = el('g', {}, A);
    linGrad(defs, 'shsky', [[0, '#27365a'], [0.5, '#8a6a7a'], [0.8, '#e59a62'], [1, '#f4c27f']]);
    linGrad(defs, 'shfield', [[0, '#5d6b3d'], [1, '#2c3520']]);
    linGrad(defs, 'shmound', [[0, '#6f7d48'], [1, '#3a4527']]);
    el('rect', { x: -400, y: -300, width: 2720, height: 1100, fill: 'url(#shsky)' }, aw);
    radGrad(defs, 'shsun', [[0, '#fff0c8', 1], [0.2, '#ffc27a', 0.6], [1, '#ffc27a', 0]]);
    el('circle', { cx: 1400, cy: 610, r: 300, fill: 'url(#shsun)' }, aw);
    el('path', { d: 'M -400 640 Q 200 600 700 630 T 1600 620 T 2320 640 L 2320 700 L -400 700 Z', fill: '#39402c' }, aw);
    // treeline
    const tl = el('g', { fill: '#252b1d' }, aw);
    const r = rng(624);
    for (let x = -400; x < 2320; x += 26) el('ellipse', { cx: x, cy: 628 - r() * 18, rx: 22 + r() * 18, ry: 16 + r() * 22 }, tl);
    el('rect', { x: -400, y: 640, width: 2720, height: 600, fill: 'url(#shfield)' }, aw);
    el('path', { d: 'M -400 668 Q 400 650 1000 672 T 2320 660 L 2320 676 Q 1400 690 800 684 T -400 684 Z', fill: '#c9a888', opacity: 0.55 }, aw); // the river Deben
    [[300, 820, 260, 70], [820, 780, 200, 55], [1180, 860, 330, 95], [1650, 800, 220, 60], [560, 720, 150, 38], [1420, 730, 160, 40]].forEach(([x, y, w, h]) => {
      el('ellipse', { cx: x + w * 0.25, cy: y + 6, rx: w * 1.2, ry: h * 0.35, fill: '#1f2616', opacity: 0.5 }, aw);
      el('path', { d: `M ${x - w} ${y} Q ${x - w * 0.5} ${y - h * 1.2} ${x} ${y - h * 1.3} Q ${x + w * 0.5} ${y - h * 1.2} ${x + w} ${y} Z`, fill: 'url(#shmound)' }, aw);
    });
    const titleA = el('g', {}, A);
    txt(titleA, 960, 300, 'Sutton Hoo', { size: 110, weight: 600, family: "'Cormorant Garamond'", anchor: 'middle', fill: '#fff' });
    txt(titleA, 960, 360, 'SUFFOLK, ENGLAND', { size: 24, weight: 600, anchor: 'middle', fill: '#f2d488', ls: '0.4em' });

    // ---------------- B: the ship impression from above ----------------
    const B = el('g', {}, svg);
    const bw = el('g', {}, B);
    el('rect', { x: -600, y: -500, width: 3200, height: 2100, fill: '#cdb489' }, bw);
    el('rect', { x: -600, y: -500, width: 3200, height: 2100, fill: noisePattern(defs, 'shsand', { seed: 39, alpha: 0.35, dark: true, blotch: true }) }, bw);
    const ship = el('g', { transform: 'translate(960 540) rotate(-8)' }, bw);
    const L = 760, Wd = 150; // half-length and half-width in px (27 m)
    const hull = u => Wd * Math.pow(Math.max(0, 1 - u * u), 0.7); // half-width at position u in [-1, 1]
    let d = '';
    for (let i = 0; i <= 60; i++) { const u = -1 + i / 30; d += `${i ? 'L' : 'M'} ${(u * L).toFixed(1)} ${(-hull(u)).toFixed(1)} `; }
    for (let i = 60; i >= 0; i--) { const u = -1 + i / 30; d += `L ${(u * L).toFixed(1)} ${hull(u).toFixed(1)} `; }
    el('path', { d: d + 'Z', fill: '#a88c62' }, ship);
    el('path', { d: d + 'Z', fill: 'none', stroke: '#6f5638', 'stroke-width': 4 }, ship);
    // ribs
    const ribs = el('g', { stroke: '#7a6040', 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0.8 }, ship);
    for (let k = 1; k < 26; k++) { const u = -1 + k * 2 / 26; const h = hull(u); el('path', { d: `M ${u * L} ${-h + 6} Q ${u * L + 10} 0 ${u * L} ${h - 6}`, fill: 'none' }, ribs); }
    // rivets along the strakes (revealed bow to stern)
    const rivets = [];
    const rg = el('g', { fill: '#3b2d20' }, ship);
    for (let s = 1; s <= 9; s++) {
      const f = s / 10;
      for (let i = 0; i <= 90; i++) {
        const u = -0.98 + i * 1.96 / 90;
        [-1, 1].forEach(sd => {
          const y = sd * hull(u) * f;
          rivets.push({ e: el('circle', { cx: u * L, cy: y, r: 3.4 }, rg), u });
        });
      }
    }
    // burial chamber
    const ch = el('g', {}, ship);
    const chRect = el('rect', { x: -110, y: -hull(0) * 0.8, width: 220, height: hull(0) * 1.6, fill: '#ffd873', opacity: 0.25, stroke: '#ffd873', 'stroke-width': 5 }, ch);
    const treasure = el('g', {}, ch);
    [[-60, -40, 22], [40, -60, 16], [0, 30, 28], [-50, 70, 14], [60, 50, 18]].forEach(([x, y, rr]) => {
      el('circle', { cx: x, cy: y, r: rr, fill: '#e3b84f', stroke: '#8a6a22', 'stroke-width': 3 }, treasure);
      el('circle', { cx: x, cy: y, r: rr * 0.4, fill: '#a2302a' }, treasure);
    });
    // scale bar
    const sb = el('g', {}, bw);
    el('line', { x1: 960 - L, y1: 860, x2: 960 + L, y2: 860, stroke: '#2a2016', 'stroke-width': 4 }, sb);
    [-L, L].forEach(x => el('line', { x1: 960 + x, y1: 844, x2: 960 + x, y2: 876, stroke: '#2a2016', 'stroke-width': 4 }, sb));
    el('rect', { x: 860, y: 836, width: 200, height: 48, rx: 8, fill: '#2a2016' }, sb);
    txt(sb, 960, 870, '27 metres', { size: 26, weight: 600, anchor: 'middle', fill: '#f2d488' });
    const chLab = callout(bw, 960, 440, 1180, 250, 'Burial chamber', { size: 30 });

    // ---------------- C: the helmet ----------------
    const C = el('g', {}, svg);
    const cw = el('g', {}, C);
    gallery(cw, defs, 'shg', { horizon: 940, wall: [[0, '#2b2f3a'], [1, '#161920']], floor: [[0, '#3a3530'], [1, '#161310']], lightX: 820, lightY: 300, lightA: 0.2 });
    spotlight(cw, defs, 'shspot', 820, 520, 420, 440, '#ffe7b8', 0.3);
    const IRON = '#4d5056', IRON_D = '#34363b', TIN = '#a7a9a3', GILT = '#d0a54c';
    const hm = el('g', { transform: 'translate(820 540)' }, cw);
    radGrad(defs, 'shiron', [[0, '#767980'], [0.55, '#4a4d53'], [1, '#26282c']], 0.38, 0.3, 0.8);
    radGrad(defs, 'shface', [[0, '#6b6e75'], [0.7, '#45484e'], [1, '#2b2d31']], 0.5, 0.35, 0.75);
    // neck guard
    el('path', { d: 'M -236 140 Q -254 270 -180 304 Q 0 336 180 304 Q 254 270 236 140 Z', fill: IRON_D }, hm);
    for (let k = -3; k <= 3; k++) el('path', { d: `M ${k * 62} 170 Q ${k * 66} 250 ${k * 70} 318`, fill: 'none', stroke: '#8d8f89', 'stroke-width': 2, opacity: 0.5 }, hm);
    // domed cap with curved bands of tinned panels
    const dome = 'M -242 70 Q -256 -300 0 -312 Q 256 -300 242 70 Z';
    const dc = el('clipPath', { id: 'shdome' }, defs); el('path', { d: dome }, dc);
    el('path', { d: dome, fill: 'url(#shiron)' }, hm);
    const panels = el('g', { 'clip-path': 'url(#shdome)' }, hm);
    [-262, -178, -94].forEach((y, row) => {
      el('path', { d: `M -270 ${y + 30} Q 0 ${y - 30} 270 ${y + 30} L 270 ${y + 92} Q 0 ${y + 32} -270 ${y + 92} Z`, fill: TIN, opacity: 0.32 }, panels);
      for (let k = -4; k <= 4; k++) {
        const x = k * 64 + (row % 2) * 32;
        el('path', { d: `M ${x} ${y + 30 - 30 * (1 - Math.abs(x) / 270)} L ${x * 1.04} ${y + 92 - 30 * (1 - Math.abs(x) / 270)}`, stroke: '#2f3135', 'stroke-width': 3, opacity: 0.6 }, panels);
        el('path', { d: `M ${x + 10} ${y + 58 - 30 * (1 - Math.abs(x) / 270)} q 11 -12 22 0 t 22 0`, fill: 'none', stroke: '#c9cbc4', 'stroke-width': 2, opacity: 0.5 }, panels);
      }
    });
    el('path', { d: 'M -12 -310 Q 0 -318 12 -310 L 10 -52 L -10 -52 Z', fill: '#c2c3bc', stroke: '#6f716b', 'stroke-width': 2 }, hm); // crest
    for (let y = -300; y < -60; y += 14) el('line', { x1: -9, y1: y, x2: 9, y2: y + 6, stroke: '#8d8f89', 'stroke-width': 1.5 }, hm);
    // cheek guards
    [-1, 1].forEach(sd => {
      el('path', { d: `M ${sd * 238} 40 Q ${sd * 272} 150 ${sd * 238} 258 Q ${sd * 190} 280 ${sd * 150} 256 Q ${sd * 130} 150 ${sd * 140} 50 Z`, fill: IRON_D }, hm);
      el('path', { d: `M ${sd * 222} 70 Q ${sd * 244} 150 ${sd * 222} 232 Q ${sd * 190} 246 ${sd * 166} 232 Q ${sd * 152} 150 ${sd * 160} 78 Z`, fill: TIN, opacity: 0.28 }, hm);
      el('circle', { cx: sd * 196, cy: 150, r: 26, fill: 'none', stroke: '#c9cbc4', 'stroke-width': 2, opacity: 0.45 }, hm);
    });
    // face mask
    el('path', { d: 'M -128 -44 L 128 -44 Q 142 80 124 170 Q 84 252 0 264 Q -84 252 -124 170 Q -142 80 -128 -44 Z', fill: 'url(#shface)' }, hm);
    [-1, 1].forEach(sd => el('path', { d: `M ${sd * 40} 196 Q ${sd * 90} 190 ${sd * 110} 150 L ${sd * 116} 60 Q ${sd * 90} 50 ${sd * 60} 60`, fill: 'none', stroke: '#8d8f89', 'stroke-width': 2, opacity: 0.45 }, hm));
    [-62, 62].forEach(x => el('path', { d: `M ${x - 40} 12 Q ${x} -10 ${x + 40} 12 Q ${x} 34 ${x - 40} 12 Z`, fill: '#0e0f12' }, hm));
    // eyebrows with garnets and boar-head ends
    const browL = 'M -122 -6 Q -70 -52 -12 -22', browR = 'M 122 -6 Q 70 -52 12 -22';
    [browL, browR].forEach(b => { el('path', { d: b, fill: 'none', stroke: '#b8b9b2', 'stroke-width': 18, 'stroke-linecap': 'round' }, hm); });
    [[-100, -26], [-80, -36], [-58, -38], [-36, -32], [100, -26], [80, -36], [58, -38], [36, -32]].forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 4.5, fill: '#b1202a' }, hm));
    [-1, 1].forEach(sd => el('ellipse', { cx: sd * 130, cy: -2, rx: 14, ry: 10, fill: GILT, transform: `rotate(${sd * 30} ${sd * 130} -2)` }, hm));
    // nose and moustache (gilt bronze)
    el('path', { d: 'M -12 -34 L 12 -34 L 26 100 Q 0 122 -26 100 Z', fill: GILT, stroke: '#8a6a22', 'stroke-width': 2 }, hm);
    el('path', { d: 'M -96 150 Q -44 116 0 128 Q 44 116 96 150 Q 44 140 0 152 Q -44 140 -96 150 Z', fill: GILT, stroke: '#8a6a22', 'stroke-width': 2 }, hm);
    el('path', { d: 'M -30 176 Q 0 182 30 176', fill: 'none', stroke: '#0e0f12', 'stroke-width': 5 }, hm);
    el('path', { d: 'M -16 -60 Q 0 -80 16 -60 L 12 -40 L -12 -40 Z', fill: GILT, stroke: '#8a6a22', 'stroke-width': 2 }, hm); // dragon head on the crest
    el('path', { d: dome, fill: noisePattern(defs, 'shrust', { seed: 41, alpha: 0.35, dark: true, blotch: true }) }, hm);
    // the dragon traced in light
    const dragon = el('g', { fill: 'none', stroke: '#ffe28a', 'stroke-width': 8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', filter: 'url(#glow)' }, hm);
    const dW1 = el('path', { d: 'M -12 -24 Q -70 -54 -126 -6' }, dragon);
    const dW2 = el('path', { d: 'M 12 -24 Q 70 -54 126 -6' }, dragon);
    const dB = el('path', { d: 'M 0 -64 L 0 110' }, dragon);
    const dT = el('path', { d: 'M 0 128 Q -44 116 -96 150 M 0 128 Q 44 116 96 150' }, dragon);
    const cDr = callout(cw, 820 + 130, 540 - 20, 1180, 300, 'A flying dragon', { size: 30 });
    glassCase(cw, 520, 170, 600, 740);

    return t => {
      const c1 = S.cue(1), c2 = S.cue(2), c4 = S.cue(4), c5 = S.cue(5);
      const bIn = c1 + 0.5, cIn = S.cue(3) + 5.0;
      setOp(A, 1 - prog(t, bIn, bIn + 1.0));
      setOp(B, prog(t, bIn, bIn + 1.0) * (1 - prog(t, cIn, cIn + 1.0)));
      setOp(C, prog(t, cIn, cIn + 1.0));
      if (t < bIn + 1.1) {
        camera(aw, keys(t, [[0, [960, 560, 1.0]], [bIn + 1, [1000, 600, 1.12]]]));
        setOp(titleA, prog(t, 2.0, 3.0) * (1 - prog(t, c1 - 0.5, c1 + 0.3)));
      }
      if (t > bIn - 0.1 && t < cIn + 1.1) {
        camera(bw, keys(t, [[bIn, [760, 540, 1.6]], [c2, [1000, 540, 0.95]], [c2 + 5, [960, 540, 1.0]], [S.cue(3), [960, 520, 1.5]], [cIn + 1, [960, 520, 1.7]]]));
        const rev = prog(t, bIn + 0.5, c2 + 3.5, ease.linear);
        rivets.forEach(rv => { const on = rv.u < -1 + rev * 2.1; rv.e.style.display = on ? '' : 'none'; });
        const chT = S.at('In the middle was');
        setOp(ch, prog(t, chT, chT + 0.6));
        chRect.setAttribute('opacity', (0.5 + 0.25 * Math.sin(t * 4)).toFixed(3));
        setOp(sb, prog(t, c2 - 1.5, c2 - 0.5) * (1 - prog(t, S.cue(3) - 0.5, S.cue(3))));
        chLab.set(prog(t, chT + 0.4, chT + 1.4, ease.linear) * (1 - prog(t, cIn - 0.4, cIn)));
      }
      if (t > cIn - 0.1) {
        camera(cw, keys(t, [[cIn, [820, 560, 0.9]], [c4, [820, 540, 1.0]], [c4 + 2, [820, 520, 1.15]], [c5, [820, 520, 1.15]], [S.dur, [900, 560, 0.95]]]));
        const cl = S.at('Look closely');
        const base = cl + 0.6;
        const fade = 1 - prog(t, c5 + 1.0, c5 + 2.0);
        drawOn(dW1, prog(t, base, base + 0.9)); drawOn(dW2, prog(t, base, base + 0.9));
        drawOn(dB, prog(t, base + 0.6, base + 1.4)); drawOn(dT, prog(t, base + 1.2, base + 2.0));
        setOp(dragon, prog(t, base - 0.1, base) * fade * (0.8 + 0.2 * Math.sin(t * 5)));
        cDr.set(prog(t, base + 1.8, base + 2.8, ease.linear) * fade);
      }
    };
  },
};
