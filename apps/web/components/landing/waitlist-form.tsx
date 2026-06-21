"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type WaitlistFormProps = {
  source: string;
  variant?: "inline" | "stacked";
  className?: string;
  showSignInHint?: boolean;
};

export function WaitlistForm({
  source,
  variant = "inline",
  className,
  showSignInHint = false,
}: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setStatus("loading");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setEmail("");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={cn("flex items-start gap-3", className)}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-landing-accent/15 text-landing-accent">
          <Check className="h-5 w-5" />
        </div>
        <div>
          <p className="font-brand text-sm font-semibold text-landing-fg">
            You&apos;re on the list
          </p>
          <p className="mt-1 text-sm text-landing-muted-fg">
            We&apos;ll reach out when early access opens.
          </p>
        </div>
      </div>
    );
  }

  const isInline = variant === "inline";

  return (
    <div className={className}>
      <form
        onSubmit={handleSubmit}
        className={cn(
          isInline
            ? "flex flex-col gap-3 sm:flex-row sm:items-center"
            : "flex flex-col gap-3 sm:flex-row sm:items-stretch"
        )}
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="you@company.com"
          disabled={status === "loading"}
          className={cn(
            "h-12 rounded-sm border border-landing-border bg-landing-surface px-4 text-sm text-landing-fg placeholder:text-landing-muted-fg/70 outline-none transition-colors focus:border-landing-accent/50 disabled:opacity-60",
            isInline ? "w-full sm:min-w-[260px] sm:flex-1" : "w-full sm:flex-1"
          )}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-sm bg-landing-accent px-7 text-sm font-semibold text-landing-ink transition-all hover:bg-landing-accent/90 disabled:opacity-60"
        >
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Join waitlist
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {(error || showSignInHint) && (
        <div className="mt-3 space-y-1">
          {error && <p className="text-sm text-red-400">{error}</p>}
          {showSignInHint && (
            <p className="text-xs text-landing-muted-fg">
              Already have access?{" "}
              <Link
                href="/login"
                className="text-landing-fg underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
