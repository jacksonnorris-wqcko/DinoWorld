# Dino World — v0.0.1 family-testing prototype

A small, toddler-oriented dinosaur playground PWA prototype. This first build uses locally rendered, 3D-inspired cartoon artwork drawn with Canvas so the scene works without external image/model downloads. It is not yet a full 3D engine build.

## Included
- Three selectable dinosaur characters: Rex, Trixie and Benny
- Tap-to-react dinosaur playground
- Egg hatching interaction
- Feeding activity
- Simple dinosaur recognition / fact activity
- Dance interaction
- Sound toggle and grown-ups information panel
- Responsive iPhone-first layout
- PWA manifest, app icon, service worker and offline shell cache
- Automatic update check on open and every 60 seconds
- Visible version label (v0.0.1)

## Run locally
For service-worker/PWA testing, serve this folder over localhost (not by opening `index.html` as a file). For example, with Python installed:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish to GitHub Pages
1. Create a repository for the game.
2. Upload the contents of this folder to the repository root (the files should not be nested in another folder).
3. In repository Settings → Pages, publish from the `main` branch and `/ (root)`.
4. Open the HTTPS GitHub Pages URL on the iPhone, then use Safari Share → Add to Home Screen.
5. Test updates on the installed app after publishing a newer build.

## Important auto-update release steps
The update system checks `version.json` when the app opens and every 60 seconds. The service worker uses `updateViaCache: 'none'`, a network-first strategy for the app shell, a versioned cache, old-cache cleanup, waiting-worker activation and reload when the new worker takes control.

For each future release, make all of these changes together:
1. Change `APP_VERSION` in `app.js`.
2. Change `version` and `released` in `version.json`.
3. Change `CACHE_VERSION` in `sw.js` (for example `dino-world-v0.0.2`).
4. Update the visible version label automatically follows `APP_VERSION`; check it on the home screen.
5. Publish all changed files together. Give GitHub Pages a few minutes to deploy before testing.

For an already-installed PWA, the browser may need a short moment to detect a deployment. If a release does not appear after a few minutes, open the hosted URL in Safari once while online; verify that `version.json` returns the new version. Do not ask testers to uninstall/reinstall unless troubleshooting proves the browser installation is damaged.

## Prototype limitations
- Dinosaur visuals are hand-drawn 2.5D-style Canvas illustrations, not rigged 3D models.
- Sound effects are simple synthesized tones; no recorded voices or licensed music yet.
- The quiz is a basic prototype and needs more usability testing with adults before toddler testing.
- No accounts, analytics, ads, purchases or cloud storage.
- This is an early prototype; supervise children during use and check content, accessibility and performance before wider distribution.
