// Closing: a recap of the tour, the "1% on display" fact, questions to discuss, credits.
const THUMBS = [
  ['greatcourt', 'Great Court'], ['rosetta', 'Rosetta Stone'], ['lamassu', 'Lamassu'],
  ['parthenon', 'Parthenon sculptures'], ['moai', 'Hoa Hakananai‘a'], ['ur', 'Royal Game of Ur'],
  ['mummies', 'Egyptian mummies'], ['suttonhoo', 'Sutton Hoo'], ['chessmen', 'Lewis Chessmen'],
];

Scenes.outro = {
  badgeFrom: 9999,
  noDoor: true,
  build(svg, defs, S) {
    const world = el('g', {}, svg);
    linGrad(defs, 'obg', [[0, '#141823'], [1, '#0b0d12']], 0, 0, 1, 1);
    el('rect', { x: -200, y: -200, width: 2320, height: 1480, fill: 'url(#obg)' }, world);
    const lat = el('g', { stroke: '#d8b35a', 'stroke-width': 1, opacity: 0.06 }, world);
    for (let k = -30; k < 60; k++) { el('line', { x1: k * 60, y1: 0, x2: k * 60 + 1080, y2: 1080 }, lat); el('line', { x1: k * 60, y1: 0, x2: k * 60 - 1080, y2: 1080 }, lat); }

    // ---- recap collage ----
    const grid = el('g', {}, world);
    const TW = 440, TH = 248, GAP = 24, GX = (1920 - (3 * TW + 2 * GAP)) / 2, GY = 120;
    txt(grid, 960, 88, 'YOUR TOUR', { size: 22, weight: 600, anchor: 'middle', fill: '#d8b35a', ls: '0.35em' });
    const tiles = THUMBS.map(([id, name], i) => {
      const x = GX + (i % 3) * (TW + GAP), y = GY + Math.floor(i / 3) * (TH + GAP);
      const g = el('g', {}, grid);
      const cp = el('clipPath', { id: `oclip${i}` }, defs); el('rect', { x, y, width: TW, height: TH, rx: 10 }, cp);
      el('rect', { x, y, width: TW, height: TH, rx: 10, fill: '#222' }, g);
      const img = el('image', { href: `../../build/thumbs/${id}.jpg`, x, y, width: TW, height: TH, preserveAspectRatio: 'xMidYMid slice', 'clip-path': `url(#oclip${i})` }, g);
      window.__pending = (window.__pending || 0) + 1;
      const done = () => { window.__pending--; };
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
      el('rect', { x, y: y + TH - 50, width: TW, height: 50, fill: 'rgba(10,11,15,0.82)', 'clip-path': `url(#oclip${i})` }, g);
      txt(g, x + 18, y + TH - 18, `${i + 1}`, { size: 22, weight: 700, fill: '#d8b35a' });
      txt(g, x + 46, y + TH - 18, name, { size: 22, weight: 600, fill: '#fff' });
      el('rect', { x, y, width: TW, height: TH, rx: 10, fill: 'none', stroke: 'rgba(216,179,90,0.6)', 'stroke-width': 2 }, g);
      return { g, cx: x + TW / 2, cy: y + TH / 2 };
    });

    // ---- 1% on display ----
    const pct = el('g', {}, world);
    txt(pct, 960, 170, 'Only about 1% is on display', { size: 64, weight: 600, family: "'Cormorant Garamond'", anchor: 'middle', fill: '#fff' });
    const cells = [];
    for (let i = 0; i < 100; i++) {
      const c = i % 10, r = Math.floor(i / 10);
      cells.push(el('rect', { x: 700 + c * 54, y: 230 + r * 54, width: 44, height: 44, rx: 6, fill: i === 44 ? '#ffd873' : '#2d3342' }, pct));
    }
    txt(pct, 960, 830, 'Around 80,000 of 8 million objects can be seen at any one time', { size: 28, weight: 500, anchor: 'middle', fill: '#cfc9bb' });

    // ---- questions ----
    const qs = el('g', {}, world);
    txt(qs, 960, 230, 'THINK ABOUT IT', { size: 24, weight: 600, anchor: 'middle', fill: '#d8b35a', ls: '0.35em' });
    const qcard = (y, q) => {
      const g = el('g', {}, qs);
      el('rect', { x: 360, y, width: 1200, height: 170, rx: 16, fill: 'rgba(30,34,46,0.9)', stroke: '#d8b35a', 'stroke-width': 2 }, g);
      txt(g, 960, y + 105, q, { size: 56, weight: 600, family: "'Cormorant Garamond'", anchor: 'middle', fill: '#fff' });
      return g;
    };
    const q1 = qcard(300, 'Whose stories are being told?');
    const q2 = qcard(520, 'Where should these objects belong?');

    // ---- end title ----
    const fin = el('g', {}, world);
    txt(fin, 960, 400, 'Thanks for joining the tour', { size: 96, weight: 600, family: "'Cormorant Garamond'", anchor: 'middle', fill: '#fff' });
    el('line', { x1: 800, y1: 450, x2: 1120, y2: 450, stroke: '#d8b35a', 'stroke-width': 3 }, fin);
    txt(fin, 960, 520, 'The British Museum · Great Russell Street, London WC1B 3DG', { size: 30, weight: 500, anchor: 'middle', fill: '#e9d49a' });
    txt(fin, 960, 570, 'Free entry to the permanent collection', { size: 26, weight: 400, anchor: 'middle', fill: '#cfc9bb' });
    const credits = el('g', {}, world);
    txt(credits, 960, 900, 'Illustrations are artistic impressions and are not to scale. Floor plans are simplified.', { size: 22, weight: 400, anchor: 'middle', fill: '#8f8a7d' });
    txt(credits, 960, 936, 'Narration: synthetic voice (Kokoro TTS). Music: generated for this video.', { size: 22, weight: 400, anchor: 'middle', fill: '#8f8a7d' });
    const black = el('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: '#000' }, svg);

    return t => {
      const c1 = S.cue(1), c2 = S.cue(2), c3 = S.cue(3);
      const gv = 1 - prog(t, c1 - 0.3, c1 + 0.5);
      setOp(grid, gv);
      tiles.forEach((tl, i) => {
        const a = 0.2 + i * 0.22, p = prog(t, a, a + 0.6, ease.out);
        setOp(tl.g, p);
        const s = 0.85 + 0.15 * p;
        setT(tl.g, `translate(${tl.cx} ${tl.cy}) scale(${s}) translate(${-tl.cx} ${-tl.cy})`);
      });
      setOp(pct, win(t, c1 - 0.1, c2 + 0.1, 0.5));
      cells.forEach((c, i) => setOp(c, prog(t, c1 + 0.2 + i * 0.012, c1 + 0.4 + i * 0.012)));
      cells[44].setAttribute('transform', `translate(${722 + 4 * 54} ${252 + 4 * 54}) scale(${1 + 0.12 * Math.sin(t * 4)}) translate(${-(722 + 4 * 54)} ${-(252 + 4 * 54)})`);
      setOp(qs, win(t, c2 - 0.1, c3 + 0.1, 0.5));
      const cq = S.at('whose stories'); setOp(q1, prog(t, cq - 0.1, cq + 0.5)); setOp(q2, prog(t, cq + 1.7, cq + 2.3));
      setOp(fin, prog(t, c3 - 0.1, c3 + 0.8));
      setOp(credits, prog(t, S.lineEnd(3) + 0.5, S.lineEnd(3) + 1.3));
      setOp(black, prog(t, S.dur - 1.6, S.dur - 0.1, ease.sine));
      setT(world, `translate(960 540) scale(${1.02 - 0.02 * prog(t, 0, S.dur, ease.linear)}) translate(-960 -540)`);
    };
  },
};
