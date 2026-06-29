# Master Prompt — Rules Engine Case Study Site (for Claude Code)

> Paste everything below this line into Claude Code, run from the repo root
> (`~/Desktop/Case-Study-Engine`). It is self-contained.

---

You are building a **premium portfolio case study website** for an enterprise Rules Engine (natural-language rule authoring for US Healthcare). This is a portfolio story whose job is to convince a Design Director to interview the author — it is NOT a UX teardown. The author is a **Lead Product Designer**; the site must read as the work of a product designer who shapes products, not a UI decorator.

The repo is the single source of truth. The Vite + React scaffold and **Section 1 (Hero) are already built and committed**. Your job is to build the shared editorial component system and assemble **Sections 2–8**, matching the Hero's direction exactly.

## 0. Orient yourself first (do this before writing code)

Read these, in order, and do not skip them:

1. `docs/brief/case-study-brief.md` — the brief, voice, and hard rules.
2. `docs/drafts/case-study-v1.md` — the **real copy** for all 8 sections. Use this verbatim (light editorial tightening allowed; do not invent facts or metrics).
3. `docs/references/inspiration.md` — the visual direction (Constructivist/editorial).
4. `docs/color-scheme/tokens.css`, `typography.md`, `colors.md` — the design tokens.
5. `site/src/components/reactbits/README.md` — the 12 staged React Bits components and their intended roles.
6. `site/src/sections/Hero.jsx` + `Hero.css` — **the canonical pattern.** Every new section must match its conventions (token usage, `.kicker`, hairline rules, motion, file structure).

Then run `npm install && npm run build` inside `site/` to confirm the current state builds before you change anything.

## 1. Non-negotiable constraints (from the brief)

**Voice & length**
- Editorial, confident, restrained — like Stripe / Linear / Notion writing. No bootcamp-UX tone, no filler, no AI-sounding padding, no marketing fluff.
- Whole case study reads in 5–7 minutes (~1,500–2,000 words). The copy in `case-study-v1.md` already hits this — don't pad it.

**Structure — exactly 8 sections, no others, in this order:**
1. Hero (built)
2. The Opportunity
3. Looking Beyond Features
4. Designing the Core Experience  ← **largest section**
5. Designing for Enterprise Scale
6. Beyond Design
7. Impact
8. Reflection

- Section 4 is organized as **5 workflows**, each structured **Challenge → Decision → Outcome** (copy already written for all five).
- Write *around* the screenshots — convey the thinking. Never describe the UI literally ("there's a blue button top-right").
- Contributions show through the narrative, never as a bullet list of "what I did."

**Banned content (do NOT add any of these):** personas, empathy maps, journey maps, a competitive-analysis section, design-thinking / double-diamond diagrams, wireframe galleries, large research-methodology sections, UX-method explanations.

**The centerpiece insight** (drives Section 3, keep it prominent): *"Why are users still relying on Excel?"* → analysts wanted **confidence, familiarity, speed** — something **easier than Excel, not more powerful**.

**Metrics are real — never inflate or alter:** 110,000-rule library · manual model ≈ **$58M/yr** & **50,000 analyst-days** · after ≈ **$3.75M** & **10,000 analyst-days** · market launch **~3 weeks → ~3 days**.

## 2. Visual direction (match the Hero)

Editorial / Russian-Constructivist meets Swiss editorial:
- **Cream background** `#FEF9EC`, **near-black** text `#29303D`, **a single hot red** `#DB3A34` as the spine. Yellow/orange/blue are **reserved for data-viz only** (Impact section) — never decorative.
- **Type:** Hecate Display for headlines + oversized stat numbers; 001 Sans Serif for body/labels. Italic Hecate for pull-quotes (the Excel insight).
- **Motifs:** `.SECTION` dot-prefix titles (e.g. `.THE OPPORTUNITY`), oversized stat numbers, red highlight blocks, thin hairline rules, generous whitespace, editorial grid.
- **Restraint:** one accent color as the spine. Premium, not busy. Type does the heavy lifting.

**All colors, type sizes, and spacing come from CSS variables in `tokens.css`.** No raw hex, no arbitrary px font sizes, no off-scale spacing anywhere. If a value you need doesn't exist as a token, add it to `tokens.css` (keep it on-scale) rather than hardcoding.

## 3. Tech & repo conventions

