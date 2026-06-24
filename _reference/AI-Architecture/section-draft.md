# §13 — THE DETECTION ENGINE
**Case Study Section Draft — AI Architecture**
*Status: Draft · Pending Ruttvik Review*

---

## OPENING STATEMENT

> "The most dangerous thing you can add to a governance tool is uncertainty. The same file should always produce the same score."

---

## A — THE HONEST CHOICE

**Section heading:** Why I didn't reach for AI first.

Every design tool built in 2024 reaches for an LLM. I almost did too. But before writing a single line of code, I asked one question that changed the direction of the engine entirely: *what does a governance metric actually need to be trustworthy?*

The answer was reproducibility.

If a designer runs the analysis twice on the same file, fixes nothing between runs, and gets a different score — the tool becomes noise. A governance metric that produces variable output isn't a metric. It's a guess.

That constraint ruled out LLMs for the measurement core immediately. They're non-deterministic by design. So v1 of the DSIE engine is a pure deterministic rule-based static-analysis system — not because I couldn't build with AI, but because deterministic output was the *correct design decision* for this specific problem.

The second reason reinforced it: the Figma sandbox has no network access. Design files — especially at enterprise scale — contain proprietary IP. The privacy story of *your design data never leaves your machine* is a genuine product feature, not a workaround.

---

### [INFOGRAPHIC A — "WHY DETERMINISTIC FIRST"]
*Four-column strip. Dark background. JetBrains Mono for labels, Inter for descriptions. border-right dividers. No card backgrounds.*

| REPRODUCIBLE | PRIVATE | OFFLINE | FAST |
|---|---|---|---|
| Same file always produces the same score. Auditable, testable, trusted. | Design data never leaves the machine. Works on proprietary enterprise files. | No network calls. Works anywhere, anytime. | Single-pass over 15k-node files in seconds. |

---

## B — THE TWO-ENVIRONMENT MODEL

**Section heading:** A non-trivial constraint that shaped the entire architecture.

Figma plugins run in two completely isolated environments that cannot access each other's APIs. Understanding this constraint is understanding why the plugin is architected the way it is.

The **plugin sandbox** (`code.ts`) has full access to the Figma file API — it can read every node, variable, layer, component, and property in the document. But it has no DOM, no `window`, and no network access.

The **UI iframe** (React) has a full browser DOM and can render any interface. But it has zero access to the Figma file API — it's completely blind to the design data.

The only bridge between them is a strictly typed `postMessage` channel. When analysis completes in the sandbox, it fires a single `ANALYSIS_COMPLETE` message with the full results payload. The React interface receives it and renders.

This forced a clean separation: the engine and the UI are two entirely independent systems that communicate through a defined contract. The build system (Vite) produces two separate bundles — a sandboxed IIFE for `code.ts` and a self-contained HTML+JS bundle for the UI iframe.

---

### [INFOGRAPHIC B — "TWO ENVIRONMENTS"]
*Full-width two-column layout. Vertical divider with `postMessage →` written across the bridge in mono.*

```
┌────────────────────────────┐              ┌────────────────────────────┐
│  PLUGIN SANDBOX            │              │  UI IFRAME                 │
│  code.ts                   │  postMessage │  React                     │
│                            │ ───────────→ │                            │
│  ✓  Figma Plugin API       │ ANALYSIS_    │  ✓  Full DOM access        │
│  ✓  File nodes, variables  │ COMPLETE     │  ✓  React components       │
│  ✗  No DOM                 │              │  ✗  No Figma API           │
│  ✗  No network access      │              │  ✗  Blind to design data   │
│                            │              │                            │
│  Runs: traversal,          │              │  Renders: score, pillars,  │
│  analysis, scoring         │              │  per-screen issues, grade  │
└────────────────────────────┘              └────────────────────────────┘
      Vite IIFE build                              Vite singlefile build
```

---

## C — HOW THE SCAN WORKS

**Section heading:** One pass. Everything counted.

When the designer clicks "Run Analysis," the orchestrator (`runAnalysis()`) begins a single synchronous traversal of the entire current page. Because the Figma sandbox is single-threaded, everything runs sequentially — but a single pass is sufficient, because all four analyzers operate on the same collected node set.

**`collectTokenLibrary()`** — Extracts the file's own local color variables and paint styles into an in-memory reference set. This is what the Token Compliance analyzer compares fills and strokes against. The reference is derived from the file itself, not an external schema — which means the engine works correctly with any design system, regardless of its naming conventions or structure.

