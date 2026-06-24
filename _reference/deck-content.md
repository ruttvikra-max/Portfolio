# DSIE Deck — Extracted Content (21 slides)
*Source: Figma Slides "Design System Intelligence Engine" — final review deck. Extracted via Figma Desktop Bridge, 2026-06-24.*

## Deck structure (agenda, slide 2)
Problem Statement (s3) · Market Opportunity (s6) · User Research (s8) · Competitor Landscape (s12) · User Persona (s13) · Our Solution (s16)

---

## 1 — Title
- **Design System Intelligence Engine**
- Detecting and measuring design system drift across Figma workflows
- Design Systems → Governance → Intelligence
- Presented by Ruttvik Aron · PG Certification Presentation

## 3 — Problem Statement: "Design Systems Breakdown at Scale"
- **Detached Components** — components break away from the source library across files
- **Token Overrides** — design tokens overridden, breaking visual consistency
- **Naming Divergence** — teams introduce inconsistent naming patterns
- **Design–Dev Misalignment** — implemented UI gradually stops matching design files

## 4 — Operational Impact: "Design Drift Creates Operational Inefficiency"
- **Rework** — 15–25% of design time spent fixing inconsistencies
- **QA Defects** — 20–30% of UI bugs originate from design–dev mismatch
- **Slow Onboarding** — 30–40% longer ramp-up for new designers & developers
- **System Instability** — lower component reuse, fragmented UI patterns

## 5 — Design Drift Lifecycle (compounding loop)
"Design drift is not a single issue — it is a systemic lifecycle that compounds over time."
Design System Created → Product Teams Ship Features → Local Overrides & Quick Fixes → Detached Components & Token Drift → Design–Development Mismatch → Manual Fixes & Patch Work → System Authority Weakens → More Drift Accumulates → (loops)

## 7 — Market Opportunity: "Why India, Why Now?"
- India is Figma's 2nd-largest user market; 40% of BSE-100 are customers
- **Target market:** mid-sized Indian product teams scaling design systems + early-stage design agencies
- **₹2,244 Cr** — UX design market size by 2025 ($2.9B)
- **19.80%** — CAGR, Asia-Pacific (fastest-growing region globally)
- **57%** — of Indian businesses increased digital design investment in 5 years
- **93%** — of Indian designers already use AI; cloud tools adopted by 44% of businesses

## 9 — User Research Overview
- A survey was conducted with professionals working in product teams to validate the problem.
- Goal: understand how design drift affects real workflows.
- **GAP:** "Participants included …" — count/roles not captured in text.

## 10 — Key Survey Insight: "Design Drift is a Real Problem"
- **67%** rated design drift a major issue
- **100%** said manual checks take too long → "Manual Design Audits Don't Scale"
- **66.7%** said poor UI architecture causes bugs/scaling problems
- **44.4%** said inconsistent component naming breaks MCP/dev handoff
- AI code-gen fails on messy design; teams have no quick reports/proof
- "Design drift directly affects development speed, product stability, and system scalability."

## 11 — Key Survey Insight: development rework
- **88.9%** said design drift causes >10% dev rework
- Rework time distribution: 0–10% → 11.1% · 11–25% → 44.4% · 26–50% → 22.2% · >50% → 22.2%
- "Nearly half spend 11–25% of dev time on rework; 44.4% experience heavy rework (26–50%+)."

## 12 — Competitive Landscape
"Seven tools operate in adjacent spaces — none covers the full picture."
ComponentQA · Design Lint · Tokens Studio · Validator · UX Expert · Supernova · Zeroheight
(Full detail in Google Sheet → `/tmp/competitors.csv`: positioning, funding, target market, key feature gaps.)

## 14 — Persona 1: Aditi Sharma
- 27 · Startup Product Designer · SaaS Startup (40 employees)
- **Goals:** maintain UI consistency; deliver features quickly
- **Pain points:** manual audits; detached components; token overrides
- **Behaviors:** works inside Figma daily; uses shared design libraries; iterates quickly with devs
- **Needs:** automated design system validation; faster detection of inconsistencies

## 15 — Persona 2: Rahul Verma
- 34 · Design System Lead · Large Fintech Organization
- **Goals:** ensure design system adoption; maintain system governance
- **Pain points:** manual reviews across many files; hard to track system health
- **Behaviors:** oversees multiple product teams; maintains centralized component library; reviews consistency regularly
- **Needs:** automated governance insights; visibility into design system health

## 16 — Our Solution: "Built to govern design."
A Figma-based engine that detects, measures, and reports on design system health — **pure analysis, no automation.**

## 17 — How it Works: Ingest → Scan → Detect → Report
- **Ingest** — connect to a Figma file + its linked design system; establishes source of truth
- **Scan** — traverse full component tree, token usage, naming patterns across every layer
- **Detect** — flag detached instances, token drift, component overrides, naming violations
- **Report** — output a structured UI blueprint + compliance score (analysis only)

## 18 — What the engine detects: Four pillars
- **Token compliance** — misused/missing/hardcoded tokens
- **Component integrity** — detached instances, unlinked components, structural overrides
- **Naming governance** — violations of architecture-based naming conventions
- **System drift score** — quantified health score across the file

## 19 — From Design Drift → Actionable System Governance (two outputs)
- **UI Blueprint** — structured architectural map; component-to-system mapping, drift hotspots, reuse-vs-custom ratio, structural integrity
- **Compliance & Drift Report** — detects detached components, token violations (color/spacing/typography), naming inconsistencies, hard-coded styles; each issue ranked by severity & impact

## 20 — Roadmap: "The Road to Design System Intelligence"
- **Foundation (Now)** — drift detection, token validation, naming enforcement → *Baseline compliance visibility*
- **Automation (Next)** — auto-fix violations, token replacement suggestions, governance PR workflows → *Reduced manual remediation*
- **Continuous Intelligence (Future)** — real-time compliance dashboards, regression alerts on commits, team health reporting → *Proactive design system governance*

## 21 — Thank you

---

## CONTENT GAPS (not in deck)
1. **The "plugin vs standalone software" trial-and-test journey** — the centerpiece the user described. NOT present in deck.
2. **Survey participants** — count & roles (slide 9 placeholder).
3. **Outcome/impact** — deck ends at roadmap; no post-launch metrics (likely a validated concept/MVP).
4. **Actual plugin UI screens** — check whether visual designs exist (design file / elsewhere) for the Solution section.
