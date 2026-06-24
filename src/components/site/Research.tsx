import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

const FINDINGS = [
  {
    stat: "100%",
    head: "Manual audits don't scale",
    body: "Every respondent said manual consistency checks take too long — teams rely on slow, manual processes to hold the system together.",
  },
  {
    stat: "66.7%",
    head: "Weak architecture causes bugs",
    body: "Two-thirds reported that poor UI architecture leads to bugs and scaling problems — drift hits product stability, not just aesthetics.",
  },
  {
    stat: "44.4%",
    head: "Naming breaks handoff",
    body: "Inconsistent component naming disrupts dev/MCP handoff, slowing development and multiplying implementation errors.",
  },
];

const REWORK = [
  { range: "0–10%", pct: 11.1 },
  { range: "11–25%", pct: 44.4 },
  { range: "26–50%", pct: 22.2 },
  { range: ">50%", pct: 22.2 },
];

export default function Research() {
  return (
    <section
      id="research"
      className="relative border-t border-white/5 bg-void-1 py-28 sm:py-36"
    >
      <div className="wrap">
        <SectionHeader
          index="02"
          chapter="The Research"
          title="I validated the problem with the people living it."
          lead="A survey of professionals working inside product teams, designed to test one question: does design drift actually affect real workflows — or just bother designers?"
        />

        {/* hero stat */}
        <div className="mt-16 grid items-end gap-10 border-y border-white/10 py-12 md:grid-cols-[auto_1fr]">
          <Reveal className="flex items-end gap-4">
            <span className="font-display text-[clamp(96px,16vw,200px)] font-normal leading-[0.8] text-accent-primary">
              67%
            </span>
          </Reveal>
          <Reveal
            delay={120}
            className="max-w-md pb-3 text-xl leading-relaxed text-pearl/90 md:max-w-xl"
          >
            rated design drift a{" "}
            <span className="text-accent-primary">major issue</span> in their
            day-to-day work — confirming the problem was worth solving before a
            single pixel of the solution existed.
          </Reveal>
        </div>

        {/* supporting findings */}
        <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-3">
          {FINDINGS.map((f, i) => (
            <Reveal key={f.head} delay={i * 90} className="border-t border-white/12 pt-6">
              <div className="font-display text-[clamp(36px,4vw,52px)] font-normal leading-none text-pearl">
                {f.stat}
              </div>
              <h3 className="mt-4 font-sans text-base font-medium text-accent-primary/90">
                {f.head}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-fog/75">{f.body}</p>
            </Reveal>
          ))}
        </div>

        {/* rework distribution */}
        <div className="mt-24 grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <Reveal className="kicker mb-3 text-fog/45">The cost in code</Reveal>
            <Reveal
              as="h3"
              delay={60}
              className="font-display text-[clamp(26px,3.2vw,40px)] font-normal leading-tight tracking-[-0.01em] text-pearl"
            >
              88.9% saw drift cause &gt;10% of dev rework.
            </Reveal>
            <Reveal delay={130} className="mt-5 max-w-xl text-fog/75 lg:max-w-none">
              Design drift isn&rsquo;t absorbed by designers — it leaks
              downstream into engineering time. Nearly half of teams lose
              11–25% of development to fixing inconsistencies.
            </Reveal>
          </div>

          {/* distribution bars */}
          <div className="space-y-5">
            {REWORK.map((r, i) => (
              <Reveal key={r.range} delay={i * 80} className="">
                <div className="mb-1.5 flex items-baseline justify-between">
                  <span className="font-mono text-xs uppercase tracking-wider text-fog/70">
                    {r.range} of dev time
                  </span>
                  <span className="font-display text-lg text-pearl">{r.pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full bg-accent-primary/80"
                    style={{ width: `${r.pct * 2}%` }}
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* pull quote */}
        <Reveal
          as="blockquote"
          delay={120}
          className="mt-24 max-w-4xl border-l-2 border-accent-primary pl-7 font-display text-[clamp(24px,3vw,38px)] font-normal leading-snug tracking-[-0.01em] text-pearl/90"
        >
          &ldquo;Design drift directly affects development speed, product
          stability, and system scalability.&rdquo;
        </Reveal>
      </div>
    </section>
  );
}
