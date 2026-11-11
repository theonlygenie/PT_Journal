// window.stats for the browser: the same functions the desktop app's preload.js gives the pages, answered here instead of by Electron's main process.
// Everything is READ-ONLY with respect to the game folder (the browser is only ever given "read" access, and there is no write call anywhere).
// What the page keeps (settings, memory of released Pokémon and items, labels, optional log copy) goes in this browser's own storage.
import { load } from '../shared/parser.js';
import * as store from './store.js';
import * as fsShim from './fs-shim.js';
import { Vfs, HandleBackend, FileListBackend } from './vfs.js';
import { createWiki } from './wiki.js';
import { cardFromSave } from './card.js';
import baseNames from '../shared/species.json';
import extraNames from '../shared/species-extra.json';
import shippedTables from '../shared/data/wiki-spawns.json';

const supported = typeof window.showDirectoryPicker === 'function';
let settings = {}, released = null, itemsLed = {}, custom = {}, speciesNames = {}, spawnTables = null, snapLast = null, wiki = null;
let lastErrors = [];   // files the browser could not read in the newest refresh
let lastNote = '', lastCard = {};   // lastCard: the newest good world-card.ini per world (the game rewrites that file, and it can be caught half-written)
let backend = null, vfs = null, handle = null, handleName = '', needsPermission = false, inflight = null, initP = null;
let connected, connect_;   // resolves when a folder is connected (the icon sheets wait for it)
const resetConnected = () => { connected = new Promise(r => { connect_ = r; }); };
resetConnected();
const imgCache = {};

const saveSettings = () => store.set('kv', 'settings', settings);
const isLogName = f => /^session-[\w-]+\.log$/.test(f);

async function init() {
  if (initP) return initP;
  initP = (async () => {
    settings = (await store.get('kv', 'settings')) || {};
    released = (await store.get('kv', 'released')) || null;
    itemsLed = (await store.get('kv', 'items')) || {};
    custom = (await store.get('kv', 'names')) || {};
    speciesNames = { ...baseNames, ...extraNames };
    const shipped = shippedTables;
    wiki = await createWiki({
      shipped, getNames: () => ({ ...speciesNames, ...custom }), getOn: () => settings.wikiAuto !== false,
      getSig: () => { const s = vfs && vfs.c.get('/game/Platinum.exe'); return s && s.stat ? `${s.stat.size}:${Math.round(s.stat.mtimeMs)}` : ''; },
      onUpdated: t => { spawnTables = t; },
    });
    spawnTables = wiki.tables().t;
    // the folder remembered from an earlier visit
    handle = (await store.get('kv', 'handle')) || null;
    if (handle) {
      handleName = handle.name || '';
      let perm = 'prompt'; try { perm = await handle.queryPermission({ mode: 'read' }); } catch {}
      if (perm === 'granted') useHandle(handle); else needsPermission = true;
    }
  })();
  return initP;
}
function useBackend(b) {
  backend = b; vfs = new Vfs(b); fsShim.attach(vfs); needsPermission = false;
  for (const k of Object.keys(imgCache)) delete imgCache[k];
  connect_();
}
const useHandle = h => { handle = h; handleName = h.name || ''; useBackend(new HandleBackend(h)); };

function notConnected(note) {
  return { gameDir: handleName || '', sessions: [], worlds: [], missing: true, found: {}, web: { state: needsPermission ? 'needs-permission' : 'no-folder', folder: handleName, supported, note: note || lastNote || '' } };
}

// ---- one refresh: run the parser in rounds until it has everything it asked for, then do the bookkeeping the desktop app's main process does ----
async function snapshot() {
  await vfs.revalidate();
  vfs.mount('/__archive/logs', settings.archive ? await archivedLogs() : null);
  let data = null;
  for (let i = 0; i < 12; i++) {
    vfs.beginPass();
    data = load('/game', settings.archive ? '/__archive/logs' : null);
    try { fsShim.statSync('/game/Platinum.exe'); } catch {}
    try { fsShim.readFileSync('/game/world-name.txt', 'utf8'); } catch {}
    if (!vfs.hasMisses()) break;
    await vfs.settle();
  }
  lastErrors = vfs.errors.splice(0);
  if (lastErrors.length) console.warn('PT Journal: some files could not be read', lastErrors);
  lastNote = '';
  return finish(data);
}
const activeWorld = () => { try { return fsShim.readFileSync('/game/world-name.txt', 'utf8').trim().slice(0, 60); } catch { return ''; } };