**`traversePage()`** — Walks the complete node tree in a single pass, building a `CollectedNode[]` array that captures the screen model, geometry, properties, and relationships. The traversal stops at component/instance boundaries so the engine never flags issues inside library components — only in how those components are used.

---

### [INFOGRAPHIC C — "THE PIPELINE"]
*Full-width horizontal flow diagram. Left to right. Mono labels. Thin arrows. Four analyzers fan out from the orchestrator, converge at scoring.*

```
[Figma File — current page]
         ↓  Figma Plugin API

  ┌──────────────────────────────────────────────────────────────────┐
  │  PLUGIN SANDBOX — code.ts                                        │
  │                                                                  │
  │  collectTokenLibrary()            traversePage()                 │
  │  color vars + paint styles        single-pass walk → CollectedNode[]
  │              ↓                           ↓                       │
  │              └──────────┬────────────────┘                       │
  │                         ↓                                        │
  │                  ┌─────────────┐                                 │
  │                  │ ORCHESTRATOR│                                 │
  │                  │ runAnalysis()                                 │
  │                  └──────┬──────┘                                 │
  │          ┌──────────────┼──────────────┬──────────────┐          │
  │          ↓              ↓              ↓              ↓          │
  │  analyzeComponents  analyzeTokens  analyzeNaming  analyzeSpacing │
  │  Component Integrity Token Compliance Naming Gov.  Spacing       │
  │       [35%]             [30%]          [20%]        [15%]        │
  │          ↓              ↓              ↓              ↓          │
  │          └──────────────┴──────────────┴──────────────┘          │
  │                         ↓                                        │
  │        scorePillar ×4 → computeDriftScore                        │
  │        weighted + lenient curve → 0–100 + grade A–F              │
  └──────────────────────────────────────────────────────────────────┘
         ↓  postMessage: ANALYSIS_COMPLETE

  [UI IFRAME — React]
  Results modal: Drift Score · Pillar breakdown · Per-screen issues
```

---

## D — THE FOUR ANALYZERS

**Section heading:** Four specialists. Each with a different job and a different weight.

The orchestrator routes to four analyzer modules. Each returns a `Violation[]` array with three fields: severity (`CRITICAL / MEDIUM / LOW`), location (screen + node path), and evidence (expected vs. found). The weights reflect what usability testing revealed about which failures cause the most real-world pain.

---

### [INFOGRAPHIC D — "FOUR ANALYZERS + WEIGHTS"]
*Four horizontal strips. border-bottom dividers. Ghost numbers (01–04) at left at 80px, ~4% opacity. Each strip: ghost number | name + weight | weight bar | description.*

```
01   COMPONENT INTEGRITY                                         [35%]
     ████████████████████████████████████████████████
     Detects detached instances, unlinked components, structural overrides.
     Ranked #1 by every usability testing participant — the highest daily pain point.
     Stops at component boundaries: flags usage, never library internals.

02   TOKEN COMPLIANCE                                            [30%]
     ████████████████████████████████████████
     Compares every fill and stroke against the file's extracted token library.
     Flags hardcoded values and missing token references.
     Reference set derived at scan time — works with any design system.

03   NAMING GOVERNANCE                                           [20%]
     ██████████████████████████
     Detects auto-named layers: /^(Frame|Group|Rectangle|Ellipse|Text)\s\d+$/
     Enforces slash-path convention for components and layer depth limits.
     Critical for automation pipelines and developer handoff reliability.

04   SPACING CONSISTENCY                                         [15%]
     ████████████████████
     4-detector sub-engine:
     · Off-grid values (4px baseline)
     · Gap uniformity within auto-layout frames
     · Repeated-item spacing mismatch
     · Cross-screen-family drift
     Measured geometrically from bounding boxes. Works with or without auto-layout.
```

**Callout (pull quote):**
> The spacing analyzer is four independent detectors running under one pillar. The cross-screen-family drift detector compares spacing patterns across screens that share a visual language, flagging divergence that's invisible at the component level but obvious when you scroll through the product.

---

## E — HOW ISSUES BECOME A SCORE

**Section heading:** A number that means something.

Each analyzer converts its findings into a pillar score. The raw compliance percentage passes through a lenient curve before weighting — a deliberate product decision.

A tool that drops a team's score from 90 to 40 because of three low-severity naming issues will be ignored within a week. The lenient curve means small numbers of isolated violations don't cascade the score. Critical violations in high-weight pillars still drag it down clearly. The curve is calibrated so the number reads as *credible* — not as an alarm, and not as flattery.

