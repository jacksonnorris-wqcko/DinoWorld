Dino World v0.0.15 — targeted Let's Play fix

Replace these five files in the ROOT of your existing GitHub repository:
- index.html
- styles.css
- app.js
- sw.js
- version.json

Do not replace artwork.js; the dinosaur artwork has not changed.

What changed:
- Removed the old square raster activity icons from the Let's Play buttons.
- Replaced them with self-contained vector illustrations that scale within a fixed icon frame.
- Used a strict two-column card layout: bounded icon + flexible text. No arrow column.
- Bumped version and service-worker cache to 0.0.15 and cache-busted CSS/JS.

Extract the ZIP first. Upload the five files to the repository root, commit, wait for GitHub Pages to deploy, then close/reopen the app and confirm v0.0.15.