async function finish(data) {
  if (data.missing) return { ...data, gameDir: backend.name, web: { state: 'wrong-folder', folder: backend.name, supported } };
  if (settings.archive) await archiveLogs();
  const tags = settings.tags || (settings.tags = {});
  const live = data.sessions.reduce((a, s) => (!a || s.mtimeMs > a.mtimeMs ? s : a), null);
  const world = activeWorld();
  if (live && world && !tags[live.file] && Date.now() - live.mtimeMs < 120000) { tags[live.file] = world; saveSettings(); }
  const rel = trackReleased(data), itemsEver = trackItems(data);
  if (settings.snapshots) await snapshotArchive(data);
  if (wiki) wiki.tick();
  if (data.worldCard) lastCard[world] = data.worldCard;
  else data.worldCard = lastCard[world] || cardFromSave(data, world);
  return { ...data, gameDir: backend.name, tags, activeWorld: world, speciesNames: { ...speciesNames, ...custom }, customNames: custom, released: rel, itemsEver, spawns: spawnTables, web: { state: 'ok', folder: backend.name, supported, errors: lastErrors } };
}

// ---- optional copy of the session logs, in this browser's storage ----
async function archivedLogs() {
  const rows = await store.all('logs'), out = {};
  for (const [name, v] of Object.entries(rows)) out[name] = { data: v.data, mtimeMs: v.mtimeMs, size: v.size };
  return out;
}
async function archiveLogs() {
  const meta = (await store.get('kv', 'logmeta')) || {};
  for (const [name, e] of vfs.loadedFiles('/game/logs')) {
    if (!isLogName(name) || (meta[name] && meta[name] >= e.stat.size)) continue;
    await store.set('logs', name, { data: new Uint8Array(e.data), mtimeMs: e.stat.mtimeMs, size: e.stat.size });
    meta[name] = e.stat.size;
  }
  await store.set('kv', 'logmeta', meta);
}
const monRow = m => [m.pid, m.species, m.nick || '', m.loc, m.ball, m.shiny ? 1 : 0, m.nature, m.iv, m.ev, m.moves, m.item, m.mlv];
const hash = s => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(16) + s.length.toString(16); };
async function snapshotArchive(data) {
  try {
    const worlds = {};
    for (const name of Object.keys(data.dex || {})) {
      const ow = (data.owned || {})[name], pa = (data.party || {})[name] || [];
      worlds[name] = { seen: data.dex[name].seen, caught: data.dex[name].caught, boxes: ow ? ow.mons.map(monRow) : [], party: pa.map(m => [...monRow(m), m.level]), bag: (data.bag || {})[name] || {} };
    }
    const body = JSON.stringify(worlds), h = hash(body);
    const list = (await store.get('kv', 'snapshots')) || [];
    if (!snapLast) { snapLast = { hash: '', t: 0 }; try { const last = JSON.parse(list[list.length - 1]); snapLast = { hash: last.h, t: Date.parse(last.t) || 0 }; } catch {} }
    if (h !== snapLast.hash && Date.now() - snapLast.t >= 600000 && Object.keys(worlds).length) {
      list.push(JSON.stringify({ t: new Date().toISOString(), h, worlds }));
      await store.set('kv', 'snapshots', list.slice(-200));   // a browser's storage is smaller than a disk, so only the newest 200 are kept
      snapLast = { hash: h, t: Date.now() };
    }
  } catch {}
}
async function archiveInfo() {
  const meta = (await store.get('kv', 'logmeta')) || {}, snaps = (await store.get('kv', 'snapshots')) || [];
  return { on: !!settings.archive, count: Object.keys(meta).length, bytes: Object.values(meta).reduce((a, b) => a + b, 0), snapsOn: !!settings.snapshots, snaps: snaps.length, snapBytes: snaps.reduce((a, s) => a + s.length, 0) };
}

