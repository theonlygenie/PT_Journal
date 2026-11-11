// Builds the website into docs/ (this folder is what gets published):
//   - bundles the web code in src/ together with the desktop app's parser (shared/parser.js) into one script, docs/web.js
//   - copies the desktop app's pages (shared/renderer) next to it, with a few web-only changes to index.html
//   - ships the wiki spawn tables and species names the pages need
const fs = require('fs'), path = require('path');
const esbuild = require('esbuild');
const root = path.resolve(__dirname, '..'), shared = path.join(root, 'shared'), docs = path.join(root, 'docs'), site = docs, src = path.join(root, 'src');   // the site is the app itself, at the root
if (!fs.existsSync(shared)) { console.error('Run "npm run sync" first.'); process.exit(1); }

fs.rmSync(docs, { recursive: true, force: true });
fs.mkdirSync(site, { recursive: true });

// 1. the web script
esbuild.buildSync({
  entryPoints: [path.join(src, 'entry.js')], outfile: path.join(site, 'web.js'), bundle: true, format: 'iife', platform: 'browser', target: 'es2022',
  alias: { fs: path.join(src, 'fs-shim.js'), path: path.join(root, 'node_modules', 'path-browserify', 'index.js') },
  inject: [path.join(src, 'buffer-shim.js')], define: { global: 'window', 'process.env.NODE_ENV': '"production"' }, minify: false, legalComments: 'none',
});

// 2. the pages, with the web-only changes
const must = (text, from, to, all) => { if (!text.includes(from)) throw new Error('build: text not found: ' + from.slice(0, 60)); return all ? text.split(from).join(to) : text.replace(from, () => to); };
const walk = (dir, rel = '') => {
  for (const e of fs.readdirSync(path.join(dir, rel), { withFileTypes: true })) {
    const r = path.join(rel, e.name);
    if (e.isDirectory()) { walk(dir, r); continue; }
    if (r === 'index.html' || r === 'README.txt') continue;
    const to = path.join(site, r);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(path.join(dir, r), to);
  }
};
walk(path.join(shared, 'renderer'));

// the files that are kept in this browser, not in a settings folder
let app = fs.readFileSync(path.join(site, 'app.js'), 'utf8');
app = must(app, 'in the app’s own settings folder', 'in this browser’s storage', true);
app = must(app, 'the app copies your session logs into its own settings folder', 'this page keeps a copy of your session logs in this browser’s storage', true);
fs.writeFileSync(path.join(site, 'app.js'), app);

let html = fs.readFileSync(path.join(shared, 'renderer', 'index.html'), 'utf8');
html = must(html, `content="default-src 'self'; img-src 'self' data: blob:"`, `content="default-src 'self'; img-src 'self' data: blob:; connect-src 'self' https://platinumtogether.online"`);
html = must(html, '<script src="core.js"></script>', '<script src="web.js"></script>\n<script src="core.js"></script>');
html = must(html, '<script src="app.js"></script>', '<script src="app.js"></script>\n<script src="web-setup.js"></script>');
// the website skin: the grid backdrop (css) and the pixel wipe between pages (script, after the app's own scripts)
html = must(html, '<link rel="stylesheet" href="units.css">', '<link rel="stylesheet" href="units.css">\n<link rel="stylesheet" href="web-skin.css">');
html = must(html, '<script src="fx.js"></script>', '<script src="fx.js"></script>\n<script src="web-skin.js"></script>');
html = must(html, '<p>This app only reads your logs, saves and encounter files. It never changes the game. Counts come from what the game logs and from your save.</p>',
  '<p>This page only reads your logs, saves and encounter files, in your browser. It never changes the game, and nothing is uploaded anywhere: your files stay on your PC. Counts come from what the game logs and from your save. The website itself uses Vercel’s cookie-free analytics for page views and page speed; it never sees your game files or your stats.</p>');
