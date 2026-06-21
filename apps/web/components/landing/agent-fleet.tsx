"use client";

import {
  Briefcase,
  Building2,
  Database,
  FlaskConical,
  Globe,
  Layers,
  Lightbulb,
  LineChart,
  Rocket,
  ShieldCheck,
  UserCog,
  Users,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type StageTab = "idea" | "psf" | "pmf" | "governance";

const tabActiveStyles: Record<StageTab, string> = {
  idea: "data-[state=active]:bg-sky-400/15 data-[state=active]:text-sky-300 data-[state=active]:border-sky-400/25",
  psf: "data-[state=active]:bg-violet-400/15 data-[state=active]:text-violet-300 data-[state=active]:border-violet-400/25",
  pmf: "data-[state=active]:bg-landing-accent/15 data-[state=active]:text-landing-accent data-[state=active]:border-landing-accent/25",
  governance:
    "data-[state=active]:bg-amber-400/15 data-[state=active]:text-amber-300 data-[state=active]:border-amber-400/25",
};

type AgentDef = {
  name: string;
  description: string;
  icon: typeof Lightbulb;
};

const stageTabs: {
  value: StageTab;
  label: string;
  count: number;
  intro: string;
  agents: AgentDef[];
}[] = [
  {
    value: "idea",
    label: "Idea",
    count: 2,
    intro: "Generate concepts from your prompt and market intelligence, ranked on three dimensions.",
    agents: [
      {
        name: "Ideator",
        description:
          "Generates ideas from your prompt, enriched by live market intelligence. Ranks each concept on viability, desirability, and feasibility, scored 0 to 10, so the strongest ideas surface first.",
        icon: Lightbulb,
      },
      {
        name: "Market Intelligence",
        description:
          "Runs AI-powered competitive and demand research to feed the Ideator, surfacing trends, whitespace, and market signals that ground every idea in real context.",
        icon: Globe,
      },
    ],
  },
  {
    value: "psf",
    label: "PSF",
    count: 4,
    intro: "Prove your solution solves a real problem before you scale.",
    agents: [
      {
        name: "Hypothesis Builder",
        description:
          "Shapes falsifiable hypotheses with clear success criteria and measurable outcomes, turning ranked ideas into experiments worth running.",
        icon: FlaskConical,
      },
      {
        name: "Persona Profiler",
        description:
          "Builds deep customer personas through guided AI conversations, capturing pains, triggers, channels, and the language your early users actually use.",
        icon: Users,
      },
      {
        name: "Early Data Manager",
        description:
          "Designs experiments and orchestrates early data collection from real users, connecting GitHub, analytics, and ad platforms to capture validation signals.",
        icon: Database,
      },
      {
        name: "POC Agent",
        description:
          "Drafts proof-of-concept scopes and lightweight build plans, defining the smallest thing you can ship to test whether the solution truly resonates.",
        icon: Layers,
      },
    ],
  },
  {
    value: "pmf",
    label: "PMF",
    count: 4,
    intro: "Architect, launch, and measure until demand becomes repeatable.",
    agents: [
      {
        name: "Persona Refiner",
        description:
          "Updates personas based on experiment results and market feedback, sharpening segment definitions as you learn who converts and who churns.",
        icon: UserCog,
      },
      {
        name: "MVP Architect",
        description:
          "Translates validated learnings into MVP architecture, scoping features, technical boundaries, and build priorities for the first scalable version.",
        icon: Building2,
      },
      {
        name: "Go-to-Market Agent",
        description:
          "Designs launch strategy, including channels, ad copy, landing pages, and budget allocation, through the platform's structured experiment builder.",
        icon: Rocket,
      },
      {
        name: "KPI Analyst",
        description:
          "Defines primary and secondary KPIs, sets thresholds, and tracks performance against targets as go-to-market experiments run in the wild.",
        icon: LineChart,
      },
    ],
  },
  {
    value: "governance",
    label: "Governance",
    count: 2,
    intro: "Cross-stage oversight, with progress reporting and gate decisions on every advance.",
    agents: [
      {
        name: "CEO Agent",
        description:
          "Creates structured progress reports across the pipeline, summarizing what moved, what stalled, and what each stage needs to advance with confidence.",
        icon: Briefcase,
      },
      {
        name: "Governance Agent",
        description:
          "Reviews evidence at each gate and recommends whether more information is needed or the project is ready to advance, keeping innovation disciplined, not chaotic.",
        icon: ShieldCheck,
      },
    ],
  },
];

function AgentList({ agents, indexOffset = 0 }: { agents: AgentDef[]; indexOffset?: number }) {
  return (
    <div className="divide-y divide-landing-border rounded-sm border border-landing-border bg-landing-surface/70 backdrop-blur-sm">
      {agents.map((agent, i) => {
        const index = indexOffset + i + 1;

        return (
          <article
            key={agent.name}
            className="group flex flex-col gap-3 p-6 transition-colors hover:bg-landing-surface sm:flex-row sm:items-baseline sm:gap-8 sm:p-8"
          >
            <div className="flex shrink-0 items-baseline gap-4 sm:w-56">
              <span className="font-display text-sm tabular-nums text-landing-accent/70">
                {String(index).padStart(2, "0")}
              </span>
              <h3 className="font-brand text-base font-semibold tracking-tight text-landing-fg">
                {agent.name}
              </h3>
            </div>

            <p className="min-w-0 flex-1 text-sm leading-relaxed text-landing-muted-fg">
              {agent.description}
            </p>
          </article>
        );
      })}
    </div>
  );
}

export function AgentFleet() {
  const stageAgentOffsets: Record<StageTab, number> = {
    idea: 0,
    psf: 2,
    pmf: 6,
    governance: 10,
  };

  return (
    <section id="agents" className="relative scroll-mt-24 overflow-hidden py-20 md:py-28">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-50"
        style={{ backgroundImage: "url(/sections/platform.webp)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(11,17,15,0.55) 0%, rgba(11,17,15,0.45) 50%, rgba(11,17,15,0.8) 100%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <span className="font-display text-lg tabular-nums text-landing-accent">03</span>
          <span className="h-px w-10 bg-landing-border" />
          <span className="font-brand text-xs font-medium text-landing-muted-fg">
            The fleet
          </span>
        </div>
        <div className="mt-8 max-w-2xl">
          <h2 className="font-display text-4xl font-normal leading-[1.08] tracking-[-0.02em] text-landing-fg sm:text-5xl">
            Twelve agents, one gated pipeline.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-landing-muted-fg md:text-lg">
            Specialized agents across Idea, PSF, and PMF, plus a governance layer
            where the CEO and gate agents oversee every advance.
          </p>
        </div>

        <Tabs defaultValue="idea" className="mt-16">
          <TabsList className="flex h-auto w-full flex-wrap gap-2 rounded-sm border border-landing-border bg-landing-surface/70 p-2 backdrop-blur-sm sm:inline-flex sm:w-auto">
            {stageTabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  "flex-1 rounded-sm border border-transparent px-5 py-2.5 font-brand text-sm font-semibold text-landing-muted-fg transition-all sm:flex-none",
                  tabActiveStyles[tab.value]
                )}
              >
                {tab.label}
                <span className="ml-2 text-xs font-medium opacity-60">
                  {tab.count}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {stageTabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-8 focus-visible:outline-none">
              <AgentList agents={tab.agents} indexOffset={stageAgentOffsets[tab.value]} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
