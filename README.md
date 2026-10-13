# Dino World v0.0.8 — changed files only

This incremental patch contains only the changed files: `index.html`, `styles.css`, `app.js`, `artwork.js`, `sw.js`, and `version.json`.

## Upload
Upload these six files to the ROOT of the existing GitHub repository, replacing the files with the same names. Do not upload this folder as a nested folder. Commit and wait for GitHub Pages to deploy.

## Main fixes
- Scene label and speech bubble now live in a dedicated toolbar above the artwork; no text is placed over the dinosaurs.
- Hero art is cropped to remove blurred padding.
- Character cards use dedicated portrait crops, not sections of the full hero image.
- Activity cards use fixed icon columns and flexible text columns to reduce overlap on narrow screens.
- CSS was consolidated into one responsive layout rather than layering overrides.
- App and service-worker cache version bumped to 0.0.8.

Confirm the footer says v0.0.8 after deployment.
