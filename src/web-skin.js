// The pixel wipe between pages: when you pick another tab, a stepped ellipse in that tab's colour grows over the content (edged in black, with a
// small pixel Poké Ball in the middle), the page changes underneath it, and the ellipse shrinks away to show the new page.
// It only runs the wipe; the page itself is changed by the app's own tab handler. Skipped when reduced motion is on.
(function () {
  'use strict';
  const stage = document.querySelector('.stage'), tabs = document.getElementById('tabs');
  if (!stage || !tabs) return;
  const cv = document.createElement('canvas'); cv.id = 'pxwipe'; cv.setAttribute('aria-hidden', 'true'); stage.appendChild(cv);
  const ctx = cv.getContext('2d'), reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let busy = false;

  const size = () => { const r = stage.getBoundingClientRect(); cv.width = Math.max(1, Math.round(r.width)); cv.height = Math.max(1, Math.round(r.height)); };
  const ball = (() => {   // the little pixel Poké Ball, as a list of cells
    const N = 17, c = 8, cells = [];
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const r = Math.hypot(x - c, y - c);
      if ((r >= 6.6 && r < 8.4) || (y === c && r < 6.6 && r >= 3.7) || (r >= 2.2 && r < 3.7)) cells.push([x, y]);
    }
    return cells;
  })();
  // a dark page colour (the Settings card is almost black) needs a light edge and a light mark, or the wipe disappears into it
  function inks(color) {
    const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(color) || [0, 0, 0, 0], l = (0.299 * m[1] + 0.587 * m[2] + 0.114 * m[3]) / 255;
    return l < 0.3 ? { edge: '#f4e9e1', mark: '#f4e9e1' } : { edge: '#000', mark: '#000' };
  }
  function draw(t, color) {
    const W = cv.width, H = cv.height; ctx.clearRect(0, 0, W, H);
    if (t <= 0) return;
    const ink = inks(color);
    const cell = Math.max(18, Math.ceil(W / 30)), cols = Math.ceil(W / cell), rows = Math.ceil(H / cell), R = t * 1.55;
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const dx = (i + 0.5 - cols / 2) / (cols / 2), dy = (j + 0.5 - rows / 2) / (rows / 2), d = Math.hypot(dx * 0.92, dy);
      if (d < R - 0.1) { ctx.fillStyle = color; ctx.fillRect(i * cell, j * cell, cell + 1, cell + 1); }
      else if (d < R) { ctx.fillStyle = ink.edge; ctx.fillRect(i * cell, j * cell, cell + 1, cell + 1); }
    }
    if (t > 0.55) {   // the mark in the middle, once the colour has covered the page
      const px = Math.max(5, Math.round(Math.min(W, H) / 44)), ox = Math.round(W / 2 - 8.5 * px), oy = Math.round(H / 2 - 8.5 * px);
      ctx.globalAlpha = Math.min(1, (t - 0.55) / 0.3); ctx.fillStyle = ink.mark;
      for (const [x, y] of ball) ctx.fillRect(ox + x * px, oy + y * px, px, px);
      ctx.globalAlpha = 1;
    }
  }
  const ease = k => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
  const run = (from, to, ms, color) => new Promise(done => {
    const t0 = performance.now();
    (function frame(now) {
      const k = Math.min(1, (now - t0) / ms);
      draw(from + (to - from) * ease(k), color);
      if (k < 1) requestAnimationFrame(frame); else done();
    })(t0);
  });

  // capture phase: this runs before the app's own tab handler, which is then called again once the colour has covered the page
  tabs.addEventListener('click', async e => {
    const b = e.target.closest && e.target.closest('button[data-tab]');
    if (!b || e.__pxdone || busy || reduced.matches || b.classList.contains('on')) return;
    e.stopImmediatePropagation(); e.preventDefault();
    busy = true;
    try {
      size();
      const color = getComputedStyle(b).backgroundColor;
      await run(0, 1, 420, color);
      const again = new MouseEvent('click', { bubbles: true, cancelable: true }); again.__pxdone = true;
      b.dispatchEvent(again);
      await new Promise(r => setTimeout(r, 90));
      await run(1, 0, 460, color);
    } finally { ctx.clearRect(0, 0, cv.width, cv.height); busy = false; }
  }, true);
  addEventListener('resize', () => { if (!busy) size(); });
})();

