"use client";

import type { ReactNode } from "react";
import RawFolder from "@/components/Folder";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

// the .jsx Folder types items as never[] — give it a usable signature
const Folder = RawFolder as React.ComponentType<{
  color?: string;
  size?: number;
  items?: ReactNode[];
  className?: string;
}>;

const FLOW = [
  { step: "Ingest", body: "Connect to a Figma file and its linked design system — establishing the source of truth for the pipeline." },
  { step: "Scan", body: "Traverse the full component tree, token usage, and naming patterns across every layer in the file." },
  { step: "Detect", body: "Flag detached instances, token drift, component overrides, and naming violations throughout the design." },
  { step: "Report", body: "Output a structured UI blueprint and a compliance score. Analysis only — no automation, no generation." },
];

const SCREENS = [
  { label: "Plugin panel", note: "Run analysis · live in dev" },
  { label: "Drift score + grade", note: "Results modal" },
  { label: "UI Blueprint", note: "Architecture map" },
  { label: "Compliance report", note: "Ranked violations" },
];

// Folder "papers" — the engine's deliverables
const outputPapers = [
  <div key="b" className="flex h-full w-full flex-col justify-center p-2 text-center">
    <span className="text-[8px] font-semibold text-neutral-800">UI Blueprint</span>
    <span className="mt-0.5 text-[6px] text-neutral-500">component map</span>
  </div>,
  <div key="r" className="flex h-full w-full flex-col justify-center p-2 text-center">
    <span className="text-[8px] font-semibold text-neutral-800">Drift Report</span>
    <span className="mt-0.5 text-[6px] text-neutral-500">ranked issues</span>
  </div>,
  <div key="s" className="flex h-full w-full flex-col justify-center p-2 text-center">
    <span className="text-[8px] font-semibold text-neutral-800">Health Score</span>
    <span className="mt-0.5 text-[6px] text-neutral-500">grade A–F</span>
  </div>,
];

export default function Solution() {
  return (
    <section
      id="solution"
      className="relative border-t border-white/5 bg-void-1 py-28 sm:py-36"
    >
      <div className="wrap">
        <SectionHeader
          index="06"
          chapter="The Solution"
          title="Built to govern design."
          lead="A Figma-based engine that detects, measures, and reports on design-system health — pure analysis, no automation."
        />

        {/* two-environment model */}
        <div className="mt-16">
          <Reveal className="kicker mb-5 text-fog/45">The architecture constraint</Reveal>
          <div className="grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr]">
            <Reveal className="rounded-2xl border border-white/8 bg-void-2 p-7">
              <div className="font-mono text-xs uppercase tracking-wider text-accent-primary/80">
                Plugin sandbox · code.ts
              </div>
              <ul className="mt-4 space-y-2 text-sm text-fog/80">
                <li>✓ Full Figma file API — nodes, variables, layers</li>
                <li>✗ No DOM, no window</li>
                <li>✗ No network access</li>
              </ul>
              <p className="mt-4 text-xs text-fog/55">
                Runs traversal, analysis, scoring.
              </p>
            </Reveal>

            <Reveal
              delay={80}
              className="flex flex-col items-center justify-center px-2 py-4 md:py-0"
            >
              <div className="font-mono text-[10px] uppercase tracking-wider text-fog/50">
                postMessage
              </div>
              <div className="my-2 text-accent-primary">→</div>
              <div className="font-mono text-[10px] text-fog/40">
                ANALYSIS_COMPLETE
              </div>
            </Reveal>

            <Reveal delay={120} className="rounded-2xl border border-white/8 bg-void-2 p-7">
              <div className="font-mono text-xs uppercase tracking-wider text-accent-primary/80">
                UI iframe · React
              </div>
              <ul className="mt-4 space-y-2 text-sm text-fog/80">
                <li>✓ Full DOM, React components</li>
                <li>✗ No Figma file API</li>
                <li>✗ Blind to the design data</li>
              </ul>
              <p className="mt-4 text-xs text-fog/55">
                Renders score, pillars, per-screen issues.
              </p>
            </Reveal>
          </div>
          <Reveal delay={160} className="mt-5 max-w-2xl text-sm text-fog/65 lg:max-w-3xl">
            Two isolated environments that can&rsquo;t see each other&rsquo;s
            APIs, bridged by one typed message. That constraint forced a clean
            separation — the engine and the interface are independent systems
            with a defined contract.
          </Reveal>
        </div>

        {/* Ingest -> Scan -> Detect -> Report */}
        <div className="mt-24">
          <Reveal className="kicker mb-8 text-fog/45">How it works</Reveal>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/8 sm:grid-cols-2 lg:grid-cols-4">
            {FLOW.map((f, i) => (
              <Reveal key={f.step} delay={i * 80} className="bg-void-1 p-7">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-accent-primary/70">
                    0{i + 1}
                  </span>
                  <h3 className="font-display text-2xl text-pearl">{f.step}</h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-fog/75">{f.body}</p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* outputs (Folder) + screens placeholders */}
        <div className="mt-24 grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <Reveal className="kicker mb-3 text-fog/45">Two deliverables</Reveal>
            <Reveal
              as="h3"
              delay={60}
              className="font-display text-[clamp(24px,3vw,38px)] font-normal leading-tight tracking-[-0.01em] text-pearl"
            >
              Drift becomes something teams can act on.
            </Reveal>
            <Reveal delay={120} className="mt-5 max-w-xl text-fog/75 lg:max-w-none">
              A <span className="text-pearl">UI Blueprint</span> maps every
              component against the system; a{" "}
              <span className="text-pearl">Compliance &amp; Drift Report</span>{" "}
              ranks each violation by severity. Open the folder.
            </Reveal>
            <Reveal delay={180} className="mt-10 pl-4">
              <Folder color="#FF8A1E" size={1.3} items={outputPapers} />
            </Reveal>
          </div>

          {/* plugin screen placeholders */}
          <Reveal delay={120}>
            <div className="grid grid-cols-2 gap-4">
              {SCREENS.map((s) => (
                <div
                  key={s.label}
                  className="flex aspect-[4/3] flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-void-2/60 p-4 text-center"
                >
                  <span className="font-mono text-[10px] uppercase tracking-wider text-fog/40">
                    Screen
                  </span>
                  <span className="mt-2 text-sm text-pearl/80">{s.label}</span>
                  <span className="mt-1 text-xs text-fog/45">{s.note}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-xs text-fog/40">
              Real plugin screens drop in here — development in progress.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
