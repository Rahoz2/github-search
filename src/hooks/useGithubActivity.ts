import { useQuery } from "@tanstack/react-query";
import { fetchGitHubActivity } from "../api/github";

export function useGithubActivity(username?: string) {
  const normalizedUsername = username?.trim();

  return useQuery({
    queryKey: ["github-activity", normalizedUsername],
    queryFn: () => fetchGitHubActivity(normalizedUsername ?? ""),
    enabled: Boolean(normalizedUsername),
  });
}
