# Dino World v0.0.5

## Fixes in this release
- Essential game artwork is embedded in `artwork.js`, so the hero and activity art do not depend on uploading an `assets/` directory.
- The four “Let’s play” cards use custom cropped artwork from the generated UI sheet.
- Added `apple-touch-icon.png` and linked it through the HTML and web manifest.
- Service worker cache version bumped to `d0.0.5` and now includes `artwork.js` and the iPhone icon.
- Stan is now labelled and described as a Triceratops, matching the agreed cast: Rex the T. rex, Stan the Triceratops, Jarvis the Brachiosaurus.

## Upload to GitHub
Upload **all files in this folder** to the root of the existing repository, replacing old files. Make sure `artwork.js`, `apple-touch-icon.png`, `index.html`, `app.js`, `styles.css`, `manifest.json`, `version.json`, and `sw.js` are all at the repository root. The essential artwork is embedded, so the `assets/` folder is not required for the main screen to display. Commit changes and wait for GitHub Pages to deploy.

## iPhone Home Screen icon
Safari/iOS can keep the old Home Screen icon even after the website updates. After the new version is live, remove the old Dino World shortcut from the Home Screen and add it again from Safari using Share → Add to Home Screen.

## Auto-updates
The service worker cache is versioned `dino-world-v0.0.5`. It checks the network-first for the app shell and removes older Dino World caches on activation. Real-device update behaviour should still be tested after deployment.
