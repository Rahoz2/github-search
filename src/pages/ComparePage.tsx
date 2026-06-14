import { type FormEvent, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ActivityHeatmap } from "../components/ActivityHeatmap";
import { LanguageChart } from "../components/LanguageChart";
import { RepoCard } from "../components/RepoCard";
import { StateBlock } from "../components/StateBlock";
import { StatCard } from "../components/StatCard";
import { useGithubActivity } from "../hooks/useGithubActivity";
import { useGithubRepos } from "../hooks/useGithubRepos";
import { useGithubUser } from "../hooks/useGithubUser";
import {
  compareDevelopers,
  createDeveloperSnapshot,
  formatNumber,
  getActivityDays,
  getActivityMetric,
  getLanguageBreakdown,
  getTopRepos,
} from "../lib/analytics";
import type {
  ActivityMetric,
  DeveloperSnapshot,
  LanguageBreakdownItem,
} from "../lib/analytics";
import { getFriendlyErrorMessage, getFriendlyErrorTitle } from "../lib/errors";
import type { GitHubEvent, GitHubRepo } from "../types/github";

interface DeveloperPanelProps {
  activityMetric: ActivityMetric;
  events: GitHubEvent[];
  repos: GitHubRepo[];
  side: "left" | "right";
  snapshot: DeveloperSnapshot;
}

interface DuelMetricProps {
  compareHigher?: boolean;
  firstHelper?: string;
  firstLabel: string;
  firstRaw?: number;
  firstValue: string;
  label: string;
  secondHelper?: string;
  secondLabel: string;
  secondRaw?: number;
  secondValue: string;
}

function getAccentClasses(side: "left" | "right") {
  return side === "left"
    ? {
        aura: "from-emerald-300/30 via-cyan-300/10 to-transparent",
        border: "border-emerald-300/25",
        text: "text-emerald-200",
      }
    : {
        aura: "from-cyan-300/30 via-violet-300/10 to-transparent",
        border: "border-cyan-300/25",
        text: "text-cyan-200",
      };
}

function getActivitySourceLabel(metric: ActivityMetric): string {
  if (metric.source === "events") {
    return "public events";
  }

  if (metric.source === "repo-pushes") {
    return "repo pushes";
  }

  return "no recent public signal";
}

function getTopLanguageLabel(languages: LanguageBreakdownItem[]): string {
  const topLanguage = languages[0];

  if (!topLanguage) {
    return "Unknown";
  }

  return `${topLanguage.name} (${topLanguage.percentage}%)`;
}

