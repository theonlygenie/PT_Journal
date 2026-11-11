// The scroll-driven scenes of the landing page. The panel stays in place and its scenes change as you scroll: stepped pixel wipes between colours,
// a headline that slides sideways, a paragraph that is read word by word, cards that rise in. Without this script (or on a small screen, or with
// reduced motion) the page is just the scenes stacked one after another, and nothing here runs.
(function () {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s), $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // ---- pixel art (made from small squares, in the colour the page gives each picture) ----
  function pixelBall(svg, brackets) {
    const N = 17, off = brackets ? 2 : 0, S = N + off * 2, c = (N - 1) / 2, NS = 'http://www.w3.org/2000/svg';
    svg.setAttribute('viewBox', `0 0 ${S} ${S}`);
    const add = (x, y, w = 1, h = 1) => { const r = document.createElementNS(NS, 'rect'); r.setAttribute('x', x); r.setAttribute('y', y); r.setAttribute('width', w); r.setAttribute('height', h); r.setAttribute('fill', 'currentColor'); svg.appendChild(r); };
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const r = Math.hypot(x - c, y - c);
      const ring = r >= 6.6 && r < 8.4, bar = y === c && r < 6.6 && r >= 3.7, mid = r >= 2.2 && r < 3.7;
      if (ring || bar || mid) add(x + off, y + off);
    }
    if (brackets) for (const [x, y, sx, sy] of [[0, 0, 1, 1], [S - 1, 0, -1, 1], [0, S - 1, 1, -1], [S - 1, S - 1, -1, -1]]) {
      add(sx > 0 ? x : x - 2, y + (sy > 0 ? 0 : 0), 3, 1); add(x, sy > 0 ? y : y - 2, 1, 3);
    }
  }
  $$('[data-pixel]').forEach(svg => pixelBall(svg, svg.dataset.pixel === 'ball-brackets'));

  // ---- the scenes, in order. len = how long the scene stays, in screen heights of scrolling ----
  const SCENES = [
    { id: 'hero', len: 0.9, color: '#ffb200' },
    { id: 'approach', len: 1.6, color: '#ff5c38', blob: true },
    { id: 'think', len: 1.8, color: '#ea3737' },
    { id: 'icon', len: 0.8, color: '#ea3737' },
    { id: 'belief', len: 2.2, color: '#ea3737' },
    { id: 'pillars', len: 1.7, color: '#ffb200' },
    { id: 'see', len: 2.2, color: '#ab54f7' },
    { id: 'why', len: 1.9, color: '#00aa3c' },
    { id: 'get', len: 1.3, color: '#ff5c38' },
  ];
  const TRANS = 0.75;      // screen heights of scrolling for a wipe between two colours
  const FADE = 0.3;        // ...and for a plain change between two scenes of the same colour
  const GROUP = { hero: 'hero', approach: 'hero', think: 'hero', icon: 'hero', belief: 'hero', pillars: 'pillars', see: 'see', why: 'see', get: 'get' };

  const root = document.documentElement, under = $('#under'), panel = $('#panel'), stage = $('#stage'), track = $('.track'), wipe = $('#wipe');
  const els = Object.fromEntries(SCENES.map(s => [s.id, $(`[data-scene="${s.id}"]`)]));
  const rcs = $$('.rc[data-go]');

  // the paragraph, split into words
  const read = $('#read');
  const text = read.textContent.trim();
  read.textContent = '';
  const words = text.split(/\s+/).map(w => { const s = document.createElement('span'); s.className = 'w'; s.textContent = w + ' '; read.appendChild(s); return s; });

  const pinnedOK = () => matchMedia('(min-width: 901px)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches && innerHeight >= 520;
  let pinned = false, layout = null, last = '', cur = 0, target = 0, raf = 0;

  // ---- layout: where each scene starts and ends, in pixels of scrolling ----
  function measure() {
    const vh = innerHeight; let y = 0; const out = [];
    SCENES.forEach((s, i) => {
      const dwell = s.len * vh, start = y; y += dwell;
      let tr = 0;
      const wipes = i < SCENES.length - 1 && SCENES[i + 1].color !== s.color && !s.blob;   // a scene with its own blob just fades on into the next
      if (i < SCENES.length - 1) tr = (wipes ? TRANS : FADE) * vh;
      out.push({ ...s, start, dwell, end: y, tr, wipe: wipes });
      y += tr;
    });
    const panelH = vh - 40;
    return { scenes: out, total: y, panelH, top: stage.getBoundingClientRect().top + scrollY };
  }
  function enable() {
    layout = measure();
    track.style.height = Math.round(layout.total + layout.panelH) + 'px';
    root.classList.add('pinned'); pinned = true; last = '';
    const r = panel.getBoundingClientRect(); wipe.width = Math.max(1, Math.round(r.width)); wipe.height = Math.max(1, Math.round(r.height));
    placeGlyph();
  }
  function disable() {
    root.classList.remove('pinned'); pinned = false; track.style.height = '';
    SCENES.forEach(s => els[s.id].classList.remove('show', 'fade'));
    $$('.on', panel).forEach(e => e.classList.remove('on'));
    words.forEach(w => w.classList.add('on'));
    const m = $('.marquee'); m.style.transform = '';
  }

  // the little icon beside the first line of the headline
  function placeGlyph() {
    const g = $('.glyph'), l1 = $('.l1'); if (!g || !l1) return;
    const rg = document.createRange(); rg.selectNodeContents(l1);
    const t = rg.getBoundingClientRect(), sc = els.hero.getBoundingClientRect();
    g.style.left = Math.round(t.right - sc.left + parseFloat(getComputedStyle(l1).fontSize) * 0.16) + 'px';
    g.style.top = Math.round(t.top - sc.top + t.height * 0.78) + 'px';
  }

  // ---- the stepped pixel wipe: new-colour squares spread from the middle, edged in black ----
  const wctx = wipe.getContext('2d');
  function drawWipe(t, color) {
    const W = wipe.width, H = wipe.height; wctx.clearRect(0, 0, W, H);
    if (t <= 0) return;
    const cell = Math.ceil(W / 30), cols = Math.ceil(W / cell), rows = Math.ceil(H / cell), R = t * 1.55;
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const dx = (i + 0.5 - cols / 2) / (cols / 2), dy = (j + 0.5 - rows / 2) / (rows / 2), d = Math.hypot(dx * 0.92, dy);
      if (d < R - 0.1) { wctx.fillStyle = color; wctx.fillRect(i * cell, j * cell, cell + 1, cell + 1); }
      else if (d < R) { wctx.fillStyle = '#000'; wctx.fillRect(i * cell, j * cell, cell + 1, cell + 1); }
    }
  }

  // ---- what each scene does as its own progress t goes from 0 to 1 ----
  function update(id, t) {
    if (id === 'think') {
      const m = $('.marquee'), span = m.scrollWidth - panel.clientWidth * 0.5;
      m.style.transform = `translateX(${Math.round(panel.clientWidth * 0.06 - t * span)}px)`;
    } else if (id === 'belief') {
      const n = Math.round(Math.min(1, t * 1.15) * words.length);
      words.forEach((w, i) => w.classList.toggle('on', i < n));
    } else if (id === 'pillars') {
      $$('.pillars .card').forEach((c, i) => c.classList.toggle('on', t > 0.12 + i * 0.16));
    } else if (id === 'see') {
      $$('.shots .shot').forEach((c, i) => c.classList.toggle('on', t > 0.08 + i * 0.13));
    } else if (id === 'why') {
      $$('.why li').forEach((c, i) => c.classList.toggle('on', t > 0.08 + i * 0.28));
    }
  }

  function show(id) {
    SCENES.forEach(s => { const on = s.id === id; els[s.id].classList.toggle('show', on); });
  }

  // ---- one frame at scroll position y (pixels into the track) ----
  function render(y) {
    if (!pinned) return;
    const L = layout.scenes; y = Math.max(0, Math.min(layout.total, y));
    let i = L.findIndex(s => y < s.end + s.tr);
    if (i < 0) i = L.length - 1;
    const s = L[i];
    let showId = s.id, wipeT = 0, wipeColor = '', progress = Math.min(1, Math.max(0, (y - s.start) / (s.dwell || 1)));
    if (y > s.end && s.tr) {
      const t = (y - s.end) / s.tr, next = L[i + 1];
      if (s.wipe) { wipeT = Math.min(1, t / 0.85); wipeColor = next.color; showId = t >= 0.85 ? next.id : s.id; }
      else showId = t >= 0.5 ? next.id : s.id;
      progress = 1;
    }
    // the pixel blob that grows inside the 'approach' scene
    const blobT = showId === 'approach' ? Math.min(1, Math.max(0, (progress - 0.1) / 0.72)) : 0;
    const key = showId + '|' + wipeT.toFixed(3) + '|' + progress.toFixed(3) + '|' + blobT.toFixed(3);
    if (key === last) return; last = key;
    show(showId);
    // which scene sits on the under layer, so its own words stay above the canvas
    let over = null, canvasT = 0, canvasColor = '';
    if (wipeT > 0 && wipeT < 1) { over = els[s.id]; canvasT = wipeT; canvasColor = wipeColor; }
    else if (showId === 'approach') { over = els.approach; canvasT = blobT; canvasColor = '#ea3737'; }
    SCENES.forEach(x => els[x.id].classList.toggle('wiping', els[x.id] === over));
    if (over) {
      under.className = 'under on ' + [...over.classList].filter(k => /^(yellow|orange|red|purple|green|grid)$/.test(k)).join(' ');
      drawWipe(canvasT, canvasColor);
    } else { under.className = 'under'; wctx.clearRect(0, 0, wipe.width, wipe.height); }
    // the scene on screen gets its own progress; a scene about to be shown starts from zero, a scene just left stays complete
    update(showId, showId === s.id ? progress : 0);
    const g = GROUP[showId]; rcs.forEach(a => a.classList.toggle('on', a.dataset.go === g));
  }

  // ---- scrolling: the picture eases toward where the page is scrolled to ----
  function loop() {
    const d = target - cur;
    cur = Math.abs(d) < 0.4 ? target : cur + d * 0.16;
    render(cur);
    raf = Math.abs(target - cur) > 0.4 ? requestAnimationFrame(loop) : 0;
  }
  function onScroll() {
    if (!pinned) return;
    target = scrollY - layout.top;
    if (!raf) raf = requestAnimationFrame(loop);
  }
  addEventListener('scroll', onScroll, { passive: true });

  // the rail: jump to the start of a scene
  rcs.forEach(a => a.addEventListener('click', e => {
    if (!pinned) return;
    e.preventDefault();
    const id = a.dataset.go === 'hero' ? 'hero' : a.dataset.go, s = layout.scenes.find(x => x.id === id);
    scrollTo({ top: Math.round(layout.top + s.start + (id === 'hero' ? 0 : 6)), behavior: 'smooth' });
  }));
  $('.logo').addEventListener('click', e => { if (!pinned) return; e.preventDefault(); scrollTo({ top: 0, behavior: 'smooth' }); });

  function setup() {
    const want = pinnedOK();
    if (want && !pinned) { enable(); }
    else if (want && pinned) { enable(); }
    else if (!want && pinned) disable();
    if (pinned) { cur = target = scrollY - layout.top; render(cur); }
    else words.forEach(w => w.classList.add('on'));
  }
  let rt = 0; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(setup, 120); });
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(setup);
  setup();

  // for checking the page by hand: window.__landing.at(y) draws the page as it looks at scroll position y
  window.__landing = { at(y) { if (!pinned) return null; cur = target = y; last = ''; render(y); return { total: layout.total, scenes: layout.scenes.map(s => [s.id, Math.round(s.start), Math.round(s.end)]) }; } };
})();
