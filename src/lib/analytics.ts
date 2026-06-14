import type { GitHubEvent, GitHubRepo, GitHubUser } from "../types/github";

export interface LanguageBreakdownItem {
  name: string;
  repoCount: number;
  size: number;
  percentage: number;
  colorClass: string;
}

export interface ActivityDay {
  date: string;
  count: number;
}

export interface ActivityStreak {
  count: number;
  startDate: string | null;
  endDate: string | null;
}

export interface ActivityMetric {
  label: string;
  value: string;
  helper: string;
  score: number;
  source: "events" | "repo-pushes" | "none";
  recentEventCount: number;
  recentlyPushedRepoCount: number;
}

export interface DeveloperSnapshot {
  login: string;
  displayName: string;
  avatarUrl: string;
  htmlUrl: string;
  followers: number;
  following: number;
  publicRepos: number;
  analyzedRepos: number;
  totalStars: number;
  totalForks: number;
  activeDays: number;
  activityEvents: number;
  activityStreak: ActivityStreak;
  topLanguage: string | null;
}

export interface ComparisonResult {
  leader: DeveloperSnapshot | null;
  isTie: boolean;
  insightLines: string[];
}

const languageColorClasses = [
  "bg-emerald-500",
  "bg-cyan-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-indigo-500",
  "bg-lime-500",
  "bg-orange-500",
  "bg-fuchsia-500",
];

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en", {
    notation: value >= 10_000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDate(value: string | null): string {
  if (!value) {
    return "Unavailable";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function getTotalStars(repos: GitHubRepo[]): number {
  return repos.reduce((total, repo) => total + repo.stargazers_count, 0);
}

export function getTotalForks(repos: GitHubRepo[]): number {
  return repos.reduce((total, repo) => total + repo.forks_count, 0);
}

export function getTopRepos(repos: GitHubRepo[], limit = 6): GitHubRepo[] {
  return [...repos]
    .sort((first, second) => {
      const firstScore = first.stargazers_count * 2 + first.forks_count;
      const secondScore = second.stargazers_count * 2 + second.forks_count;
      return secondScore - firstScore;
    })
    .slice(0, limit);
}

export function getLanguageBreakdown(
  repos: GitHubRepo[],
): LanguageBreakdownItem[] {
  const languageTotals = repos.reduce<Record<string, { count: number; size: number }>>(
    (totals, repo) => {
      if (!repo.language) {
        return totals;
      }

      const current = totals[repo.language] ?? { count: 0, size: 0 };
      totals[repo.language] = {
        count: current.count + 1,
        size: current.size + Math.max(repo.size, 1),
      };

      return totals;
    },
    {},
  );

  const totalSize = Object.values(languageTotals).reduce(
    (total, language) => total + language.size,
    0,
  );

  if (totalSize === 0) {
    return [];
  }

  return Object.entries(languageTotals)
    .map(([name, value], index) => ({
      name,
      repoCount: value.count,
      size: value.size,
      percentage: Math.round((value.size / totalSize) * 1000) / 10,
      colorClass: languageColorClasses[index % languageColorClasses.length],
    }))
    .sort((first, second) => second.size - first.size);
}

export function getTopLanguage(repos: GitHubRepo[]): LanguageBreakdownItem | null {
  return getLanguageBreakdown(repos)[0] ?? null;
}

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return nextDate;
}

export function getActivityDays(events: GitHubEvent[], days = 84): ActivityDay[] {
  const today = new Date();
  const startDate = addDays(today, -days + 1);
  const counts = events.reduce<Record<string, number>>((totals, event) => {
    const key = toDateKey(new Date(event.created_at));
    totals[key] = (totals[key] ?? 0) + 1;
    return totals;
  }, {});

  return Array.from({ length: days }, (_, index) => {
    const date = addDays(startDate, index);
    const dateKey = toDateKey(date);

    return {
      date: dateKey,
      count: counts[dateKey] ?? 0,
    };
  });
}

export function getActiveDayCount(events: GitHubEvent[]): number {
  return new Set(events.map((event) => toDateKey(new Date(event.created_at))))
    .size;
}

export function getActivityStreak(events: GitHubEvent[]): ActivityStreak {
  const activeDates = new Set(
    events.map((event) => toDateKey(new Date(event.created_at))),
  );
  const sortedDates = [...activeDates].sort();
  const endDate = sortedDates[sortedDates.length - 1] ?? null;

  if (!endDate) {
    return {
      count: 0,
      startDate: null,
      endDate: null,
    };
  }

  let count = 0;
  let cursor = new Date(`${endDate}T00:00:00.000Z`);
  let startDate = endDate;

  while (activeDates.has(toDateKey(cursor))) {
    startDate = toDateKey(cursor);
    count += 1;
    cursor = addDays(cursor, -1);
  }

  return {
    count,
    startDate,
    endDate,
  };
}

export function getActivityMetric(
  repos: GitHubRepo[],
  events: GitHubEvent[],
  windowDays = 90,
): ActivityMetric {
  const now = Date.now();
  const windowStart = now - windowDays * 24 * 60 * 60 * 1000;
  const recentEvents = events.filter(
    (event) => new Date(event.created_at).getTime() >= windowStart,
  );
  const recentlyPushedRepos = repos.filter((repo) => {
    if (!repo.pushed_at) {
      return false;
    }

    return new Date(repo.pushed_at).getTime() >= windowStart;
  });

  if (recentEvents.length > 0) {
    return {
      label: "Public activity pulse",
      value: formatNumber(recentEvents.length),
      helper: `Visible public events in the last ${windowDays} days.`,
      score: recentEvents.length,
      source: "events",
      recentEventCount: recentEvents.length,
      recentlyPushedRepoCount: recentlyPushedRepos.length,
    };
  }

  if (recentlyPushedRepos.length > 0) {
    return {
      label: "Repository activity pulse",
      value: formatNumber(recentlyPushedRepos.length),
      helper: `Repos pushed in the last ${windowDays} days; public events were unavailable.`,
      score: recentlyPushedRepos.length,
      source: "repo-pushes",
      recentEventCount: 0,
      recentlyPushedRepoCount: recentlyPushedRepos.length,
    };
  }

  return {
    label: "Activity pulse",
    value: "Quiet",
    helper: `No public events or repo pushes found in the last ${windowDays} days.`,
    score: 0,
    source: "none",
    recentEventCount: 0,
    recentlyPushedRepoCount: 0,
  };
}

export function createDeveloperSnapshot(
  user: GitHubUser,
  repos: GitHubRepo[],
  events: GitHubEvent[],
): DeveloperSnapshot {
  return {
    login: user.login,
    displayName: user.name ?? user.login,
    avatarUrl: user.avatar_url,
    htmlUrl: user.html_url,
    followers: user.followers,
    following: user.following,
    publicRepos: user.public_repos,
    analyzedRepos: repos.length,
    totalStars: getTotalStars(repos),
    totalForks: getTotalForks(repos),
    activeDays: getActiveDayCount(events),
    activityEvents: events.length,
    activityStreak: getActivityStreak(events),
    topLanguage: getTopLanguage(repos)?.name ?? null,
  };
}

function compareMetric(
  first: DeveloperSnapshot,
  second: DeveloperSnapshot,
  key: keyof Pick<
    DeveloperSnapshot,
    | "followers"
    | "publicRepos"
    | "totalStars"
    | "totalForks"
    | "activeDays"
  >,
): number {
  if (first[key] > second[key]) {
    return 1;
  }

  if (first[key] < second[key]) {
    return -1;
  }

  return 0;
}

export function compareDevelopers(
  first: DeveloperSnapshot,
  second: DeveloperSnapshot,
): ComparisonResult {
  const comparisons = [
    compareMetric(first, second, "followers"),
    compareMetric(first, second, "publicRepos"),
    compareMetric(first, second, "totalStars"),
    compareMetric(first, second, "totalForks"),
    compareMetric(first, second, "activeDays"),
  ];
  const score = comparisons.reduce((total, value) => total + value, 0);
  const leader = score > 0 ? first : score < 0 ? second : null;
  const lines = [
    `${first.login} has ${formatNumber(first.totalStars)} stars across analyzed repos; ${second.login} has ${formatNumber(second.totalStars)}.`,
    `${first.login} shows ${first.activeDays} active public event days; ${second.login} shows ${second.activeDays}.`,
    `${first.login} follows ${formatNumber(first.following)} accounts; ${second.login} follows ${formatNumber(second.following)}.`,
  ];

  if (first.topLanguage && second.topLanguage) {
    lines.push(
      first.topLanguage === second.topLanguage
        ? `Both profiles lean most heavily toward ${first.topLanguage}.`
        : `${first.login} leans toward ${first.topLanguage}; ${second.login} leans toward ${second.topLanguage}.`,
    );
  }

  return {
    leader,
    isTie: leader === null,
    insightLines: lines,
  };
}
