import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import DriftCycle from "./DriftCycle";

const BREAKDOWNS = [
  {
    n: "01",
    title: "Detached Components",
    body: "Components break away from the source library across files — silently, one override at a time.",
  },
  {
    n: "02",
    title: "Token Overrides",
    body: "Design tokens get overridden in place, breaking the visual consistency the system was meant to guarantee.",
  },
  {
    n: "03",
    title: "Naming Divergence",
    body: "Teams introduce inconsistent naming patterns that quietly poison automation and dev handoff.",
  },
  {
    n: "04",
    title: "Design–Dev Misalignment",
    body: "The implemented UI gradually stops matching the design files no one notices until it's expensive.",
  },
];

const IMPACT = [
  { stat: "15–25%", label: "of design time spent fixing inconsistencies", tag: "Rework" },
  { stat: "20–30%", label: "of UI bugs originate from design–dev mismatch", tag: "QA Defects" },
  { stat: "30–40%", label: "longer ramp-up for new designers & developers", tag: "Slow Onboarding" },
  { stat: "↓ reuse", label: "lower component reuse, fragmented UI patterns", tag: "System Instability" },
];

export default function Problem() {
  return (
    <section id="problem" className="relative border-t border-white/5 bg-void py-28 sm:py-36">
      <div className="wrap">
        <SectionHeader
          index="01"
          chapter="The Problem"
          title="Design systems break down at scale."
          lead="They don't fail in one dramatic moment. They erode — across files, sprints, and teams — through four recurring failure modes."
        />

        {/* four breakdown modes */}
        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/8 sm:grid-cols-2 lg:grid-cols-4">
          {BREAKDOWNS.map((b, i) => (
            <Reveal
              key={b.title}
              delay={i * 70}
              className="group bg-void-1 p-7 transition-colors duration-300 hover:bg-void-2"
            >
              <div className="font-display text-3xl text-white/12 transition-colors duration-300 group-hover:text-accent-primary/40">
                {b.n}
              </div>
              <h3 className="mt-5 text-base font-medium text-pearl">{b.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-fog/80">{b.body}</p>
            </Reveal>
          ))}
        </div>

        {/* operational impact */}
        <div className="mt-28">
          <Reveal className="kicker mb-3 text-fog/45">Operational impact</Reveal>
          <Reveal
            as="h3"
            delay={60}
            className="text-balance font-display text-[clamp(26px,3.2vw,40px)] font-normal leading-tight tracking-[-0.01em] text-pearl"
          >
            Drift creates measurable operational cost.
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-6">
            {IMPACT.map((it, i) => (
              <Reveal
                key={it.tag}
                delay={i * 70}
                className="border-t border-white/12 pt-6 lg:pr-6"
              >
                <div className="font-display text-[clamp(40px,5vw,60px)] font-normal leading-none text-accent-primary">
                  {it.stat}
                </div>
                <div className="kicker mt-4 text-pearl/80">{it.tag}</div>
                <p className="mt-2 text-sm leading-relaxed text-fog/70">{it.label}</p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* drift lifecycle */}
        <div className="mt-28">
          <Reveal className="kicker mb-3 text-fog/45">The drift lifecycle</Reveal>
          <Reveal
            as="h3"
            delay={60}
            className="max-w-3xl text-balance font-display text-[clamp(26px,3.2vw,40px)] font-normal leading-tight tracking-[-0.01em] text-pearl lg:max-w-none"
          >
            Drift isn&rsquo;t one issue. It&rsquo;s a loop that compounds.
          </Reveal>

          <div className="mt-12 rounded-2xl border border-white/8 bg-void-1 p-6 sm:p-10">
            <DriftCycle />
          </div>
        </div>
      </div>
    </section>
  );
}
