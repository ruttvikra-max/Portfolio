import Reveal from "./Reveal";

export default function ContextStrip() {
  return (
    <section id="context" className="relative bg-void py-28 sm:py-36">
      <div className="wrap">
        <div className="grid gap-10 md:grid-cols-[140px_1fr]">
          {/* chapter index */}
          <Reveal className="kicker pt-2 text-fog/45">00 — Context</Reveal>

          {/* lead statement */}
          <Reveal
            as="p"
            className="max-w-4xl text-balance text-[26px] font-light leading-[1.45] tracking-tight text-pearl/90 sm:text-[34px] lg:max-w-none"
          >
            Design systems don&rsquo;t fail loudly. They{" "}
            <span className="text-accent-primary">drift</span> — a detached
            component here, a hardcoded color there — until the gap between the
            library and the file is too wide to trust. The{" "}
            <span className="text-pearl">Design System Intelligence Engine</span>{" "}
            measures that drift, and turns it into a single number you can
            actually defend.
          </Reveal>
        </div>
      </div>
    </section>
  );
}
