import Reveal from "./Reveal";

type SectionHeaderProps = {
  index: string; // e.g. "01"
  chapter: string; // e.g. "The Problem"
  title: string;
  lead?: string;
  align?: "left" | "center";
};

export default function SectionHeader({
  index,
  chapter,
  title,
  lead,
  align = "left",
}: SectionHeaderProps) {
  return (
    <header className={align === "center" ? "mx-auto text-center" : ""}>
      <Reveal
        className={`mb-6 flex items-center gap-3.5 ${
          align === "center" ? "justify-center" : ""
        }`}
      >
        <span className="h-px w-8 bg-accent-primary" />
        <span className="kicker text-accent-primary">
          {index} — {chapter}
        </span>
      </Reveal>
      <Reveal
        as="h2"
        delay={80}
        className="text-balance font-display text-[clamp(30px,3.8vw,48px)] font-normal leading-[1.04] tracking-[-0.02em] text-pearl"
      >
        {title}
      </Reveal>
      {lead ? (
        <Reveal
          as="p"
          delay={150}
          className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-fog lg:max-w-3xl"
        >
          {lead}
        </Reveal>
      ) : null}
    </header>
  );
}
