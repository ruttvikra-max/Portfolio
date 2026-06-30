# Design System Intelligence Engine — Case Study

A product-design case study built as a **Next.js app** (Next 16 · React 19 · Tailwind v4).
This is the final, live case study. It is **not** a static HTML file — it must be run.

## ▶ Run it (this is the case study)

```bash
npm install      # required on every fresh clone — node_modules is gitignored
npm run dev      # starts the dev server
```

Then open **http://localhost:3000**.

To build for production:

```bash
npm run build && npm run start
```

## ⚠ Do NOT open the archived HTML

`_reference/_archive/old-html-template.html` is the **old v1 template**, kept for
reference only. Opening it in a browser shows the *outdated* design — it is **not**
the final case study. The final case study only renders by running the Next.js app
above (`npm run dev`).

## Structure

```
src/app/             App Router entry (page.tsx composes all sections)
src/components/site/  Case-study sections (Hero, Problem, Research, Personas,
                      Market, TurningPoint, Solution, UnderTheHood, Outcome, …)
src/components/       React-bits components (GlassIcons, BorderGlow, Folder,
                      ChromaGrid, CardSwap)
public/fonts/         Rengok (display); Roboto (body) loads via next/font
_reference/           Archived source material (deck content, old v1 template) —
                      reference only, not part of the live app
```
