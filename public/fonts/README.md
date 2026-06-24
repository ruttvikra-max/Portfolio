# Rengok font — drop files here

Place the Rengok font files in this folder. Supported names (any one works):

- `Rengok.woff2`  ← preferred
- `Rengok.woff`
- `Rengok.otf` / `Rengok.ttf`

If you have multiple weights, name them:
`Rengok-Regular.woff2`, `Rengok-Medium.woff2`, `Rengok-Bold.woff2`, etc.

The @font-face declaration is already wired in `src/app/globals.css` (search "Rengok").
Until the files exist, the site falls back to a similar display font so layout/spacing stay correct.
