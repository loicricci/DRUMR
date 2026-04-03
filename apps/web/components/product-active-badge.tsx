interface ProductActiveBadgeProps {
  active: boolean;
}

export function ProductActiveBadge({ active }: ProductActiveBadgeProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium">
      <span
        className={`inline-block h-2 w-2 rounded-full ${
          active
            ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]"
            : "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.4)]"
        }`}
      />
      <span
        className={
          active
            ? "text-emerald-700 dark:text-emerald-400"
            : "text-amber-700 dark:text-amber-400"
        }
      >
        {active ? "Active" : "Under construction"}
      </span>
    </span>
  );
}
