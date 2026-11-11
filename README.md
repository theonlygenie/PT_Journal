# PT Journal (website)

The website for [PT Journal](../StatTracker): the app itself, running in the browser, with nothing to download. A player opens the page,
points it at their Platinum Together game folder once, and sees their stats. It is the desktop app's own pages and numbers with a website look on top: the
grid backdrop from the units.gr reference behind the content panel, and a stepped pixel wipe (in the colour of the page you are going to, with a
pixel Poké Ball in the middle) when you switch page. The look is in `src/web-skin.css` and `src/web-skin.js`; the cards and charts are the app's own.

Settings is a section of its own in the rail (06), with the game folder, the optional log copy, wiki data, theme, motion and a link to the Windows app, as cards. Every section in the rail opens from its beginning (its first sub-page, scrolled to the top).

(An earlier scrolling landing page, built to lead people to the app, is kept in `src/landing/` but is no longer built.)

**It never uploads anything.** The page reads the folder inside the player's own browser, read-only. There is no server and no account.

## How a player uses it

1. Open the page and press **Choose the folder**. Pick the game folder (the one with `Platinum.exe`, usually called `Game`).
2. That's it. In Chrome and Edge the folder is **remembered**: on later visits the page shows a **Reconnect** button (one click and
   "Allow", or "Allow on every visit" so it never asks again). Nobody has to upload their files again.
3. While the page is open it re-reads the folder every 15 seconds, so new play and new saves show up by themselves.

| Browser | Remembers the folder | Notes |
| --- | --- | --- |
| Chrome, Edge | Yes (one click to reconnect, or none with "Allow on every visit") | Uses the browser's folder picker, with read-only access |
| Firefox, Safari | No | Uses a plain "choose a folder" box, so the folder is chosen again on each visit |

On Windows, Chrome refuses to hand out `.ini` files (world.ini, world-card.ini, encounters.ini) when they are asked for by name ("Name is not allowed"), so the page finds them by listing the folder instead (`HandleBackend.find` in `src/vfs.js`). If a file still cannot be read, Settings → Game folder says how many, with the names folded away.

The browser refuses a few folders as a pick (Desktop, Documents or Downloads themselves), but a game folder inside one of them is fine.

## What is in this folder

```
docs/       the finished site (the app, at the root). This is what gets published.
src/        the web-only code (see below); src/web-skin.* is the website look
shared/     a copy of the desktop app's parser, tables and pages (npm run sync refreshes it)
scripts/    sync, build, serve
test/       checks the web file layer against a real game folder
```

The website is the desktop app's own pages (`shared/renderer`) plus a browser stand-in for the part Electron normally does:

- `src/vfs.js` is an in-memory copy of the game folder, filled from the folder the player picked (a folder handle, or a plain file list).
- `src/fs-shim.js` is a small stand-in for Node's `fs` so the desktop app's **unchanged parser** runs in the browser. It only has read functions.
  The parser runs in rounds: whatever it asks for that isn't loaded yet is fetched, then it runs again until nothing new is asked for.
- `src/stats-api.js` is the browser version of the desktop app's `preload.js` / `main.js` (`window.stats`): the same functions, answered here.
  Settings, the memory of released Pokémon and items, map labels, custom names and the optional log copy live in the browser's IndexedDB.
- `src/wiki.js` keeps the wiki spawn tables fresh (the browser version of the desktop updater): one public file from
  `platinumtogether.online`, nothing about the player sent, can be switched off in Settings.
- `src/web-setup.js` is the first-run and "welcome back" screen.

## Working on it

```
npm install
npm run sync     # copy the latest parser, tables and pages from ../StatTracker into shared/
npm run build    # build docs/
npm run serve    # try it at http://localhost:4190
npm test -- "C:\path\to\Game"   # check the web file layer gives the same results as the desktop parser
```

`npm test` runs the website's file layer in Node against a real game folder and compares every field the parser produces with what the
desktop app's parser produces reading the same folder directly. It is read-only on the game folder. (The browser's folder picker itself cannot
be driven by a script, so the picker and the remembered-folder flow need trying by hand in Chrome or Edge.)

## Publishing (not done yet)

Everything the site needs is in `docs/`, so it can go on any static host. On GitHub Pages: put this folder in a repository, then
**Settings → Pages → Build and deployment → Deploy from a branch → `main` / `/docs`**. After changing the desktop app, run `npm run sync` and
`npm run build` and commit the new `docs/` folder.

## Credits

Platinum Together and its community wiki (spawn and evolution data): <https://platinumtogether.online/wiki>. Fonts Archivo Black and Figtree
(SIL Open Font License 1.1). Pokémon is a trademark of Nintendo / Creatures Inc. / GAME FREAK inc. This is an unofficial fan project and is not
affiliated with them or with the Platinum Together developers.
