import type { ReactNode } from "react";

interface StateBlockProps {
  title: string;
  message: string;
  action?: ReactNode;
  status?: "default" | "loading" | "error" | "empty";
  tone?: "light" | "dark";
}

export function StateBlock({
  title,
  message,
  action,
  status = "default",
  tone = "light",
}: StateBlockProps) {
  const isDark = tone === "dark";
  const showLoading = status === "loading";
  const badgeLabel =
    status === "error"
      ? "Needs attention"
      : status === "empty"
        ? "No data"
        : showLoading
          ? "Loading"
          : "RepoLens";

  return (
    <section
      aria-busy={showLoading}
      aria-live={showLoading ? "polite" : undefined}
      className={isDark ? "min-h-[calc(100vh-73px)] bg-[#07090f] py-10" : ""}
      role={status === "error" ? "alert" : undefined}
    >
      <div className="page-shell">
        <div
          className={
            isDark
              ? "relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.06] p-6 text-center text-white shadow-[0_18px_70px_rgba(0,0,0,0.35)] sm:p-8"
              : "surface rounded-lg p-6 text-center sm:p-8"
          }
        >
          {isDark ? (
            <>
              <div
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/70 to-transparent"
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 bg-[linear-gradient(115deg,rgba(16,185,129,0.12),transparent_42%,rgba(34,211,238,0.1)_80%,transparent)]"
                aria-hidden="true"
              />
            </>
          ) : null}
          <div className="relative">
            <span
              className={
                isDark
                  ? "inline-flex rounded-md border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300"
                  : "inline-flex rounded-md bg-mist px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500"
              }
            >
              {badgeLabel}
            </span>
            {showLoading ? (
              <div
                className="mx-auto mt-5 h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-emerald-300"
                aria-hidden="true"
              />
            ) : null}
            <h1
              className={`mt-5 text-2xl font-bold ${
                isDark ? "text-white" : "text-ink"
              }`}
            >
              {title}
            </h1>
            <p
              className={`mx-auto mt-3 max-w-2xl text-sm leading-6 ${
                isDark ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              {message}
            </p>
            {action ? <div className="mt-5">{action}</div> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
