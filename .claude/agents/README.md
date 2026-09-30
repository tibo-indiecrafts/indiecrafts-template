# Agents — this repo's reviewers

Claude Code discovers agents recursively. This folder holds **only what this repo uses**. The
general vendored suite (`contains-studio/agents`) was removed as unused — review and build work
runs through the plugin agents (`pr-review-toolkit`, `feature-dev`, `caveman`), the gstack review
skills (`/review` · `/codex` · `/cso`), and the reviewers below. Agents live at the repo root only
(`pnpm check:claude-md` fails on a nested `.claude/agents/`).

## `project/` — this repo's custom reviewers

Read-only, repo-aware critics encoding _this_ template's conventions. Reach for them after a
change, before shipping; the `design-critique` skill sequences the design lenses.

- **config-consistency-reviewer** — the config-first NEVERs (no hard-coded brand/URL/color/nav, strings in `messages/`, typed routing, no leaked token, one home per fact).
- **design-system-reviewer** — the `DESIGN.md` token contract.
- **accessibility-reviewer** — structural a11y + WCAG AA.
- **ux-reviewer** — flow, clarity, friction, hierarchy.
- **copy-reviewer** — product voice + tone.
- **interaction-states-reviewer** — hover / focus / active / disabled / loading / empty / error / destructive.
- **page-builder-reviewer** — a page-builder block touched every synced file.
- **architecture-reviewer** — monorepo boundary + altitude: no cross-app imports, deps point down, ≥2-consumer extraction, single-owner shared resources, registry rows.
- **compliance-reviewer** — GDPR: data minimization, consent, erasure/export coverage, audit trail, DPIA/ROPA.
- **performance-reviewer** — Next.js/React perf: server-first, bundle, image sizing, fetch waterfalls, static/ISR.

## Links

- **Live:** `<production URL>` · **Repo:** `<git URL>` · **Deploy:** `<dashboard>`

<!-- Template placeholders — fill per project; canonical URLs live in the root README. -->
