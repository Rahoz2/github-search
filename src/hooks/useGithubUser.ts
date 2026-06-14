import { useQuery } from "@tanstack/react-query";
import { fetchGitHubUser } from "../api/github";

export function useGithubUser(username?: string) {
  const normalizedUsername = username?.trim();

  return useQuery({
    queryKey: ["github-user", normalizedUsername],
    queryFn: () => fetchGitHubUser(normalizedUsername ?? ""),
    enabled: Boolean(normalizedUsername),
  });
}
