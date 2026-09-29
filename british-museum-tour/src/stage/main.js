// Scene registry and the frame renderer called by the capture script.
const DOOR_T = 2.0; // seconds spent walking through a doorway at the start of a gallery

let TL = null;
const built = [];

window.init = function (timeline) {
  TL = timeline;
  HUD.init();
  const root = document.getElementById('scenes');
  timeline.scenes.forEach((s, i) => {
    const def = Scenes[s.id];
    if (!def) throw new Error('missing scene ' + s.id);
    const svg = el('svg', { viewBox: '0 0 1920 1080', width: 1920, height: 1080 }, root);
    const defs = el('defs', {}, svg);
    commonDefs(defs);
    const at = str => { const c = s.captions.find(c => c.text.includes(str)); if (!c) throw new Error(`no caption "${str}" in ${s.id}`); return c.start; };
    const ctx = { ...s, def, svg, defs, at, cue: k => s.lines[k].start, lineEnd: k => s.lines[k].end };
    const update = def.build(svg, defs, ctx);
    built.push({ ...ctx, update });
  });
  return timeline.total;
};

function sceneAt(T) {
  for (let i = built.length - 1; i >= 0; i--) if (T >= built[i].start) return i;
  return 0;
}

window.renderFrame = function (T) {
  const i = sceneAt(T);
  const cur = built[i];
  const t = T - cur.start;
  built.forEach((b, k) => { if (k !== i && k !== i - 1) b.svg.style.display = 'none'; });

  cur.svg.style.display = 'block';
  cur.svg.style.zIndex = 1;
  cur.update(t);

  const useDoor = i > 0 && !cur.def.noDoor && t < DOOR_T;
  const prev = built[i - 1];
  if (i > 0 && t < DOOR_T * 0.6 && prev) {
    const a = useDoor ? prog(t, 0, 0.55, ease.sine) : prog(t, 0, 1.0, ease.sine);
    prev.svg.style.display = a < 1 ? 'block' : 'none';
    prev.svg.style.zIndex = 2;
    prev.svg.style.opacity = 1 - a;
    if (a < 1) prev.update(T - prev.start);
  } else if (prev) {
    prev.svg.style.display = 'none';
  }

  const door = HUD.door;
  if (useDoor) {
    HUD.setDoorText(cur.def.doorRoom || cur.room, cur.def.doorGallery || cur.gallery);
    door.style.display = 'block';
    door.style.zIndex = 3;
    const a = prog(t, 0, 0.55, ease.sine);
    const push = prog(t, 0.6, DOOR_T, ease.in);
    door.style.opacity = a * (1 - prog(t, DOOR_T - 0.25, DOOR_T, ease.linear));
    door.style.transformOrigin = '960px 660px';
    door.style.transform = `scale(${1 + push * 4.5})`;
    // the gallery beyond the door settles as we walk in
    const s = 1.18 - 0.18 * prog(t, 0.4, DOOR_T, ease.out);
    cur.svg.style.transformOrigin = '960px 620px';
    cur.svg.style.transform = `scale(${s})`;
  } else {
    door.style.display = 'none';
    cur.svg.style.transform = '';
  }
  cur.svg.style.opacity = 1;
  HUD.update(cur, t);
};

