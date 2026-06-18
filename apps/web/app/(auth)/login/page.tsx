"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const inputClassName =
  "h-12 w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 text-sm text-landing-fg placeholder:text-landing-muted-fg/70 outline-none transition-colors focus:border-landing-accent/40 focus:bg-white/[0.06] disabled:opacity-60";

const labelClassName =
  "mb-2 block text-sm font-medium text-landing-muted-fg";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      toast.error(error.message);
      setGoogleLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-landing-surface/80 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-10">
      <div className="mb-8">
        <p className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-landing-accent">
          Welcome back
        </p>
        <h1 className="mt-3 font-display text-3xl font-normal tracking-[-0.02em] text-landing-fg">
          Sign in
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-landing-muted-fg">
          Access your DrumR workspace, with ideation, PSF, and PMF in one place.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label htmlFor="email" className={labelClassName}>
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="password" className={labelClassName}>
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className={inputClassName}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-landing-accent text-sm font-semibold text-landing-ink transition-all hover:bg-landing-accent/90 disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs uppercase tracking-wider text-landing-muted-fg">
          or
        </span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={googleLoading || loading}
        className="inline-flex h-12 w-full items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-sm font-medium text-landing-fg transition-all hover:border-white/25 hover:bg-white/[0.06] disabled:opacity-60"
      >
        {googleLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Continue with Google"
        )}
      </button>

      <p className="mt-8 text-center text-sm text-landing-muted-fg">
        Don&apos;t have access yet?{" "}
        <Link
          href="/#waitlist"
          className="font-medium text-landing-fg underline-offset-4 hover:underline"
        >
          Join the waitlist
        </Link>
      </p>
    </div>
  );
}
