// Stop 5: Hoa Hakananai'a, Room 24.
Scenes.moai = {
  facts: [
    { line: 0, dt: 4.5, label: 'From', value: 'Rapa Nui (Easter Island)', sub: 'In the Pacific Ocean' },
    { line: 1, dt: 0.5, label: 'Carved', value: 'About AD 1000–1200', sub: 'From basalt · 2.42 m tall' },
    { line: 4, dt: 0.4, label: 'Taken', value: '1868', sub: 'By the crew of HMS Topaze' },
    { line: 4, dt: 4.2, label: 'Today', value: 'A request to return', sub: 'Rapa Nui has asked for him to come home' },
  ],
  hideFacts(t, S) { return win(t, S.cue(2) - 0.2, S.cue(3) + 0.2, 0.3); },
  build(svg, defs, S) {
    const world = el('g', {}, svg);
    gallery(world, defs, 'mo', { horizon: 900, wall: [[0, '#8f8d88'], [1, '#6a6863']], floor: [[0, '#8a847b'], [1, '#4a453f']], lightX: 760, lightY: 260, lightA: 0.3 });
    spotlight(world, defs, 'mospot', 760, 560, 420, 520, '#fff4dc', 0.3);
    // plinth
    el('rect', { x: 540, y: 880, width: 440, height: 70, fill: '#3e3b38' }, world);
    el('rect', { x: 540, y: 880, width: 440, height: 8, fill: '#57534e' }, world);
    shadow(world, 760, 950, 300, 26, 0.5);

    const BAS = '#3c3b3e', BAS_L = '#56555a', BAS_D = '#252427';
    linGrad(defs, 'mobody', [[0, '#2a292c'], [0.4, '#4a494e'], [0.65, '#434247'], [1, '#232225']], 0, 0, 1, 0);
    const rough = noisePattern(defs, 'morough', { seed: 24, alpha: 0.4, size: 160, blotch: true });
    // rotating wrapper (front <-> back)
    const spin = el('g', {}, world);
    const outline = 'M 640 880 L 632 600 Q 612 560 612 520 L 604 300 Q 600 180 660 150 L 860 150 Q 920 180 916 300 L 908 520 Q 908 560 888 600 L 880 880 Z';
    const frontG = el('g', {}, spin);
    el('path', { d: outline, fill: 'url(#mobody)' }, frontG);
    el('path', { d: outline, fill: rough, opacity: 0.45 }, frontG);
    // ears
    el('path', { d: 'M 606 250 Q 588 260 590 330 Q 592 420 612 470 L 620 470 L 616 260 Z', fill: BAS_D }, frontG);
    el('path', { d: 'M 914 250 Q 932 260 930 330 Q 928 420 908 470 L 900 470 L 904 260 Z', fill: BAS_D }, frontG);
    // brow and eye sockets
    el('path', { d: 'M 630 240 Q 760 214 890 240 L 890 262 Q 760 240 630 262 Z', fill: BAS_L }, frontG);
    el('path', { d: 'M 650 266 Q 700 300 740 272 L 736 290 Q 700 318 654 290 Z', fill: '#141316' }, frontG);
    el('path', { d: 'M 870 266 Q 820 300 780 272 L 784 290 Q 820 318 866 290 Z', fill: '#141316' }, frontG);
    // nose
    el('path', { d: 'M 744 262 L 776 262 L 790 392 Q 760 408 730 392 Z', fill: BAS_L }, frontG);
    el('path', { d: 'M 730 392 Q 742 404 756 398 M 764 398 Q 778 404 790 392', fill: 'none', stroke: BAS_D, 'stroke-width': 4 }, frontG);
    // lips and chin
    el('path', { d: 'M 712 430 Q 760 418 808 430 Q 760 444 712 430 Z', fill: BAS_D }, frontG);
    el('path', { d: 'M 700 470 Q 760 500 820 470 L 818 498 Q 760 520 702 498 Z', fill: BAS_L }, frontG);
    // collar bones, arms and long hands
    el('path', { d: 'M 660 560 Q 700 590 740 588 M 860 560 Q 820 590 780 588', fill: 'none', stroke: BAS_D, 'stroke-width': 5 }, frontG);
    el('path', { d: 'M 640 620 Q 650 720 700 770 L 760 780', fill: 'none', stroke: BAS_L, 'stroke-width': 14, 'stroke-linecap': 'round' }, frontG);
    el('path', { d: 'M 880 620 Q 870 720 820 770 L 760 780', fill: 'none', stroke: BAS_L, 'stroke-width': 14, 'stroke-linecap': 'round' }, frontG);
    for (let k = 0; k < 4; k++) {
      el('line', { x1: 700 + k * 12, y1: 772, x2: 752 + k * 3, y2: 790, stroke: BAS_D, 'stroke-width': 3 }, frontG);
      el('line', { x1: 820 - k * 12, y1: 772, x2: 768 - k * 3, y2: 790, stroke: BAS_D, 'stroke-width': 3 }, frontG);
    }
    el('path', { d: outline, fill: 'none', stroke: '#6b6a70', 'stroke-width': 2 }, frontG);

    // back view with the birdman carvings
    const backG = el('g', {}, spin);
    el('path', { d: outline, fill: 'url(#mobody)' }, backG);
    el('path', { d: outline, fill: rough, opacity: 0.45 }, backG);
    const RED = '#b9523f', WHITE = '#e9e2d4';
    const carve = el('g', { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, backG);
    const birdman = (x, y, dir) => {
      const g = el('g', { transform: `translate(${x} ${y}) scale(${dir} 1)` }, carve);
      el('path', { d: 'M 0 0 Q 30 -40 60 -10 L 88 -4 L 60 6 Q 50 20 40 22', stroke: WHITE, 'stroke-width': 5 }, g);   // bird head + beak
      el('path', { d: 'M 40 22 Q 10 40 16 80 Q 30 110 60 100 M 30 60 Q 60 60 70 90 M 16 80 L 0 110', stroke: WHITE, 'stroke-width': 5 }, g); // crouching body
      el('circle', { cx: 34, cy: -8, r: 5, fill: RED, stroke: 'none' }, g);
    };
    birdman(650, 250, 1); birdman(870, 250, -1);
    el('path', { d: 'M 760 190 Q 780 170 800 186 L 822 180 L 804 198 Q 790 214 770 206 Z', fill: RED, stroke: 'none' }, carve); // frigatebird
    // ceremonial paddles (ao) on the shoulders
    [[640, 1], [880, -1]].forEach(([x, d]) => {
      el('path', { d: `M ${x} 520 L ${x + d * 20} 640`, stroke: WHITE, 'stroke-width': 5 }, carve);
      el('ellipse', { cx: x - d * 4, cy: 490, rx: 22, ry: 36, stroke: RED, 'stroke-width': 5 }, carve);
    });
    // ring and girdle (maro)
    el('circle', { cx: 760, cy: 620, r: 44, stroke: WHITE, 'stroke-width': 7 }, carve);
    el('path', { d: 'M 640 720 Q 760 750 880 720 M 640 744 Q 760 774 880 744 M 760 762 L 760 830', stroke: WHITE, 'stroke-width': 6 }, carve);
    el('path', { d: outline, fill: 'none', stroke: '#6b6a70', 'stroke-width': 2 }, backG);
    const backLabels = el('g', {}, world);
    const cb1 = callout(backLabels, 860, 250, 1010, 190, 'Birdmen', { size: 28 });
    const cb2 = callout(backLabels, 636, 490, 380, 500, 'Ceremonial paddles', { size: 28 });
    const cb3 = callout(backLabels, 790, 640, 1000, 770, 'Ring and girdle', { size: 28 });

    // name and translation
    const nameG = el('g', {}, svg);
    el('rect', { x: 1120, y: 360, width: 700, height: 250, rx: 14, fill: 'rgba(14,15,20,0.84)', stroke: '#d8b35a', 'stroke-width': 2 }, nameG);
    txt(nameG, 1470, 450, 'Hoa Hakananai‘a', { size: 64, weight: 600, family: "'Cormorant Garamond'", anchor: 'middle', fill: '#fff' });
    el('line', { x1: 1370, y1: 480, x2: 1570, y2: 480, stroke: '#d8b35a', 'stroke-width': 2 }, nameG);
    txt(nameG, 1470, 548, '“lost or stolen friend”', { size: 44, weight: 500, italic: true, family: "'Cormorant Garamond'", anchor: 'middle', fill: '#e9d49a' });

    const pp = el('g', {}, world);
    const walk = crowd(pp, [
      { x0: 330, y: 940, h: 470, still: true, seed: 1, pack: true },
      { x0: 1230, y: 940, h: 440, still: true, seed: 2, dir: -1, bun: true },
    ]);
    world.appendChild(backLabels);

    return t => {
      const cBack = S.at('Look at his back');
      const flip1 = prog(t, cBack - 0.2, cBack + 1.2, ease.inOut);
      const flip2 = prog(t, S.cue(4) + 0.2, S.cue(4) + 1.6, ease.inOut);
      const ang = Math.PI * (flip1 - flip2);   // 0 = front, PI = back
      const sx = Math.cos(ang);
      setT(spin, `translate(760 0) scale(${Math.abs(sx).toFixed(4) || 0.001} 1) translate(-760 0)`);
      setOp(frontG, sx >= 0 ? 1 : 0);
      setOp(backG, sx < 0 ? 1 : 0);
      const cam = keys(t, [
        [0, [900, 560, 0.9]], [S.cue(1), [860, 540, 1.0]], [S.cue(2), [900, 500, 1.1]],
        [cBack, [800, 520, 1.1]], [cBack + 2, [780, 520, 1.12]], [S.cue(4), [780, 540, 1.1]], [S.dur, [880, 560, 0.92]],
      ]);
      camera(world, cam);
      walk(t);
      const bl = prog(t, cBack + 1.2, cBack + 1.6) * (1 - prog(t, S.cue(4), S.cue(4) + 0.4));
      cb1.set(prog(t, cBack + 1.3, cBack + 2.3, ease.linear) * bl);
      cb2.set(prog(t, cBack + 2.3, cBack + 3.3, ease.linear) * bl);
      cb3.set(prog(t, cBack + 3.3, cBack + 4.3, ease.linear) * bl);
      setOp(nameG, win(t, S.cue(2) - 0.3, S.cue(3) + 0.1, 0.4));
    };
  },
};
