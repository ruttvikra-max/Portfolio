import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

const ANALYZERS = [
  { n: "01", name: "Component Integrity", weight: 35, body: "Detached instances, unlinked components, structural overrides. Ranked the #1 daily pain point in testing — so it carries the most weight." },
  { n: "02", name: "Token Compliance", weight: 30, body: "Every fill and stroke compared against the file's own extracted token library. Flags hardcoded values and missing references." },
  { n: "03", name: "Naming Governance", weight: 20, body: "Auto-named layers and slash-path violations. Critical for automation pipelines and reliable developer handoff." },
  { n: "04", name: "Spacing Consistency", weight: 15, body: "A four-detector sub-engine: off-grid values, gap uniformity, repeated-item spacing, and cross-screen-family drift." },
];

const GRADES = [
  { range: "90–100", grade: "A", label: "Healthy", color: "#3D5AFE" },
  { range: "75–89", grade: "B", label: "Needs attention", color: "#AEB6C2" },
  { range: "60–74", grade: "C", label: "At risk", color: "#FF8A1E" },
  { range: "40–59", grade: "D", label: "Degraded", color: "#FF6A1E" },
  { range: "0–39", grade: "F", label: "Critical", color: "#FF2FA3" },
];

export default function UnderTheHood() {
  return (
    <section
      id="under-the-hood"
      className="relative border-t border-white/5 bg-void py-28 sm:py-36"
    >
      <div className="wrap">
        <SectionHeader
          index="07"
          chapter="Under the Hood"
          title="Four analyzers. One defensible score."
          lead="The engine routes every file through four specialists — each with a different job and a weight set by what usability testing showed causes the most real pain."
        />

        {/* analyzers with weight bars */}
        <div className="mt-16 space-y-px overflow-hidden rounded-2xl border border-white/8">
          {ANALYZERS.map((a, i) => (
            <Reveal
              key={a.name}
              delay={i * 70}
              className="grid items-center gap-5 bg-void-1 p-7 sm:grid-cols-[auto_1fr_auto] sm:gap-8"
            >
              <div className="flex items-center gap-5">
                <span className="font-display text-3xl text-white/12">{a.n}</span>
                <div className="max-w-md">
                  <h3 className="font-sans text-base font-medium text-pearl">
                    {a.name}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-fog/70">
                    {a.body}
                  </p>
                </div>
              </div>
              <div className="hidden h-2 overflow-hidden rounded-full bg-white/8 sm:block sm:w-40 lg:w-64">
                <div
                  className="h-full rounded-full bg-accent-primary/80"
                  style={{ width: `${a.weight * 2.2}%` }}
                />
              </div>
              <div className="font-display text-2xl text-accent-primary">
                {a.weight}%
              </div>
            </Reveal>
          ))}
        </div>

        {/* scoring as trust */}
        <div className="mt-24 grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div>
            <Reveal className="kicker mb-3 text-fog/45">Scoring as trust</Reveal>
            <Reveal
              as="h3"
              delay={60}
              className="font-display text-[clamp(26px,3.2vw,40px)] font-normal leading-tight tracking-[-0.01em] text-pearl"
            >
              A number that&rsquo;s credible — not an alarm.
            </Reveal>
            <Reveal delay={120} className="mt-5 max-w-xl space-y-4 text-fog/80 lg:max-w-none">
              <p>
                Raw compliance passes through a deliberate{" "}
                <span className="text-pearl">lenient curve</span> before
                weighting. A tool that drops a team from 90 to 40 over three
                minor naming issues gets ignored within a week.
              </p>
              <p>
                Critical violations in high-weight pillars still drag the score
                down clearly — but isolated issues don&rsquo;t cascade. The
                number reads as honest: not flattery, not panic.
              </p>
            </Reveal>
            <Reveal delay={160} className="mt-7 rounded-xl border border-white/8 bg-void-1 p-5 font-mono text-xs leading-relaxed text-fog/70">
              (Component × .35) + (Token × .30) +<br />
              (Naming × .20) + (Spacing × .15)<br />
              <span className="text-accent-primary">→ lenient curve → 0–100 + grade</span>
            </Reveal>
          </div>

          {/* grade scale */}
          <Reveal delay={120} className="space-y-2">
            {GRADES.map((g) => (
              <div
                key={g.grade}
                className="flex items-center gap-5 rounded-xl border border-white/8 bg-void-1 p-4"
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg font-display text-xl"
                  style={{ background: `${g.color}22`, color: g.color }}
                >
                  {g.grade}
                </span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-pearl">{g.label}</div>
                  <div className="font-mono text-xs text-fog/55">{g.range}</div>
                </div>
                <div
                  className="h-1.5 w-16 rounded-full"
                  style={{ background: g.color, opacity: 0.85 }}
                />
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