function DeveloperPanel({
  activityMetric,
  events,
  repos,
  side,
  snapshot,
}: DeveloperPanelProps) {
  const topRepos = getTopRepos(repos, 3);
  const languages = getLanguageBreakdown(repos).slice(0, 5);
  const accent = getAccentClasses(side);
  const activityDays = getActivityDays(events);

  return (
    <section className="space-y-4">
      <div
        className={`relative overflow-hidden rounded-lg border ${accent.border} bg-white/[0.06] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.32)]`}
      >
        <div
          className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-br ${accent.aura}`}
          aria-hidden="true"
        />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          <img
            className="h-20 w-20 rounded-lg border border-white/15 object-cover shadow-[0_18px_45px_rgba(0,0,0,0.3)]"
            src={snapshot.avatarUrl}
            alt={`${snapshot.login} avatar`}
          />
          <div className="min-w-0 flex-1">
            <p
              className={`text-xs font-semibold uppercase tracking-[0.18em] ${accent.text}`}
            >
              Contender
            </p>
            <h2 className="mt-2 truncate text-3xl font-bold text-white">
              {snapshot.displayName}
            </h2>
            <a
              className="focus-ring mt-1 inline-block rounded-md text-sm font-semibold text-zinc-300 hover:text-white"
              href={snapshot.htmlUrl}
              target="_blank"
              rel="noreferrer"
            >
              @{snapshot.login}
            </a>
          </div>
        </div>

        <div className="relative mt-5 grid grid-cols-2 gap-3">
          <StatCard
            label="Followers"
            value={formatNumber(snapshot.followers)}
            tone="dark"
            accent={side === "left" ? "emerald" : "cyan"}
          />
          <StatCard
            label="Following"
            value={formatNumber(snapshot.following)}
            tone="dark"
            accent="violet"
          />
          <StatCard
            label="Stars"
            value={formatNumber(snapshot.totalStars)}
            helper="Analyzed repos"
            tone="dark"
            accent="amber"
          />
          <StatCard
            label="Activity"
            value={activityMetric.value}
            helper={getActivitySourceLabel(activityMetric)}
            tone="dark"
            accent="rose"
          />
        </div>
      </div>

      <LanguageChart languages={languages} tone="dark" />

      <ActivityHeatmap
        days={activityDays}
        streak={snapshot.activityStreak}
        totalEvents={events.length}
        tone="dark"
      />

      <div className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.24)]">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Top repositories
            </p>
            <h3 className="mt-2 text-xl font-bold text-white">
              Ranked public work
            </h3>
          </div>
          <span className="rounded-md border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold text-zinc-400">
            Top {topRepos.length}
          </span>
        </div>
        <div className="mt-5 grid gap-3">
          {topRepos.length > 0 ? (
            topRepos.map((repo, index) => (
              <RepoCard
                key={repo.id}
                repo={repo}
                rank={index + 1}
                tone="dark"
              />
            ))
          ) : (
            <div className="rounded-lg border border-white/10 bg-black/20 p-4 text-sm text-zinc-400">
              No repositories returned for this profile.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function DuelMetric({
  compareHigher = true,
  firstHelper,
  firstLabel,
  firstRaw,
  firstValue,
  label,
  secondHelper,
  secondLabel,
  secondRaw,
  secondValue,
}: DuelMetricProps) {
  const canCompare =
    compareHigher && firstRaw !== undefined && secondRaw !== undefined;
  const firstWins = canCompare && firstRaw > secondRaw;
  const secondWins = canCompare && secondRaw > firstRaw;

  return (
    <div className="grid gap-3 border-t border-white/10 py-4 lg:grid-cols-[0.9fr_1.1fr_1.1fr] lg:items-stretch">
      <div>
        <p className="text-sm font-bold text-white">{label}</p>
        {!canCompare ? (
        <p className="mt-1 text-xs text-zinc-400">Compared as context</p>
        ) : null}
      </div>
      <div
        className={`rounded-lg border p-4 ${
          firstWins
            ? "border-emerald-300/40 bg-emerald-300/10"
            : "border-white/10 bg-white/[0.045]"
        }`}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
          {firstLabel}
        </p>
        <p className="mt-2 text-2xl font-bold text-white">{firstValue}</p>
        {firstHelper ? (
          <p className="mt-2 text-xs leading-5 text-zinc-400">{firstHelper}</p>
        ) : null}
      </div>
      <div
        className={`rounded-lg border p-4 ${
          secondWins
            ? "border-cyan-300/40 bg-cyan-300/10"
            : "border-white/10 bg-white/[0.045]"
        }`}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
          {secondLabel}
        </p>
        <p className="mt-2 text-2xl font-bold text-white">{secondValue}</p>
        {secondHelper ? (
          <p className="mt-2 text-xs leading-5 text-zinc-400">{secondHelper}</p>
        ) : null}
      </div>
    </div>
  );
}

export function ComparePage() {
  const { user1 = "", user2 = "" } = useParams();
  const navigate = useNavigate();
  const [firstInput, setFirstInput] = useState(user1);
  const [secondInput, setSecondInput] = useState(user2);
  const firstUserQuery = useGithubUser(user1);
  const firstReposQuery = useGithubRepos(user1);
  const firstActivityQuery = useGithubActivity(user1);
  const secondUserQuery = useGithubUser(user2);
  const secondReposQuery = useGithubRepos(user2);
  const secondActivityQuery = useGithubActivity(user2);

  const queries = [
    firstUserQuery,
    firstReposQuery,
    firstActivityQuery,
    secondUserQuery,
    secondReposQuery,
    secondActivityQuery,
  ];
  const isLoading = queries.some((query) => query.isLoading);
  const error = queries.find((query) => query.error)?.error;

  function handleCompare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const first = firstInput.trim();
    const second = secondInput.trim();

    if (first && second) {
      navigate(
        `/compare/${encodeURIComponent(first)}/${encodeURIComponent(second)}`,
      );
    }
  }

  if (!user1.trim() || !user2.trim()) {
    return (
      <StateBlock
        title="Choose two profiles"
        message="Enter two GitHub usernames to compare public profile and repository signals."
        status="empty"
        tone="dark"
        action={
          <Link className="btn-primary" to="/">
            Start from search
          </Link>
        }
      />
    );
  }

  if (isLoading) {
    return (
      <StateBlock
        title="Building comparison"
        message="RepoLens is collecting public GitHub data for both profiles."
        status="loading"
        tone="dark"
      />
    );
  }

  if (error) {
    return (
      <StateBlock
        title={getFriendlyErrorTitle(error)}
        message={getFriendlyErrorMessage(error)}
        status="error"
        tone="dark"
        action={
          <Link className="btn-secondary" to="/">
            Search again
          </Link>
        }
      />
    );
  }

  if (
    !firstUserQuery.data ||
    !firstReposQuery.data ||
    !firstActivityQuery.data ||
    !secondUserQuery.data ||
    !secondReposQuery.data ||
    !secondActivityQuery.data
  ) {
    return (
      <StateBlock
        title="Comparison unavailable"
        message="GitHub returned an empty response for at least one profile."
        status="empty"
        tone="dark"
        action={
          <Link className="btn-secondary" to="/">
            Search again
          </Link>
        }
      />
    );
  }

  const firstSnapshot = createDeveloperSnapshot(
    firstUserQuery.data,
    firstReposQuery.data,
    firstActivityQuery.data,
  );
  const secondSnapshot = createDeveloperSnapshot(
    secondUserQuery.data,
    secondReposQuery.data,
    secondActivityQuery.data,
  );
  const firstLanguages = getLanguageBreakdown(firstReposQuery.data);
  const secondLanguages = getLanguageBreakdown(secondReposQuery.data);
  const firstActivityMetric = getActivityMetric(
    firstReposQuery.data,
    firstActivityQuery.data,
  );
  const secondActivityMetric = getActivityMetric(
    secondReposQuery.data,
    secondActivityQuery.data,
  );
  const comparison = compareDevelopers(firstSnapshot, secondSnapshot);
  const summaryTitle = comparison.isTie
    ? "Balanced public signal"
    : `${comparison.leader?.login} leads the measured public signal`;
  const firstPartialRepos =
    firstSnapshot.publicRepos > firstSnapshot.analyzedRepos;
  const secondPartialRepos =
    secondSnapshot.publicRepos > secondSnapshot.analyzedRepos;

  return (
    <div className="min-h-[calc(100vh-73px)] bg-[#07090f] text-white">
      <div className="page-shell space-y-6">
        <section className="relative overflow-hidden rounded-lg border border-white/10 bg-[#0b111d] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.38)] sm:p-7 lg:p-8">
          <div
            className="absolute inset-0 bg-[linear-gradient(115deg,rgba(16,185,129,0.16),transparent_34%,rgba(34,211,238,0.14)_72%,transparent)]"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:34px_34px] opacity-40"
            aria-hidden="true"
          />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_440px] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                Shareable versus report
              </p>
              <h1 className="mt-3 text-4xl font-bold leading-tight text-white sm:text-6xl">
                {firstSnapshot.login}{" "}
                <span className="text-zinc-500">vs</span>{" "}
                {secondSnapshot.login}
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-6 text-zinc-300 sm:text-base sm:leading-7">
                A recruiter-friendly comparison built from public GitHub
                profile data, analyzed repositories, and honestly available
                activity signals.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-md border border-emerald-300/25 bg-emerald-300/10 px-3 py-2 text-xs font-semibold text-emerald-100">
                  Public REST API
                </span>
                <span className="rounded-md border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-xs font-semibold text-cyan-100">
                  Shareable URL
                </span>
                <span className="rounded-md border border-white/10 bg-white/[0.07] px-3 py-2 text-xs font-semibold text-zinc-300">
                  No private contribution data inferred
                </span>
              </div>
            </div>

            <form
              className="rounded-lg border border-white/10 bg-black/20 p-4 backdrop-blur"
              onSubmit={handleCompare}
            >
              <p className="mb-3 text-sm font-bold text-white">
                Compare different profiles
              </p>
              <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] lg:grid-cols-1">
                <input
                  className="focus-ring min-h-11 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-zinc-500"
                  value={firstInput}
                  aria-label="First username"
                  required
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  onChange={(event) => setFirstInput(event.target.value)}
                />
                <input
                  className="focus-ring min-h-11 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-zinc-500"
                  value={secondInput}
                  aria-label="Second username"
                  required
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  onChange={(event) => setSecondInput(event.target.value)}
                />
                <button
                  className="focus-ring inline-flex min-h-11 items-center justify-center rounded-md bg-emerald-300 px-4 py-2 text-sm font-bold text-ink transition hover:bg-emerald-200"
                  type="submit"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_220px_1fr] lg:items-stretch">
          <DeveloperPanel
            activityMetric={firstActivityMetric}
            events={firstActivityQuery.data}
            repos={firstReposQuery.data}
            side="left"
            snapshot={firstSnapshot}
          />
          <div className="flex items-center justify-center">
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] shadow-[0_20px_70px_rgba(0,0,0,0.3)] lg:h-44 lg:w-44">
              <div
                className="absolute inset-3 rounded-full border border-emerald-300/20"
                aria-hidden="true"
              />
              <div
                className="absolute inset-8 rounded-full border border-cyan-300/20"
                aria-hidden="true"
              />
              <span className="text-4xl font-black text-white">
                VS
              </span>
            </div>
          </div>
          <DeveloperPanel
            activityMetric={secondActivityMetric}
            events={secondActivityQuery.data}
            repos={secondReposQuery.data}
            side="right"
            snapshot={secondSnapshot}
          />
        </section>

        <section className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.3)] sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Insight summary
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white">
                {summaryTitle}
              </h2>
              <p className="mt-4 text-sm leading-6 text-zinc-400">
                This is a directional public-signal summary, not a judgment of
                skill, seniority, or private contribution history.
              </p>
            </div>
            <div className="space-y-3">
              {comparison.insightLines.map((line) => (
                <p
                  className="rounded-lg border border-white/10 bg-black/20 p-4 text-sm leading-6 text-zinc-300"
                  key={line}
                >
                  {line}
                </p>
              ))}
              <p className="rounded-lg border border-white/10 bg-black/20 p-4 text-sm leading-6 text-zinc-300">
                Activity pulse uses{" "}
                {getActivitySourceLabel(firstActivityMetric)} for{" "}
                {firstSnapshot.login} and{" "}
                {getActivitySourceLabel(secondActivityMetric)} for{" "}
                {secondSnapshot.login}.
              </p>
            </div>
          </div>
        </section>

        {(firstPartialRepos || secondPartialRepos) && (
          <div className="rounded-lg border border-amber-300/25 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
            RepoLens analyzes up to the first 100 recently updated repositories
            returned by GitHub.{" "}
            {firstPartialRepos
              ? `${firstSnapshot.login}: ${formatNumber(
                  firstSnapshot.analyzedRepos,
                )} of ${formatNumber(firstSnapshot.publicRepos)} analyzed. `
              : ""}
            {secondPartialRepos
              ? `${secondSnapshot.login}: ${formatNumber(
                  secondSnapshot.analyzedRepos,
                )} of ${formatNumber(secondSnapshot.publicRepos)} analyzed.`
              : ""}
          </div>
        )}

        <section className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.3)] sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                Head-to-head metrics
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                Public signals side by side
              </h2>
            </div>
            <p className="text-sm text-zinc-400">
              Highlighted cells show higher numeric values where that is a
              meaningful comparison.
            </p>
          </div>
          <div className="mt-5">
            <DuelMetric
              label="Followers"
              firstLabel={firstSnapshot.login}
              secondLabel={secondSnapshot.login}
              firstValue={formatNumber(firstSnapshot.followers)}
              secondValue={formatNumber(secondSnapshot.followers)}
              firstRaw={firstSnapshot.followers}
              secondRaw={secondSnapshot.followers}
            />
            <DuelMetric
              label="Following"
              compareHigher={false}
              firstLabel={firstSnapshot.login}
              secondLabel={secondSnapshot.login}
              firstValue={formatNumber(firstSnapshot.following)}
              secondValue={formatNumber(secondSnapshot.following)}
            />
            <DuelMetric
              label="Public repositories"
              firstLabel={firstSnapshot.login}
              secondLabel={secondSnapshot.login}
              firstValue={formatNumber(firstSnapshot.publicRepos)}
              secondValue={formatNumber(secondSnapshot.publicRepos)}
              firstRaw={firstSnapshot.publicRepos}
              secondRaw={secondSnapshot.publicRepos}
              firstHelper={`${formatNumber(firstSnapshot.analyzedRepos)} analyzed`}
              secondHelper={`${formatNumber(secondSnapshot.analyzedRepos)} analyzed`}
            />
            <DuelMetric
              label="Total stars"
              firstLabel={firstSnapshot.login}
              secondLabel={secondSnapshot.login}
              firstValue={formatNumber(firstSnapshot.totalStars)}
              secondValue={formatNumber(secondSnapshot.totalStars)}
              firstRaw={firstSnapshot.totalStars}
              secondRaw={secondSnapshot.totalStars}
            />
            <DuelMetric
              label="Total forks"
              firstLabel={firstSnapshot.login}
              secondLabel={secondSnapshot.login}
              firstValue={formatNumber(firstSnapshot.totalForks)}
              secondValue={formatNumber(secondSnapshot.totalForks)}
              firstRaw={firstSnapshot.totalForks}
              secondRaw={secondSnapshot.totalForks}
            />
            <DuelMetric
              label="Top language"
              compareHigher={false}
              firstLabel={firstSnapshot.login}
              secondLabel={secondSnapshot.login}
              firstValue={getTopLanguageLabel(firstLanguages)}
              secondValue={getTopLanguageLabel(secondLanguages)}
            />
            <DuelMetric
              label="Activity pulse"
              firstLabel={firstSnapshot.login}
              secondLabel={secondSnapshot.login}
              firstValue={firstActivityMetric.value}
              secondValue={secondActivityMetric.value}
              firstRaw={firstActivityMetric.score}
              secondRaw={secondActivityMetric.score}
              firstHelper={firstActivityMetric.helper}
              secondHelper={secondActivityMetric.helper}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
