import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/landing/brand-logo";

export const metadata: Metadata = {
  title: "Ideation, PSF & PMF, the three validation gates | DrumR",
  description:
    "What Ideation, Problem–Solution Fit, and Product–Market Fit actually mean, and why DrumR groups them into three gated steps to validate ideas with evidence instead of conviction.",
};

const IDEA = "#7dd3fc";
const PSF = "#c4b5fd";
const PMF = "#7efcb8";

type Stage = {
  label: string;
  acronym: string;
  full: string;
  color: string;
  question: string;
  body: string;
  does: string[];
  gate: string;
};

const stages: Stage[] = [
  {
    label: "Stage 01",
    acronym: "Idea",
    full: "Ideation",
    color: IDEA,
    question: "Is this idea even worth pursuing?",
    body: "Before a line of code or a single experiment, you need to know an idea earns your time. Ideation turns a prompt, enriched with live market intelligence, into concrete concepts, then scores each one so the strongest rise to the top.",
    does: [
      "Generate concepts from your prompt and real market signals",
      "Score each on viability, desirability, and feasibility (0–10)",
      "Rank everything into an evidence-backed shortlist",
    ],
    gate: "Advance when an idea scores high enough across all three dimensions to justify real validation.",
  },
  {
    label: "Stage 02",
    acronym: "PSF",
    full: "Problem–Solution Fit",
    color: PSF,
    question: "Is the problem real, and does our solution actually solve it?",
    body: "A high-scoring idea is still a bet. Problem–Solution Fit is where you test that bet against reality: that a specific audience genuinely has the problem, and that your proposed solution resonates, before committing to building a full product.",
    does: [
      "Frame falsifiable hypotheses with clear success criteria",
      "Profile the personas who feel the problem most acutely",
      "Run lightweight experiments and POCs to collect real signals",
    ],
    gate: "Advance when the evidence shows the problem is real and your solution earns a genuine response.",
  },
  {
    label: "Stage 03",
    acronym: "PMF",
    full: "Product–Market Fit",
    color: PMF,
    question: "Does the market want this enough to come back for it?",
    body: "Solving a problem once isn't a business. Product–Market Fit is where you prove demand is repeatable and scalable: a real product, in a real market, pulling recurring usage, so you only pour fuel on a fire that's already lit.",
    does: [
      "Refine personas and architect a focused MVP",
      "Launch go-to-market experiments across channels",
      "Track KPIs against thresholds until demand repeats",
    ],
    gate: "Advance to scale when the data confirms repeatable, growing demand.",
  },
];

