"use client";

import BorderGlow from "@/components/BorderGlow";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

type Persona = {
  name: string;
  age: number;
  role: string;
  company: string;
  goals: string[];
  pains: string[];
  behaviors: string[];
  needs: string[];
};

const PERSONAS: Persona[] = [
  {
    name: "Aditi Sharma",
    age: 27,
    role: "Startup Product Designer",
    company: "SaaS startup · 40 employees",
    goals: ["Maintain UI consistency", "Deliver features quickly"],
    pains: ["Manual audits", "Detached components", "Token overrides"],
    behaviors: [
      "Works inside Figma daily",
      "Uses shared design libraries",
      "Iterates quickly with developers",
    ],
    needs: ["Automated design-system validation", "Faster detection of inconsistencies"],
  },
  {
    name: "Rahul Verma",
    age: 34,
    role: "Design System Lead",
    company: "Large fintech organization",
    goals: ["Ensure design-system adoption", "Maintain system governance"],
    pains: ["Manual reviews across many files", "Hard to track system health"],
    behaviors: [
      "Oversees multiple product teams",
      "Maintains a centralized component library",
      "Reviews design consistency regularly",
    ],
    needs: ["Automated governance insights", "Visibility into design-system health"],
  },
];

function TraitBlock({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <div className="kicker mb-2.5 text-accent-primary/80">{label}</div>
      <ul className="space-y-1.5">
        {items.map((it) => (
          <li key={it} className="flex gap-2.5 text-sm leading-snug text-fog/85">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-fog/40" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Personas() {
  return (
    <section
      id="personas"
      className="relative border-t border-white/5 bg-void py-28 sm:py-36"
    >
      <div className="wrap">
        <SectionHeader
          index="03"
          chapter="The People"
          title="Two people, one breaking system."
          lead="The research pointed at two distinct users — the designer fighting drift inside a single file, and the lead trying to govern it across an entire organization."
        />

        <div className="mt-16 grid gap-7 lg:grid-cols-2">
          {PERSONAS.map((p, i) => (
            <Reveal key={p.name} delay={i * 120}>
              <BorderGlow
                glowColor="31 100 56"
                backgroundColor="#0b0d12"
                borderRadius={24}
                glowIntensity={0.9}
                className="h-full"
              >
                <div className="p-8 sm:p-10">
                  {/* identity */}
                  <div className="flex items-start justify-between gap-4 border-b border-white/8 pb-6">
                    <div>
                      <h3 className="font-display text-3xl leading-none text-pearl">
                        {p.name}
                      </h3>
                      <p className="mt-3 text-sm text-fog/80">{p.role}</p>
                      <p className="text-sm text-fog/55">{p.company}</p>
                    </div>
                    <span className="font-mono text-xs text-accent-primary/80">
                      AGE {p.age}
                    </span>
                  </div>

                  {/* traits */}
                  <div className="mt-7 grid grid-cols-1 gap-7 sm:grid-cols-2">
                    <TraitBlock label="Goals" items={p.goals} />
                    <TraitBlock label="Pain Points" items={p.pains} />
                    <TraitBlock label="Behaviors" items={p.behaviors} />
                    <TraitBlock label="Needs" items={p.needs} />
                  </div>
                </div>
              </BorderGlow>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
