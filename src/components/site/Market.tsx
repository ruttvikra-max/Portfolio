"use client";

import type { CSSProperties, ReactNode } from "react";
import CardSwap, { Card as RawCard } from "@/components/CardSwap";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

// the .jsx Card forwardRef doesn't expose children/style to TS — give it a usable type
const Card = RawCard as React.ComponentType<{
  children?: ReactNode;
  style?: CSSProperties;
  customClass?: string;
}>;

const STATS = [
  { value: "₹2,244 Cr", label: "UX design market size in India by 2025 ($2.9B)" },
  { value: "19.8%", label: "CAGR — Asia-Pacific, the fastest-growing region globally" },
  { value: "57%", label: "of Indian businesses raised digital-design investment in 5 years" },
  { value: "93%", label: "of Indian designers already use AI; 44% of businesses use cloud tools" },
];

const COMPETITORS = [
  { name: "ComponentQA", pos: "Design-system QA & drift fixer", stage: "Early-stage plugin", gap: "No naming / UI architecture" },
  { name: "Design Lint", pos: "Error finder for design systems", stage: "Open-source plugin", gap: "No reports / naming / architecture" },
  { name: "Tokens Studio", pos: "Design-token management", stage: "Acquired by InVision (2023)", gap: "Weak drift reports / MCP" },
  { name: "Validator", pos: "Token compliance checker", stage: "Figma plugin", gap: "Tokens only — no MCP / UI depth" },
  { name: "UX Expert", pos: "Automated UX linting", stage: "Pre-funding prototype", gap: "No drift / audit focus" },
  { name: "Supernova", pos: "Enterprise token platform", stage: "$15M+ funded", gap: "Limited renaming / governance" },
  { name: "Zeroheight", pos: "Living documentation", stage: "Funded startup", gap: "No automation / UI scoring" },
];

// capability coverage — 2 = full, 1 = partial, 0 = none
const CAPS = ["Drift", "Tokens", "Naming", "UI Arch", "Score", "Offline"];
const MATRIX: { name: string; cov: number[]; ours?: boolean }[] = [
  { name: "ComponentQA", cov: [1, 1, 0, 0, 1, 1] },
  { name: "Design Lint", cov: [0, 1, 0, 0, 0, 2] },
  { name: "Tokens Studio", cov: [0, 2, 0, 0, 0, 1] },
  { name: "Validator", cov: [0, 2, 0, 0, 0, 2] },
  { name: "UX Expert", cov: [0, 0, 0, 1, 0, 0] },
  { name: "Supernova", cov: [0, 2, 1, 1, 0, 0] },
  { name: "Zeroheight", cov: [0, 1, 0, 0, 0, 0] },
  { name: "DSIE — Ours", cov: [2, 2, 2, 2, 2, 2], ours: true },
];

function Mark({ v, ours }: { v: number; ours?: boolean }) {
  if (v === 2)
    return (
      <span className={ours ? "text-accent-primary" : "text-pearl/85"} aria-label="full">
        ●
      </span>
    );
  if (v === 1)
    return (
      <span className="text-fog/55" aria-label="partial">
        ◐
      </span>
    );
  return (
    <span className="text-white/15" aria-label="none">
      –
    </span>
  );
}

