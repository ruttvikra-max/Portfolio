#!/usr/bin/env bash
# Run from the Tier-2 React project root, AFTER `npx shadcn@latest init`.
# Pulls the exact ReactBits source via the shadcn registry (no hand-copying).
set -e

echo "Installing runtime deps..."
npm install gsap

echo "Adding ReactBits effects (JS + CSS variants)..."
npx shadcn@latest add https://reactbits.dev/r/TextType-JS-CSS
npx shadcn@latest add https://reactbits.dev/r/SplashCursor-JS-CSS
npx shadcn@latest add https://reactbits.dev/r/MagicBento-JS-CSS
npx shadcn@latest add https://reactbits.dev/r/Masonry-JS-CSS

echo "Done. Remember: SplashCursor -> brown #C7AD9E, desktop-only, reduced-motion off."