// ================= Settings as a section of its own, and every section opens from its beginning =================
(function () {
  'use strict';
  const stage = document.querySelector('.stage'), tabs = document.getElementById('tabs'), view = document.getElementById('view'), info = document.getElementById('infopanel');
  if (!stage || !tabs || !view || !info || typeof tabView !== 'function') return;

  // the rail card
  const card = document.createElement('button');
  card.dataset.tab = 'settings';
  card.innerHTML = '<i class="no">06</i><i class="arr">↗</i><span class="lab">Settings</span>';
  tabs.appendChild(card);
  if (typeof TAB_COLORS === 'object') TAB_COLORS.settings = ['#161412', '#f4e9e1'];

  // the page: the settings panel's own pieces (they keep their buttons and ids, so everything still works), laid out as cards
  const page = document.createElement('section'); page.id = 'setpage'; page.setAttribute('aria-label', 'Settings');
  view.after(page);
  const colours = { 'Game folder': 'c-yellow', 'Keep my own copy': 'c-lime', 'Wiki data': 'c-flame', 'Theme': 'c-lilac', 'Motion': 'c-grey', 'Read-only': 'c-black', 'Get the app': 'c-navy' };
  const cards = {};
  let cur = null;
  for (const k of [...info.children]) {
    if (k.tagName === 'H4') {
      const name = k.textContent.trim() === 'Connected folder' ? 'Game folder' : k.textContent.trim();
      cur = document.createElement('section'); cur.className = 'tile card setcard ' + (colours[name] || 'c-grey');
      const h = document.createElement('h3'); h.textContent = name; cur.appendChild(h); cards[name] = cur;
    } else if (cur) cur.appendChild(k);
  }
  // choosing another folder lives with the folder, not in the rail
  const pick = document.getElementById('pick');
  if (pick && cards['Game folder']) { pick.textContent = 'Choose another folder'; pick.className = 'pill ghost'; cards['Game folder'].appendChild(pick); }
  // the desktop app
  const dl = document.createElement('section'); dl.className = 'tile card setcard c-navy';
  dl.innerHTML = '<h3>Get the app</h3><p>PT Journal also runs as a free Windows app, with no browser needed. It has the same pages and numbers, and it only ever reads your game.</p>';
  const a = document.createElement('a'); a.className = 'pill'; a.href = '{{RELEASES}}'; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'Download for Windows';
  dl.appendChild(a); cards['Get the app'] = dl;
  const column = names => { const c = document.createElement('div'); c.className = 'setcol'; for (const n of names) if (cards[n]) c.appendChild(cards[n]); return c; };
  page.append(column(['Game folder', 'Keep my own copy', 'Theme']), column(['Get the app', 'Wiki data', 'Motion', 'Read-only']));

  // draw it when the Settings tab is the one chosen
  const plainTabView = tabView;
  tabView = function () { return tab === 'settings' ? document.createElement('div') : plainTabView(); };
  const plainRender = render;
  render = function () {
    plainRender();
    const on = tab === 'settings' && !!data && !data.missing;
    document.body.classList.toggle('on-settings', on);
  };

  // every pick in the rail opens that section from its beginning: its first sub-page, scrolled to the top
  const firstSub = Object.assign({}, subPick);
  tabs.addEventListener('click', e => {
    const b = e.target.closest && e.target.closest('button[data-tab]');
    if (!b) return;
    Object.assign(subPick, firstSub);
    view.dispatchEvent(new Event('pt-reset-scroll')); page.scrollTop = 0;
  }, true);
})();