export default function Market() {
  return (
    <section
      id="market"
      className="relative border-t border-white/5 bg-void-1 py-28 sm:py-36"
    >
      <div className="wrap">
        <SectionHeader
          index="04"
          chapter="The Market"
          title="Why India, why now."
          lead="India is Figma's second-largest user market — 40% of the BSE-100 are customers. The wedge: mid-sized Indian product teams scaling their design systems, and early-stage design agencies."
        />

        {/* stat band */}
        <div className="mt-16 grid grid-cols-1 gap-y-10 border-y border-white/10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-6">
          {STATS.map((s, i) => (
            <Reveal
              key={s.value}
              delay={i * 80}
              className="lg:border-l lg:border-white/10 lg:pl-6 lg:first:border-l-0 lg:first:pl-0"
            >
              <div className="font-display text-[clamp(34px,4vw,52px)] font-normal leading-none text-accent-primary">
                {s.value}
              </div>
              <p className="mt-4 max-w-[15rem] text-sm leading-relaxed text-fog/75">
                {s.label}
              </p>
            </Reveal>
          ))}
        </div>

        {/* competitive landscape */}
        <div className="mt-24">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            {/* left — narrative */}
            <div>
              <Reveal className="kicker mb-3 text-fog/45">Competitive landscape</Reveal>
              <Reveal
                as="h3"
                delay={60}
                className="max-w-xl text-balance font-display text-[clamp(26px,3.2vw,40px)] font-normal leading-tight tracking-[-0.01em] text-pearl lg:max-w-none"
              >
                Seven tools in adjacent spaces. None covers the full picture.
              </Reveal>
              <Reveal delay={130} className="mt-5 max-w-xl text-fog/75 lg:max-w-none">
                Each rival owns one slice — tokens, linting, or documentation.
                Hover to pause and read where each one stops short.
              </Reveal>
            </div>

            {/* right — CardSwap stack (desktop) */}
            <div className="relative hidden h-[420px] lg:block">
              <CardSwap
                width={400}
                height={270}
                cardDistance={46}
                verticalDistance={52}
                delay={3000}
                pauseOnHover
                skewAmount={5}
                easing="elastic"
                onCardClick={() => {}}
              >
                {COMPETITORS.map((c) => (
                  <Card
                    key={c.name}
                    style={{
                      background: "#11141b",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 18,
                    }}
                  >
                    <div className="flex h-full flex-col justify-between p-7">
                      <div className="flex items-start justify-between gap-4">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-primary/15 font-display text-lg text-accent-primary">
                          {c.name[0]}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-fog/60">
                          {c.stage}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-display text-2xl leading-none text-pearl">
                          {c.name}
                        </h3>
                        <p className="mt-2 text-sm text-fog/80">{c.pos}</p>
                      </div>
                      <div className="border-t border-white/8 pt-3 text-sm text-accent-primary">
                        Gap — {c.gap}
                      </div>
                    </div>
                  </Card>
                ))}
              </CardSwap>
            </div>
          </div>

          {/* capability matrix — the points of difference */}
          <div className="mt-24 lg:mt-56">
            <Reveal className="kicker mb-5 text-fog/45">
              Capability coverage — only one row is complete
            </Reveal>
            <Reveal delay={60} className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/12">
                    <th className="kicker py-3 pr-4 font-normal text-fog/55">Tool</th>
                    {CAPS.map((c) => (
                      <th
                        key={c}
                        className="kicker px-2 py-3 text-center font-normal text-fog/55"
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MATRIX.map((row) => (
                    <tr
                      key={row.name}
                      className={`border-b border-white/8 ${
                        row.ours ? "bg-accent-soft" : ""
                      }`}
                    >
                      <td
                        className={`py-3.5 pr-4 text-sm ${
                          row.ours
                            ? "font-medium text-accent-primary"
                            : "text-pearl/85"
                        }`}
                      >
                        {row.name}
                      </td>
                      {row.cov.map((v, i) => (
                        <td
                          key={i}
                          className="px-2 py-3.5 text-center text-base"
                        >
                          <Mark v={v} ours={row.ours} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Reveal>
            <Reveal delay={120} className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-fog/60">
              <span><span className="text-pearl/85">●</span> Full</span>
              <span><span className="text-fog/55">◐</span> Partial</span>
              <span><span className="text-white/30">–</span> None</span>
            </Reveal>
          </div>

          {/* whitespace insight */}
          <Reveal
            delay={120}
            className="mt-12 flex flex-col gap-4 rounded-2xl border border-accent-primary/25 bg-accent-soft p-7 sm:flex-row sm:items-center sm:gap-7"
          >
            <span className="shrink-0 font-display text-2xl text-accent-primary">
              The gap
            </span>
            <p className="text-pretty text-base leading-relaxed text-pearl/90">
              Drift detection <span className="text-fog">+</span> naming
              governance <span className="text-fog">+</span> UI-architecture
              analysis <span className="text-fog">+</span> a defensible drift
              score — unified in the one place designers already work. That
              intersection is open.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
