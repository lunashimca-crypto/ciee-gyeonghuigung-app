# Gyeonghuigung / Seoul Museum of History — Scavenger Hunt (standalone)

Standalone single-mission version of the original two-location "CIEE Scavenger
Hunt" app, containing only the Gyeonghuigung chapter.

## Included
- Full working project: `package.json`, `vite.config.js`, `index.html`, `src/`
- `src/questions.js` — the Gyeonghuigung chapter's 10 questions, renumbered as
  the app's single chapter (this chapter was already written as the story's
  ending, so no narrative rewrite was needed)
- `public/images/` — **placeholder images** with the correct filenames already
  in place (`q2-1.jpg`...`q2-10.jpg`, `journal-2a/b/c.jpg`, `ch2-intro.jpg`).
  Just replace these files with your real photos — same filenames, no code
  changes needed.

## Run it
```
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
```

## What changed from the original combined app
- Home screen shows one mission card instead of two
- Chapter renumbered from "Mission 2" to "Mission 1"
- Luna's mission-briefing text updated from "two real-world locations" to "one"
- Own localStorage key, so progress won't collide with the War Memorial app
