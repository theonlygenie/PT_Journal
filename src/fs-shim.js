// A small stand-in for Node's "fs", so the desktop app's parser runs unchanged in the browser.
// It answers from an in-memory copy of the game folder (see vfs.js). When something has not been loaded yet it gives a harmless empty answer
// and the loader notes what was asked for, fetches it, and runs the parser again (see stats-api.js); the result of a round that had to
// fetch something is thrown away. READ-ONLY: there is no write function at all.
import { Buffer } from 'buffer';
let vfs = null;
export function attach(v) { vfs = v; }
const err = (code, p) => Object.assign(new Error(code + ": " + p), { code });
export function existsSync(p) { return vfs.exists(p); }
export function readFileSync(p, enc) {
  const b = vfs.read(p);
  if (b === null) throw err('ENOENT', p);
  if (b === undefined) return enc ? '' : Buffer.alloc(0);
  return enc ? b.toString(enc) : b;
}
export function statSync(p) {
  const s = vfs.stat(p);
  if (s === null) throw err('ENOENT', p);
  return s === undefined ? { mtimeMs: 0, size: 0, isFile: () => true } : s;
}
export function readdirSync(p) {
  const l = vfs.list(p);
  if (l === null) throw err('ENOENT', p);
  return l === undefined ? [] : l.slice();
}
export default { existsSync, readFileSync, statSync, readdirSync };
