import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandLogo } from "@/components/landing/brand-logo";

export type LegalSection = {
  heading: string;
  body: React.ReactNode;
};

type LegalPageProps = {
  title: string;
  intro: React.ReactNode;
  lastUpdated: string;
  sections: LegalSection[];
};

export function LegalPage({ title, intro, lastUpdated, sections }: LegalPageProps) {
  return (
    <div className="relative min-h-screen bg-landing-bg text-landing-fg">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[600px]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 70% 10%, rgba(126,252,184,0.06), transparent 60%)",
        }}
        aria-hidden
      />

      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-landing-bg/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-4xl items-center justify-between px-6">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <BrandLogo size="md" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-landing-muted-fg transition-colors hover:text-landing-fg"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>
        </div>
      </header>

      <main className="relative mx-auto max-w-4xl px-6 pb-24 pt-16">
        <p className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-landing-accent">
          Legal
        </p>
        <h1 className="mt-4 font-display text-4xl font-normal leading-[1.1] tracking-[-0.02em] text-landing-fg sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-sm text-landing-muted-fg">
          Last updated: {lastUpdated}
        </p>

        <div className="mt-8 space-y-5 text-base leading-relaxed text-landing-muted-fg">
          {intro}
        </div>

        <div className="mt-12 space-y-12">
          {sections.map((section, index) => (
            <section key={section.heading}>
              <h2 className="font-display text-2xl font-normal tracking-[-0.02em] text-landing-fg">
                <span className="mr-3 text-landing-accent/50">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {section.heading}
              </h2>
              <div className="mt-4 space-y-4 text-base leading-relaxed text-landing-muted-fg">
                {section.body}
              </div>
            </section>
          ))}
        </div>
      </main>

      <footer className="border-t border-white/[0.06] py-10">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
          <div className="flex items-center gap-4">
            <BrandLogo size="sm" />
            <span className="text-sm text-landing-muted-fg">
              &copy; {new Date().getFullYear()} DrumR
            </span>
          </div>
          <div className="flex gap-8 text-sm text-landing-muted-fg">
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
