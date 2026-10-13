Dino World v0.0.19 — character scale and placement fix

Replace these five files in the ROOT of the existing GitHub repository:
- index.html
- styles.css
- app.js
- sw.js
- version.json

Leave artwork.js and all other files unchanged.

Changes:
- Corrected a conflicting short-screen CSS rule that was shrinking Jarvis too much.
- Jarvis is taller again and remains left of the speech bubble.
- Rex and Stan use explicit, stable scales and share the same bottom/ground alignment.
- The greeting bubble remains above the dinosaur but should not cover the face.
- Version/cache references updated to v0.0.19.

This changes layout only; it does not regenerate or replace the underlying character artwork. Check the result on the iPhone after deployment.
