Dino World v0.0.9 — changed files only

This is a targeted fix for the duplicate scene shown in v0.0.8.

Upload these 5 files to the ROOT of your existing GitHub repository, replacing files with the same names:
- index.html
- styles.css
- app.js
- sw.js
- version.json

Do not upload the ZIP itself into the repository. Extract it first and upload the five files above.
Wait for GitHub Pages to deploy, then close/reopen Dino World. Confirm the footer shows v0.0.9.

The old canvas meadow has been removed from the page and its drawing loop is disabled when absent, leaving the custom hero image as the only scene.
