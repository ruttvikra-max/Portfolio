**Document Type**: Portfolio Case Study
**Project / Feature**: Rules Engine — Natural-Language Rule Authoring for US Healthcare
**Author**:
**Date**: June 28, 2026
**Status**: Draft v1

---

# Rules Engine

## 1 · Hero

> **A healthcare ops team used to wait three weeks and a queue of engineers to change a single rule. We set out to make it three days — and put the work back in their hands.**

`[HERO IMAGE — product shot: the rule builder with the conversational assistant open]`

| | |
|---|---|
| **Role** | Lead Product Designer — discovery through high-fidelity, plus product strategy |
| **Timeline** | 6 months (in development) |
| **Team** | Product Manager · Engineers · Data Scientist · Designer (me) |
| **Ownership** | Owned the end-to-end product experience and shaped what we built and in what order |

---

## 2 · The Opportunity

Healthcare organizations run on rules. Eligibility, provider-data quality, billing accuracy, network participation, state-by-state Medicaid and CMS compliance — all of it is encoded as logic. A single client's rule library can exceed **110,000 rules**, and every one of them touches whether a patient gets access, whether a claim is correct, whether an audit passes.

The problem was never the rules. It was who could change them.

Authoring a rule required engineering syntax, so the people who understood the rules — business analysts with deep domain knowledge — couldn't touch them. Every change, even a trivial one, routed through a specialized Business Rules Unit. That dependency had a price the business could measure: rolling a new healthcare market live took nearly **three weeks**, support queues filled with simple change requests, and at full scale the manual model ran to roughly **$58 million a year** and **50,000 analyst-days** of effort.

This wasn't a request for a nicer internal tool. It was an operational liability. The goal was to let operations teams configure rules independently — cutting the engineering dependency while *improving* governance, scalability, and the confidence clients had in the system.

---

## 3 · Looking Beyond Features

When we started, the conversation in the room was about capability. What advanced logic could we support? How many rule types, how many operators, how much power?

I pushed in a different direction. Instead of *"What more can we build?"* I kept asking one question:

> ### *"Why are users still relying on Excel?"*

The answer reframed the whole project. Analysts weren't reaching for Excel because it was powerful. They reached for it because it was **theirs** — familiar, fast, and forgiving. They didn't want more functionality than the rule engine could already offer. They wanted **confidence**. They wanted to make a change and trust the result without filing a ticket and waiting.

So the bar wasn't "more powerful than Excel." It was **easier than Excel**. That became the design principle the rest of the product was measured against — and the reason I spent as much energy arguing things *out* of the product as designing things into it.

---

## 4 · Designing the Core Experience

The product is large — a rule builder, a library, validation, testing, version history, audit trails, dependencies, search, tags, citations, bulk editing, an AI assistant, draft mode, permissions, preview, and a visual flow view. Listing them explains nothing. What matters is how they collapse into a few workflows an analyst actually moves through.

### Workflow 1 — Author a rule in plain English

**Challenge.** Rule syntax was the wall between domain experts and their own logic. Even "simple" rules needed a technical translator.

**Decision.** We made natural language the front door. An analyst types what they mean — *"Flag providers with a missing NPI in Florida whose specialty is cardiology"* — and the engine translates that intent into executable, structured logic. The technical layer stays; we just stopped making the analyst speak it.

**Outcome.** The person who understands the rule can now write the rule. The translation step — and the ticket it used to require — disappears.

`[VISUAL — conversational rule authoring: natural-language prompt → generated structured rule]`

### Workflow 2 — Refine through conversation, not rework

**Challenge.** Handoffs between business and technical teams meant every revision was a slow round-trip, and intent got lost in translation.

**Decision.** Refinement stays conversational. *"Now include nurse practitioners"* updates the existing rule in place rather than starting over. The dialogue holds the context so the analyst never re-explains.

**Outcome.** Iteration happens in minutes, inside one continuous thread, with the business intent intact end to end.

`[VISUAL — iterative refinement thread: a rule evolving across two or three prompts]`

### Workflow 3 — Two views of the same truth

**Challenge.** A rule has to be reviewed by people with very different fluency — analysts comfortable with logic, and business stakeholders who are not.

