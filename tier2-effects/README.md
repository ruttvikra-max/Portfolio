# Tier-2 effects — staging kit (NOT wired in yet)

These are ReactBits components + interaction specs we want **ready** for Tier 2
(when the site gains React / React Three Fiber). They are **not** installed into the
static Tier-0 site — ReactBits needs React, and we're deliberately staying static
until Tier 2.

The `shadcn` MCP is installed at user scope, so at Tier 2 the exact, up-to-date
source is pulled with the commands below (no hand-copying — avoids version drift).

> Variant choice: **JS + CSS** (`*-JS-CSS`) to match our plain-CSS + design-token
> approach (no Tailwind). If we go TypeScript at Tier 2, swap the suffix to `-TS-CSS`.

---

## 1. Hero text — TextType
Typewriter effect for the hero headline / role line.
- Source: https://reactbits.dev/text-animations/text-type
- Files: `TextType/TextType.jsx`, `TextType/TextType.css`
- Deps: `gsap`
- Install: `npx shadcn@latest add https://reactbits.dev/r/TextType-JS-CSS`
- Use: hero `<h1>` ("First, coffee.") and/or the role line. **Accessibility:** under
  `prefers-reduced-motion`, render the final string immediately (skip the animation).

## 2. Cursor — SplashCursor (brown)
Fluid-sim cursor trail. **Use the kraft brown `#C7AD9E`.**
- Source: https://reactbits.dev/animations/splash-cursor
- Files: `SplashCursor/SplashCursor.jsx`
- Deps: none (self-contained WebGL)
- Install: `npx shadcn@latest add https://reactbits.dev/r/SplashCursor-JS-CSS`
- Config:
  - Brown `#C7AD9E` = `rgb(199,173,158)` → normalized `{ r: 0.78, g: 0.68, b: 0.62 }`.
    Set the splat color to this (override `generateColor()` to return the brown, or
    fix the color and set `COLOR_UPDATE_SPEED = 0`) so it reads as coffee, not rainbow.
  - **Desktop + pointer:fine only.** Disable on touch and on `prefers-reduced-motion`.
  - Render behind content (`position:fixed; inset:0; z-index:-1; pointer-events:none`),
    keep opacity low so it supports — never fights — the warm palette.

## 3. Graphics gallery — pick ONE (the "creativity world" section)
For a future section showcasing graphic work (not in the current IA yet).
Keep both staged; decide at build time.

**Option 1 — MagicBento**
- Source: https://reactbits.dev/components/magic-bento
- Files: `MagicBento/MagicBento.jsx`, `MagicBento/MagicBento.css`
- Deps: `gsap`
- Install: `npx shadcn@latest add https://reactbits.dev/r/MagicBento-JS-CSS`

**Option 2 — Masonry**
- Source: https://reactbits.dev/components/masonry
- Files: `Masonry/Masonry.jsx`, `Masonry/Masonry.css`
- Deps: `gsap`
- Install: `npx shadcn@latest add https://reactbits.dev/r/Masonry-JS-CSS`

> Bento = curated, editorial, fixed highlights. Masonry = many pieces, gallery feel.
> Lean Bento if the graphic work is a tight set; Masonry if it's a large body.

---

## Button micro-interaction spec
Reference (look & feel + micro-interaction): https://jitter.video/file/?id=P7coK9xopur3xyZOUzHJB6WH&nodeId=51m89pqtMucwbSj_ArLSp

Translate the Jitter feel onto our tokens (consistent with the `emil-design-eng` motion principles):
- **Shape/fill:** pill (`--radius-pill`), warm fill `--accent`; primary uses dark
  `--text-primary` label on warm (on-brand contrast).
- **Hover (the "pour"):** the heat gradient (`--accent-gradient`) sweeps in from the
  bottom over `--dur-ui` with `--ease-pour`; a slight `translateY(-2px)` lift.
- **Press:** weighted `scale(0.98)` at `--dur-micro` — settle, no bounce.
- **Icon nudge:** trailing icon (→ / ↺) shifts ~4px on hover, eases back on leave.
- **Focus:** `--focus-ring` (3px, offset) — never removed.
- **Reduced motion:** drop the lift/sweep, keep an instant fill + focus state.

Apply to `.btn-primary`, `.refill`, and Tier-2 interactive buttons. The Tier-0
`base.css` already implements the lift + press; the gradient-sweep hover lands at Tier 2.

---

## One-shot install (run inside the Tier-2 React app)
See `install-effects.sh`. Run it from the React project root **after** `components.json`
exists (i.e. after `npx shadcn@latest init`).
