# AGENTS.md

## Project: RepoLens

RepoLens is a React + TypeScript web app for visualizing GitHub developer profiles and comparing two developers.

## Core stack

- React
- TypeScript
- React Router
- React Query / TanStack Query
- Tailwind CSS
- GitHub REST API for public profile and repository data

## Project expectations

- Keep API calls in `src/api`.
- Keep shared TypeScript types in `src/types`.
- Keep reusable data calculations in `src/lib` or `src/utils`.
- Keep page-level route components in `src/pages`.
- Keep reusable UI pieces in `src/components`.
- Use React Query for server state, loading states, error states, and caching.
- Use React Router for navigation and route params.
- Use Tailwind classes for styling.
- Make all pages responsive.

## GitHub API rules

- Never hardcode a GitHub token in the client.
- Prefer public REST API endpoints unless there is a strong reason to use GraphQL.
- Handle API errors and rate limits gracefully.
- Do not fake GitHub-only data. If something cannot be accurately fetched from public data, show an honest fallback or label it clearly.

## Product rules

- The UI should feel polished enough for a portfolio project.
- Prioritize recruiter-friendly visuals: stat cards, charts, clean comparison sections, and shareable URLs.
- Keep the app fast and avoid excessive API calls.
- Do not add dependencies without explaining why they are needed.
- Prefer simple, maintainable code over clever abstractions.

## Design direction: bold, impressive, not generic

The design should feel like a premium developer analytics product, not a generic AI-generated dashboard.

Visual style:

- Bold, editorial, and modern.
- Dark-first interface with strong contrast.
- Use a distinctive visual identity: oversized typography, sharp stat cards, glowing accents, gradient borders, subtle grid/background texture, and clean spacing.
- Avoid generic SaaS blocks, random pastel gradients, boring cards, and cookie-cutter layouts.
- The app should feel closer to a polished product landing page mixed with a data dashboard.

Inspiration:

- Linear-level polish
- Vercel-style spacing and typography
- GitHub developer aesthetic
- Modern analytics dashboards
- Premium portfolio project, not tutorial UI

Layout expectations:

- The home page should have a strong hero section, not just a centered input.
- The profile page should feel like a shareable “developer report card.”
- The comparison page should feel like a versus page with strong visual hierarchy.
- Use big numbers, meaningful stat cards, chart sections, badges, and clean sections.
- Make the first screen impressive before scrolling.

Design rules:

- Do not use placeholder-looking cards everywhere.
- Do not overuse emojis.
- Do not use bland section titles like “Stats” everywhere.
- Do not make everything the same size.
- Create hierarchy: hero, primary stats, secondary stats, detailed charts.
- Use motion only if it is tasteful and lightweight.
- Keep accessibility: readable contrast, keyboard-friendly controls, and clear focus states.
- Make mobile responsive, but prioritize a desktop layout that looks recruiter-ready.

Before finalizing:

- Review the UI critically and improve anything that looks generic.
- Explain what design choices make it feel distinctive.
- Suggest one or two optional polish upgrades, but do not add heavy dependencies without asking.

## Verification

Before finishing a task, run the relevant commands available in the repo, such as:

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`

If a command does not exist, mention that instead of inventing one.

## Definition of done

A task is done only when:

- The requested feature works.
- Loading, error, and empty states are handled.
- TypeScript types are clean.
- The UI is responsive.
- Relevant checks were run or clearly explained.
- The final response includes a summary of changed files and verification results.
