# Sama Eldesouki, personal site

Live at https://sayrz1.github.io

Static site with no build step.

## Run locally
    python -m http.server 5173
then open http://localhost:5173

## Pages
- `/` (`index.html`, `styles.css`, `script.js`, `mascot.js`): Hero (talking cartoon avatar) · Projects (numbered index + stage) ·
  About (flipping ID card on a lanyard) · Skills (periodic table with family filters) · Certifications ·
  Education & experience (timeline) · Outside the terminal (links to the pages below) · Contact
- `/motion/`: motion graphics films (`motion/motion.js` holds the film list)
- `/websites/`: websites for small shops, laid out as a high street
- `/copy/`: copywriting before and after

Mini Sama (`mascot.js`) is a chibi mascot that follows you down the page, swaps props per section, naps when idle and
invites you to get in touch when clicked. Visitors can hide her. `script.js` announces the section being read with a
`section:change` event; the nav pill and Mini Sama both follow it.

## Editing
- Hero: `assets/sama.webp` (cut-out illustration) with `assets/sama-blink.webp` flashed over the eyes to blink.
  Speech bubble lines are in `script.js` (`lines`).
- Skills: the `els` array in `script.js` (symbol, name, family, Simple Icons slug, description).
- Projects: one `<article class="panel">` each inside `#stage` in `index.html`. The index, stage and nav count are built from
  them. `panel-space` and `panel-accent` give a project its own palette.
- Certifications and experience: plain HTML in `index.html`.

Light and dark mode follow the system setting, with a manual toggle. Motion respects `prefers-reduced-motion`,
and the hero animation has a pause button.