---

### [INFOGRAPHIC E — "SCORING MODEL"]

**Part 1 — Formula strip (mono, centered):**
```
PILLAR SCORE ×4  →  WEIGHTED SUM  →  LENIENT CURVE  →  DRIFT SCORE 0–100

(Component × 0.35) + (Token × 0.30) + (Naming × 0.20) + (Spacing × 0.15)
```

**Part 2 — Grade table (5 rows, border-bottom dividers, no card backgrounds):**

| SCORE | GRADE | LABEL |
|---|---|---|
| 90 – 100 | A | HEALTHY |
| 75 – 89 | B | NEEDS ATTENTION |
| 60 – 74 | C | AT RISK |
| 40 – 59 | D | DEGRADED |
| 0 – 39 | F | CRITICAL |

---

## F — WHAT COMES NEXT: THE AGENTIC LAYER

**Section heading:** V1 is the measurement core. V2 is the intelligence layer.

The deterministic engine solves detection and scoring cleanly. What it can't do is explain. It can tell you *that* a fill value doesn't match any token. It can't tell you *which* token you probably meant, *why* the convention exists, or *how* to fix it in context.

That's the boundary where AI becomes the right tool — not for the score, but for everything that comes after it.

The target architecture adds a RAG + LLM layer on top of the deterministic core. The two layers have completely separate responsibilities and must stay that way: the measurement core stays deterministic, the intelligence layer handles explanation and remediation.

---

### [INFOGRAPHIC F — "V1 → V2 EVOLUTION"]
*Two-column layout. Vertical rule between them. V2 column has accent border-top (3px). New V2 items prefixed with `+` in accent colour.*

```
V1 — IMPLEMENTED (NOW)                    V2 — TARGET ARCHITECTURE
──────────────────────────                ──────────────────────────────────────
Deterministic rule-based detection    +   LLM explanation layer
File-derived token reference set      +   RAG over design system documentation
Offline · zero inference cost         +   Context-aware remediation suggestions
Reproducible, auditable score         +   Semantic component intent grouping
Sequential single-pass analysis       +   Agentic auto-fix proposals
Score only                            +   Score + Why it's wrong + How to fix it
```

---

### [INFOGRAPHIC G — "V2 AGENTIC LAYER DETAIL"]
*Two columns with border-right divider. Left: RAG RETRIEVES. Right: LLM PRODUCES.*

```
RAG RETRIEVES                               LLM PRODUCES
──────────────────────────────              ──────────────────────────────
Team's design system documentation          Plain-language rationale per violation
Spacing guidelines and token specs          "Use spacing/sm = 8px — per your DS doc"
Component usage rules and do/don'ts         Suggested fix draft for designer review
Naming conventions with examples            Semantic screen-family grouping by intent
```

**Body copy:**

The measurement core must remain deterministic. A score that can change without the file changing is not a governance metric. The LLM layer sits above the score — it reads the findings and the retrieved documentation, then generates the explanation. The score is never touched by inference. Only the words around it are.

This two-layer model isn't a compromise — it's the responsible way to add AI to a system that must produce a defensible number.

---

## CLOSING LINE

> **"The engine doesn't guess. The next version will explain."**

---

## INFOGRAPHIC DESIGN NOTES
*(For Ruttvik — when building visuals in cowork)*

| Infographic | Layout | Background | Key Visual Element |
|---|---|---|---|
| A — Why Deterministic | 4-column strip | `#0C0C1C` | border-right dividers only, no cards |
| B — Two Environments | 2-column split | `#0C0C1C` | postMessage bridge label in mono |
| C — Pipeline | Horizontal flow | `#07070F` | Left-to-right arrows, fanout branches |
| D — Four Analyzers | 4 horizontal strips | `#07070F` | Ghost numbers 80px / 4% opacity |
| E — Scoring | Formula + table | `#07070F` | Mono formula, clean table rows |
| F — V1 → V2 | 2-column split | `#0C0C1C` | Accent border-top on V2 column |
| G — Agentic Detail | 2-column split | `#0C0C1C` | border-right divider only |

**Fonts:** Space Grotesk 800 for headings · Inter for body · JetBrains Mono for labels, code, formulas
**Accent colour:** `#5C6CF2`
**Rule colour:** `rgba(255,255,255,0.08)` on dark · `#DDDDED` on light
