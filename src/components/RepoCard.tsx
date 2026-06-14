import type { GitHubRepo } from "../types/github";
import { formatDate, formatNumber } from "../lib/analytics";

interface RepoCardProps {
  repo: GitHubRepo;
  rank?: number;
  tone?: "light" | "dark";
}

export function RepoCard({ repo, rank, tone = "light" }: RepoCardProps) {
  const isDark = tone === "dark";
  const containerClass = isDark
    ? "rounded-lg border border-white/10 bg-white/[0.055] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.22)] transition hover:border-emerald-300/35"
    : "surface rounded-lg p-4";
  const titleClass = isDark ? "text-white" : "text-ink";
  const bodyClass = isDark ? "text-zinc-400" : "text-zinc-600";
  const mutedClass = isDark ? "text-zinc-400" : "text-zinc-500";
  const statClass = isDark ? "text-white" : "text-ink";

  return (
    <article className={containerClass}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          {rank ? (
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
              Rank {rank}
            </p>
          ) : null}
          <a
            className={`focus-ring rounded-md text-base font-bold hover:underline ${titleClass}`}
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
          >
            {repo.name}
          </a>
          <p className={`mt-2 line-clamp-2 text-sm leading-6 ${bodyClass}`}>
            {repo.description ?? "No description provided."}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {repo.language ? (
            <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
              {repo.language}
            </span>
          ) : null}
          {repo.fork ? (
            <span className="rounded-md bg-cyan-50 px-2 py-1 text-xs font-semibold text-cyan-700">
              Fork
            </span>
          ) : null}
          {repo.archived ? (
            <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
              Archived
            </span>
          ) : null}
        </div>
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <div>
          <dt className={`text-xs ${mutedClass}`}>Stars</dt>
          <dd className={`font-bold ${statClass}`}>
            {formatNumber(repo.stargazers_count)}
          </dd>
        </div>
        <div>
          <dt className={`text-xs ${mutedClass}`}>Forks</dt>
          <dd className={`font-bold ${statClass}`}>
            {formatNumber(repo.forks_count)}
          </dd>
        </div>
        <div>
          <dt className={`text-xs ${mutedClass}`}>Pushed</dt>
          <dd className={`font-bold ${statClass}`}>
            {formatDate(repo.pushed_at)}
          </dd>
        </div>
      </dl>
    </article>
  );
}
