"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type StageId = "idea" | "psf" | "pmf" | "governance";

const STAGE_META: Record<
  StageId,
  { label: string; color: string; agents: string[]; description: string }
> = {
  idea: {
    label: "Idea",
    color: "#7dd3fc",
    agents: ["Ideator", "Market Intelligence"],
    description: "Generate & rank ideas on viability, desirability, feasibility",
  },
  psf: {
    label: "PSF",
    color: "#c4b5fd",
    agents: ["Hypothesis Builder", "Persona Profiler", "Early Data Manager", "POC Agent"],
    description: "Validate solution fit with experiments & early user data",
  },
  pmf: {
    label: "PMF",
    color: "#7efcb8",
    agents: ["Persona Refiner", "MVP Architect", "Go-to-Market Agent", "KPI Analyst"],
    description: "Architect, launch & measure repeatable market demand",
  },
  governance: {
    label: "Governance",
    color: "#fcd34d",
    agents: ["CEO Agent", "Governance Agent"],
    description: "Progress reports & gate decisions at every advance",
  },
};

const STAGE_ORDER: StageId[] = ["idea", "psf", "pmf", "governance"];
const CORE_STAGES: Exclude<StageId, "governance">[] = ["idea", "psf", "pmf"];

const NODE_X: Record<string, number> = { idea: 90, psf: 200, pmf: 310 };
const NODE_Y = 150;
const ORBIT_R = 28;

const tabStyles: Record<StageId, { active: string; idle: string }> = {
  idea: {
    active: "border-sky-400/40 bg-sky-400/20 text-sky-300",
    idle: "border-white/10 bg-white/[0.03] text-landing-muted-fg hover:border-sky-400/25 hover:text-sky-300",
  },
  psf: {
    active: "border-violet-400/40 bg-violet-400/20 text-violet-300",
    idle: "border-white/10 bg-white/[0.03] text-landing-muted-fg hover:border-violet-400/25 hover:text-violet-300",
  },
  pmf: {
    active: "border-landing-accent/40 bg-landing-accent/20 text-landing-accent",
    idle: "border-white/10 bg-white/[0.03] text-landing-muted-fg hover:border-landing-accent/25 hover:text-landing-accent",
  },
  governance: {
    active: "border-amber-400/40 bg-amber-400/20 text-amber-300",
    idle: "border-white/10 bg-white/[0.03] text-landing-muted-fg hover:border-amber-400/25 hover:text-amber-300",
  },
};

function agentPositions(cx: number, cy: number, n: number, r: number) {
  return Array.from({ length: n }).map((_, i) => {
    const theta = -Math.PI / 2 + (i / n) * Math.PI * 2;
    return { x: cx + r * Math.cos(theta), y: cy + r * Math.sin(theta) };
  });
}

