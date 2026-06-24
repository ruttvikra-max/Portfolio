"use client";

import { useEffect, useRef, useState } from "react";

// 8 stages of the compounding drift loop — colored cobalt (healthy) → magenta (critical)
const STAGES = [
  { label: "Design system created", color: "#3D5AFE", icon: "grid" },
  { label: "Teams ship features", color: "#8A6AC0", icon: "send" },
  { label: "Local overrides & quick fixes", color: "#C77E73", icon: "edit" },
  { label: "Detached components & token drift", color: "#FF8A1E", icon: "unlink" },
  { label: "Design–dev mismatch", color: "#FF6E40", icon: "split" },
  { label: "Manual fixes & patch work", color: "#FF5466", icon: "wrench" },
  { label: "System authority weakens", color: "#FF3E8C", icon: "trend-down" },
  { label: "More drift accumulates", color: "#FF2FA3", icon: "alert" },
] as const;

// serpentine node centers in the 1240×540 viewBox (top row L→R, bottom row R→L)
// rows are widely separated so the centre block never collides with the cards
const VB_H = 540;
const POS = [
  { x: 155, y: 92 },
  { x: 465, y: 92 },
  { x: 775, y: 92 },
  { x: 1085, y: 92 },
  { x: 1085, y: 448 },
  { x: 775, y: 448 },
  { x: 465, y: 448 },
  { x: 155, y: 448 },
];

// clockwise rectangle through the node centers; perimeter = 2*(930+356) = 2572
const TRACK = "M155 92 H1085 V448 H155 Z";
const TRACK_LEN = 2572;

function Icon({ name }: { name: string }) {
  const p = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "grid":
      return <svg {...p}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></svg>;
    case "send":
      return <svg {...p}><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4Z" /></svg>;
    case "edit":
      return <svg {...p}><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>;
    case "unlink":
      return <svg {...p}><path d="m18.84 12.25 1.72-1.71a4.5 4.5 0 0 0-6.36-6.37l-1.72 1.71" /><path d="m5.17 11.75-1.71 1.71a4.5 4.5 0 0 0 6.36 6.37l1.71-1.71" /><line x1="8" y1="2" x2="8" y2="5" /><line x1="2" y1="8" x2="5" y2="8" /><line x1="16" y1="19" x2="16" y2="22" /><line x1="19" y1="16" x2="22" y2="16" /></svg>;
    case "split":
      return <svg {...p}><line x1="6" y1="3" x2="6" y2="15" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M18 9a9 9 0 0 1-9 9" /></svg>;
    case "wrench":
      return <svg {...p}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z" /></svg>;
    case "trend-down":
      return <svg {...p}><polyline points="22 17 13.5 8.5 8.5 13.5 2 7" /><polyline points="16 17 22 17 22 11" /></svg>;
    case "alert":
      return <svg {...p}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>;
    default:
      return null;
  }
}

export default function DriftCycle() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [play, setPlay] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (setPlay(true), obs.unobserve(e.target))),
      { threshold: 0.3 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={`drift-cycle ${play ? "play" : ""}`}>
      {/* ── desktop serpentine diagram ── */}
      <div className="relative hidden h-[540px] w-full lg:block">
        <svg viewBox="0 0 1240 540" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" fill="none">
          <defs>
            <filter id="pulseGlow" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <linearGradient id="trackGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#3D5AFE" stopOpacity="0.5" />
              <stop offset="0.5" stopColor="#FF8A1E" stopOpacity="0.5" />
              <stop offset="1" stopColor="#FF2FA3" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          {/* faint base track */}
          <path d={TRACK} stroke="rgba(255,255,255,0.07)" strokeWidth="2" />
          {/* drawn gradient track */}
          <path className="drift-track" style={{ ["--len" as string]: TRACK_LEN }} d={TRACK} stroke="url(#trackGrad)" strokeWidth="2" />
          {/* connector dots at node centers */}
          {POS.map((pt, i) => (
            <circle key={i} cx={pt.x} cy={pt.y} r="3" fill={STAGES[i].color} />
          ))}
          {/* travelling pulse */}
          {play && !reduced && (
            <circle r="6" fill="#FF8A1E" filter="url(#pulseGlow)">
              <animateMotion dur="9s" repeatCount="indefinite" rotate="auto" path={TRACK} />
            </circle>
          )}
        </svg>

        {/* node cards */}
        <div className="absolute inset-0">
          {STAGES.map((s, i) => (
            <div
              key={s.label}
              className="drift-node absolute flex h-[102.38px] w-[17.5%] flex-col justify-center rounded-xl border border-white/10 bg-void-2/90 p-3.5 backdrop-blur-sm"
              style={{
                left: `${(POS[i].x / 1240) * 100}%`,
                top: `${(POS[i].y / VB_H) * 100}%`,
                transitionDelay: play ? `${i * 90 + 400}ms` : "0ms",
                boxShadow: `0 0 0 1px ${s.color}22`,
              }}
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md" style={{ background: `${s.color}1f`, color: s.color }}>
                  <Icon name={s.icon} />
                </span>
                <span className="font-mono text-[10px] tabular-nums" style={{ color: s.color }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-2.5 text-[12.5px] leading-snug text-pearl/85">{s.label}</p>
            </div>
          ))}

          {/* center: the loop + health cue */}
          <div className="absolute left-1/2 top-1/2 w-[26%] -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="font-display text-4xl text-accent-primary">↻</div>
            <p className="mt-1 text-sm font-medium text-pearl">The loop compounds</p>
            <p className="mt-1 text-xs leading-snug text-fog/60">
              system authority drops each cycle
            </p>
            {/* declining health bar */}
            <div className="mx-auto mt-3 flex h-1.5 w-32 overflow-hidden rounded-full">
              <span className="h-full flex-1" style={{ background: "#3D5AFE" }} />
              <span className="h-full flex-1" style={{ background: "#FF8A1E" }} />
              <span className="h-full flex-1" style={{ background: "#FF2FA3" }} />
            </div>
          </div>

          {/* loop-back label on the left side */}
          <div className="absolute left-[12.5%] top-1/2 -translate-x-[140%] -translate-y-1/2 -rotate-90">
            <span className="kicker whitespace-nowrap text-fog/45">↻ worse each pass</span>
          </div>
        </div>
      </div>

      {/* ── mobile vertical flow ── */}
      <div className="pl-2 lg:hidden">
        {/* line + pulse are bound to the node list and centred on the icons */}
        <div className="relative">
          {/* vertical line through the icon centres */}
          <div className="absolute inset-y-4 left-[20px] w-px -translate-x-1/2 bg-white/10" />
          {/* travelling pulse */}
          {!reduced && (
            <div className="pointer-events-none absolute inset-y-4 left-[20px] -translate-x-1/2">
              <div className="drift-mobile-pulse absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "#FF8A1E", boxShadow: "0 0 10px 2px #FF8A1E" }} />
            </div>
          )}
          <ul className="space-y-5">
            {STAGES.map((s, i) => (
              <li key={s.label} className="relative flex items-center gap-4 pl-1">
                <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-void-2" style={{ color: s.color, boxShadow: `0 0 0 1px ${s.color}33` }}>
                  <Icon name={s.icon} />
                </span>
                <div>
                  <span className="font-mono text-[10px]" style={{ color: s.color }}>{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-sm leading-snug text-pearl/85">{s.label}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* loop-back — ↻ sits under the same icon column */}
        <div className="mt-6 flex items-center gap-4 pl-1 text-fog/55">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center text-base text-accent-primary">↻</span>
          <span className="text-sm">Back to the top — worse each pass.</span>
        </div>
      </div>
    </div>
  );
}
