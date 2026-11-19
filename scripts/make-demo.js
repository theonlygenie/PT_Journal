// Makes the sample data for the demo (?demo=1, or "Try with sample data" on the first screen): one real game folder, read once by the
// desktop app's own parser, cleaned, and saved as src/demo/sample.json, with the game's four picture sheets next to it so the icons and the
// town map show. The build copies src/demo/ to docs/demo/.
//
//   node scripts/make-demo.js "C:\path\to\Game" ["%APPDATA%\pt-journal"]
//
// The second folder is the desktop app's own settings folder (optional): its log archive adds older sessions, and its memory of released
// Pokémon and items fills those pages. Nothing is written anywhere but src/demo/.
//
// Cleaned out: the folder path, your trainer name (it becomes "Player"), and other players' trainer names on traded Pokémon (they become
// "Trainer A", "Trainer B", ... so trades still group the same way). Nicknames, IVs, routes, balls and counts are kept as they are.
const fs = require('fs'), path = require('path');
const { load } = require('../shared/parser.js');

const [gameDir, appDir] = process.argv.slice(2);
if (!gameDir || !fs.existsSync(path.join(gameDir, 'Platinum.exe'))) { console.error('Usage: node scripts/make-demo.js "C:\\path\\to\\Game" ["%APPDATA%\\pt-journal"]'); process.exit(1); }
const archive = appDir && fs.existsSync(path.join(appDir, 'archive', 'logs')) ? path.join(appDir, 'archive', 'logs') : null;
const readJson = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return null; } };

const data = load(gameDir, archive);
if (data.missing) { console.error('That folder does not look like a game folder.'); process.exit(1); }

// trainer names: yours become "Player" (the pages compare them without case, so the case is kept), everyone else's a letter
const own = new Set();
for (const t of Object.values(data.trainer || {})) if (t && t.name) own.add(t.name.toLowerCase());
if (data.worldCard && data.worldCard.trainer) own.add(String(data.worldCard.trainer).toLowerCase());
const others = new Map();
const rename = name => {
  if (typeof name !== 'string' || !name) return name;
  if (own.has(name.toLowerCase())) return name === name.toUpperCase() ? 'PLAYER' : 'Player';
  if (!others.has(name)) { const i = others.size; others.set(name, 'Trainer ' + (i < 26 ? String.fromCharCode(65 + i) : i + 1)); }
  return others.get(name);
};
const walk = v => {
  if (Array.isArray(v)) v.forEach(walk);
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) { if (k === 'ot') v[k] = rename(x); else walk(x); }
};
walk(data.owned); walk(data.party);
for (const t of Object.values(data.trainer || {})) if (t) t.name = rename(t.name);
if (data.worldCard) data.worldCard.trainer = rename(data.worldCard.trainer);

// the desktop app's memory of released Pokémon and items, shaped the way the pages get it
const led = appDir && readJson(path.join(appDir, 'released.json'));
const released = { since: (led && led.since) || new Date().toISOString(), worlds: {} };
if (led && led.worlds) for (const [name, W] of Object.entries(led.worlds)) if (data.owned && data.owned[name]) released.worlds[name] = { count: (W.left || []).length, left: (W.left || []).slice(-300).reverse() };
const itemsEver = (appDir && readJson(path.join(appDir, 'items-ever.json'))) || {};

let activeWorld = '';
try { activeWorld = fs.readFileSync(path.join(gameDir, 'world-name.txt'), 'utf8').trim().slice(0, 60); } catch {}

const out = { ...data, gameDir: 'Sample data', tags: {}, activeWorld, customNames: {}, released, itemsEver, made: new Date().toISOString() };
const dir = path.resolve(__dirname, '..', 'src', 'demo');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'sample.json'), JSON.stringify(out));
for (const f of ['kit-mon-icons.png', 'kit-item-icons.png', 'kit-mon-front-shiny.png', 'town-map.png']) {
  if (fs.existsSync(path.join(gameDir, f))) fs.copyFileSync(path.join(gameDir, f), path.join(dir, f));
}
const left = JSON.stringify(out).match(/"(?:gameDir|name|trainer|ot)":"[^"]*"/g) || [];
console.log(`wrote src/demo/sample.json (${Math.round(fs.statSync(path.join(dir, 'sample.json')).size / 1024)} KB): ${data.sessions.length} sessions, ${Object.keys(data.owned || {}).length} worlds, ${others.size} other trainer names replaced`);
console.log('names left in the file:', [...new Set(left)].join(' '));
