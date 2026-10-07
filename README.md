# Sama Eldesouki, personal site

Live at https://sayrz1.github.io

Static site with no build step: `index.html`, `styles.css`, `script.js`, `character.js`.

## Run locally
    python -m http.server 5173
then open http://localhost:5173

## Sections
Hero (talking, waving cartoon avatar) · About (flipping ID card on a lanyard) · Skills (periodic table with family filters) ·
Work (project accordion with a live LexiLift demo) · Certifications · Education & experience (timeline) ·
Achievements (sideways scroll with count-up numbers) · Contact

Mini Sama (`mascot.js`) is a chibi mascot that follows you down the page, swaps props per section, naps when idle and shares facts when clicked. Visitors can hide her.

## Editing
- Hero: `assets/sama.webp` (cut-out illustration) with `assets/sama-blink.webp` flashed over the eyes to blink.
  Speech bubble lines are in `script.js` (`lines`).
- Skills: the `els` array in `script.js` (symbol, name, family, Simple Icons slug, description).
- Projects, certifications, experience, achievements: plain HTML in `index.html`.

Light and dark mode follow the system setting, with a manual toggle. Motion respects `prefers-reduced-motion`,
and the hero animation has a pause button.
