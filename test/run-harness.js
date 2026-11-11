const path = require('path'), esbuild = require('esbuild'), os = require('os'), fs = require('fs');
const root = path.resolve(__dirname, '..');
const game = path.resolve(process.argv[2] || '');
if (!fs.existsSync(game)) { console.error('usage: node test/run-harness.js "C:\\path\\to\\Game"'); process.exit(1); }
const out = path.join(os.tmpdir(), 'pt-journal-harness.cjs');
esbuild.buildSync({
  entryPoints: [path.join(__dirname, 'harness-entry.js')], outfile: out, bundle: true, format: 'cjs', platform: 'node', logLevel: 'error',
  alias: { fs: path.join(root, 'src', 'fs-shim.js'), path: path.join(root, 'node_modules', 'path-browserify', 'index.js') },
});
(async () => {
  const { viaShim } = require(out);
  const t0 = Date.now();
  const r = await viaShim(game);
  const t1 = Date.now();
  const direct = require(path.join(root, 'shared', 'parser.js')).load(game, null);   // the desktop app's parser, reading the folder directly
  const strip = d => { const c = JSON.parse(JSON.stringify(d)); delete c.gameDir; return c; };
  const a = strip(r.data), b = strip(direct);
  const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])];
  const diff = keys.filter(k => JSON.stringify(a[k]) !== JSON.stringify(b[k]));
  console.log(`rounds: ${r.rounds}, files read into memory: ${r.filesRead}, via the file layer: ${t1 - t0} ms`);
  console.log(`second refresh settled without new reads: ${r.settledAgain}, same result: ${r.againSame}`);
  console.log(`sessions ${a.sessions.length}/${b.sessions.length}, worlds ${a.worlds.length}/${b.worlds.length}, saves with dex ${Object.keys(a.dex || {}).length}/${Object.keys(b.dex || {}).length}`);
  console.log(diff.length ? 'DIFFERENT in: ' + diff.join(', ') : 'IDENTICAL: every field matches the desktop parser (' + keys.length + ' fields)');
  process.exit(diff.length ? 1 : 0);
})();
