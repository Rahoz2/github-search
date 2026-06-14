import { GitHubApiError } from "../api/github";

export function getFriendlyErrorTitle(error: unknown): string {
  if (error instanceof GitHubApiError) {
    if (error.status === 404) {
      return "Profile not found";
    }

    if (error.status === 403) {
      return "GitHub limit reached";
    }
  }

  return "Could not load GitHub data";
}

export function getFriendlyErrorMessage(error: unknown): string {
  if (error instanceof GitHubApiError) {
    if (error.status === 404) {
      return "GitHub could not find that profile. Check the username and try again.";
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong while loading GitHub data.";
}
