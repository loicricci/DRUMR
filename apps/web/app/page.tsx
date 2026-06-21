import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { BrandLogo } from "@/components/landing/brand-logo";
import { AgentFleet } from "@/components/landing/agent-fleet";
import { IntegrationLogos } from "@/components/landing/integration-logos";
import { ProjectLifecycleVisual } from "@/components/landing/project-lifecycle-visual";
import { WaitlistForm } from "@/components/landing/waitlist-form";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowUpRight, Github } from "lucide-react";

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
    <div className="min-h-screen bg-landing-bg text-landing-fg">
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

function SectionMarker({
  index,
  label,
  tone = "dark",
}: {
  index: string;
  label: string;
  tone?: "dark" | "paper";
}) {
  const paper = tone === "paper";
  return (
    <div className="flex items-center gap-4">
      <span
        className={cn(
          "font-display text-lg tabular-nums",
          paper ? "text-landing-clay" : "text-landing-accent"
        )}
      >
        {index}
      </span>
      <span
        className={cn(
          "h-px w-10",
          paper ? "bg-landing-paper-border" : "bg-landing-border"
        )}
      />
      <span
        className={cn(
          "font-brand text-xs font-medium",
          paper ? "text-landing-paper-muted" : "text-landing-muted-fg"
        )}
      >
        {label}
      </span>
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-landing-border bg-landing-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <BrandLogo size="md" />
        </Link>

        <nav className="hidden items-center gap-10 text-sm text-landing-muted-fg md:flex">
          <a href="#stages" className="transition-colors hover:text-landing-fg">
            Pipeline
          </a>
          <a href="#agents" className="transition-colors hover:text-landing-fg">
            Agents
          </a>
          <a href="#features" className="transition-colors hover:text-landing-fg">
            Platform
          </a>
        </nav>

        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="hidden text-sm text-landing-muted-fg transition-colors hover:text-landing-fg sm:inline-flex"
          >
            Sign in
          </Link>
          <a
            href="#waitlist"
            className="inline-flex items-center gap-2 rounded-sm bg-landing-accent px-4 py-2 text-sm font-semibold text-landing-ink transition-colors hover:bg-landing-accent/90"
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
    <section className="relative overflow-hidden border-b border-landing-border">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url(/sections/hero.webp)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, var(--color-landing-bg) 0%, rgba(12,21,18,0.72) 55%, rgba(12,21,18,0.4) 100%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 pb-20 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="flex flex-col">
          <div className="flex items-center gap-3 text-sm text-landing-muted-fg">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-landing-accent" />
            The agentic operating system for innovation
          </div>

          <h1 className="mt-8 font-display text-[2.75rem] font-normal leading-[1.04] tracking-[-0.025em] text-landing-fg sm:text-[3.25rem] lg:text-[4rem]">
            Turning ideas into
            <br className="hidden sm:block" /> useful solutions.
          </h1>

          <p className="mt-7 max-w-md text-base leading-relaxed text-landing-muted-fg md:text-lg">
            Product-market fit shouldn&apos;t be guesswork. DrumR wraps
            specialized AI agents around a gated process, from Idea to
            Problem-Solution Fit to Product-Market Fit, so every call is backed
            by evidence instead of conviction.
          </p>

          <div className="mt-10 max-w-md">
            <WaitlistForm source="hero" showSignInHint />
          </div>

          <dl className="mt-10 grid max-w-md grid-cols-3 gap-6">
            {[
              { value: "3", label: "Gated stages" },
              { value: "12", label: "Specialist agents" },
              { value: "10", label: "Max grade" },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="font-display text-4xl font-normal leading-none tracking-[-0.01em] text-landing-fg sm:text-5xl">
                  {stat.value}
                </dt>
                <dd className="mt-2.5 text-xs text-landing-muted-fg">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
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
    <section className="border-b border-landing-border">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
          <p className="max-w-[12rem] shrink-0 text-sm leading-snug text-landing-muted-fg">
            Plugs into the stack you already run on
          </p>
          <div className="hidden h-10 w-px bg-landing-border lg:block" />
          <IntegrationLogos className="lg:flex-1" />
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
    image: "/stages/idea.webp",
    agents: ["Ideator", "Market Intelligence"],
  },
  {
    step: "02",
    label: "PSF",
    title: "Validate the solution",
    description:
      "Shape hypotheses, profile personas, run early experiments, and draft POCs. The Early Data Manager collects real signals from users while you prove product-solution fit.",
    image: "/stages/psf.webp",
    agents: ["Hypothesis Builder", "Persona Profiler", "Early Data Manager", "POC Agent"],
  },
  {
    step: "03",
    label: "PMF",
    title: "Validate your product",
    description:
      "Refine personas, architect the MVP, launch go-to-market motions, and track KPIs. Scale only when the data confirms repeatable product-market fit.",
    image: "/stages/pmf.webp",
    agents: ["Persona Refiner", "MVP Architect", "Go-to-Market Agent", "KPI Analyst"],
  },
];

function InnovationStages() {
  return (
    <section id="stages" className="scroll-mt-20 border-b border-landing-border">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28 lg:px-8">
        <SectionMarker index="01" label="The pipeline" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
          <h2 className="font-display text-4xl font-normal leading-[1.08] tracking-[-0.02em] text-landing-fg sm:text-5xl">
            Three stages, one continuous loop.
          </h2>
          <p className="text-base leading-relaxed text-landing-muted-fg">
            DrumR moves your concept from idea generation to product-solution
            fit to product-market fit, with dedicated agents at each gate and
            governance oversight the whole way through.
          </p>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-sm border border-landing-border bg-landing-border md:grid-cols-3">
          {stages.map((stage) => (
            <article
              key={stage.label}
              className="group relative flex flex-col overflow-hidden bg-landing-bg p-7"
            >
              <div
                className="pointer-events-none absolute inset-0 scale-105 bg-cover bg-center opacity-25 blur-sm transition-opacity duration-500 group-hover:opacity-40"
                style={{ backgroundImage: `url(${stage.image})` }}
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(12,21,18,0.55) 0%, rgba(12,21,18,0.88) 100%)",
                }}
                aria-hidden
              />

              <div className="relative flex flex-1 flex-col">
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-5xl font-normal text-landing-fg/15">
                    {stage.step}
                  </span>
                  <span className="font-brand text-xs font-semibold tracking-wide text-landing-accent">
                    {stage.label}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-2xl font-normal tracking-[-0.01em] text-landing-fg">
                  {stage.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-landing-muted-fg">
                  {stage.description}
                </p>
                <div className="mt-6 flex min-h-[3.75rem] flex-wrap content-start gap-1.5 border-t border-landing-border pt-5">
                  {stage.agents.map((agent) => (
                    <span
                      key={agent}
                      className="font-brand text-[0.6875rem] text-landing-muted-fg"
                    >
                      {agent}
                      <span className="mx-1.5 text-landing-border last:hidden">·</span>
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-px overflow-hidden rounded-sm border border-landing-border bg-landing-border lg:grid-cols-[3fr_7fr]">
          <div className="flex flex-col justify-between gap-8 bg-landing-surface p-7">
            <div className="flex items-start gap-4">
              <Github className="mt-0.5 h-5 w-5 shrink-0 text-landing-accent" strokeWidth={1.5} />
              <div>
                <p className="font-display text-lg leading-snug text-landing-fg">
                  Run the Idea stage today and get a report
                </p>
                <p className="mt-1.5 font-brand text-xs font-semibold text-landing-accent">
                  Free and open source
                </p>
                <p className="mt-3 text-sm leading-relaxed text-landing-muted-fg">
                  The Ideation Kit runs the full Idea stage locally with Claude
                  Code. Three agents turn a one-line prompt into a ranked,
                  evidence-backed shortlist.
                </p>
              </div>
            </div>
            <a
              href="https://github.com/loicricci/DrumR_Ideation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-sm border border-landing-border px-4 py-2.5 font-brand text-sm font-semibold text-landing-fg transition-colors hover:border-landing-accent/40 hover:text-landing-accent"
            >
              <Github className="h-4 w-4" />
              Get the kit
            </a>
          </div>
          <div className="relative min-h-[340px] bg-landing-bg lg:min-h-[420px]">
            <Image
              src="/sections/report-drumr-v2.jpg"
              alt="DrumR CEO progress report"
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

const methodologies = [
  {
    name: "Design Thinking",
    principle: "Desirability",
    description:
      "Start from the human. Agents profile personas, surface real pain points, and prototype concepts so you build what people actually want.",
  },
  {
    name: "Lean Startup",
    principle: "Validated learning",
    description:
      "Build, measure, learn fast. Every hypothesis becomes a cheap experiment, and decisions ride on real signals, never opinions.",
  },
  {
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
      className="bg-landing-paper text-landing-paper-fg"
    >
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28 lg:px-8">
        <SectionMarker index="02" label="The method" tone="paper" />
        <div className="mt-8 max-w-3xl">
          <h2 className="font-display text-4xl font-normal leading-[1.06] tracking-[-0.02em] text-landing-paper-fg sm:text-5xl">
            Design Thinking, Lean, and Agile — fused into a single loop.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-landing-paper-muted md:text-lg">
            We didn&apos;t invent a new framework. We took three that already
            work and let agents run them end to end: human-centered,
            evidence-based, relentlessly iterative.
          </p>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden border-y border-landing-paper-border md:grid-cols-3 md:gap-12 md:border-y-0">
          {methodologies.map((method) => (
            <div
              key={method.name}
              className="border-t border-landing-paper-border py-8 md:border-t-0 md:py-0"
            >
              <h3 className="font-display text-2xl font-normal tracking-[-0.01em] text-landing-paper-fg">
                {method.name}
              </h3>
              <p className="mt-1 font-brand text-xs font-semibold uppercase tracking-[0.12em] text-landing-clay">
                {method.principle}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-landing-paper-muted">
                {method.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start gap-6 border-t border-landing-paper-border pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl font-display text-2xl font-normal leading-snug tracking-[-0.01em] text-landing-paper-fg">
            One loop. You only scale what the data confirms.
          </p>
          <Link
            href="#waitlist"
            className="inline-flex shrink-0 items-center gap-2 rounded-sm bg-landing-paper-fg px-5 py-2.5 font-brand text-sm font-semibold text-landing-paper transition-opacity hover:opacity-90"
          >
            Join waitlist
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    title: "Idea scoring",
    description:
      "Generate ideas from your prompt and market intelligence, then rank each on viability, desirability, and feasibility, scored 0 to 10.",
  },
  {
    title: "PSF validation",
    description:
      "Build hypotheses, profile personas, run early experiments, and draft POCs, collecting real user data before you scale.",
  },
  {
    title: "PMF acceleration",
    description:
      "Refine personas, architect your MVP, launch go-to-market experiments, and track KPIs until demand is repeatable.",
  },
  {
    title: "CEO progress reports",
    description:
      "Structured progress reports across every stage, covering what moved, what stalled, and what needs attention next.",
  },
  {
    title: "Governance gates",
    description:
      "A governance agent reviews evidence at each gate and recommends whether you need more information or can advance.",
  },
  {
    title: "Market intelligence",
    description:
      "AI-powered research feeds every stage, from idea generation through competitive positioning at launch.",
  },
];

function Features() {
  return (
    <section id="features" className="scroll-mt-20 border-b border-landing-border">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28 lg:px-8">
        <SectionMarker index="04" label="The platform" />
        <div className="mt-8 max-w-3xl">
          <h2 className="font-display text-4xl font-normal leading-[1.08] tracking-[-0.02em] text-landing-fg sm:text-5xl">
            One system for the whole journey.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-landing-muted-fg">
            From a one-line prompt to repeatable demand. Everything the pipeline
            needs at each stage, and nothing it doesn&apos;t.
          </p>
        </div>

        <div className="mt-16 grid border-t border-landing-border sm:grid-cols-2">
          {features.map((feature, i) => (
            <article
              key={feature.title}
              className="flex gap-6 border-b border-landing-border px-1 py-8 sm:px-6 sm:odd:border-r sm:odd:pl-0 sm:even:pr-0"
            >
              <span className="font-display text-sm tabular-nums text-landing-accent/70">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-brand text-base font-semibold tracking-tight text-landing-fg">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-landing-muted-fg">
                  {feature.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="waitlist" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28 lg:px-8">
        <div className="grid gap-10 rounded-sm border border-landing-border bg-landing-surface p-8 sm:p-12 lg:grid-cols-[1fr_0.9fr] lg:gap-16 lg:p-16">
          <div>
            <SectionMarker index="05" label="Early access" />
            <h2 className="mt-8 font-display text-4xl font-normal leading-[1.06] tracking-[-0.02em] text-landing-fg sm:text-5xl">
              Get in before the guesswork does.
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-landing-muted-fg md:text-lg">
              Be first in line for DrumR, the agentic innovation platform from
              Idea to Problem-Solution Fit to Product-Market Fit. We&apos;ll
              reach out when spots open.
            </p>
          </div>
          <div className="flex flex-col justify-center">
            <WaitlistForm source="cta" variant="stacked" showSignInHint />
            <div className="mt-8 flex items-center gap-3 border-t border-landing-border pt-6 text-sm text-landing-muted-fg">
              <ArrowUpRight className="h-4 w-4 text-landing-accent" />
              No credit card. Just early access and product updates.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-landing-border py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row lg:px-8">
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
        <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-sm text-landing-muted-fg">
          <Link href="/login" className="transition-colors hover:text-landing-fg">
            Sign in
          </Link>
          <a href="#waitlist" className="transition-colors hover:text-landing-fg">
            Join waitlist
          </a>
          <span className="hidden h-4 w-px bg-landing-border sm:inline-block" aria-hidden />
          <Link href="/privacy" className="transition-colors hover:text-landing-fg">
            Privacy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-landing-fg">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
