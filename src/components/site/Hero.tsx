import Reveal from "./Reveal";

const META = [
  { label: "Role", value: "Product Designer" },
  { label: "Timeline", value: "2026 · 8 weeks" },
  { label: "Platform", value: "Figma Plugin" },
  { label: "Discipline", value: "Design Systems · AI" },
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-dvh flex-col overflow-hidden bg-void"
    >
      <div className="hero-grid" aria-hidden />
      <div className="hero-glow" aria-hidden />

      {/* content pinned to lower third, reference-style */}
      <div className="wrap relative z-10 flex flex-1 flex-col justify-end pb-16 pt-28">
        {/* kicker */}
        <div className="mb-9 flex items-center gap-3.5">
          <span className="kinetic-line h-px w-10 bg-accent-primary" />
          <span className="kicker text-accent-primary">
            Case Study — Design System Governance
          </span>
        </div>

        {/* headline */}
        <h1 className="font-display font-normal uppercase leading-[0.92] tracking-[-0.02em] text-pearl [font-size:clamp(52px,9vw,148px)]">
          <Reveal as="span" className="block">
            The Engine
          </Reveal>
          <Reveal as="span" delay={90} className="block text-accent-primary">
            That Doesn&rsquo;t Guess
          </Reveal>
        </h1>

        {/* subhead */}
        <Reveal
          delay={180}
          className="mt-9 max-w-2xl text-balance text-lg leading-relaxed text-fog sm:text-xl lg:max-w-3xl"
        >
          A deterministic governance engine that scores design-system drift
          inside Figma — built reproducible-first, before reaching for AI.
        </Reveal>

        {/* divider */}
        <Reveal delay={240} className="mt-12 h-px w-full bg-white/10" />

        {/* meta grid */}
        <Reveal delay={300}>
          <dl className="mt-8 grid grid-cols-2 gap-y-6 md:grid-cols-4">
            {META.map((m) => (
              <div
                key={m.label}
                className="border-l border-white/10 pl-4 first:border-l-0 first:pl-0 md:border-l md:pl-5 md:first:border-l-0 md:first:pl-0"
              >
                <dt className="kicker mb-2 text-fog/55">{m.label}</dt>
                <dd className="text-sm text-pearl/90">{m.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      {/* scroll cue */}
      <div className="wrap relative z-10 pb-8">
        <div className="flex items-center gap-3 text-fog/60">
          <span className="scroll-cue-dot inline-flex h-7 w-4 items-start justify-center rounded-full border border-fog/30 pt-1.5">
            <span className="h-1.5 w-1 rounded-full bg-fog/70" />
          </span>
          <span className="kicker">Scroll to read</span>
        </div>
      </div>
    </section>
  );
}
