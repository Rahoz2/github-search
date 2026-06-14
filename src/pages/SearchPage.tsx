import { type FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SearchForm } from "../components/SearchForm";

const RECENT_SEARCHES_KEY = "repolens:recent-searches";
const DEFAULT_SUGGESTIONS = ["Rahoz2"];

function readRecentSearches(): string[] {
  try {
    const storedSearches = window.localStorage.getItem(RECENT_SEARCHES_KEY);
    const parsedSearches: unknown = storedSearches
      ? JSON.parse(storedSearches)
      : [];

    return Array.isArray(parsedSearches)
      ? parsedSearches.filter((search): search is string => {
          return typeof search === "string" && search.trim().length > 0;
        })
      : [];
  } catch {
    return [];
  }
}

function writeRecentSearches(searches: string[]): void {
  window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
}

export function SearchPage() {
  const navigate = useNavigate();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [compareFirst, setCompareFirst] = useState("");
  const [compareSecond, setCompareSecond] = useState("");

  useEffect(() => {
    setRecentSearches(readRecentSearches());
  }, []);

  const suggestions = DEFAULT_SUGGESTIONS;

  function saveSearches(...usernames: string[]) {
    const cleanUsernames = usernames
      .map((username) => username.trim())
      .filter(Boolean);
    const nextSearches = [
      ...cleanUsernames,
      ...recentSearches.filter((recentUsername) => {
        return !cleanUsernames.some(
          (username) => username.toLowerCase() === recentUsername.toLowerCase(),
        );
      }),
    ].slice(0, 5);

    setRecentSearches(nextSearches);
    writeRecentSearches(nextSearches);
  }

  function handleSearch(username: string) {
    saveSearches(username);
    navigate(`/u/${encodeURIComponent(username)}`);
  }

  function handleCompare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const first = compareFirst.trim();
    const second = compareSecond.trim();

    if (first && second) {
      saveSearches(first, second);
      navigate(
        `/compare/${encodeURIComponent(first)}/${encodeURIComponent(second)}`,
      );
    }
  }

  return (
    <div className="min-h-[calc(100vh-73px)] bg-[#07090f] text-white">
      <div className="page-shell space-y-8">
        <section className="relative overflow-hidden rounded-lg border border-white/10 bg-[#0b111d] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.38)] sm:p-7 lg:p-8">
          <div
            className="absolute inset-0 bg-[linear-gradient(115deg,rgba(16,185,129,0.16),transparent_36%,rgba(34,211,238,0.12)_72%,transparent)]"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:34px_34px] opacity-40"
            aria-hidden="true"
          />

          <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-6">
              <div className="max-w-4xl">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                  GitHub profile intelligence
                </p>
                <h1 className="mt-3 text-4xl font-bold leading-tight text-white sm:text-6xl">
                  Public GitHub signal, packaged like a recruiter-ready report.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300">
                  Search a username to inspect public profile context,
                  repository momentum, language focus, and honest activity
                  signals without inventing private contribution data.
                </p>
              </div>

              <div className="rounded-lg border border-white/10 bg-black/20 p-4 backdrop-blur sm:p-5">
                <SearchForm
                  suggestions={suggestions}
                  tone="dark"
                  onSubmit={handleSearch}
                />
                {recentSearches.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {recentSearches.map((username) => (
                      <button
                        className="focus-ring rounded-md border border-white/10 bg-white/[0.07] px-3 py-2 text-sm font-semibold text-zinc-300 transition hover:border-emerald-300/40 hover:text-white"
                        key={username}
                        type="button"
                        onClick={() => handleSearch(username)}
                      >
                        {username}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                    Report preview
                  </p>
                  <p className="mt-2 text-2xl font-bold text-white">
                    Developer signal scan
                  </p>
                </div>
                <div
                  className="h-14 w-14 rounded-lg border border-emerald-300/25 bg-emerald-300/10"
                  aria-hidden="true"
                />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  ["Repos", "public"],
                  ["Stars", "measured"],
                  ["Activity", "honest"],
                ].map(([label, value]) => (
                  <div
                    className="rounded-lg border border-white/10 bg-black/20 p-3"
                    key={label}
                  >
                    <p className="text-xs text-zinc-400">{label}</p>
                    <p className="mt-2 text-lg font-bold text-white">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 space-y-3">
                {[
                  ["Language focus", "72%", "bg-emerald-400"],
                  ["Repository signal", "58%", "bg-cyan-400"],
                  ["Activity pulse", "36%", "bg-amber-300"],
                ].map(([label, percentage, colorClass]) => (
                  <div key={label}>
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-zinc-300">{label}</span>
                      <span className="text-zinc-400">sample</span>
                    </div>
                    <div className="mt-2 h-3 overflow-hidden rounded-md bg-white/10">
                      <div
                        className={`h-full rounded-md ${colorClass}`}
                        style={{ width: percentage }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-5 text-zinc-400">
                Preview only. Live profile pages use public GitHub REST data.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
              Versus reports
            </p>
            <h2 className="mt-2 text-3xl font-bold text-white">
              Compare two developers with a shareable URL.
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Build a side-by-side view for public followers, repos, stars,
              forks, language focus, top repositories, and visible activity.
            </p>
          </div>
          <form
            className="rounded-lg border border-white/10 bg-white/[0.06] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.24)] sm:p-5"
            onSubmit={handleCompare}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <label>
                <span className="mb-2 block text-sm font-semibold text-zinc-300">
                  First user
                </span>
                <input
                  className="focus-ring min-h-11 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-zinc-500"
                  placeholder="first username"
                  value={compareFirst}
                  required
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  onChange={(event) => setCompareFirst(event.target.value)}
                />
              </label>
              <label>
                <span className="mb-2 block text-sm font-semibold text-zinc-300">
                  Second user
                </span>
                <input
                  className="focus-ring min-h-11 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-zinc-500"
                  placeholder="second username"
                  value={compareSecond}
                  required
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  onChange={(event) => setCompareSecond(event.target.value)}
                />
              </label>
            </div>
            <button className="btn-primary mt-4 w-full sm:w-auto" type="submit">
              Compare developers
            </button>
          </form>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {[
            [
              "Honest public data",
              "RepoLens labels activity limits and never invents private contribution history.",
            ],
            [
              "Recruiter scan speed",
              "Bold stats, ranked repositories, and language visuals surface signal quickly.",
            ],
            [
              "Portfolio-ready URLs",
              "Profile and comparison routes are shareable by design.",
            ],
          ].map(([title, copy]) => (
            <div
              className="rounded-lg border border-white/10 bg-white/[0.06] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.22)]"
              key={title}
            >
              <h3 className="font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{copy}</p>
            </div>
          ))}
        </section>

        <div className="text-center text-sm text-zinc-400">
          Try{" "}
          <Link
            className="focus-ring rounded-md font-semibold text-emerald-300 hover:text-emerald-200"
            to="/u/Rahoz2"
          >
            /u/Rahoz2
          </Link>
        </div>
      </div>
    </div>
  );
}
