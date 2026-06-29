# Case-Study-Engine

Single source of truth for the **enterprise Rules Engine** portfolio case study (US Healthcare) — both the written content and the deployable case study site.

## Project at a glance
- **Product:** Enterprise Rules Engine for US Healthcare organizations
- **Status:** In development · 6-month timeline
- **Role:** Lead Product Designer (discovery → high-fidelity + product strategy)
- **Team:** PM · Engineers · Data Scientist · Designer
- **Core goal:** let ops teams configure rules without engineering — launch a new market in ~3 days instead of ~3 weeks

## Repository structure

```
docs/                  Written case study + source material
  brief/               Original guidelines (.docx) + structured brief (source of truth)
  references/          Reference case studies & storytelling/visual inspiration
  ui-designs/          Final UI screenshots/exports to embed
  color-scheme/        Brand colors, tokens, type, styling decisions
  drafts/              Working drafts of the written case study
site/                  Deployable case study website (the "Engine")
  public/              Static assets served as-is
  src/
    components/        UI components
    styles/            Global styles / tokens
    content/           Case study copy as structured content
    assets/            Images used by the site
```

## Case study structure (8 fixed sections)
1. Hero · 2. The Opportunity · 3. Looking Beyond Features · 4. Designing the Core Experience · 5. Designing for Enterprise Scale · 6. Beyond Design · 7. Impact · 8. Reflection

See `docs/brief/case-study-brief.md` for the full brief, tone, and writing rules.

## Workflow
Work happens in this repo. Drafts live in `docs/drafts/`, final copy feeds the site in `site/src/content/`. Assets (UI, colors) go in their `docs/` folders and are mirrored into `site/src/assets/` when used.
