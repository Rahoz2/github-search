export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepoOwner {
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  archived: boolean;
  disabled: boolean;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  size: number;
  topics?: string[];
  homepage: string | null;
  created_at: string;
  updated_at: string;
  pushed_at: string | null;
  owner: GitHubRepoOwner;
}

export interface GitHubEventRepo {
  id: number;
  name: string;
  url: string;
}

export interface GitHubEventActor {
  id: number;
  login: string;
  display_login?: string;
  avatar_url: string;
  url: string;
}

export interface GitHubEvent {
  id: string;
  type: string;
  actor: GitHubEventActor;
  repo: GitHubEventRepo;
  public: boolean;
  created_at: string;
  payload: Record<string, unknown>;
}

export interface GitHubApiErrorPayload {
  message?: string;
  documentation_url?: string;
}
