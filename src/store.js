// Everything this page keeps lives in the browser's own storage (IndexedDB), on the player's PC. Nothing is sent anywhere.
// kv: the remembered game folder, settings, the released / items memory, custom names, map labels, snapshots, downloaded wiki tables.
// logs: an optional copy of the session logs (off until switched on), so the stats survive the game clearing its logs.
const NAME = 'pt-journal';
let dbp = null;
function open() {
  if (!dbp) dbp = new Promise((ok, no) => {
    const r = indexedDB.open(NAME, 1);
    r.onupgradeneeded = () => { const db = r.result; db.createObjectStore('kv'); db.createObjectStore('logs'); };
    r.onsuccess = () => ok(r.result);
    r.onerror = () => no(r.error);
  });
  return dbp;
}
const run = async (store, mode, fn) => {
  const db = await open();
  return new Promise((ok, no) => {
    const tx = db.transaction(store, mode), s = tx.objectStore(store), req = fn(s);
    tx.oncomplete = () => ok(req ? req.result : undefined);
    tx.onerror = () => no(tx.error); tx.onabort = () => no(tx.error);
  });
};
export const get = async (store, key) => { try { return await run(store, 'readonly', s => s.get(key)); } catch { return undefined; } };
export const set = (store, key, value) => run(store, 'readwrite', s => s.put(value, key)).catch(() => {});
export const del = (store, key) => run(store, 'readwrite', s => s.delete(key)).catch(() => {});
export const all = async store => {
  try {
    const db = await open();
    return await new Promise((ok, no) => {
      const out = {}, tx = db.transaction(store, 'readonly'), req = tx.objectStore(store).openCursor();
      req.onsuccess = () => { const c = req.result; if (c) { out[c.key] = c.value; c.continue(); } else ok(out); };
      req.onerror = () => no(req.error);
    });
  } catch { return {}; }
};
