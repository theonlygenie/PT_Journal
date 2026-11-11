// The game folder as the parser sees it: an in-memory copy, filled on demand from the folder the player picked.
// READ-ONLY. Two ways of reaching the folder (the "backend"):
//   - HandleBackend: a folder handle from the browser's folder picker (Chrome, Edge). Remembered between visits.
//   - FileListBackend: the files from a plain "choose a folder" box (Firefox, Safari). Not remembered.
// The parser is synchronous and the browser is not, so this works in rounds: the parser runs, anything it asked for that is not loaded is
// noted, settle() fetches it, and the parser runs again, until nothing new is asked for.
import { Buffer } from 'buffer';

const isMissing = e => e && (e.name === 'NotFoundError' || e.name === 'TypeMismatchError');

export class HandleBackend {
  constructor(root) { this.root = root; this.name = root.name; this.kind = 'handle'; }
  async dir(parts) { let h = this.root; for (const p of parts) h = await h.getDirectoryHandle(p); return h; }
  async node(parts) {
    if (!parts.length) return { kind: 'dir' };
    try {
      const d = await this.dir(parts.slice(0, -1)), n = parts[parts.length - 1];
      try { await d.getFileHandle(n); return { kind: 'file' }; } catch (e) {
        // Chrome refuses some file names when they are asked for by name (the .ini files on Windows: "Name is not allowed"); listing the folder still shows them
        if (e && e.name === 'TypeError') { const h = await this.find(d, n); if (h) return { kind: h.kind }; }
        else if (!isMissing(e)) throw e;
      }
      try { await d.getDirectoryHandle(n); return { kind: 'dir' }; } catch (e) { if (!isMissing(e) && !(e && e.name === 'TypeError')) throw e; }
      return null;
    } catch (e) { if (isMissing(e)) return null; throw e; }
  }
  // look a name up by listing the folder, which works even for names the browser will not hand out by name
  async find(d, name) { for await (const h of d.values()) if (h.name === name) return h; return null; }
  async file(parts) {
    try {
      const d = await this.dir(parts.slice(0, -1)), n = parts[parts.length - 1];
      let fh;
      try { fh = await d.getFileHandle(n); }
      catch (e) { if (e && e.name === 'TypeError') fh = await this.find(d, n); else throw e; }
      return fh && fh.kind === 'file' ? await fh.getFile() : null;
    } catch (e) { if (isMissing(e)) return null; throw e; }
  }
  async list(parts) {
    try { const d = await this.dir(parts), names = []; for await (const [name] of d.entries()) names.push(name); return names; } catch (e) { if (isMissing(e)) return null; throw e; }
  }
}

export class FileListBackend {
  // files: [{ path: 'a/b.txt' (without the top folder), file: File-like }]
  constructor(files, name) {
    this.name = name || 'folder'; this.kind = 'files'; this.files = new Map(); this.dirs = new Map([['', new Set()]]);
    for (const { path, file } of files) {
      this.files.set(path, file);
      const parts = path.split('/');
      for (let i = 0; i < parts.length; i++) {
        const parent = parts.slice(0, i).join('/'), child = parts[i];
        (this.dirs.get(parent) || this.dirs.set(parent, new Set()).get(parent)).add(child);
        if (i < parts.length - 1 && !this.dirs.has(parts.slice(0, i + 1).join('/'))) this.dirs.set(parts.slice(0, i + 1).join('/'), new Set());
      }
    }
  }
  async node(parts) { const k = parts.join('/'); return this.files.has(k) ? { kind: 'file' } : this.dirs.has(k) ? { kind: 'dir' } : null; }
  async file(parts) { return this.files.get(parts.join('/')) || null; }
  async list(parts) { const s = this.dirs.get(parts.join('/')); return s ? [...s] : null; }
}

const norm = p => '/' + String(p).split('/').filter(Boolean).join('/');
const stat = f => ({ mtimeMs: f.lastModified, size: f.size, isFile: () => true });

export class Vfs {
  constructor(backend, rootName = 'game') {
    this.b = backend; this.rootName = rootName; this.c = new Map(); this.miss = new Map(); this.mounted = new Set(); this.errors = [];
  }
  // what the parser asks
  exists(p) { const k = norm(p), e = this.c.get(k); if (e) return e.kind !== 'none'; this.miss.set(k, this.miss.get(k) || 'exists'); return false; }
  // The answers: the thing itself, null (it is not there), or undefined (not loaded yet: the question is noted for the next round)
  read(p) { const k = norm(p), e = this.c.get(k); if (e && e.data) return e.data; if (e && e.kind === 'none') return null; this.miss.set(k, 'read'); return undefined; }
  stat(p) { const k = norm(p), e = this.c.get(k); if (e && e.stat) return e.stat; if (e && e.kind === 'none') return null; this.miss.set(k, this.miss.get(k) === 'read' ? 'read' : 'stat'); return undefined; }
  list(p) { const k = norm(p), e = this.c.get(k); if (e && e.list) return e.list; if (e && e.kind === 'none') return null; this.miss.set(k, 'list'); return undefined; }
  beginPass() { this.miss.clear(); }
  hasMisses() { return this.miss.size > 0; }