**Decision.** Every rule renders two synchronized ways: a **structured text view** with the precise conditions, and a **visual flow view** that reads as a sequence anyone can follow. Same rule, same source of truth, two doors in.

**Outcome.** Technical and non-technical reviewers validate the same logic before anything ships — fewer misreads, faster sign-off, shared understanding.

`[VISUAL — dual view: structured logic on one side, flow diagram on the other]`

### Workflow 4 — Trust before publish: validation & conflict detection

**Challenge.** In a 110,000-rule library, a new rule can silently contradict an existing one. Catching that by hand was slow and risky — and undetected conflicts become compliance and billing failures.

**Decision.** Validation and conflict detection run inline, as the analyst works, with feedback in plain language before publish — not in a separate review cycle weeks later.

**Outcome.** Confidence moves to the moment of authoring. Errors are caught where they're cheapest to fix, and the analyst publishes knowing the rule holds.

`[VISUAL — inline validation + conflict warning surfaced during authoring]`

### Workflow 5 — Find, reuse, and change at scale

**Challenge.** Tens of thousands of rules are useless if you can't find the one you need — and pointless to edit one at a time.

**Decision.** Search, filters, and tags make the library navigable; duplication and bulk editing let analysts reuse and update many rules safely in one pass, with the same validation guarding the batch.

**Outcome.** The library becomes a working asset, not an archive. Routine bulk changes that used to demand the Business Rules Unit now sit with the analyst.

`[VISUAL — rule library: search, filters, tags, and a bulk-edit action]`

---

## 5 · Designing for Enterprise Scale

Approachability was the goal; it couldn't come at the cost of the controls healthcare requires. The harder design work was making power *quiet* — present when needed, invisible when not.

**Permissions** decide who can draft, who can publish, and who can only view, so autonomy never undercuts governance. **Version history and audit trails** record what changed, when, and by whom — non-negotiable when an auditor or a regulator asks the system to account for itself. **Rule dependencies** are made visible so a change in one place doesn't quietly break another. **Draft mode** gives analysts room to work without touching production logic. **Source citation** ties a rule back to the regulation or policy that justifies it, so compliance is built in rather than reconstructed later.

None of these are features an analyst asks for by name. They're the reasons a healthcare client will trust the tool with 110,000 live rules — and the reason the simpler front end is safe to offer at all.

---

## 6 · Beyond Design

I didn't own a screen library; I owned the product experience, and that meant being in the arguments that decide a product.

I prioritized what shipped and in what order, pushing the conversational core ahead of advanced capabilities because that's what unblocked real users first. I challenged engineering when a proposed approach added complexity the user would feel without solving their problem, and I pushed back on stakeholders when "more powerful" was winning over "more usable." I validated direction by running product demonstrations — putting the work in front of the people who'd live in it and letting their reactions, not our assumptions, set the next sprint.

Working alongside the PM, engineers, and a data scientist, my job was as much about protecting the product's focus as drawing its interface.

---

## 7 · Impact

The model we replaced cost roughly **$58 million a year** across **50,000 analyst-days** of manual effort. The redesigned, AI-assisted workflow is projected to bring the same 110,000-rule library to about **$3.75 million** and **10,000 analyst-days** — and to compress a new market launch from **~3 weeks to ~3 days**.

But the number that matters most isn't a cost line. It's that the people who understand the rules can now change them. Engineering dependency drops. Governance improves because every change is validated, versioned, and audit-ready by default. Discoverability replaces tribal knowledge. Configuration errors fall because conflicts surface before publish. And clients gain something harder to quantify than savings: confidence that the system they run their operations on is one they can actually control.

These aren't shipped features. They're operational problems that stopped being problems.

---

## 8 · Reflection

This project changed how I think about enterprise software. The instinct in complex domains is to meet complexity with more — more capability, more options, more power. The work that mattered here was the opposite: understanding *why* people still trusted a spreadsheet over a purpose-built system, and designing for that trust instead of designing past it.

The best thing we built wasn't a feature. It was the confidence to let a non-engineer change a rule that affects a hundred thousand others — and be right.

That's the difference between designing an interface and designing a product.
