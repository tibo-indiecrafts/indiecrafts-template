# Changelog

One shared record for **code and design** — every change that alters behavior,
config, a route/convention, or a design token lands here in plain language,
explaining the _why_, not just the _what_. Dev and design write to the same file
so an agent (or a client) reads one history, not two.

- **Design/token changes** are also governed by `DESIGN.md` (the token contract);
  **code/convention changes** by `CLAUDE.md`. This file is where both are logged.
- Format follows [Keep a Changelog](https://keepachangelog.com); versions are
  `[major.minor.patch]`. Categories: **Added · Changed · Deprecated · Removed ·
  Fixed**. Tag design-only entries with _(design)_ for quick scanning.
- After any token change, re-sync `theme.hexColors` and run `pnpm verify:contrast`.

## [Unreleased]

### Added

- _(design)_ Typography levels `subheading`, `title`, `lead`, `caption` — filled
  the 5→9 gap so an agent building an `h3`/lead/caption has a token instead of a
  guess. Each maps to a Tailwind size already in use (`text-sm` was the most-used
  size with no token).
- _(design)_ `elevation` tokens (`flat/card/raised/overlay`) — the Elevation
  section was prose-only; the depth steps are now machine-readable.
- _(design)_ Component tokens `button-secondary` and `focus-ring`; `card` now
  cross-links `{elevation.card}`.
- _(design)_ "How to read this system" precedence header — states that tokens win
  over hardcoded values and where the runtime source of truth lives.
- This shared `CHANGELOG.md`.
- Opt-in **CodeGraph** support for AI coding agents — `.codegraph/` gitignored,
  guarded `codegraph:init` / `codegraph:status` scripts, and `docs/setup/codegraph.md`.
  Kept out of the committed `.mcp.json` so it never spawns for client sites that
  didn't opt in; MCP registration is per-developer (global).

### Changed

- `CLAUDE.md` front-loaded: a stack line + top-5 non-negotiables now open the file
  so the highest-attention lines carry the load-bearing rules; Working principles
  and the docs section tightened.
- _(design)_ Colors prose now pairs each role with its resolved value
  (`brand — oklch(0.55 0.18 260) · #4f69d9`) so agents don't cross-reference.
- Added rules (CLAUDE.md + DESIGN.md) to maximise the `frontend-design` skill and
  require all UI to be responsive/optimised for every supported screen size
  (verify 375 / 768 / 1280).
