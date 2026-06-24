import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

const WINS = [
  {
    k: "Validated",
    title: "A real, costly problem",
    body: "67% call drift a major issue; 88.9% see it cause >10% dev rework. The problem was proven before the solution was designed.",
  },
  {
    k: "Mapped",
    title: "Open competitive whitespace",
    body: "Seven adjacent tools, none combining drift, naming, UI-architecture and a defensible score — a clear, un-owned position.",
  },
  {
    k: "Decided",
    title: "Two mature scoping calls",
    body: "Plugin over standalone, and deterministic over AI-first. Knowing what not to build is the real design output here.",
  },
];

const ROADMAP = [
  {
    phase: "Foundation",
    when: "Now",
    items: ["Drift detection", "Token validation", "Naming enforcement"],
    outcome: "Baseline compliance visibility",
    active: true,
  },
  {
    phase: "Automation",
    when: "Next",
    items: ["Auto-fix drift violations", "Token replacement suggestions", "Governance PR workflows"],
    outcome: "Reduced manual remediation",
    active: false,
  },
  {
    phase: "Continuous Intelligence",
    when: "Future",
    items: ["Real-time compliance dashboards", "Regression alerts on commits", "Team health reporting"],
    outcome: "Proactive design-system governance",
    active: false,
  },
];

export default function Outcome() {
  return (
    <section
      id="outcome"
      className="relative border-t border-white/5 bg-void-1 py-28 sm:py-36"
    >
      <div className="wrap">
        <SectionHeader
          index="08"
          chapter="The Outcome"
          title="A validated concept, and a clear road."
          lead="This is an early-stage concept, now in active development — so the outcome isn't usage metrics. It's the strength of what the research and the decisions de-risked."
        />

        {/* wins */}
        <div className="mt-16 grid grid-cols-1 gap-7 md:grid-cols-3">
          {WINS.map((w, i) => (
            <Reveal
              key={w.title}
              delay={i * 90}
              className="rounded-2xl border border-white/8 bg-void-2 p-7"
            >
              <div className="kicker text-accent-primary/80">{w.k}</div>
              <h3 className="mt-4 font-sans text-lg font-medium text-pearl">
                {w.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-fog/75">{w.body}</p>
            </Reveal>
          ))}
        </div>

        {/* roadmap */}
        <div className="mt-24">
          <Reveal className="kicker mb-8 text-fog/45">
            The road to design-system intelligence
          </Reveal>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {ROADMAP.map((r, i) => (
              <Reveal
                key={r.phase}
                delay={i * 90}
                className={`rounded-2xl border p-7 ${
                  r.active
                    ? "border-accent-primary/40 bg-accent-soft"
                    : "border-white/8 bg-void"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-display text-xl ${
                      r.active ? "text-accent-primary" : "text-pearl/80"
                    }`}
                  >
                    {r.phase}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-fog/55">
                    {r.when}
                  </span>
                </div>
                <ul className="mt-5 space-y-2">
                  {r.items.map((it) => (
                    <li key={it} className="flex gap-2.5 text-sm text-fog/80">
                      <span
                        className={`mt-2 h-1 w-1 shrink-0 rounded-full ${
                          r.active ? "bg-accent-primary" : "bg-fog/40"
                        }`}
                      />
                      {it}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 border-t border-white/8 pt-4 text-sm text-pearl/70">
                  {r.outcome}
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* reflection */}
        <div className="mt-24 max-w-3xl">
          <Reveal className="kicker mb-3 text-fog/45">Reflection</Reveal>
          <Reveal as="p" delay={60} className="text-pretty text-lg leading-relaxed text-fog/85">
            The hardest part wasn&rsquo;t building the analyzer — it was the
            discipline to keep the measurement core deterministic and the scope
            honest, while every trend pulled toward bolting on AI. The research
            gave me the conviction to make those calls and defend them.
          </Reveal>
        </div>

        {/* closing line */}
        <Reveal
          as="p"
          delay={80}
          className="mt-24 max-w-4xl text-balance font-display text-[clamp(32px,5vw,68px)] font-normal leading-[1.02] tracking-[-0.02em] text-pearl"
        >
          The engine doesn&rsquo;t guess.{" "}
          <span className="text-accent-primary">
            The next version will explain.
          </span>
        </Reveal>

        {/* footer */}
        <footer className="mt-28 flex flex-col gap-6 border-t border-white/10 pt-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="font-display text-lg text-pearl">Ruttvik Aron</div>
          <div className="flex flex-wrap gap-x-7 gap-y-2">
            <a href="mailto:ruttvik.aron@hilabs.com" className="kicker text-fog/70 transition-colors hover:text-accent-primary">
              Email
            </a>
            <a href="#hero" className="kicker text-fog/70 transition-colors hover:text-accent-primary">
              Back to top
            </a>
            <span className="kicker text-fog/40">Design System Intelligence Engine · 2026</span>
          </div>
        </footer>
      </div>
    </section>
  );
}