// ---- remembering which Pokémon and items have been seen (the same rules as the desktop app) ----
function trackReleased(data) {
  let led = released, dirty = false;
  if (!led || typeof led !== 'object' || !led.worlds) { led = released = { since: new Date().toISOString(), worlds: {} }; dirty = true; }
  const now = Date.now(), out = {};
  for (const [name, ow] of Object.entries(data.owned || {})) {
    if (!ow || !Array.isArray(ow.all) || !ow.mons.length) continue;
    const present = new Set(ow.all), info = m => ({ s: m.species, n: m.nick || '', l: m.loc, b: m.ball, sh: m.shiny ? 1 : 0 });
    let W = led.worlds[name];
    if (!W) {
      W = led.worlds[name] = { tracked: {}, missing: {}, left: [] };
      for (const m of ow.mons) W.tracked[m.pid] = info(m);
      dirty = true;
    } else {
      for (const m of ow.mons) {
        const was = W.tracked[m.pid], now2 = info(m);
        if (!was || was.s !== now2.s || was.n !== now2.n) { W.tracked[m.pid] = now2; dirty = true; }
        if (W.missing[m.pid]) { delete W.missing[m.pid]; dirty = true; }
        const back = W.left.findIndex(x => x.pid === m.pid);
        if (back >= 0) { W.left.splice(back, 1); dirty = true; }
      }
      const tracked = Object.keys(W.tracked), absent = tracked.filter(p => !present.has(Number(p)));
      if (tracked.length >= 10 && absent.length > tracked.length / 2) {
        if (Object.keys(W.missing).length) { W.missing = {}; dirty = true; }
      } else {
        for (const p of tracked) {
          if (present.has(Number(p))) { if (W.missing[p]) { delete W.missing[p]; dirty = true; } continue; }
          if (!W.missing[p]) { W.missing[p] = now; dirty = true; }
          else if (now - W.missing[p] >= 20000) {
            W.left.push({ pid: Number(p), species: W.tracked[p].s, nick: W.tracked[p].n, loc: W.tracked[p].l, ball: W.tracked[p].b, shiny: W.tracked[p].sh, when: new Date().toISOString() });
            delete W.tracked[p]; delete W.missing[p]; dirty = true;
          }
        }
      }
    }
    out[name] = { count: W.left.length, left: W.left.slice(-300).reverse() };
  }
  if (dirty) store.set('kv', 'released', led);
  return { since: led.since, worlds: out };
}
function trackItems(data) {
  let dirty = false;
  const now = new Date().toISOString();
  for (const name of Object.keys(data.bag || {})) {
    const have = {};
    for (const list of Object.values(data.bag[name])) for (const [id, q] of list) have[id] = (have[id] || 0) + q;
    const ow = (data.owned || {})[name], pa = (data.party || {})[name] || [];
    for (const m of [...(ow ? ow.mons : []), ...pa]) if (m.item) have[m.item] = (have[m.item] || 0) + 1;
    const W = itemsLed[name] ||= {};
    for (const [id, q] of Object.entries(have)) {
      const cur = W[id];
      if (!cur) { W[id] = [q, now]; dirty = true; } else if (q > cur[0]) { cur[0] = q; dirty = true; }
    }
  }
  if (dirty) store.set('kv', 'items', itemsLed);
  return itemsLed;
}

// ---- images from the game folder (read, never copied), handed to the page as data URLs ----
async function dataUrl(name) {
  await connected;
  if (name in imgCache) return imgCache[name];
  let out = null;
  try {
    const f = await vfs.readBlob([name]);
    if (f) {
      const blob = f instanceof Blob ? f : new Blob([await f.arrayBuffer()], { type: 'image/png' });
      out = await new Promise(res => { const r = new FileReader(); r.onload = () => res(String(r.result).replace(/^data:[^;,]*/, 'data:image/png')); r.onerror = () => res(null); r.readAsDataURL(blob); });
    }
  } catch {}
  return (imgCache[name] = out);
}

// ---- choosing the folder ----
function pickViaInput() {
  return new Promise(resolve => {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.webkitdirectory = true; inp.multiple = true; inp.style.display = 'none';
    document.body.append(inp);
    inp.onchange = () => { const l = [...inp.files]; inp.remove(); resolve(l); };
    inp.oncancel = () => { inp.remove(); resolve(null); };
    inp.click();
  });
}
function useFiles(list, name) {
  useBackend(new FileListBackend(list, name));
  handle = null; handleName = name;
}

