# React Bits Components (staged)

12 components copied from reactbits.dev (JS + CSS variant), ready to import into the case study site. Source: https://reactbits.dev — MIT licensed.

## Components & intended use in the case study
| Component | Folder | Likely use |
|---|---|---|
| FlowingMenu | `FlowingMenu/` | Section nav / index of the 8 sections |
| GradientBlinds | `GradientBlinds/` | Hero background (WebGL via `ogl`) |
| DotGrid | `DotGrid/` | Background texture (the "dot-field" requested) |
| BlurText | `BlurText/` | Headline reveal on scroll |
| TextType | `TextType/` | Typewriter — great for the NL-rule prompt example |
| GradientText | `GradientText/` | Accent headline / key phrase |
| DecryptedText | `DecryptedText/` | Stat reveal / the "$58M → $3.75M" moment |
| ScrollFloat | `ScrollFloat/` | Section title float-in |
| ScrollReveal | `ScrollReveal/` | Paragraph reveal on scroll |
| ScrollStack | `ScrollStack/` | The 5 workflow cards (Challenge→Decision→Outcome) |
| MagicBento | `MagicBento/` | Feature grid / enterprise-scale capabilities |
| Carousel | `Carousel/` | UI screenshot gallery |

## Required npm dependencies
Install in `site/` when scaffolding:
```bash
npm i motion@^12.23.12 gsap@^3.13.0 ogl@^1.0.11 lenis@^1.3.13 react-icons@^5.5.0
```
- **gsap** — FlowingMenu, DotGrid, TextType, ScrollFloat, ScrollReveal, MagicBento (uses `gsap/ScrollTrigger`, `gsap/InertiaPlugin` — bundled with gsap)
- **motion** — BlurText, GradientText, DecryptedText, Carousel
- **ogl** — GradientBlinds
- **lenis** — ScrollStack
- **react-icons** — Carousel

## Notes
- These are unmodified upstream sources. Color/animation props will be themed to our palette (cream/black/red) at the point of use, not by editing these files.
- Performance: GradientBlinds (WebGL) and DotGrid are GPU-backed — use sparingly, prefer one hero background.