- **Stack:** Vite + React (JS, not TS), single-page, Vercel-ready. Already configured — don't change the build setup.
- **File structure to follow:**
  - Section components → `site/src/sections/<Name>.jsx` + colocated `<Name>.css` (mirror the Hero).
  - Reusable editorial primitives → `site/src/components/editorial/<Name>.jsx` + colocated CSS.
  - React Bits stay **unmodified** in `site/src/components/reactbits/`. Theme them via props at the point of use (cream/black/red), never by editing the upstream files.
  - UI screenshots will live in `docs/ui-designs/` (none provided yet) → mirror into `site/src/assets/` when wired. For now use clearly-marked placeholder slots (follow `Hero.jsx`'s `hero__shot-placeholder` pattern: hatched box, label, caption).
- `App.jsx` renders the sections in order. Currently renders `<Hero/>` only.
- React Bits deps are already installed: `motion`, `gsap`, `ogl`, `lenis`, `react-icons`. Import `motion` from `motion/react`.
- Respect `prefers-reduced-motion` (global.css already has a base; ensure new animations degrade).
- Keep the bundle reasonable: **one** WebGL/GPU background max for the whole page (Hero already uses DotGrid) — don't add GradientBlinds on top.

## 4. Shared editorial components to build (in `components/editorial/`)

Build these as reusable, prop-driven primitives, then use them across sections:

1. **`SectionHeader`** — `.SECTION` dot-prefix title (kicker) + optional lead-in line, on a hairline/2px rule like the Hero topline. Animate in with ScrollFloat or BlurText.
2. **`Prose`** — constrained measure (`--measure`) body container with the editorial paragraph rhythm. Wrap with ScrollReveal for on-scroll paragraph reveal.
3. **`StatBlock`** — oversized Hecate number + label, red accent. Used in The Opportunity and Impact. Use DecryptedText for the headline stat reveals ($58M → $3.75M).
4. **`PullQuote`** — large italic Hecate quote, red accent, for the *"Why are users still relying on Excel?"* moment.
5. **`BeforeAfter`** — two-column comparison (manual model vs AI-assisted) for the Impact metrics; this is the one place data-viz color (blue/amber) is allowed.
6. **`WorkflowCard`** — a single Challenge → Decision → Outcome card. Five of these stack in Section 4 via **ScrollStack**.
7. **`ImageSlot`** — placeholder/real screenshot block with caption, text wraps around it per the brief. (Generalize the Hero's placeholder.)
8. **`MetaCapability`** — small labeled block for the 5 enterprise-scale controls in Section 5 (Permissions, Audit, Dependencies, Draft mode, Citations); MagicBento is a candidate here — keep it restrained.

Each must be themeable through tokens and accept content as props/children (no hardcoded copy inside primitives).

## 5. React Bits role mapping (from reactbits/README.md — use as intended)

- **DotGrid** — Hero background (already used). Don't reuse elsewhere.
- **BlurText** — headline reveals (Hero uses it; reuse for section headlines sparingly).
- **ScrollFloat** — section-title float-in (`SectionHeader`).
- **ScrollReveal** — paragraph reveal on scroll (`Prose`).
- **DecryptedText** — the stat reveal moment ($58M → $3.75M) in Impact.
- **TextType** — typewriter for the natural-language rule prompt example in Workflow 1 (e.g. *"Flag providers with a missing NPI in Florida whose specialty is cardiology"*).
- **GradientText** — one accent key-phrase, used once, not everywhere.
- **ScrollStack** — the 5 workflow cards in Section 4.
- **MagicBento** — enterprise-scale capability grid in Section 5 (keep quiet).
- **Carousel** — UI screenshot gallery, once screenshots exist.
- **FlowingMenu** — optional section index / nav.
- **GradientBlinds** — skip for now (avoid a second WebGL background).

## 6. Section-by-section build (copy is in `case-study-v1.md`)

Build and visually verify **one section at a time**, in order. Commit after each.

- **§2 The Opportunity** — narrative + `StatBlock`s for 110,000 rules / $58M / 50,000 analyst-days / 3-weeks. Land the line: *"The problem was never the rules. It was who could change them."*
- **§3 Looking Beyond Features** — built around the `PullQuote` *"Why are users still relying on Excel?"* and the **easier than Excel, not more powerful** principle. This is the conceptual heart — give it room.
- **§4 Designing the Core Experience** — the **largest** section. Intro paragraph, then 5 `WorkflowCard`s in a `ScrollStack`, each Challenge→Decision→Outcome, each with an `ImageSlot`. Workflow 1 uses `TextType` for the NL-prompt example.
- **§5 Designing for Enterprise Scale** — "making power quiet." The 5 controls as `MetaCapability` blocks (Permissions, Version history/audit, Dependencies, Draft mode, Source citation).
- **§6 Beyond Design** — prose only; shows product-designer judgment (prioritization, pushing back on eng/stakeholders, product demos). No new viz.
- **§7 Impact** — the payoff. `BeforeAfter` comparison + `DecryptedText` on the headline numbers ($58M→$3.75M, 50k→10k days, 3wk→3d). This is the only section where data-viz color is allowed.
- **§8 Reflection** — quiet, confident close. Land: *"That's the difference between designing an interface and designing a product."*

## 7. Verification (required before each commit)

1. `npm run build` passes clean (no warnings you introduced).
2. `npm run dev` and visually check the section in the browser: layout, type hierarchy, motion, responsiveness (test ~375px, ~768px, ~1200px).
3. **Accessibility:** check color contrast on cream — `--text-secondary` and especially `--accent` red on cream can be marginal for small text; verify WCAG AA (4.5:1 body, 3:1 large). Keyboard focus visible. Animations respect reduced-motion. Headings nest correctly (one `<h1>` in Hero, `<h2>` per section).
4. Confirm no banned content crept in and the section reads in the editorial voice.

## 8. Out of scope / leave for the human

- Don't fabricate UI screenshots — use placeholder `ImageSlot`s; the author supplies real exports into `docs/ui-designs/`.
- **001 Sans Serif is a DEMO license** (~850KB) — flag before public deploy; don't swap fonts yourself.
- Don't deploy. Stop at a working local build + dev preview.

## 9. Definition of done

All 8 sections assembled in `App.jsx`, built from real `case-study-v1.md` copy, matching the Hero's direction, every value tokenized, clean production build, responsive, AA-accessible on cream, no banned content, reads in 5–7 minutes as a confident product-designer narrative. Commit each section as you go with clear messages.
