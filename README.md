# Dino World v0.0.7

## What changed
- Reframed the hero artwork to remove the stray wooden banner and give the characters breathing room.
- Replaced zoomed-in character portraits with individual contained portraits so heads and bodies are not cut off.
- Reworked the mobile layout rules into one authoritative responsive block, avoiding conflicting historical CSS overrides.
- Adjusted speech bubble and scene-caption overlays to reduce obstruction of dinosaur artwork.
- Refined activity-card icon/text sizing for narrow iPhone screens.
- Updated app version, service-worker cache and version metadata to 0.0.7.

## Deploy
Upload the contents of this folder to the root of the existing GitHub Pages repository, replacing the old files. Keep `index.html`, `styles.css`, `app.js`, `artwork.js`, `sw.js`, `manifest.json`, `version.json`, and `apple-touch-icon.png` together at the repository root.

After deployment, open the site in Safari and confirm the footer says v0.0.7. If the Home Screen app stays stale, fully close and reopen it; for the icon, remove and re-add the Home Screen shortcut.
