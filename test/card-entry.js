// Checks the world card built from the save when world-card.ini cannot be read (the folder is read with that one file left out).
import nodeFs from 'node:fs';
import nodePath from 'node:path';
import { load } from '../shared/parser.js';
import * as fsShim from '../src/fs-shim.js';
import { Vfs, FileListBackend } from '../src/vfs.js';
import { cardFromSave } from '../src/card.js';

export async function run(gameDir) {
  const files = [];
  (function walk(rel) {
    for (const e of nodeFs.readdirSync(nodePath.join(gameDir, rel), { withFileTypes: true })) {
      const r = rel ? rel + '/' + e.name : e.name;
      if (e.isDirectory()) walk(r);
      else if (r !== 'world-card.ini') {   // the file we pretend cannot be read
        const full = nodePath.join(gameDir, r), s = nodeFs.statSync(full);
        files.push({ path: r, file: { lastModified: s.mtimeMs, size: s.size, arrayBuffer: async () => { const b = nodeFs.readFileSync(full); return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength); } } });
      }
    }
  })('');
  const vfs = new Vfs(new FileListBackend(files, 'Game')); fsShim.attach(vfs);
  let data;
  for (let i = 0; i < 12; i++) { vfs.beginPass(); data = load('/game', null); if (!vfs.hasMisses()) break; await vfs.settle(); }
  const world = nodeFs.readFileSync(nodePath.join(gameDir, 'world-name.txt'), 'utf8').trim();
  return { worldCardFromIni: data.worldCard, fromSave: cardFromSave(data, world), world };
}
