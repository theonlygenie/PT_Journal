// The first-run screen for the website. The desktop app's pages call setupGuide() when no game folder is connected; here it explains how to
// connect one in the browser (and how to come back to it on later visits). Loads after app.js so it can replace that function.
setupGuide = function webSetupGuide() {
  const w = (data && data.web) || {}, f = data.found || {};
  const supported = w.supported !== false;
  const step = (n, title, ...body) => el('li', { class: 'sstep' }, el('span', { class: 'sn' }, String(n)), el('div', {}, el('h4', {}, title), ...body));
  const check = (ok, label) => el('li', { class: ok ? 'ok' : 'no' }, el('i', {}, ok ? '✓' : '✗'), label);

  const note = w.note ? el('div', { class: 'setupmsg' }, el('h4', {}, 'Something did not work'), el('p', {}, w.note)) : null;
  // came back, and the browser wants one click before it reads the remembered folder again
  if (w.state === 'needs-permission') {
    return el('div', { class: 'setup' },
      el('section', { class: 'tile c-navy setuphead' },
        el('h2', {}, 'Welcome back'),
        el('p', {}, `Your game folder${w.folder ? ` “${w.folder}”` : ''} is remembered. Your browser just wants a click before it reads it again. Nothing is uploaded, and it is only ever read.`)),
      el('section', { class: 'tile c-grey setupsteps' },
        el('ol', {},
          step(1, 'Reconnect', el('p', {}, 'Press the button, then choose “Allow”. If your browser offers “Allow on every visit”, pick that and you will not be asked again.'),
            el('button', { class: 'pill', onclick: () => refresh(window.stats.reconnect) }, 'Reconnect my folder')),
          step(2, 'Different folder?', el('p', {}, 'If you moved the game, choose the folder again.'),
            el('button', { class: 'pill ghost', onclick: () => refresh(window.stats.pick) }, 'Choose another folder'))),
        note));
  }

  const wrong = w.state === 'wrong-folder';
  return el('div', { class: 'setup' },
    el('section', { class: 'tile c-navy setuphead' },
      el('h2', {}, 'Welcome'),
      el('p', {}, 'Let’s connect this page to your game. It takes about ten seconds. Your files are read right here in your browser. Nothing is uploaded, and the page only ever reads, it never changes your game.')),
    el('section', { class: 'tile c-grey setupsteps' },
      el('ol', {},
        step(1, 'Find your game folder', el('p', {}, 'It is the folder you start the game from. Look for the one with ', el('b', {}, 'Platinum.exe'), ' inside. It is usually called ', el('b', {}, 'Game'), ' and sits inside your Platinum Together folder.')),
        step(2, 'Choose it here', el('p', {}, supported
          ? 'Press the button, pick that folder, then choose “View files”. Pick the folder itself, not one of the folders inside it.'
          : 'Press the button and pick that folder. Your browser will ask to confirm. Pick the folder itself, not one inside it.'),
          el('button', { class: 'pill', onclick: () => refresh(window.stats.pick) }, 'Choose the folder')),
        step(3, 'That is it', el('p', {}, supported
          ? 'Your stats appear straight away, and the page remembers the folder. Next time it only asks for one click.'
          : 'Your stats appear straight away. This browser cannot remember the folder, so you will choose it again each visit. In Chrome or Edge it is remembered.'))),
      note,
      !supported ? el('div', { class: 'setupmsg' }, el('h4', {}, 'Tip: use Chrome or Edge'), el('p', {}, 'They can remember the folder between visits. Firefox and Safari work too, but ask you to choose it every time.')) : null,
      wrong ? el('div', { class: 'setupmsg' },
        el('h4', {}, 'That folder does not look right'),
        el('p', {}, `The page looked in “${w.folder}” and expected to find these:`),
        el('ul', {}, check(f.exe, 'Platinum.exe'), check(f.logs, 'logs folder'), check(f.save, 'save.bin'), check(f.worlds, 'worlds folder')),
        el('p', {}, 'Play the game once so it makes its logs, or pick the folder that holds Platinum.exe.')) : null));
};

// Settings panel: say, briefly, which files could not be read (if any), with the details folded away
const renderWithoutErrors = render;
render = function () {
  renderWithoutErrors();
  const p = document.getElementById('readerrs');
  if (!p) return;
  const errs = (data && data.web && data.web.errors) || [];
  p.replaceChildren();
  if (!errs.length) return;
  const rows = errs.map(e => { const i = e.indexOf(': '); return [e.slice(0, i).replace('/game/', ''), e.slice(i + 2)]; });
  const why = [...new Set(rows.map(r => r[1]))];
  const box = document.createElement('details');
  const sum = document.createElement('summary');
  sum.textContent = rows.length === 1 ? '1 file could not be read' : rows.length + ' files could not be read';
  const list = document.createElement('div'); list.className = 'readerrs-list';
  list.textContent = rows.map(r => r[0]).join('\n') + '\n\n' + why.join('\n');
  box.append(sum, list); p.append(box);
};
