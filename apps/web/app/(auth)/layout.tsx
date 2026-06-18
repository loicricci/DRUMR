import Link from "next/link";
import { BrandLogo } from "@/components/landing/brand-logo";

export const dynamic = "force-dynamic";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-landing-bg text-landing-fg">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[600px]"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(126,252,184,0.08), transparent 60%)",
        }}
        aria-hidden
      />

      <header className="relative z-10 border-b border-white/[0.06] px-6 py-5 lg:px-10">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <BrandLogo size="sm" />
          </Link>
          <Link
            href="/#waitlist"
            className="text-sm font-medium text-landing-muted-fg transition-colors hover:text-landing-fg"
          >
            Join waitlist
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
