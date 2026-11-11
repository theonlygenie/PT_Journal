// Renders src/og/og.html to src/og/og.png (the 1200x630 picture that link previews show). Dev only; the PNG is kept in the repo.
// It uses Electron's own renderer, so run it with the desktop app's Electron:
//   "..\StatTracker\node_modules\electron\dist\electron.exe" scripts\make-og.js
const { app, BrowserWindow } = require('electron');
const fs = require('fs'), path = require('path');
app.whenReady().then(async () => {
  const w = new BrowserWindow({ width: 1200, height: 630, useContentSize: true, show: false, webPreferences: { zoomFactor: 1 } });
  await w.loadFile(path.join(__dirname, '..', 'src', 'og', 'og.html'));
  await new Promise(r => setTimeout(r, 1200));
  let img = await w.webContents.capturePage();
  const s = img.getSize();
  if (s.width !== 1200 || s.height !== 630) img = img.resize({ width: 1200, height: 630, quality: 'best' });
  fs.writeFileSync(path.join(__dirname, '..', 'src', 'og', 'og.png'), img.toPNG());
  console.log('wrote og.png from', s.width + 'x' + s.height);
  app.quit();
});