html = must(html, 'title="Theme, motion, archive and what this app reads"', 'title="Theme, motion, archive and what this page reads"');
html = must(html, '<h4>Game folder</h4>', '<h4>Connected folder</h4>');
html = must(html, '<p id="folder"></p>', '<p id="folder"></p>\n        <p id="readerrs"></p>');
html = must(html, '<button class="pill ghost" id="pick">Game folder</button>', '<button class="pill ghost" id="pick">Game folder</button>');
// the app's own icon (the Poké Ball with PT) as the tab icon, the home-screen icon, and for every size the browser may ask for
html = must(html, '<title>PT Journal</title>', '<title>PT Journal</title>\n<link rel="icon" href="favicon.ico" sizes="any">\n<link rel="icon" type="image/png" sizes="32x32" href="icon-32.png">\n<link rel="apple-touch-icon" href="apple-touch-icon.png">');
const siteCfg = JSON.parse(fs.readFileSync(path.join(src, 'config.json'), 'utf8'));
// what a pasted link shows in Discord, Slack, Messages and so on: a title, a line, and a picture (og.png, 1200x630)
const title = 'PT Journal – your way of playing Platinum Together';
const blurb = 'A free journal of how you play: shiny luck, IVs, balls, your Pokédex and map, worked out from your own game. Nothing is uploaded.';
const alt = 'PT Journal: your way of playing. A grid page with the stats screen of the app.';
const share = [
  ['meta', { name: 'description', content: blurb }], ['meta', { name: 'theme-color', content: '#ffb200' }],
  ['meta', { property: 'og:type', content: 'website' }], ['meta', { property: 'og:site_name', content: 'PT Journal' }],
  ['meta', { property: 'og:title', content: title }], ['meta', { property: 'og:description', content: blurb }],
  ['meta', { property: 'og:url', content: siteCfg.siteUrl + '/' }], ['meta', { property: 'og:image', content: siteCfg.siteUrl + '/og.png' }],
  ['meta', { property: 'og:image:width', content: '1200' }], ['meta', { property: 'og:image:height', content: '630' }], ['meta', { property: 'og:image:alt', content: alt }],
  ['meta', { name: 'twitter:card', content: 'summary_large_image' }], ['meta', { name: 'twitter:title', content: title }],
  ['meta', { name: 'twitter:description', content: blurb }], ['meta', { name: 'twitter:image', content: siteCfg.siteUrl + '/og.png' }],
].map(([t, a]) => '<' + t + ' ' + Object.entries(a).map(([k, v]) => k + '="' + v.replace(/&/g, '&amp;').replace(/"/g, '&quot;') + '"').join(' ') + '>').join('\n');
html = must(html, '<link rel="apple-touch-icon" href="apple-touch-icon.png">', '<link rel="apple-touch-icon" href="apple-touch-icon.png">\n' + share);
fs.copyFileSync(path.join(src, 'og', 'og.png'), path.join(site, 'og.png'));
for (const f of fs.readdirSync(path.join(src, 'favicon'))) fs.copyFileSync(path.join(src, 'favicon', f), path.join(site, f));
fs.writeFileSync(path.join(site, 'index.html'), html);

// 3. the page that goes with the web script, and the data the pages need
fs.copyFileSync(path.join(src, 'web-setup.js'), path.join(site, 'web-setup.js'));
fs.copyFileSync(path.join(src, 'web-skin.css'), path.join(site, 'web-skin.css'));
const cfg = JSON.parse(fs.readFileSync(path.join(src, 'config.json'), 'utf8'));
fs.writeFileSync(path.join(site, 'web-skin.js'), must(fs.readFileSync(path.join(src, 'web-skin.js'), 'utf8'), '{{RELEASES}}', cfg.releases, true));
// blocks start to rise before they reach the screen, so scrolling fast never shows an empty page
const fxFile = path.join(site, 'fx.js');
let fxText = must(fs.readFileSync(fxFile, 'utf8'), "rootMargin: '0px' }", "rootMargin: '0px 0px 700px 0px' }");
// the wheel smoothing keeps its own target, so a page switch while it was still easing dragged the new page back down to the old position; this lets a page switch reset it
fxText = must(fxText, "view.addEventListener('scroll', () => { if (!raf) target = view.scrollTop; });", "view.addEventListener('scroll', () => { if (!raf) target = view.scrollTop; });\n  view.addEventListener('pt-reset-scroll', () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } target = 0; view.scrollTop = 0; });");
fs.writeFileSync(fxFile, fxText);
fs.writeFileSync(path.join(docs, '.nojekyll'), '');

console.log('built docs/ (the app, with the website skin)');
