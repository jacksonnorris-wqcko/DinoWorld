Dino World v0.0.14 — changed files only

This update specifically fixes the Let's Play activity cards on narrow iPhone screens.

Upload these five files to the ROOT of your existing GitHub repository, replacing the matching files:
- index.html
- styles.css
- app.js
- sw.js
- version.json

Do not upload the ZIP itself. Extract it first. Keep all files at repository root.
Wait for GitHub Pages to deploy. Close/reopen the app and confirm the footer says v0.0.14.

What changed:
- Activity icons are constrained to a square box with object-fit: contain.
- Text receives the remaining grid width without the arrow consuming space on iPhones.
- Arrows remain on wider screens.
- Versioned CSS/JS URLs help prevent Safari from showing stale styles.
