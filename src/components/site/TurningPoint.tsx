"use client";

import GlassIcons from "@/components/GlassIcons";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

const AMBER_GRADIENT = "linear-gradient(hsl(31, 100%, 55%), hsl(20, 100%, 48%))";

const I = {
  repeat: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m17 2 4 4-4 4" /><path d="M3 11v-1a4 4 0 0 1 4-4h14" /><path d="m7 22-4-4 4-4" /><path d="M21 13v1a4 4 0 0 1-4 4H3" /></svg>
  ),
  lock: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
  ),
  offline: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 2 20 20" /><path d="M8.5 16.5a5 5 0 0 1 7 0" /><path d="M2 8.82a15 15 0 0 1 4.17-2.65" /><path d="M10.66 5c4.01-.36 8.14.9 11.34 3.76" /><path d="M16.85 11.25a10 10 0 0 1 2.22 1.68" /><path d="M5 13a10 10 0 0 1 5.24-2.76" /><line x1="12" x2="12.01" y1="20" y2="20" /></svg>
  ),
  zap: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" /></svg>
  ),
};

const PRINCIPLES = [
  { icon: I.repeat, color: AMBER_GRADIENT, label: "Reproducible" },
  { icon: I.lock, color: AMBER_GRADIENT, label: "Private" },
  { icon: I.offline, color: AMBER_GRADIENT, label: "Offline" },
  { icon: I.zap, color: AMBER_GRADIENT, label: "Fast" },
];

const OPTIONS = [
  { name: "Standalone web app", verdict: "Re-upload files. Data leaves the machine.", chosen: false },
  { name: "Desktop tool", verdict: "Another install, another context to switch into.", chosen: false },
  { name: "Browser extension", verdict: "Fragile against Figma's canvas internals.", chosen: false },
  { name: "Figma plugin", verdict: "In-context, offline, private by default.", chosen: true },
];

export default function TurningPoint() {
  return (
    <section
      id="decision"
      className="relative border-t border-white/5 bg-void py-28 sm:py-36"
    >
      <div className="wrap">
        <SectionHeader
          index="05"
          chapter="The Decision"
          title="Two early calls shaped the entire engine."
          lead="Before a single feature, two decisions set the direction — and both pushed against the obvious default."
        />

        {/* Decision 1 — form factor */}
        <div className="mt-20 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <Reveal className="font-mono text-sm text-accent-primary/80">
              Decision 01
            </Reveal>
            <Reveal
              as="h3"
              delay={60}
              className="mt-3 font-display text-[clamp(28px,3.4vw,46px)] font-normal leading-tight tracking-[-0.01em] text-pearl"
            >
              A plugin — not a separate app.
            </Reveal>
            <Reveal delay={120} className="mt-5 max-w-xl space-y-4 text-fog/80 lg:max-w-none">
              <p>
                The instinct is to build governance as its own product — a web
                dashboard you upload files to. I ruled it out for two reasons.
              </p>
              <p>
                Designers <span className="text-pearl">live inside Figma</span>{" "}
                every day; a separate app means re-uploading work and breaking
                flow. And the Figma sandbox has{" "}
                <span className="text-pearl">no network access</span> — so{" "}
                <span className="text-accent-primary">
                  your design data never leaves your machine.
                </span>{" "}
                For proprietary enterprise files, that privacy guarantee is a
                feature a web app simply can&rsquo;t match.
              </p>
            </Reveal>
          </div>

          {/* options considered */}
          <Reveal delay={140} className="space-y-3">
            {OPTIONS.map((o) => (
              <div
                key={o.name}
                className={`flex items-center justify-between gap-4 rounded-xl border p-5 transition-colors ${
                  o.chosen
                    ? "border-accent-primary/40 bg-accent-soft"
                    : "border-white/8 bg-void-1"
                }`}
              >
                <div>
                  <div
                    className={`text-base ${
                      o.chosen ? "font-medium text-accent-primary" : "text-pearl/85"
                    }`}
                  >
                    {o.name}
                  </div>
                  <div className="mt-1 text-sm text-fog/65">{o.verdict}</div>
                </div>
                <span className="shrink-0 font-mono text-xs uppercase tracking-wider">
                  {o.chosen ? (
                    <span className="text-accent-primary">✓ Chosen</span>
                  ) : (
                    <span className="text-white/25">Ruled out</span>
                  )}
                </span>
              </div>
            ))}
          </Reveal>
        </div>

        {/* Decision 2 — deterministic */}
        <div className="mt-28">
          <Reveal className="font-mono text-sm text-accent-primary/80">
            Decision 02
          </Reveal>
          <Reveal
            as="h3"
            delay={60}
            className="mt-3 max-w-3xl font-display text-[clamp(28px,3.4vw,46px)] font-normal leading-tight tracking-[-0.01em] text-pearl"
          >
            Deterministic — not AI-first.
          </Reveal>

          <Reveal
            as="blockquote"
            delay={120}
            className="mt-8 max-w-3xl border-l-2 border-accent-primary pl-7 font-display text-[clamp(22px,2.8vw,34px)] font-normal leading-snug tracking-[-0.01em] text-pearl/90"
          >
            &ldquo;The most dangerous thing you can add to a governance tool is
            uncertainty. The same file should always produce the same
            score.&rdquo;
          </Reveal>

          <Reveal delay={160} className="mt-6 max-w-2xl text-fog/80 lg:max-w-3xl">
            Every design tool today reaches for an LLM. But a governance
            metric that changes without the file changing isn&rsquo;t a metric —
            it&rsquo;s a guess. So the measurement core stays deterministic.
            That single constraint earns four properties for free:
          </Reveal>

          <Reveal delay={200} className="mt-12">
            <GlassIcons items={PRINCIPLES} className="" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
