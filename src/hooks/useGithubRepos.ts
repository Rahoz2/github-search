import { useQuery } from "@tanstack/react-query";
import { fetchGitHubRepos } from "../api/github";

export function useGithubRepos(username?: string) {
  const normalizedUsername = username?.trim();

  return useQuery({
    queryKey: ["github-repos", normalizedUsername],
    queryFn: () => fetchGitHubRepos(normalizedUsername ?? ""),
    enabled: Boolean(normalizedUsername),
  });
}
