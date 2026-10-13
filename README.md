# Dino World — v0.0.4 family-testing prototype

A small, toddler-oriented dinosaur playground PWA prototype. This release uses locally rendered, 3D-inspired cartoon artwork drawn with Canvas so the scene works without external image/model downloads. It is not yet a full 3D engine build.

## Included
- Updated character cast: Rex (Tyrannosaurus rex), Stan (Stegosaurus) and Jarvis (Brachiosaurus)
- Three selectable dinosaur characters: Rex, Stan and Jarvis
- Tap-to-react dinosaur playground
- Egg hatching interaction
- Feeding activity
- Simple dinosaur recognition / fact activity
- Dance interaction
- Sound toggle and grown-ups information panel
- Responsive iPhone-first layout
- PWA manifest, app icon, service worker and offline shell cache
- Automatic update check on open and every 60 seconds
- Visible version label (v0.0.4)

## Version 0.0.4 changes
- Replaced Trixie with Stan the Stegosaurus, including back plates and a spiked tail in the canvas illustration.
- Replaced Benny with Jarvis the Brachiosaurus.
- Updated character cards, selection, greetings, facts, quiz choices and egg-hatching character pool.
- Bumped the visible app version, remote version file and service-worker cache together to preserve automatic updates.

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
3. Change `CACHE_VERSION` in `sw.js` (for example `dino-world-v0.0.4`).
4. Update the visible version label automatically follows `APP_VERSION`; check it on the home screen.
5. Publish all changed files together. Give GitHub Pages a few minutes to deploy before testing.

For an already-installed PWA, the browser may need a short moment to detect a deployment. If a release does not appear after a few minutes, open the hosted URL in Safari once while online; verify that `version.json` returns the new version. Do not ask testers to uninstall/reinstall unless troubleshooting proves the browser installation is damaged.

## Prototype limitations
- Dinosaur visuals are hand-drawn 2.5D-style Canvas illustrations, not rigged 3D models.
- Sound effects are simple synthesized tones; no recorded voices or licensed music yet.
- The quiz is a basic prototype and needs more usability testing with adults before toddler testing.
- No accounts, analytics, ads, purchases or cloud storage.
- This is an early prototype; supervise children during use and check content, accessibility and performance before wider distribution.

\n## v0.0.4 custom art pack\n\nThis release bundles all four generated concept-board images plus cropped local artwork for the main dinosaur scene, character cards, environment, expressions/actions, eggs/food, icons, and reward graphics. The current app uses the generated character artwork in the main scene and character picker. The full boards are retained in `assets/` as a source art library for future individual sprite extraction.\n