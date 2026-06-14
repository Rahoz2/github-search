import type { GitHubUser } from "../types/github";
import { formatDate, formatNumber } from "../lib/analytics";

interface ProfileHeaderProps {
  user: GitHubUser;
  totalStars?: number;
  topLanguage?: string | null;
}

function getProfileMeta(user: GitHubUser): string[] {
  return [user.company, user.location, user.blog].filter(Boolean) as string[];
}

export function ProfileHeader({
  user,
  totalStars = 0,
  topLanguage,
}: ProfileHeaderProps) {
  const meta = getProfileMeta(user);

  return (
    <section className="relative overflow-hidden rounded-lg border border-white/10 bg-[#0b111d] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.38)] sm:p-7 lg:p-8">
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/70 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(115deg,rgba(16,185,129,0.16),transparent_38%,rgba(34,211,238,0.1)_70%,transparent)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:34px_34px] opacity-40"
        aria-hidden="true"
      />

      <div className="relative grid gap-7 lg:grid-cols-[1fr_340px] lg:items-end">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <img
            className="h-28 w-28 rounded-lg border border-white/15 object-cover shadow-[0_18px_55px_rgba(16,185,129,0.18)] sm:h-32 sm:w-32"
            src={user.avatar_url}
            alt={`${user.login} avatar`}
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              <span>Developer report</span>
              <span className="h-1 w-1 rounded-full bg-emerald-300" />
              <span>Public GitHub profile</span>
            </div>
            <h1 className="mt-3 text-4xl font-bold leading-tight text-white sm:text-6xl">
              {user.name ?? user.login}
            </h1>
            <a
              className="focus-ring mt-2 inline-block rounded-md text-base font-semibold text-cyan-200 hover:text-white"
              href={user.html_url}
              target="_blank"
              rel="noreferrer"
            >
              @{user.login}
            </a>
            <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300">
              {user.bio ??
                "No public bio is available, so this report focuses on public repositories and visible activity."}
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-zinc-300">
              {meta.map((item) => (
                <span
                  key={item}
                  className="rounded-md border border-white/10 bg-white/[0.07] px-3 py-2"
                >
                  {item}
                </span>
              ))}
              <span className="rounded-md border border-white/10 bg-white/[0.07] px-3 py-2">
                Joined {formatDate(user.created_at)}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-black/20 p-4 backdrop-blur">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-white/10 bg-white/[0.06] p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                Followers
              </p>
              <p className="mt-2 text-2xl font-bold text-white">
                {formatNumber(user.followers)}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.06] p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                Repos
              </p>
              <p className="mt-2 text-2xl font-bold text-white">
                {formatNumber(user.public_repos)}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.06] p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                Stars
              </p>
              <p className="mt-2 text-2xl font-bold text-white">
                {formatNumber(totalStars)}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.06] p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                Top language
              </p>
              <p className="mt-2 truncate text-2xl font-bold text-white">
                {topLanguage ?? "Unknown"}
              </p>
            </div>
          </div>
          <a
            className="focus-ring mt-4 inline-flex w-full min-h-11 items-center justify-center rounded-md border border-emerald-300/35 bg-emerald-300/10 px-4 py-2 text-sm font-bold text-emerald-100 transition hover:bg-emerald-300/20"
            href={user.html_url}
            target="_blank"
            rel="noreferrer"
          >
            Open GitHub profile
          </a>
        </div>
      </div>
    </section>
  );
}
