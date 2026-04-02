import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  FlaskConical,
  IterationCcw,
  Target,
  Users,
  Zap,
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
    <div className="flex min-h-screen flex-col">
      <Nav />
      <Hero />
      <LogoBar />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <IterationCcw className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">Drumr</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#how-it-works" className="transition-colors hover:text-foreground">
            How it works
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/signup">
              Get started <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--color-muted)_0%,_transparent_50%)]" />
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-24 md:pb-32 md:pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm text-muted-foreground">
            <Zap className="h-3.5 w-3.5 text-warning" />
            Autonomous P/M fit validation
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Stop guessing.{" "}
            <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              Start validating.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Drumr is your autonomous CEO agent that connects market
            intelligence, persona understanding, and ad experiments — driving toward
            product-market fit through structured hypothesis validation.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/signup">
                Create free account <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
              <Link href="/login">Sign in to your account</Link>
            </Button>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            No credit card required. Start validating in minutes.
          </p>
        </div>
      </div>
    </section>
  );
}

function LogoBar() {
  return (
    <section className="border-y bg-muted/30 py-8">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Integrates with the tools you already use
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-sm font-medium text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-success" />
            GitHub
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-info" />
            Google Analytics
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-warning" />
            Google Ads
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-foreground" />
            X / Twitter Ads
          </span>
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    icon: BrainCircuit,
    title: "AI-powered personas",
    description:
      "Build deep customer personas through guided AI conversations. Drumr understands who your users are and what drives them.",
  },
  {
    icon: BarChart3,
    title: "Automated market analysis",
    description:
      "Get real-time market intelligence powered by AI research. Understand your competitive landscape without hours of manual work.",
  },
  {
    icon: FlaskConical,
    title: "Experiment builder",
    description:
      "Design falsifiable experiments with a structured 7-step flow. Validate hypotheses with real data, not assumptions.",
  },
  {
    icon: Target,
    title: "Daily CEO reports",
    description:
      "Receive actionable daily reports with clear CONTINUE, PUSH, or PAUSE recommendations. Always know what to do next.",
  },
  {
    icon: IterationCcw,
    title: "Verdict loop",
    description:
      "Automatically update personas and propose next experiments based on results. The loop never stops learning.",
  },
  {
    icon: Users,
    title: "Team email digests",
    description:
      "Keep your whole team aligned with daily email summaries of experiment progress, insights, and next steps.",
  },
];

function Features() {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to find P/M fit
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From market research to experiment validation — Drumr automates the
            entire product-market fit discovery process.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border bg-card p-6 transition-colors hover:border-foreground/20"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <feature.icon className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    step: "01",
    title: "Register your product",
    description:
      "Describe your product and optionally connect your data sources — GitHub, Google Analytics, Google Ads, or X Ads.",
  },
  {
    step: "02",
    title: "Build your personas",
    description:
      "Use AI-guided conversations to create deep, nuanced customer personas that evolve as you learn.",
  },
  {
    step: "03",
    title: "Run experiments",
    description:
      "Design hypotheses, set success criteria, and launch experiments. Drumr tracks results and delivers verdicts.",
  },
  {
    step: "04",
    title: "Close the loop",
    description:
      "Get daily CEO reports, act on recommendations, and watch your personas and strategy refine automatically.",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t bg-muted/20 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Four steps to systematic product-market fit validation.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.step} className="relative">
              {i < steps.length - 1 && (
                <div className="absolute right-0 top-8 hidden h-px w-6 bg-border lg:block" />
              )}
              <div className="rounded-xl border bg-card p-6">
                <span className="text-2xl font-bold text-muted-foreground/40">
                  {step.step}
                </span>
                <h3 className="mt-3 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl rounded-2xl border bg-card p-8 text-center sm:p-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to validate your P/M fit?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Join founders and product teams using Drumr to make data-driven
            decisions and find product-market fit faster.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/signup">
                Create your account <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
            <IterationCcw className="h-3 w-3 text-primary-foreground" />
          </div>
          <span className="font-medium text-foreground">Drumr</span>
          <span>&middot;</span>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <Link href="/login" className="transition-colors hover:text-foreground">
            Sign in
          </Link>
          <Link href="/signup" className="transition-colors hover:text-foreground">
            Register
          </Link>
        </div>
      </div>
    </footer>
  );
}
