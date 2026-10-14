DINO WORLD v0.1.0 — 3D REX INTEGRATION TEST

This build starts from the locked recovered v0.0.24 baseline. It preserves the existing home screen, meadow, dino picker, egg hatch, feeding, quiz, dance and modal flows. Only the main Rex hero is replaced by a procedural 3D model when WebGL and the Three.js CDN are available. Stan and Jarvis keep their existing artwork. If the 3D module fails, the original Rex image remains visible.

HOW TO TEST
1. Deploy the full contents of this folder to GitHub Pages (keep the assets folder and artwork.js).
2. Open the site with internet access. Three.js is fetched from jsDelivr.
3. Confirm Rex appears in the existing meadow, tap Rex, switch to Stan/Jarvis, and test Hatch an egg, Feed a dino, Dino quiz, Dance time and Grown-ups.
4. If the 3D model cannot start, the app should fall back to the original Rex artwork.

LIMITATIONS
This is a first integration test, not a fully QA-certified release. The 3D character is a procedural model based on the prototype rig, not the original painted PNG converted to 3D. No physical iPhone test was possible here.

Version: 0.1.0
