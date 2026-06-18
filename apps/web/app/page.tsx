import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BrandLogo } from "@/components/landing/brand-logo";
import { AgentFleet } from "@/components/landing/agent-fleet";
import { IntegrationLogos } from "@/components/landing/integration-logos";
import { ProjectLifecycleVisual } from "@/components/landing/project-lifecycle-visual";
import { WaitlistForm } from "@/components/landing/waitlist-form";
import {
  ArrowRight,
  Briefcase,
  Compass,
  FlaskConical,
  Gauge,
  Globe,
  Lightbulb,
  Repeat,
  Rocket,
  ShieldCheck,
  Target,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="relative min-h-screen bg-landing-bg text-landing-fg">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[900px]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 70% 20%, rgba(126,252,184,0.07), transparent 60%), radial-gradient(ellipse 50% 40% at 10% 80%, rgba(126,252,184,0.04), transparent 50%)",
        }}
        aria-hidden
      />

      <Nav />
      <main>
        <Hero />
        <LogoBar />
        <InnovationStages />
        <Methodology />
        <AgentFleet />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-landing-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <BrandLogo size="sm" />
        </Link>

        <nav className="hidden items-center gap-10 text-sm font-medium text-landing-muted-fg md:flex">
          <a href="#features" className="transition-colors hover:text-landing-fg">
            Features
          </a>
          <a href="#stages" className="transition-colors hover:text-landing-fg">
            Stages
          </a>
          <a href="#agents" className="transition-colors hover:text-landing-fg">
            Agents
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-landing-muted-fg transition-colors hover:text-landing-fg sm:inline-flex"
          >
            Sign in
          </Link>
          <a
            href="#waitlist"
            className="inline-flex items-center gap-2 rounded-full bg-landing-accent px-5 py-2.5 text-sm font-semibold text-landing-ink transition-all hover:bg-landing-accent/90"
          >
            Join waitlist
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 pt-16 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:pb-32 lg:pt-24">
        <div>
          <h1 className="font-display text-[2.625rem] font-normal leading-[1.08] tracking-[-0.02em] text-landing-fg sm:text-5xl lg:text-[3.75rem]">
            The agentic operating system for innovation
          </h1>

          <p className="mt-7 max-w-lg text-base leading-relaxed text-landing-muted-fg md:text-lg md:leading-relaxed">
            Reaching product-market fit shouldn&apos;t be guesswork. DrumR puts
            specialized AI agents around a gated process, from Idea, Problem
            Solution Fit to Product Market Fit, so every decision is grounded in
            real data, not just conviction.
          </p>

          <WaitlistForm source="hero" showSignInHint className="mt-10" />
        </div>

        <div className="relative">
          <ProjectLifecycleVisual />
        </div>
      </div>
    </section>
  );
}

function LogoBar() {
  return (
    <section className="border-y border-white/[0.06] bg-landing-muted/40 py-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="text-center text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-landing-muted-fg">
          Integrates with the tools you already use
        </p>
        <IntegrationLogos className="mt-10" />
      </div>
    </section>
  );
}

const features = [
  {
    icon: Lightbulb,
    title: "Idea scoring",
    description:
      "Generate ideas from your prompt and market intelligence, then rank each on viability, desirability, and feasibility, scored 0 to 10.",
  },
  {
    icon: FlaskConical,
    title: "PSF validation",
    description:
      "Build hypotheses, profile personas, run early experiments, and draft POCs, collecting real user data before you scale.",
  },
  {
    icon: Rocket,
    title: "PMF acceleration",
    description:
      "Refine personas, architect your MVP, launch go-to-market experiments, and track KPIs until demand is repeatable.",
  },
  {
    icon: Briefcase,
    title: "CEO progress reports",
    description:
      "Receive structured progress reports across every stage, covering what moved, what stalled, and what needs attention next.",
  },
  {
    icon: ShieldCheck,
    title: "Governance gates",
    description:
      "A governance agent reviews evidence at each gate and recommends whether you need more information or can advance.",
  },
  {
    icon: Globe,
    title: "Market intelligence",
    description:
      "AI-powered research feeds every stage, from idea generation through competitive positioning at launch.",
  },
];