function GateFlow() {
  const nodes = [
    { n: "01", acronym: "Idea", full: "Ideation", color: IDEA },
    { n: "02", acronym: "PSF", full: "Problem–Solution Fit", color: PSF },
    { n: "03", acronym: "PMF", full: "Product–Market Fit", color: PMF },
  ];
  return (
    <div>
      <div className="mb-10 flex items-center gap-3">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-300" />
        <span className="font-brand text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-amber-300/80">
          Governance oversight at every gate
        </span>
      </div>

      <div className="relative grid gap-10 sm:grid-cols-3 sm:gap-4">
        <div
          className="pointer-events-none absolute left-[16.6%] right-[16.6%] top-7 hidden h-px sm:block"
          style={{
            background:
              "linear-gradient(to right, #7dd3fc, #c4b5fd, #7efcb8)",
            opacity: 0.45,
          }}
        />
        {nodes.map((node) => (
          <div key={node.acronym} className="relative flex flex-col items-center text-center">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full border bg-landing-surface"
              style={{ borderColor: `${node.color}80` }}
            >
              <span className="font-display text-lg" style={{ color: node.color }}>
                {node.n}
              </span>
            </div>
            <span className="mt-5 font-brand text-sm font-medium text-landing-fg">
              {node.full}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StageIllustration({ stage }: { stage: Stage }) {
  const c = stage.color;
  if (stage.acronym === "Idea") {
    const bars = [
      { x: 40, h: 70, label: "V" },
      { x: 95, h: 96, label: "D" },
      { x: 150, h: 58, label: "F" },
    ];
    return (
      <svg viewBox="0 0 220 180" className="h-full w-full" aria-hidden>
        <line x1="28" y1="140" x2="200" y2="140" stroke={c} strokeOpacity={0.25} strokeWidth="1" />
        {bars.map((b) => (
          <g key={b.label}>
            <rect x={b.x} y={140 - b.h} width="34" height={b.h} rx="4" fill={c} fillOpacity={0.18} stroke={c} strokeOpacity={0.5} strokeWidth="1" />
            <text x={b.x + 17} y="158" textAnchor="middle" fontSize="11" fill={c} fillOpacity={0.8}>
              {b.label}
            </text>
          </g>
        ))}
        <circle cx="175" cy="48" r="16" fill={c} fillOpacity={0.16} stroke={c} strokeOpacity={0.6} strokeWidth="1.5" />
        <path d="M175 40v16M171 52h8" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (stage.acronym === "PSF") {
    return (
      <svg viewBox="0 0 220 180" className="h-full w-full" aria-hidden>
        <path
          d="M92 36h36v34l30 56a14 14 0 0 1-12 22H74a14 14 0 0 1-12-22l30-56z"
          fill={c}
          fillOpacity={0.1}
          stroke={c}
          strokeOpacity={0.5}
          strokeWidth="1.5"
        />
        <path d="M70 118h80" stroke={c} strokeOpacity={0.4} strokeWidth="1.5" />
        {[
          [86, 132],
          [104, 142],
          [122, 130],
          [136, 140],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="4" fill={c} fillOpacity={0.85} />
        ))}
        <path d="M150 60l8 8M158 60l-8 8" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 220 180" className="h-full w-full" aria-hidden>
      <line x1="34" y1="146" x2="196" y2="146" stroke={c} strokeOpacity={0.25} strokeWidth="1" />
      <line x1="40" y1="30" x2="40" y2="146" stroke={c} strokeOpacity={0.25} strokeWidth="1" />
      <path
        d="M40 132C72 128 92 118 116 92 140 66 158 52 196 40"
        fill="none"
        stroke={c}
        strokeOpacity={0.8}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M196 40l-14 2M196 40l-2 14" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
      {[
        [72, 122],
        [116, 92],
        [158, 60],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="4.5" fill={c} />
      ))}
    </svg>
  );
}

export default function GlossaryPage() {
  return (
    <div className="min-h-screen bg-landing-bg text-landing-fg">
      <header className="sticky top-0 z-50 border-b border-landing-border bg-landing-bg/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <BrandLogo size="md" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-landing-muted-fg transition-colors hover:text-landing-fg"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 lg:px-8">
        <section className="border-b border-landing-border py-16 md:py-24">
          <div className="flex items-center gap-4">
            <span className="font-display text-lg text-landing-accent">·</span>
            <span className="h-px w-10 bg-landing-border" />
            <span className="font-brand text-xs font-medium text-landing-muted-fg">
              The framework
            </span>
          </div>
          <h1 className="mt-8 max-w-3xl font-display text-4xl font-normal leading-[1.06] tracking-[-0.025em] text-landing-fg sm:text-5xl lg:text-[3.5rem]">
            Idea, PSF, PMF. The three gates of validation.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-landing-muted-fg md:text-lg">
            Most products don&apos;t fail because the team couldn&apos;t build
            them. They fail because nobody validated whether they should. DrumR
            breaks the path from raw idea to repeatable demand into three gated
            steps, Ideation, <span className="text-landing-fg">PSF</span>{" "}
            (Problem–Solution Fit), and{" "}
            <span className="text-landing-fg">PMF</span> (Product–Market Fit).
            Each one kills a different risk before you spend on the next.
          </p>

          <div className="mt-12 rounded-sm border border-landing-border bg-landing-surface p-6 sm:p-10">
            <GateFlow />
          </div>
        </section>

        {stages.map((stage, i) => (
          <section
            key={stage.acronym}
            className="border-b border-landing-border py-16 md:py-24"
          >
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
              <div className={i % 2 === 1 ? "lg:order-2" : undefined}>
                <div className="flex items-center gap-3">
                  <span
                    className="font-brand text-xs font-semibold uppercase tracking-[0.14em]"
                    style={{ color: stage.color }}
                  >
                    {stage.label}
                  </span>
                  <span className="h-px w-8" style={{ backgroundColor: `${stage.color}55` }} />
                  <span className="font-brand text-xs text-landing-muted-fg">
                    {stage.acronym}
                  </span>
                </div>
                <h2 className="mt-5 font-display text-3xl font-normal tracking-[-0.02em] text-landing-fg sm:text-4xl">
                  {stage.full}
                </h2>
                <p
                  className="mt-4 font-display text-xl italic leading-snug"
                  style={{ color: stage.color }}
                >
                  “{stage.question}”
                </p>
                <p className="mt-5 text-base leading-relaxed text-landing-muted-fg">
                  {stage.body}
                </p>

                <ul className="mt-7 space-y-2.5">
                  {stage.does.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-landing-fg/90">
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: stage.color }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <div
                  className="mt-7 flex items-start gap-3 rounded-sm border-l-2 bg-landing-surface/60 py-3 pl-4 pr-4"
                  style={{ borderColor: stage.color }}
                >
                  <span className="font-brand text-xs font-semibold uppercase tracking-wide text-landing-muted-fg">
                    Gate
                  </span>
                  <p className="text-sm leading-relaxed text-landing-fg/90">{stage.gate}</p>
                </div>
              </div>

              <div className={i % 2 === 1 ? "lg:order-1" : undefined}>
                <div className="flex aspect-[5/4] items-center justify-center rounded-sm border border-landing-border bg-landing-surface p-10">
                  <StageIllustration stage={stage} />
                </div>
              </div>
            </div>
          </section>
        ))}

        <section className="bg-landing-paper text-landing-paper-fg -mx-6 px-6 py-16 md:py-24 lg:-mx-8 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-center gap-4">
              <span className="font-display text-lg text-landing-clay">·</span>
              <span className="h-px w-10 bg-landing-paper-border" />
              <span className="font-brand text-xs font-medium text-landing-paper-muted">
                Why three steps
              </span>
            </div>
            <h2 className="mt-8 max-w-3xl font-display text-3xl font-normal leading-[1.08] tracking-[-0.02em] text-landing-paper-fg sm:text-4xl">
              Each gate kills a different risk, in the order that wastes the
              least.
            </h2>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {[
                {
                  t: "Idea de-risks the bet itself",
                  d: "Is this even desirable, viable, and feasible? Killing a weak idea here costs a prompt, not a product.",
                },
                {
                  t: "PSF de-risks the solution",
                  d: "Is the problem real and is our answer right? You learn this with experiments, before building the whole thing.",
                },
                {
                  t: "PMF de-risks the market",
                  d: "Will demand repeat at scale? You prove the pull before you pour budget into growth.",
                },
              ].map((c) => (
                <div key={c.t} className="border-t border-landing-paper-border pt-5">
                  <h3 className="font-display text-xl font-normal tracking-[-0.01em] text-landing-paper-fg">
                    {c.t}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-landing-paper-muted">
                    {c.d}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-10 max-w-3xl text-base leading-relaxed text-landing-paper-muted">
              Run them out of order and you risk scaling something nobody asked
              for. Run them in sequence and every euro and every sprint goes
              toward a bet the evidence already supports. At each boundary a{" "}
              <span className="text-landing-paper-fg">governance gate</span>{" "}
              decides whether to iterate, pivot, or advance. The same
              discipline behind Design Thinking, Lean Startup, and Agile, run as
              one continuous loop.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="flex flex-col items-start gap-6 rounded-sm border border-landing-border bg-landing-surface p-8 sm:flex-row sm:items-center sm:justify-between sm:p-12">
            <div>
              <h2 className="font-display text-2xl font-normal tracking-[-0.01em] text-landing-fg sm:text-3xl">
                See the three gates in action.
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-landing-muted-fg">
                DrumR runs the whole loop with specialized agents at every
                stage. Join the waitlist for early access.
              </p>
            </div>
            <Link
              href="/#waitlist"
              className="inline-flex shrink-0 items-center gap-2 rounded-sm bg-landing-accent px-5 py-2.5 font-brand text-sm font-semibold text-landing-ink transition-colors hover:bg-landing-accent/90"
            >
              Join waitlist
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-landing-border py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 px-6 sm:flex-row lg:px-8">
          <div className="flex items-center gap-4">
            <BrandLogo size="sm" />
            <span className="text-sm text-landing-muted-fg">
              &copy; {new Date().getFullYear()} DrumR
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-sm text-landing-muted-fg">
            <Link href="/" className="transition-colors hover:text-landing-fg">
              Home
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-landing-fg">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-landing-fg">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
