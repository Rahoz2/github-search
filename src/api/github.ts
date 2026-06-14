import type {
  GitHubApiErrorPayload,
  GitHubEvent,
  GitHubRepo,
  GitHubUser,
} from "../types/github";

const GITHUB_API_BASE_URL = "https://api.github.com";

export class GitHubApiError extends Error {
  status: number;
  resetAt: Date | null;

  constructor(message: string, status: number, resetAt: Date | null = null) {
    super(message);
    this.name = "GitHubApiError";
    this.status = status;
    this.resetAt = resetAt;
  }
}

async function parseError(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as GitHubApiErrorPayload;
    return payload.message ?? response.statusText;
  } catch {
    return response.statusText;
  }
}

function getResetDate(response: Response): Date | null {
  const resetHeader = response.headers.get("x-ratelimit-reset");
  if (!resetHeader) {
    return null;
  }

  const resetTimestamp = Number(resetHeader);
  if (Number.isNaN(resetTimestamp)) {
    return null;
  }

  return new Date(resetTimestamp * 1000);
}

async function fetchGitHub<T>(path: string): Promise<T> {
  const response = await fetch(`${GITHUB_API_BASE_URL}${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!response.ok) {
    const apiMessage = await parseError(response);
    const resetAt = getResetDate(response);
    const remaining = response.headers.get("x-ratelimit-remaining");
    const isRateLimited = response.status === 403 && remaining === "0";
    const message = isRateLimited
      ? `GitHub API rate limit reached. Try again after ${
          resetAt?.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }) ?? "the reset window"
        }.`
      : apiMessage;

    throw new GitHubApiError(message, response.status, resetAt);
  }

  return response.json() as Promise<T>;
}

function encodeUsername(username: string): string {
  return encodeURIComponent(username.trim());
}

export function fetchGitHubUser(username: string): Promise<GitHubUser> {
  return fetchGitHub<GitHubUser>(`/users/${encodeUsername(username)}`);
}

export function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
  return fetchGitHub<GitHubRepo[]>(
    `/users/${encodeUsername(username)}/repos?per_page=100&sort=updated`,
  );
}

export function fetchGitHubActivity(username: string): Promise<GitHubEvent[]> {
  return fetchGitHub<GitHubEvent[]>(
    `/users/${encodeUsername(username)}/events/public?per_page=100`,
  );
}