const api = {
  web: true, supported,
  async load() {
    if (inflight) return inflight;
    inflight = (async () => {
      await init();
      if (!backend) return notConnected();
      if (backend.kind === 'handle') {
        let perm = 'denied'; try { perm = await handle.queryPermission({ mode: 'read' }); } catch {}
        if (perm !== 'granted') { backend = null; resetConnected(); needsPermission = true; return notConnected(); }
      }
      try { return await snapshot(); }
      catch (e) {
        console.warn('PT Journal: could not read the folder', e);
        const wasHandle = backend.kind === 'handle'; backend = null; resetConnected(); needsPermission = wasHandle;
        lastNote = 'Could not read the folder: ' + String((e && e.message) || e);
        return notConnected(lastNote);
      }
    })().finally(() => { inflight = null; });
    return inflight;
  },
  // Chrome and Edge: the folder picker, remembered for next time. Other browsers: a plain "choose a folder" box (not remembered).
  async pick() {
    if (supported) {
      let h = null;
      try { h = await window.showDirectoryPicker({ id: 'pt-journal', mode: 'read' }); } catch (e) { if (e && e.name !== 'AbortError') console.warn(e); }
      await init();
      if (inflight) await inflight.catch(() => {});
      if (h) { await store.set('kv', 'handle', h); useHandle(h); }
    } else {
      const files = await pickViaInput();
      await init();
      if (files && files.length) {
        const top = (files[0].webkitRelativePath || '').split('/')[0] || 'folder';
        useFiles(files.map(f => ({ path: (f.webkitRelativePath || f.name).split('/').slice(1).join('/'), file: f })).filter(x => x.path), top);
      }
    }
    return api.load();
  },
  // the folder is remembered but the browser wants a click before it will read it again
  async reconnect() {
    let perm = 'denied', why = '';
    const t0 = performance.now();
    if (handle) { try { perm = await handle.requestPermission({ mode: 'read' }); } catch (e) { why = String((e && e.message) || e); } }
    const quick = performance.now() - t0 < 600;   // an answer that quick means no permission box was shown
    await init();
    if (inflight) await inflight.catch(() => {});
    if (perm === 'granted') useHandle(handle);
    else if (supported && quick) {
      // the browser showed no permission box, so open the folder picker instead (in the same place), which always shows
      try {
        const h = await window.showDirectoryPicker({ id: 'pt-journal', mode: 'read', startIn: handle || undefined });
        await store.set('kv', 'handle', h); useHandle(h);
      } catch (e) { if (!e || e.name !== 'AbortError') lastNote = 'Could not open the folder box: ' + String((e && e.message) || e); }
    } else lastNote = 'The browser did not give permission' + (perm ? ' (it said: ' + perm + ')' : '') + (why ? '. ' + why : '') + '. Press Reconnect again and choose Allow, or choose the folder again.';
    return api.load();
  },
  async tag(file, world) { await init(); if (typeof file !== 'string' || !isLogName(file)) return; settings.tags = settings.tags || {}; if (typeof world === 'string' && world && world.length <= 60) settings.tags[file] = world; else delete settings.tags[file]; saveSettings(); },
  async tagMany(files, world) { await init(); if (!Array.isArray(files) || typeof world !== 'string' || !world || world.length > 60) return; settings.tags = settings.tags || {}; for (const f of files) if (typeof f === 'string' && isLogName(f)) settings.tags[f] = world; saveSettings(); },
  async archiveGet() { await init(); return archiveInfo(); },
  async archiveSet(which, on) { await init(); settings[which === 'snapshots' ? 'snapshots' : 'archive'] = on === true; await saveSettings(); return archiveInfo(); },
  async wikiGet() { await init(); return wiki.status(); },
  async wikiCheck() { await init(); return wiki.check({ force: true }); },
  async wikiSet(on) { await init(); settings.wikiAuto = on === true; await saveSettings(); return wiki.status(); },
  icons: () => dataUrl('kit-mon-icons.png'),
  itemIcons: () => dataUrl('kit-item-icons.png'),
  shinyFronts: () => dataUrl('kit-mon-front-shiny.png'),
  townMap: () => dataUrl('town-map.png'),
  async mapLoad() { await init(); return (await store.get('kv', 'maplabels')) || null; },
  async mapSave(assign) {
    if (!assign || typeof assign !== 'object') return;
    const clean = {};
    for (const [key, place] of Object.entries(assign).slice(0, 600)) if (/^\d{1,3},\d{1,3}$/.test(key) && Number.isInteger(place) && place >= 0 && place < 10000) clean[key] = place;
    await store.set('kv', 'maplabels', { assign: clean });
  },
  async nameSpecies(id, name) {
    await init();
    if (!/^\d{1,4}$/.test(String(id)) || +id <= 493 || typeof name !== 'string') return;
    const clean = name.replace(/[\u0000-\u001f]/g, '').trim().slice(0, 40);
    if (clean) custom[String(id)] = clean; else delete custom[String(id)];
    await store.set('kv', 'names', custom);
  },
  // for finding out why a file will not read: await stats.probe('world-card.ini') in the browser console
  async probe(name) {
    await init();
    if (!backend) return 'not connected';
    try {
      const f = await backend.file(String(name).split('/'));
      if (!f) return 'not found';
      const ab = await f.arrayBuffer();
      return { size: f.size, modified: new Date(f.lastModified).toISOString(), bytesRead: ab.byteLength, start: new TextDecoder().decode(ab.slice(0, 300)) };
    } catch (e) { return 'error: ' + (e && e.name) + ': ' + (e && e.message); }
  },
  // for testing only: connect a folder handle directly (for example one that refuses some names, like Chrome does)
  _connectHandle(h) { useHandle(h); },
  // for testing only: connect a folder given as { path, file } entries without the picker
  _connectFiles(list, name) { useFiles(list, name || 'Game'); },
};
export default api;
