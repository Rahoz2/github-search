import type { ActivityDay, ActivityStreak } from "../lib/analytics";
import { formatDate } from "../lib/analytics";

interface ActivityHeatmapProps {
  days: ActivityDay[];
  streak: ActivityStreak;
  totalEvents: number;
  tone?: "light" | "dark";
}

function getActivityClass(count: number, tone: "light" | "dark"): string {
  if (count === 0) {
    return tone === "dark" ? "bg-white/10" : "bg-zinc-100";
  }

  if (count < 2) {
    return tone === "dark" ? "bg-emerald-400/45" : "bg-emerald-200";
  }

  if (count < 4) {
    return tone === "dark" ? "bg-emerald-400/75" : "bg-emerald-400";
  }

  return tone === "dark" ? "bg-emerald-300" : "bg-emerald-700";
}

export function ActivityHeatmap({
  days,
  streak,
  totalEvents,
  tone = "light",
}: ActivityHeatmapProps) {
  const isDark = tone === "dark";
  const containerClass = isDark
    ? "rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.26)]"
    : "surface rounded-lg p-5";
  const titleClass = isDark ? "text-white" : "text-ink";
  const mutedClass = isDark ? "text-zinc-400" : "text-zinc-500";
  const bodyClass = isDark ? "text-zinc-300" : "text-zinc-600";

  return (
    <section className={containerClass}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className={`text-lg font-bold ${titleClass}`}>Public activity</h2>
          <p className={`text-sm ${mutedClass}`}>
            Based on the latest public events GitHub exposes.
          </p>
        </div>
        <div className={`text-sm ${bodyClass}`}>
          <span className={`font-bold ${titleClass}`}>{totalEvents}</span>{" "}
          events - <span className={`font-bold ${titleClass}`}>{streak.count}</span>{" "}
          day streak
        </div>
      </div>
      <div
        className="mt-5 grid grid-cols-12 gap-1"
        aria-label="Public activity heatmap for the last 84 days"
      >
        {days.map((day) => (
          <span
            key={day.date}
            className={`aspect-square rounded-sm ${getActivityClass(
              day.count,
              tone,
            )}`}
            title={`${formatDate(day.date)}: ${day.count} public events`}
            aria-label={`${formatDate(day.date)}: ${day.count} public events`}
          />
        ))}
      </div>
      <p className={`mt-4 text-xs leading-5 ${mutedClass}`}>
        Activity streak is calculated only from visible public events between{" "}
        {formatDate(streak.startDate)} and {formatDate(streak.endDate)}.
      </p>
    </section>
  );
}
