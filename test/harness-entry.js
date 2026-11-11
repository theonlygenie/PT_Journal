// Runs the website's file layer (vfs.js + the fs stand-in) against a real game folder in Node, and compares what the parser produces
// through it with what the desktop app's parser produces reading the same folder directly. READ-ONLY on the game folder.
// Usage: node test/run-harness.js "C:\path\to\Game"
import nodeFs from 'node:fs';
import nodePath from 'node:path';
import { load } from '../shared/parser.js';
import * as fsShim from '../src/fs-shim.js';
import { Vfs, FileListBackend } from '../src/vfs.js';

export async function viaShim(gameDir) {
  const files = [];
  (function walk(rel) {
    for (const e of nodeFs.readdirSync(nodePath.join(gameDir, rel), { withFileTypes: true })) {
      const r = rel ? rel + '/' + e.name : e.name;
      if (e.isDirectory()) walk(r);
      else {
        const full = nodePath.join(gameDir, r), s = nodeFs.statSync(full);
        files.push({ path: r, file: { lastModified: s.mtimeMs, size: s.size, arrayBuffer: async () => { const b = nodeFs.readFileSync(full); return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength); } } });
      }
    }
  })('');
  const vfs = new Vfs(new FileListBackend(files, 'Game'));
  fsShim.attach(vfs);
  let data, rounds = 0;
  for (; rounds < 12; rounds++) {
    vfs.beginPass();
    data = load('/game', null);
    if (!vfs.hasMisses()) break;
    await vfs.settle();
  }
  // a second refresh with nothing changed must settle without fetching anything new
  const before = [...vfs.c.values()].filter(e => e.data).length;
  await vfs.revalidate();
  vfs.beginPass(); const again = load('/game', null);
  return { data, rounds: rounds + 1, filesRead: before, settledAgain: !vfs.hasMisses(), againSame: JSON.stringify(again) === JSON.stringify(data) };
}