function StageNode({ id, active }: { id: Exclude<StageId, "governance">; active: boolean }) {
  const meta = STAGE_META[id];
  const cx = NODE_X[id];
  const agents = agentPositions(cx, NODE_Y, meta.agents.length, ORBIT_R);
  const dur = id === "idea" ? "26s" : id === "psf" ? "32s" : "29s";

  return (
    <g style={{ transition: "opacity 0.6s ease" }} opacity={active ? 1 : 0.55}>
      {/* soft halo */}
      <circle
        cx={cx}
        cy={NODE_Y}
        r={active ? 30 : 22}
        fill={meta.color}
        opacity={active ? 0.16 : 0.06}
        style={{ transition: "all 0.6s ease" }}
      />
      {/* faint orbit guide */}
      <circle cx={cx} cy={NODE_Y} r={ORBIT_R} fill="none" stroke={meta.color} strokeOpacity={0.18} strokeWidth={0.75} />

      {/* orbiting agent bubbles */}
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          from={`0 ${cx} ${NODE_Y}`}
          to={`360 ${cx} ${NODE_Y}`}
          dur={dur}
          repeatCount="indefinite"
        />
        {agents.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={active ? 3.4 : 2.6} fill={meta.color} style={{ transition: "r 0.6s ease" }}>
            <animate
              attributeName="opacity"
              values="0.55;1;0.55"
              dur="3.5s"
              begin={`${i * 0.5}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </g>

      {/* core node */}
      <circle
        cx={cx}
        cy={NODE_Y}
        r={active ? 11 : 8}
        fill={meta.color}
        style={{ transition: "r 0.6s ease" }}
      />
      <circle cx={cx} cy={NODE_Y} r={active ? 11 : 8} fill="#0c1512" opacity={0.35} style={{ transition: "r 0.6s ease" }} />

      {/* stage label */}
      <text
        x={cx}
        y={NODE_Y + 52}
        textAnchor="middle"
        fontSize="11"
        fontWeight="600"
        letterSpacing="0.08em"
        fill={active ? meta.color : "#9ca3af"}
        style={{ transition: "fill 0.6s ease", textTransform: "uppercase" }}
      >
        {meta.label}
      </text>
    </g>
  );
}

function LifecycleDiagram({ activeStage }: { activeStage: StageId }) {
  const govActive = activeStage === "governance";
  return (
    <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" role="img" aria-label="DrumR innovation pipeline: Idea to PSF to PMF with governance oversight">
      <defs>
        <linearGradient id="flowGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="50%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#7efcb8" />
        </linearGradient>
      </defs>

      {/* governance oversight frame */}
      <rect
        x="34"
        y="74"
        width="332"
        height="152"
        rx="18"
        fill={govActive ? "#fcd34d" : "transparent"}
        fillOpacity={govActive ? 0.05 : 0}
        stroke="#fcd34d"
        strokeOpacity={govActive ? 0.5 : 0.16}
        strokeWidth="1"
        strokeDasharray="4 5"
        style={{ transition: "all 0.6s ease" }}
      />
      <text x="200" y="68" textAnchor="middle" fontSize="9" letterSpacing="0.22em" fill="#fcd34d" fillOpacity={govActive ? 0.9 : 0.4} style={{ transition: "fill-opacity 0.6s ease", textTransform: "uppercase" }}>
        Governance
      </text>

      {/* flow line */}
      <line x1={NODE_X.idea} y1={NODE_Y} x2={NODE_X.pmf} y2={NODE_Y} stroke="url(#flowGrad)" strokeOpacity="0.45" strokeWidth="1.5" />

      {/* traveling flow pulses */}
      {[0, 1.8].map((begin, i) => (
        <circle key={i} r="3" fill="#ffffff">
          <animateMotion dur="3.6s" begin={`${begin}s`} repeatCount="indefinite" path={`M${NODE_X.idea} ${NODE_Y} L${NODE_X.pmf} ${NODE_Y}`} />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.85;1" dur="3.6s" begin={`${begin}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {CORE_STAGES.map((id) => (
        <StageNode key={id} id={id} active={activeStage === id || govActive} />
      ))}
    </svg>
  );
}

export function ProjectLifecycleVisual() {
  const [activeStage, setActiveStage] = useState<StageId>("idea");
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setActiveStage((current) => {
        const idx = STAGE_ORDER.indexOf(current);
        return STAGE_ORDER[(idx + 1) % STAGE_ORDER.length];
      });
    }, 3500);
    return () => clearInterval(interval);
  }, [paused]);

  const meta = STAGE_META[activeStage];

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-landing-surface shadow-[0_32px_80px_rgba(0,0,0,0.45)]">
      <div className="relative aspect-[4/3] bg-[#0c1512]">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 45%, rgba(126,252,184,0.08), transparent 70%)",
          }}
        />

        <LifecycleDiagram activeStage={activeStage} />

        <div className="absolute left-3 right-3 top-3 z-10 flex flex-wrap gap-1.5 sm:left-4 sm:right-4">
          {STAGE_ORDER.map((id) => (
            <button
              key={id}
              type="button"
              onMouseEnter={() => {
                setActiveStage(id);
                setPaused(true);
              }}
              onMouseLeave={() => setPaused(false)}
              onClick={() => {
                setActiveStage(id);
                setPaused(true);
              }}
              className={cn(
                "rounded-full border px-2.5 py-1 font-brand text-[0.625rem] font-semibold uppercase tracking-wide backdrop-blur-md transition-all duration-300",
                activeStage === id ? tabStyles[id].active : tabStyles[id].idle
              )}
            >
              {STAGE_META[id].label}
              <span className="ml-1 opacity-60">{STAGE_META[id].agents.length}</span>
            </button>
          ))}
        </div>

        <div className="pointer-events-none absolute bottom-3 left-3 right-3 z-10 sm:bottom-4 sm:left-4 sm:right-4">
          <div
            className="rounded-xl border border-white/[0.08] bg-[#0c1512]/70 px-3 py-2.5 backdrop-blur-md"
            style={{ borderColor: `${meta.color}30` }}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-brand text-[0.6875rem] font-semibold uppercase tracking-wide" style={{ color: meta.color }}>
                {meta.label} · {meta.agents.length} agents
              </p>
              <Link
                href="#agents"
                className="pointer-events-auto inline-flex shrink-0 items-center gap-1 font-brand text-[0.625rem] font-medium text-landing-muted-fg transition-colors hover:text-landing-fg"
              >
                All agents
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <p className="mt-1 text-[0.6875rem] leading-snug text-landing-muted-fg">
              {meta.description}
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {meta.agents.map((agent) => (
                <span
                  key={agent}
                  className="rounded border border-white/[0.06] bg-white/[0.04] px-1.5 py-0.5 font-brand text-[0.5625rem] text-landing-fg/90"
                >
                  {agent}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.06] p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-landing-fg">Ideator · Top ranked idea</p>
            <p className="text-xs text-landing-muted-fg">AI workflow automation for SMBs</p>
          </div>
          <span className="rounded-full bg-landing-accent/15 px-3 py-1 text-xs font-semibold text-landing-accent">
            Gate ready
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Viability", value: "8.4" },
            { label: "Desirability", value: "7.9" },
            { label: "Feasibility", value: "8.1" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-3"
            >
              <p className="text-[0.625rem] uppercase tracking-wider text-landing-muted-fg">
                {stat.label}
              </p>
              <p className="mt-1 font-display text-xl text-landing-fg">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
