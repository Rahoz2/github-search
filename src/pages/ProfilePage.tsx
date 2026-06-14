import { type FormEvent, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ActivityHeatmap } from "../components/ActivityHeatmap";
import { LanguageChart } from "../components/LanguageChart";
import { ProfileHeader } from "../components/ProfileHeader";
import { RepoCard } from "../components/RepoCard";
import { StateBlock } from "../components/StateBlock";
import { StatCard } from "../components/StatCard";
import { useGithubActivity } from "../hooks/useGithubActivity";
import { useGithubRepos } from "../hooks/useGithubRepos";
import { useGithubUser } from "../hooks/useGithubUser";
import {
  formatNumber,
  getActivityMetric,
  getActivityDays,
  getActivityStreak,
  getActiveDayCount,
  getLanguageBreakdown,
  getTopLanguage,
  getTopRepos,
  getTotalForks,
  getTotalStars,
} from "../lib/analytics";
import { getFriendlyErrorMessage, getFriendlyErrorTitle } from "../lib/errors";

export function ProfilePage() {
  const { username = "" } = useParams();
  const navigate = useNavigate();
  const [compareUsername, setCompareUsername] = useState("");
  const userQuery = useGithubUser(username);
  const reposQuery = useGithubRepos(username);
  const activityQuery = useGithubActivity(username);

  const isLoading =
    userQuery.isLoading || reposQuery.isLoading || activityQuery.isLoading;
  const error = userQuery.error ?? reposQuery.error ?? activityQuery.error;

  function handleCompare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const secondUsername = compareUsername.trim();

    if (secondUsername && userQuery.data) {
      navigate(
        `/compare/${encodeURIComponent(userQuery.data.login)}/${encodeURIComponent(
          secondUsername,
        )}`,
      );
    }
  }

  if (!username.trim()) {
    return (
      <StateBlock
        title="Choose a GitHub profile"
        message="Search for a username to build a public profile analytics page."
        status="empty"
        tone="dark"
        action={
          <Link className="btn-primary" to="/">
            Search profiles
          </Link>
        }
      />
    );
  }

  if (isLoading) {
    return (
      <StateBlock
        title="Loading profile"
        message="RepoLens is collecting public profile, repository, and activity data from GitHub."
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

  if (!userQuery.data || !reposQuery.data || !activityQuery.data) {
    return (
      <StateBlock
        title="No profile data"
        message="GitHub returned an empty response for this profile."
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

  const user = userQuery.data;
  const repos = reposQuery.data;
  const events = activityQuery.data;
  const languages = getLanguageBreakdown(repos);
  const topRepos = getTopRepos(repos);
  const activityDays = getActivityDays(events);
  const activityStreak = getActivityStreak(events);
  const totalStars = getTotalStars(repos);
  const totalForks = getTotalForks(repos);
  const activeDayCount = getActiveDayCount(events);
  const topLanguage = getTopLanguage(repos);
  const activityMetric = getActivityMetric(repos, events);
  const isRepoAnalysisPartial = user.public_repos > repos.length;

  return (
    <div className="min-h-[calc(100vh-73px)] bg-[#07090f] text-white">
      <div className="page-shell space-y-6">
        <ProfileHeader
          user={user}
          totalStars={totalStars}
          topLanguage={topLanguage?.name}
        />

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <StatCard
            label="Followers"
            value={formatNumber(user.followers)}
            helper="Audience signal"
            tone="dark"
            accent="emerald"
          />
          <StatCard
            label="Following"
            value={formatNumber(user.following)}
            helper="Network footprint"
            tone="dark"
            accent="cyan"
          />
          <StatCard
            label="Repos"
            value={formatNumber(user.public_repos)}
            helper={`${formatNumber(repos.length)} analyzed`}
            tone="dark"
            accent="violet"
          />
          <StatCard
            label="Stars"
            value={formatNumber(totalStars)}
            helper="Across analyzed repos"
            tone="dark"
            accent="amber"
          />
          <StatCard
            label="Forks"
            value={formatNumber(totalForks)}
            helper="Across analyzed repos"
            tone="dark"
            accent="rose"
          />
          <StatCard
            label="Top language"
            value={topLanguage?.name ?? "Unknown"}
            helper={
              topLanguage
                ? `${topLanguage.percentage}% of measured repo size`
                : "No primary language data"
            }
            tone="dark"
            accent="emerald"
          />
        </section>

        {isRepoAnalysisPartial ? (
          <div className="rounded-lg border border-amber-300/25 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
            This profile has {formatNumber(user.public_repos)} public
            repositories. RepoLens is analyzing the first{" "}
            {formatNumber(repos.length)} recently updated repos returned by
            GitHub for this version.
          </div>
        ) : null}

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.26)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
              Activity signal
            </p>
            <h2 className="mt-3 text-2xl font-bold text-white">
              {activityMetric.label}
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-zinc-400">Pulse</p>
                <p className="mt-2 text-3xl font-bold text-white">
                  {activityMetric.value}
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-zinc-400">Public event days</p>
                <p className="mt-2 text-3xl font-bold text-white">
                  {formatNumber(activeDayCount)}
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-zinc-400">Visible streak</p>
                <p className="mt-2 text-3xl font-bold text-white">
                  {activityStreak.count} days
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-zinc-400">
              {activityMetric.helper} This is an honest public-data metric, not
              a full contribution graph.
            </p>
          </div>

          <ActivityHeatmap
            days={activityDays}
            streak={activityStreak}
            totalEvents={events.length}
            tone="dark"
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <LanguageChart languages={languages} tone="dark" />
          <div className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.26)]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                  Repository signal
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">
                  Ranked work that recruiters can scan fast
                </h2>
              </div>
              <p className="text-sm text-zinc-400">
                Stars carry extra weight, forks break ties.
              </p>
            </div>
            {topRepos.length > 0 ? (
              <div className="mt-5 grid gap-4">
                {topRepos.map((repo, index) => (
                  <RepoCard
                    key={repo.id}
                    repo={repo}
                    rank={index + 1}
                    tone="dark"
                  />
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-lg border border-white/10 bg-black/20 p-5 text-sm text-zinc-400">
                No public repositories were returned for this profile.
              </div>
            )}
          </div>
        </section>

        <aside className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.24)]">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-lg font-bold text-white">
                Turn this report into a head-to-head comparison
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Add another GitHub username to create a shareable comparison
                URL from this profile.
              </p>
            </div>
            <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleCompare}>
              <label className="min-w-0 sm:w-72">
                <span className="sr-only">Compare with username</span>
                <input
                  className="focus-ring min-h-11 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-zinc-500"
                  placeholder="second username"
                  value={compareUsername}
                  required
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  onChange={(event) => setCompareUsername(event.target.value)}
                />
              </label>
              <button
                className="focus-ring inline-flex min-h-11 items-center justify-center rounded-md bg-emerald-300 px-4 py-2 text-sm font-bold text-ink transition hover:bg-emerald-200"
                type="submit"
              >
                Compare
              </button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}
