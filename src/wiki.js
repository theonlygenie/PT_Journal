// Keeps the wiki spawn tables fresh while the page is open (the browser version of the desktop app's wiki-updater.js).
// It fetches the community wiki's public data file (one GET of https://platinumtogether.online/wiki/data/wiki.json, nothing about the player
// is sent), rebuilds the tables, and keeps them in browser storage. It checks soon after the page opens, every 6 hours after that, and when the
// game itself has been updated (Platinum.exe changed). A failed or odd-looking download is thrown away; the copy shipped with the site is the fallback.
import { build, looksLikeWiki } from '../shared/spawns-build.js';
import * as store from './store.js';

const URL_ = 'https://platinumtogether.online/wiki/data/wiki.json';
const EVERY = 6 * 3600e3, RETRY = 3600e3, MAX_BYTES = 25 * 1024 * 1024, TIMEOUT = 45e3;
const valid = t => t && t.places && typeof t.places === 'object' && Object.keys(t.places).length > 20 && Array.isArray(t.rare) && t.evo && t.matched >= 300;   // tables without a good name match (or from before this was recorded) are thrown away

export async function createWiki({ shipped, getNames, getOn, getSig, onUpdated }) {
  let state = (await store.get('kv', 'wikiState')) || {}, mine = await store.get('kv', 'wikiTables'), busy = false;
  if (!valid(mine)) mine = null;
  const save = () => store.set('kv', 'wikiState', state);
  const tables = () => (mine ? { t: mine, shipped: false } : { t: shipped, shipped: true });
  const status = () => {
    const { t, shipped: isShipped } = tables();
    return { on: getOn(), shipped: isShipped, version: t ? t.wikiVersion || '' : '', source: t ? t.wikiSource || '' : '', built: t ? t.built || '' : '', checkedAt: state.checkedAt || 0, result: state.result || '', error: state.error || '', busy };
  };

  async function run(opts) {
    if (busy) return;
    busy = true;
    const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), TIMEOUT);
    try {
      const res = await fetch(URL_, { signal: ctl.signal, credentials: 'omit', cache: 'no-store' });
      if (!res.ok) throw new Error(`the wiki answered ${res.status}`);
      const len = +res.headers.get('content-length') || 0;
      if (len > MAX_BYTES) throw new Error('the file is larger than expected');
      const text = await res.text();
      if (text.length > MAX_BYTES) throw new Error('the file is larger than expected');
      const W = JSON.parse(text);
      if (!looksLikeWiki(W)) throw new Error('the file does not look like the wiki data');
      const cur = tables();
      if (!opts.force && !cur.shipped && cur.t.wikiSource === String(W.source || '') && cur.t.wikiVersion === String(W.version || '')) {
        state.checkedAt = Date.now(); state.result = 'Up to date'; state.error = ''; return;
      }
      const { out, missing } = build(W, getNames());
      const places = Object.keys(out.places).length, before = cur.t ? Object.keys(cur.t.places).length : 0;
      if (places < 20 || (before && places < before * 0.8)) throw new Error('the new tables look incomplete, so they were not used');
      mine = out; await store.set('kv', 'wikiTables', out);
      state.checkedAt = Date.now(); state.error = '';
      state.result = `Updated to v${out.wikiVersion}${missing.length ? ` (${missing.length} species not matched by name)` : ''}`;
      try { onUpdated(out); } catch {}
    } catch (e) {
      state.lastTry = Date.now();
      state.error = e && e.name === 'AbortError' ? 'The wiki did not answer in time' : String((e && e.message) || e).slice(0, 160);
      state.result = 'Could not update, using the last good data';
    } finally { clearTimeout(timer); busy = false; save(); }
  }
  async function check(opts = {}) { await run(opts); return status(); }

  // called after every refresh: cheap unless a check is due
  function tick() {
    if (!getOn() || busy) return;
    const sig = getSig(), changed = sig && state.gameSig && sig !== state.gameSig;
    if (sig && sig !== state.gameSig) { state.gameSig = sig; save(); }
    const now = Date.now(), due = !state.checkedAt || now - state.checkedAt > EVERY;
    const retryOk = !state.lastTry || now - state.lastTry > RETRY || (state.checkedAt || 0) > state.lastTry;
    if (changed || (due && retryOk)) run({ force: !!changed });
  }
  return { tables, status, check, tick };
}