function Features() {
  return (
    <section id="features" className="py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-landing-accent">
            Platform
          </p>
          <h2 className="mt-4 font-display text-4xl font-normal leading-[1.1] tracking-[-0.02em] text-landing-fg sm:text-5xl">
            Built for every stage of innovation
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-landing-muted-fg">
            From scored ideas to validated solution and repeatable market
            demand. DrumR runs the full innovation pipeline with agents at
            every stage.
          </p>
        </div>

        <div className="mt-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group rounded-2xl border border-white/[0.06] bg-landing-surface/60 p-7 transition-all duration-300 hover:border-landing-accent/20 hover:bg-landing-surface"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-landing-accent transition-colors group-hover:border-landing-accent/20 group-hover:bg-landing-accent/10">
                <feature.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <h3 className="font-brand text-base font-semibold tracking-tight text-landing-fg">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-landing-muted-fg">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const stages = [
  {
    step: "01",
    label: "Idea",
    title: "Generate and rank ideas",
    description:
      "Submit a prompt enriched by market intelligence. The Ideator generates concepts and scores each on viability, desirability, and feasibility (0–10) before anything gets built.",
    icon: Lightbulb,
    agents: ["Ideator", "Market Intelligence"],
  },
  {
    step: "02",
    label: "PSF",
    title: "Validate the solution",
    description:
      "Shape hypotheses, profile personas, run early experiments, and draft POCs. The Early Data Manager collects real signals from users while you prove product-solution fit.",
    icon: FlaskConical,
    agents: ["Hypothesis Builder", "Persona Profiler", "Early Data Manager", "POC Agent"],
  },
  {
    step: "03",
    label: "PMF",
    title: "Validate your product",
    description:
      "Refine personas, architect the MVP, launch go-to-market motions, and track KPIs. Scale only when the data confirms repeatable product-market fit.",
    icon: Target,
    agents: ["Persona Refiner", "MVP Architect", "Go-to-Market Agent", "KPI Analyst"],
  },
];

const methodologies = [
  {
    icon: Compass,
    name: "Design Thinking",
    principle: "Desirability",
    description:
      "Start from the human. Agents profile personas, surface real pain points, and prototype concepts so you build what people actually want.",
  },
  {
    icon: Gauge,
    name: "Lean Startup",
    principle: "Validated learning",
    description:
      "Build, measure, learn fast. Every hypothesis becomes a cheap experiment, and decisions are made on real signals, never opinions.",
  },
  {
    icon: Repeat,
    name: "Agile",
    principle: "Continuous iteration",
    description:
      "Move in tight loops. Work advances in short cycles with governance gates that decide when to iterate, pivot, or scale.",
  },
];

function Methodology() {
  return (
    <section
      id="methodology"
      className="border-t border-white/[0.06] py-28 md:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-landing-accent">
            Methodology
          </p>
          <h2 className="mt-4 font-display text-4xl font-normal leading-[1.1] tracking-[-0.02em] text-landing-fg sm:text-5xl">
            The best of every innovation playbook
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-landing-muted-fg">
            DrumR distills decades of proven practice: Design Thinking, Lean
            Startup, and Agile bundled into one continuous, agent-driven loop.
            The result is the leanest, most data-driven path from idea to
            product-market fit.
          </p>
        </div>

        <div className="mt-20 grid gap-5 lg:grid-cols-3">
          {methodologies.map((method) => (
            <article
              key={method.name}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-landing-surface/60 p-8 transition-all duration-300 hover:border-landing-accent/20 hover:bg-landing-surface"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-landing-accent/10 text-landing-accent transition-colors group-hover:border-landing-accent/25">
                  <method.icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-brand text-lg font-semibold tracking-tight text-landing-fg">
                    {method.name}
                  </h3>
                  <p className="font-brand text-xs font-medium uppercase tracking-[0.14em] text-landing-accent/70">
                    {method.principle}
                  </p>
                </div>
              </div>
              <p className="mt-6 text-sm leading-relaxed text-landing-muted-fg">
                {method.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start gap-4 rounded-2xl border border-landing-accent/15 bg-landing-accent/[0.06] p-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl font-display text-xl font-normal leading-snug tracking-[-0.01em] text-landing-fg sm:text-2xl">
            One loop. Human-centered, evidence-based, and relentlessly iterative,
            so you only scale what the data confirms.
          </p>
          <Link
            href="#waitlist"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-landing-accent px-5 py-2.5 font-brand text-sm font-semibold text-landing-bg transition-opacity hover:opacity-90"
          >
            Join waitlist
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function InnovationStages() {
  return (
    <section
      id="stages"
      className="border-t border-white/[0.06] bg-landing-muted/30 py-28 md:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-landing-accent">
            Innovation pipeline
          </p>
          <h2 className="mt-4 font-display text-4xl font-normal leading-[1.1] tracking-[-0.02em] text-landing-fg sm:text-5xl">
            Three stages. One continuous loop.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-landing-muted-fg">
            DrumR moves with your concept through multiple steps, from Idea
            generation to product-solution fit to product-market fit, supported
            by dedicated agents at each gate and governance oversight throughout.
          </p>
        </div>

        <div className="relative mt-20">
          <div className="grid gap-6 lg:grid-cols-3">
            {stages.map((stage) => (
              <article
                key={stage.label}
                className="relative rounded-2xl border border-white/[0.06] bg-landing-surface/60 p-8 transition-all duration-300 hover:border-landing-accent/20 hover:bg-landing-surface"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-landing-accent/10 text-landing-accent">
                    <stage.icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <span className="rounded-full border border-landing-accent/20 bg-landing-accent/10 px-3 py-1 font-brand text-xs font-semibold tracking-wide text-landing-accent">
                    {stage.label}
                  </span>
                </div>
                <span className="font-display text-3xl font-normal text-landing-accent/50">
                  {stage.step}
                </span>
                <h3 className="mt-3 font-display text-2xl font-normal tracking-[-0.02em] text-landing-fg">
                  {stage.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-landing-muted-fg">
                  {stage.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {stage.agents.map((agent) => (
                    <span
                      key={agent}
                      className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-1 font-brand text-[0.625rem] font-medium text-landing-muted-fg"
                    >
                      {agent}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="waitlist" className="scroll-mt-24 py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-landing-surface px-8 py-14 sm:px-14 sm:py-16">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, rgba(126,252,184,0.12), transparent 50%)",
            }}
            aria-hidden
          />
          <div className="relative max-w-2xl">
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-landing-accent">
              Early access
            </p>
            <h2 className="mt-4 font-display text-4xl font-normal leading-[1.1] tracking-[-0.02em] text-landing-fg sm:text-5xl">
              Join the waitlist
            </h2>
            <p className="mt-5 text-base leading-relaxed text-landing-muted-fg md:text-lg">
              Be first in line for DrumR, the agentic innovation platform from
              Idea, Problem Solution Fit to Product Market Fit. We&apos;ll
              notify you when spots open.
            </p>
            <WaitlistForm
              source="cta"
              variant="stacked"
              className="mt-10"
              showSignInHint
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 sm:flex-row lg:px-10">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <div className="flex items-center gap-4">
            <BrandLogo size="sm" />
            <span className="text-sm text-landing-muted-fg">
              &copy; {new Date().getFullYear()} DrumR
            </span>
          </div>
          <p className="text-xs text-landing-muted-fg/70">
            A{" "}
            <a
              href="https://perceptron-labs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-landing-muted-fg underline-offset-4 transition-colors hover:text-landing-fg hover:underline"
            >
              Perceptron Labs
            </a>{" "}
            solution
          </p>
        </div>
        <div className="flex gap-8 text-sm text-landing-muted-fg">
          <Link href="/login" className="transition-colors hover:text-landing-fg">
            Sign in
          </Link>
          <a href="#waitlist" className="transition-colors hover:text-landing-fg">
            Join waitlist
          </a>
        </div>
      </div>
    </footer>
  );
}
