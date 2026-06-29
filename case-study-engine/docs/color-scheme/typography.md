# Typography — Rules Engine Case Study

Treated as a swappable asset. Two families, stored in `docs/assets/fonts/` and `site/src/assets/fonts/`.

## 1. Primary — Hecate Display
- Files: `Hecate Display-Regular.otf`, `Hecate Display-Italic.otf`
- Role: **Display / headlines** — hero, section titles, big editorial numbers.
- Character: high-impact display serif. Carries the editorial, magazine-cover feel from the inspiration.
- CSS family name: `"Hecate Display"`

## 2. Secondary — 001 Sans Serif
- File: `001SansSerif DEMO-SVG.otf` (DEMO)
- Role: **Body / UI / captions / labels** — running text, metrics labels, nav.
- Character: clean grotesque sans for readability at body sizes.
- CSS family name: `"001 Sans Serif"`
- ⚠️ DEMO version — confirm full license before production/public deploy.

## Pairing rules
- Headlines & key stats → Hecate Display (often uppercase, tight leading, like the inspiration decks).
- Everything else → 001 Sans Serif.
- Italic Hecate for pull quotes / the "Excel insight" moment.

## @font-face (for site)
```css
@font-face {
  font-family: "Hecate Display";
  src: url("../assets/fonts/Hecate Display-Regular.otf") format("opentype");
  font-weight: 400; font-style: normal; font-display: swap;
}
@font-face {
  font-family: "Hecate Display";
  src: url("../assets/fonts/Hecate Display-Italic.otf") format("opentype");
  font-weight: 400; font-style: italic; font-display: swap;
}
@font-face {
  font-family: "001 Sans Serif";
  src: url("../assets/fonts/001SansSerif DEMO-SVG.otf") format("opentype");
  font-weight: 400; font-style: normal; font-display: swap;
}
```