  // parts of a path below the game folder ('/game/logs/x' -> ['logs', 'x'])
  parts(k) { const a = k.split('/').filter(Boolean); return a.slice(1); }

  // one attempt, then a second if the browser says the file changed or is busy (the game writes its logs while we read them)
  async resolve(k, kind) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try { return await this.resolveOnce(k, kind); }
      catch (e) {
        if (attempt === 0) { await new Promise(r => setTimeout(r, 150)); continue; }
        this.errors.push(k + ': ' + ((e && e.name) || 'error') + (e && e.message ? ' (' + String(e.message).slice(0, 90) + ')' : ''));
        this.c.set(k, { kind: 'none' });
      }
    }
  }
  async resolveOnce(k, kind) {
    if (this.mounted.has(k) || k.startsWith('/__archive')) return;   // mounted files are filled by mount()
    const parts = this.parts(k), old = this.c.get(k) || {};
    if (kind === 'list') {
      const names = await this.b.list(parts);
      this.c.set(k, names ? { ...old, kind: 'dir', list: names } : { kind: 'none' });
    } else if (kind === 'exists') {
      const n = await this.b.node(parts);
      this.c.set(k, n ? { ...old, kind: n.kind } : { kind: 'none' });
    } else {
      const f = await this.b.file(parts);
      if (!f) { this.c.set(k, old.kind === 'dir' ? old : { kind: 'none' }); return; }
      const e = { ...old, kind: 'file', stat: stat(f) };
      if (kind === 'read') e.data = Buffer.from(await f.arrayBuffer());
      this.c.set(k, e);
    }
  }
  // fetch everything the last pass asked for (a few at a time)
  async settle() {
    const todo = [...this.miss.entries()];
    this.miss.clear();
    let i = 0;
    const worker = async () => { while (i < todo.length) { const [k, kind] = todo[i++]; await this.resolve(k, kind); } };
    await Promise.all(Array.from({ length: Math.min(12, todo.length) }, worker));
  }
  // before each refresh: forget what changed in the folder, keep what did not (so only new or grown files are read again)
  async revalidate() {
    const entries = [...this.c.entries()].filter(([k]) => !this.mounted.has(k));
    let i = 0;
    const worker = async () => {
      while (i < entries.length) {
        const [k, e] = entries[i++], parts = this.parts(k);
        if (e.kind === 'file') {
          const f = await this.b.file(parts);
          if (!f) this.c.set(k, { kind: 'none' });
          else if (!e.stat || f.lastModified !== e.stat.mtimeMs || f.size !== e.stat.size) this.c.delete(k);
        } else if (e.kind === 'dir') {
          const names = await this.b.list(parts);
          this.c.set(k, names ? { ...e, list: names } : { kind: 'none' });
        } else this.c.delete(k);   // "not there" answers are asked again: a new world may have appeared
      }
    };
    await Promise.all(Array.from({ length: Math.min(12, entries.length) }, worker));
  }
  // files that are not in the game folder but should look like they are (the optional log archive)
  mount(dirPath, files) {
    const d = norm(dirPath);
    for (const k of [...this.c.keys()]) if (k === d || k.startsWith(d + '/')) this.c.delete(k);
    this.mounted.add(d);
    if (!files) { this.c.set(d, { kind: 'none' }); return; }
    this.c.set(d, { kind: 'dir', list: Object.keys(files) });
    for (const [name, f] of Object.entries(files)) {
      const k = d + '/' + name; this.mounted.add(k);
      this.c.set(k, { kind: 'file', stat: { mtimeMs: f.mtimeMs, size: f.size, isFile: () => true }, data: Buffer.from(f.data) });
    }
  }
  // loaded files below a folder (used to keep a copy of the logs)
  loadedFiles(dirPath) {
    const d = norm(dirPath) + '/', out = [];
    for (const [k, e] of this.c) if (k.startsWith(d) && e.data && !this.mounted.has(k)) out.push([k.slice(d.length), e]);
    return out;
  }
  async readBlob(parts) { const f = await this.b.file(parts); return f || null; }
}
