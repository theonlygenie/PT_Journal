// the save-derived card, against the real game folder
const path = require('path'), esbuild = require('esbuild'), os = require('os');
const root = path.resolve(__dirname, '..'), out = path.join(os.tmpdir(), 'pt-card-test.cjs');
esbuild.buildSync({ entryPoints: [path.join(root, 'test', 'card-entry.js')], outfile: out, bundle: true, format: 'cjs', platform: 'node', logLevel: 'error',
  alias: { fs: path.join(root, 'src', 'fs-shim.js'), path: path.join(root, 'node_modules', 'path-browserify', 'index.js') } });
require(out).run(process.argv[2]).then(r => console.log(JSON.stringify(r)));
