import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#07090f] text-white">
      <header className="border-b border-white/10 bg-[#07090f]/90 backdrop-blur">
        <div className="page-shell flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="focus-ring rounded-md">
            <span className="text-xl font-bold text-white">
              RepoLens
            </span>
          </Link>
          <nav
            className="flex items-center gap-2 text-sm font-medium text-zinc-400"
            aria-label="Primary navigation"
          >
            <NavLink
              to="/"
              className={({ isActive }) =>
                `focus-ring rounded-md px-3 py-2 transition hover:text-white ${
                  isActive ? "bg-white/[0.08] text-white" : ""
                }`
              }
            >
              Search
            </NavLink>
            <a
              className="focus-ring rounded-md px-3 py-2 transition hover:text-white"
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
