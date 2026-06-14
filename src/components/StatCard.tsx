interface StatCardProps {
  label: string;
  value: string;
  helper?: string;
  tone?: "light" | "dark";
  accent?: "emerald" | "cyan" | "amber" | "rose" | "violet";
}

const accentClasses = {
  emerald: "from-emerald-400/50 to-emerald-400/0",
  cyan: "from-cyan-400/50 to-cyan-400/0",
  amber: "from-amber-300/50 to-amber-300/0",
  rose: "from-rose-400/50 to-rose-400/0",
  violet: "from-violet-400/50 to-violet-400/0",
};

export function StatCard({
  label,
  value,
  helper,
  tone = "light",
  accent = "emerald",
}: StatCardProps) {
  if (tone === "dark") {
    return (
      <article className="relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.06] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
        <div
          className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${accentClasses[accent]}`}
          aria-hidden="true"
        />
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
          {label}
        </p>
        <p className="mt-3 text-3xl font-bold text-white sm:text-4xl">{value}</p>
        {helper ? (
          <p className="mt-3 text-xs leading-5 text-zinc-400">{helper}</p>
        ) : null}
      </article>
    );
  }

  return (
    <article className="surface rounded-lg p-4">
      <p className="text-sm font-medium text-zinc-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
      {helper ? <p className="mt-2 text-xs text-zinc-500">{helper}</p> : null}
    </article>
  );
}
