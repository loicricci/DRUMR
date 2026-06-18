import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: { mark: "h-7 w-7", text: "text-base" },
  md: { mark: "h-9 w-9", text: "text-xl" },
  lg: { mark: "h-11 w-11", text: "text-2xl" },
};

export function BrandLogo({
  className,
  showWordmark = true,
  size = "md",
}: BrandLogoProps) {
  const s = sizes[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center rounded-full",
          s.mark
        )}
        aria-hidden
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="20"
            cy="20"
            r="19"
            stroke="currentColor"
            strokeWidth="1"
            className="text-white/20"
          />
          <circle
            cx="20"
            cy="20"
            r="14"
            stroke="currentColor"
            strokeWidth="0.75"
            className="text-white/12"
          />
          <path
            d="M12 20C12 15.5817 15.5817 12 20 12C24.4183 12 28 15.5817 28 20C28 24.4183 24.4183 28 20 28"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="text-landing-accent"
          />
          <circle cx="20" cy="20" r="2.5" fill="currentColor" className="text-landing-fg" />
          <path
            d="M20 8V10M20 30V32M8 20H10M30 20H32"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            className="text-landing-muted-fg/30"
          />
        </svg>
      </div>
      {showWordmark && (
        <span
          className={cn(
            "font-brand font-semibold tracking-[-0.03em] text-landing-fg",
            s.text
          )}
        >
          DrumR
        </span>
      )}
    </div>
  );
}
