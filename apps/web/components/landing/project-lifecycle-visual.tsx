"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { STAGE_META, type InteractionState, type StageId } from "./project-lifecycle-3d";

const ProjectLifecycle3D = dynamic(
  () => import("./project-lifecycle-3d").then((m) => m.ProjectLifecycle3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#0c1512]">
        <div className="h-12 w-12 animate-pulse rounded-full border border-[#7efcb8]/20 bg-[#7efcb8]/5" />
      </div>
    ),
  }
);

const STAGE_ORDER: StageId[] = ["idea", "psf", "pmf", "governance"];

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

export function ProjectLifecycleVisual() {
  const [activeStage, setActiveStage] = useState<StageId>("idea");
  const [paused, setPaused] = useState(false);
  const [grabbing, setGrabbing] = useState(false);

  // Single mutable interaction object read inside the render loop — no re-renders.
  const interaction = useRef<InteractionState>({
    pointer: { x: 0, y: 0 },
    hovering: false,
    dragging: false,
    spinVelocity: 0,
  });
  const lastX = useRef(0);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setActiveStage((current) => {
        const idx = STAGE_ORDER.indexOf(current);
        return STAGE_ORDER[(idx + 1) % STAGE_ORDER.length];
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [paused]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    const it = interaction.current;
    if (it.dragging) {
      // fling momentum proportional to drag speed
      it.spinVelocity += (nx - lastX.current) * 3.2;
    }
    it.pointer.x = nx;
    it.pointer.y = ny;
    lastX.current = nx;
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = e.currentTarget.getBoundingClientRect();
    lastX.current = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    interaction.current.dragging = true;
    setGrabbing(true);
  }, []);

  const endDrag = useCallback(() => {
    interaction.current.dragging = false;
    setGrabbing(false);
  }, []);

  const meta = STAGE_META[activeStage];

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-landing-surface shadow-[0_32px_80px_rgba(0,0,0,0.45)]">
      <div
        className={cn(
          "relative aspect-[4/3] touch-none select-none",
          grabbing ? "cursor-grabbing" : "cursor-grab"
        )}
        onPointerMove={handlePointerMove}
        onPointerEnter={() => {
          interaction.current.hovering = true;
        }}
        onPointerLeave={() => {
          interaction.current.hovering = false;
          interaction.current.pointer.x = 0;
          interaction.current.pointer.y = 0;
          endDrag();
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <ProjectLifecycle3D
          className="absolute inset-0 h-full w-full"
          activeStage={activeStage}
          interaction={interaction}
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#0c1512]/90 to-transparent" />

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
