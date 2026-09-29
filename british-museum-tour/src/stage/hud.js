// Heads-up display: stop badge, mini floor plan, fact cards, captions and the
// doorway "walk-through" transition between galleries.
const HUD = (() => {
  const TOTAL_STOPS = 9;
  const badge = document.getElementById('badge');
  const mm = document.getElementById('minimap');
  const factsBox = document.getElementById('facts');
  const cap = document.querySelector('#caption span');
  const door = document.getElementById('door');

  // ---------- mini floor plan (simplified, not to scale) ----------
  const PLAN = {
    ground: {
      label: 'Ground floor',
      rooms: [
        { id: 'entrance', x: 200, y: 257, name: 'Entrance' },
        { id: 'greatcourt', x: 200, y: 196, name: 'Great Court' },
        { id: 'rosetta', x: 116, y: 150, name: 'Room 4' },
        { id: 'lamassu', x: 76, y: 90, name: 'Room 10' },
        { id: 'parthenon', x: 40, y: 168, name: 'Room 18' },
        { id: 'moai', x: 200, y: 76, name: 'Room 24' },
      ],
      route: {
        greatcourt: [[200, 257], [200, 196]],
        rosetta: [[200, 196], [150, 196], [116, 150]],
        lamassu: [[116, 150], [116, 110], [76, 90]],
        parthenon: [[76, 90], [76, 168], [40, 168]],
        moai: [[40, 168], [76, 168], [116, 200], [150, 200], [150, 100], [200, 76]],
      },
    },
    upper: {
      label: 'Upper floor',
      rooms: [
        { id: 'stairs', x: 230, y: 96, name: 'Stairs' },
        { id: 'ur', x: 166, y: 76, name: 'Room 56' },
        { id: 'mummies', x: 116, y: 124, name: 'Rooms 62–63' },
        { id: 'suttonhoo', x: 285, y: 200, name: 'Room 41' },
        { id: 'chessmen', x: 285, y: 150, name: 'Room 40' },
      ],
      route: {
        ur: [[230, 96], [230, 76], [166, 76]],
        mummies: [[166, 76], [116, 76], [116, 124]],
        suttonhoo: [[116, 124], [116, 222], [285, 222], [285, 200]],
        chessmen: [[285, 200], [285, 150]],
      },
    },
  };
  const ORDER = ['greatcourt', 'rosetta', 'lamassu', 'parthenon', 'moai', 'ur', 'mummies', 'suttonhoo', 'chessmen'];

  function buildPlan(floor) {
    const g = el('g', { display: 'none' }, mm);
    const P = PLAN[floor];
    el('rect', { x: 0, y: 0, width: 380, height: 300, rx: 14, fill: 'rgba(16,18,25,0.86)', stroke: 'rgba(216,179,90,0.5)', 'stroke-width': 1.5 }, g);
    txt(g, 22, 34, P.label.toUpperCase(), { size: 14, weight: 600, fill: '#d8b35a', ls: '0.2em' });
    txt(g, 358, 34, 'Simplified plan', { size: 13, weight: 400, fill: '#9c978c', anchor: 'end' });
    const b = el('g', { fill: '#2c2f3a', stroke: '#6f6a5e', 'stroke-width': 1.5 }, g);
    // building blocks
    el('rect', { x: 55, y: 58, width: 265, height: 180 }, b);       // main quadrangle + west wing
    el('rect', { x: 22, y: 150, width: 40, height: 34 }, b);         // Duveen gallery (Room 18)
    el('rect', { x: 80, y: 232, width: 240, height: 14 }, b);        // south colonnade
    el('rect', { x: 140, y: 88, width: 120, height: 128, fill: '#3a3d49' }, g); // Great Court
    if (floor === 'ground') {
      el('circle', { cx: 200, cy: 146, r: 30, fill: '#4a4d5a', stroke: '#8a8577', 'stroke-width': 1.5 }, g);
      txt(g, 200, 150, 'Reading Room', { size: 10, fill: '#c9c3b5', anchor: 'middle' });
    } else {
      txt(g, 200, 150, 'Great Court below', { size: 11, fill: '#8f8a7d', anchor: 'middle' });
    }
    // columns hint on the front
    for (let i = 0; i < 22; i++) el('rect', { x: 86 + i * 10.6, y: 234, width: 3, height: 10, fill: '#8c8474' }, g);
    const routeDone = el('path', { fill: 'none', stroke: '#d8b35a', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': '1 9' }, g);
    const routeNow = el('path', { fill: 'none', stroke: '#f2d488', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    const dots = {};
    P.rooms.forEach(r => {
      const dg = el('g', {}, g);
      el('circle', { cx: r.x, cy: r.y, r: 6, fill: '#6f6a5e' }, dg);
      dots[r.id] = dg;
    });
    const pulse = el('circle', { r: 10, fill: 'none', stroke: '#f2d488', 'stroke-width': 3 }, g);
    const here = el('circle', { r: 8, fill: '#f2d488' }, g);
    const hereLab = el('g', {}, g);
    const hereRect = el('rect', { height: 26, rx: 6, fill: '#f2d488' }, hereLab);
    const hereTxt = txt(hereLab, 0, 0, '', { size: 15, weight: 700, fill: '#16171c', anchor: 'middle' });
    return { g, P, routeDone, routeNow, pulse, here, hereLab, hereRect, hereTxt };
  }
  const plans = {};

  function pathD(pts) { return pts.map((p, i) => (i ? 'L' : 'M') + p[0] + ' ' + p[1]).join(' '); }

  function updatePlan(sceneId, t) {
    const idx = ORDER.indexOf(sceneId);
    const vis = win(t, 1.9, 8.6, 0.5);
    mm.style.opacity = idx < 0 ? 0 : vis;
    if (idx < 0 || vis <= 0) return;
    const floor = idx >= 5 ? 'upper' : 'ground';
    Object.keys(plans).forEach(k => plans[k].g.setAttribute('display', k === floor ? 'inline' : 'none'));
    const pl = plans[floor];
    const done = [];
    ORDER.slice(0, idx).forEach(id => { if (pl.P.route[id]) done.push(...pl.P.route[id]); });
    pl.routeDone.setAttribute('d', done.length ? pathD(done) : '');
    const now = pl.P.route[sceneId];
    pl.routeNow.setAttribute('d', pathD(now));
    drawOn(pl.routeNow, prog(t, 2.4, 4.6));
    const room = pl.P.rooms.find(r => r.id === sceneId);
    const ph = (t * 1.3) % 1;
    pl.pulse.setAttribute('cx', room.x); pl.pulse.setAttribute('cy', room.y);
    pl.pulse.setAttribute('r', 8 + ph * 16); pl.pulse.setAttribute('opacity', (1 - ph) * prog(t, 4.3, 4.7));
    pl.here.setAttribute('cx', room.x); pl.here.setAttribute('cy', room.y);
    setOp(pl.here, prog(t, 4.3, 4.7));
    pl.hereTxt.textContent = room.name;
    const w = room.name.length * 8.6 + 20;
    let lx = clamp(room.x, 20 + w / 2, 360 - w / 2);
    const ly = room.y > 200 ? room.y - 22 : room.y + 30;
    pl.hereRect.setAttribute('x', lx - w / 2); pl.hereRect.setAttribute('y', ly - 18); pl.hereRect.setAttribute('width', w);
    pl.hereTxt.setAttribute('x', lx); pl.hereTxt.setAttribute('y', ly);
    setOp(pl.hereLab, prog(t, 4.5, 5.0));
  }

  // ---------- doorway overlay ----------
  let doorRoom, doorGallery;
  function buildDoor() {
    const defs = el('defs', {}, door);
    linGrad(defs, 'dwall', [[0, '#4a4640'], [0.7, '#35322d'], [1, '#2a2723']]);
    linGrad(defs, 'dframe', [[0, '#d9cfbb'], [1, '#a99d86']], 0, 0, 1, 0);
    const npat = noisePattern(defs, 'dnoise', { seed: 11, alpha: 0.35, blotch: true });
    // wall with the doorway opening cut out
    const hole = 'M 690 262 H 1230 V 1080 H 690 Z';
    el('path', { d: `M -10 -10 H 1930 V 1090 H -10 Z ${hole}`, 'fill-rule': 'evenodd', fill: 'url(#dwall)' }, door);
    el('path', { d: `M -10 -10 H 1930 V 1090 H -10 Z ${hole}`, 'fill-rule': 'evenodd', fill: npat, opacity: 0.5 }, door);
    // stone courses
    const c = el('g', { stroke: 'rgba(0,0,0,0.18)', 'stroke-width': 2 }, door);
    for (let y = 90; y < 1080; y += 90) {
      el('line', { x1: 0, y1: y, x2: 640, y2: y }, c); el('line', { x1: 1280, y1: y, x2: 1920, y2: y }, c);
    }
    // architrave frame
    const f = el('g', {}, door);
    el('path', { d: 'M 640 1080 V 212 H 1280 V 1080 H 1230 V 262 H 690 V 1080 Z', fill: 'url(#dframe)' }, f);
    el('path', { d: 'M 640 1080 V 212 H 1280 V 1080', fill: 'none', stroke: '#8e826c', 'stroke-width': 3 }, f);
    el('path', { d: 'M 666 1080 V 238 H 1254 V 1080', fill: 'none', stroke: '#b9ad95', 'stroke-width': 2 }, f);
    // cornice above the door
    el('rect', { x: 600, y: 176, width: 720, height: 36, fill: '#cfc4ad' }, f);
    el('rect', { x: 585, y: 160, width: 750, height: 18, fill: '#ddd3be' }, f);
    // floor
    el('rect', { x: 0, y: 1040, width: 640, height: 40, fill: '#1f1c19' }, door);
    el('rect', { x: 1280, y: 1040, width: 640, height: 40, fill: '#1f1c19' }, door);
    // sign
    doorRoom = txt(door, 960, 104, '', { size: 64, weight: 600, family: "'Cormorant Garamond'", anchor: 'middle', fill: '#f0e6cf', ls: '0.12em' });
    doorGallery = txt(door, 960, 144, '', { size: 22, weight: 600, anchor: 'middle', fill: '#d8b35a', ls: '0.3em' });
  }

  // ---------- fact cards ----------
  let cardEls = [];
  function buildFacts(scene) {
    factsBox.innerHTML = '';
    cardEls = (scene.def.facts || []).map(f => {
      const d = document.createElement('div');
      d.className = 'fact';
      const nb = s => s.replace(/ (BC|AD|kg|cm|m|V|II)\b/g, '&nbsp;$1').replace(/\b(AD|BC|c\.) (\d)/g, '$1&nbsp;$2');
      d.innerHTML = `<div class="label">${f.label}</div><div class="value">${nb(f.value)}</div>` + (f.sub ? `<div class="sub">${nb(f.sub)}</div>` : '');
      d.style.opacity = 0;
      factsBox.appendChild(d);
      return { d, f, at: scene.lines[f.line].start + (f.dt || 0.4) };
    });
    // measure heights once
    cardEls.forEach(c => { c.h = c.d.offsetHeight; });
  }
  let factsFor = null;
  function updateFacts(scene, t) {
    if (factsFor !== scene) { buildFacts(scene); factsFor = scene; }
    const out = 1 - prog(t, scene.dur - 0.9, scene.dur - 0.2);
    // which cards are active: appeared, and not pushed out by later ones (max 3)
    const shown = cardEls.filter(c => t >= c.at);
    const maxCards = scene.def.maxFacts || 2;
    let y = 0;
    const active = shown.slice(-maxCards);
    cardEls.forEach(c => {
      const ai = active.indexOf(c);
      if (ai < 0) {
        // fading out if it was recently pushed
        const later = cardEls[cardEls.indexOf(c) + maxCards];
        const gone = later ? prog(t, later.at - 0.05, later.at + 0.35) : 1;
        c.d.style.opacity = t >= c.at ? (1 - gone) * out : 0;
        c.d.style.transform = `translate(${gone * 40}px, ${c.lastY || 0}px)`;
        return;
      }
      const p = prog(t, c.at, c.at + 0.55, ease.out);
      c.targetY = y;
      c.d.style.opacity = p * out;
      c.d.style.transform = `translate(${(1 - p) * 80}px, ${y}px)`;
      c.lastY = y;
      y += c.h + 18;
    });
    // hide cards for scenes that ask (e.g. when an overlay needs the space)
    if (scene.def.hideFacts) { const h = scene.def.hideFacts(t, scene); factsBox.style.opacity = 1 - (h || 0); }
    else factsBox.style.opacity = 1;
  }

  // ---------- captions ----------
  function updateCaption(scene, t) {
    const c = scene.captions.find(c => t >= c.start - 0.05 && t < c.end + 0.2);
    if (!c) { cap.style.opacity = 0; return; }
    if (cap.textContent !== c.text) cap.textContent = c.text;
    cap.style.opacity = Math.min(prog(t, c.start - 0.05, c.start + 0.12, ease.linear), 1 - prog(t, c.end + 0.05, c.end + 0.2, ease.linear));
  }

  // ---------- badge ----------
  function updateBadge(scene, t) {
    const d = scene.def;
    const stopTxt = scene.stop ? `Stop ${scene.stop} of ${TOTAL_STOPS}` : (d.badgeTop || '');
    const roomTxt = scene.room === scene.gallery || !scene.gallery ? scene.room : `${scene.room} · <em>${scene.gallery}</em>`;
    const html = scene.stop ? roomTxt : (d.badgeRoom || roomTxt);
    if (badge.dataset.k !== scene.id) {
      badge.querySelector('.stop').textContent = stopTxt;
      badge.querySelector('.room').innerHTML = html;
      badge.dataset.k = scene.id;
    }
    const a = d.badgeFrom !== undefined ? d.badgeFrom : 2.0;
    const o = win(t, a, scene.dur - 0.3, 0.6);
    badge.style.opacity = o;
    badge.style.transform = `translateY(${(1 - prog(t, a, a + 0.6, ease.out)) * -16}px)`;
  }

  return {
    init() {
      plans.ground = buildPlan('ground');
      plans.upper = buildPlan('upper');
      buildDoor();
    },
    door,
    setDoorText(room, gallery) {
      doorRoom.textContent = room.toUpperCase();
      doorGallery.textContent = gallery.toUpperCase();
    },
    update(scene, t) {
      updateBadge(scene, t);
      updatePlan(scene.id, t);
      updateFacts(scene, t);
      updateCaption(scene, t);
    },
  };
})();
