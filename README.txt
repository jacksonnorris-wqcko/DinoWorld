Dino World v0.0.21 — character artwork transparency hotfix

Replace these files in the ROOT of the existing GitHub repository:
- index.html
- app.js
- artwork.js
- sw.js
- version.json

Leave styles.css and all other files unchanged.

This hotfix replaces the flawed flattened character images with transparent PNG artwork, repairing the rectangular/patchy backgrounds visible around the characters. It also bumps the app version and service-worker cache to v0.0.21 so installed iPhone PWAs fetch the corrected artwork.

After committing, wait for GitHub Pages to deploy, then close and reopen the app. Confirm the visible version reads v0.0.21 and check Rex, Stan and Jarvis in both the character cards and main meadow scene.
