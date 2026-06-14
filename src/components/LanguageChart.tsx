import type { LanguageBreakdownItem } from "../lib/analytics";
import { formatNumber } from "../lib/analytics";

interface LanguageChartProps {
  languages: LanguageBreakdownItem[];
  tone?: "light" | "dark";
}

export function LanguageChart({ languages, tone = "light" }: LanguageChartProps) {
  const isDark = tone === "dark";
  const containerClass = isDark
    ? "rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.26)]"
    : "surface rounded-lg p-5";
  const titleClass = isDark ? "text-white" : "text-ink";
  const mutedClass = isDark ? "text-zinc-400" : "text-zinc-500";
  const labelClass = isDark ? "text-white" : "text-ink";
  const trackClass = isDark ? "bg-white/10" : "bg-zinc-100";

  if (languages.length === 0) {
    return (
      <div className={containerClass}>
        <h2 className={`text-lg font-bold ${titleClass}`}>Language breakdown</h2>
        <p className={`mt-3 text-sm leading-6 ${mutedClass}`}>
          No primary language data was available for the analyzed repositories.
        </p>
      </div>
    );
  }

  return (
    <section className={containerClass}>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className={`text-lg font-bold ${titleClass}`}>
            Language breakdown
          </h2>
          <p className={`text-sm ${mutedClass}`}>
            Based on primary language and repository size.
          </p>
        </div>
      </div>
      <div className="mt-5 space-y-4">
        {languages.map((language) => (
          <div key={language.name}>
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <span className={`font-semibold ${labelClass}`}>
                {language.name}
              </span>
              <span className={mutedClass}>
                {language.percentage}% - {formatNumber(language.repoCount)} repos
              </span>
            </div>
            <div className={`h-3 overflow-hidden rounded-md ${trackClass}`}>
              <div
                className={`h-full rounded-md ${language.colorClass}`}
                style={{ width: `${Math.max(language.percentage, 3)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
