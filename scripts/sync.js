// Copies the shared code from the desktop app (../StatTracker) into shared/, so this folder stands on its own and can be published by itself.
// Run it whenever the desktop app's parser, tables or pages change:  npm run sync
const fs = require('fs'), path = require('path');
const src = path.resolve(__dirname, '..', '..', 'StatTracker'), dst = path.resolve(__dirname, '..', 'shared');
if (!fs.existsSync(path.join(src, 'parser.js'))) { console.error('Cannot find the desktop app at', src); process.exit(1); }
fs.rmSync(dst, { recursive: true, force: true });
const copy = (from, to) => { fs.mkdirSync(path.dirname(to), { recursive: true }); fs.copyFileSync(from, to); };
for (const f of ['parser.js', 'spawns-build.js', 'species.json', 'species-extra.json']) copy(path.join(src, f), path.join(dst, f));
copy(path.join(src, 'data', 'wiki-spawns.json'), path.join(dst, 'data', 'wiki-spawns.json'));
const walk = (dir, rel = '') => {
  for (const e of fs.readdirSync(path.join(dir, rel), { withFileTypes: true })) {
    const r = path.join(rel, e.name);
    if (e.isDirectory()) walk(dir, r);
    else copy(path.join(dir, r), path.join(dst, 'renderer', r));
  }
};
walk(path.join(src, 'renderer'));
console.log('synced from', src);
