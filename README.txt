Dino World v0.0.20 — character artwork replacement

Replace these files in the ROOT of the existing GitHub repository:
- index.html
- app.js
- artwork.js
- sw.js
- version.json

Leave styles.css and all other files unchanged.

This release replaces the embedded Rex, Stan and Jarvis image data in artwork.js with the available full-body replacement assets. The meadow background, activity icons and existing app interactions are preserved. The image assets have transparent safety margins to reduce edge clipping.

After committing, allow the GitHub Pages deployment to finish and reload the app. The service worker cache is bumped to v0.0.20. Check all three character cards and the main meadow scene on iPhone before wider release.
