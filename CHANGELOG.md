# Changelog — the everything-view

The **repo-wide roll-up**: per release, a few plain-language bullets of what shipped across
every area, each linking to the area log for the detail. This is where you see the whole
template's history at a glance.

**One home per change** — the detail is logged in exactly one area log, never copied here:

| Area                               | Log                                                                                                    | Covers                                                 |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| App (`@indiecrafts/website`)       | [`code/projects/web/surfaces/website/CHANGELOG.md`](./code/projects/web/surfaces/website/CHANGELOG.md) | behavior, config, routes, conventions, design tokens   |
| Packages (`@indiecrafts/*` bricks) | [`code/packages/CHANGELOG.md`](./code/packages/CHANGELOG.md)                                           | a brick's public surface — exports, deps, splits       |
| Modules (product slices)           | [`code/modules/CHANGELOG.md`](./code/modules/CHANGELOG.md)                                             | a module's surface/wiring — extraction, blocks, gating |
| Docs site                          | [`code/docs/CHANGELOG.md`](./code/docs/CHANGELOG.md)                                                   | pages added/removed/moved, structure, sidebar          |

This file stays **coarse**: cut a rolled-up entry at release/tag time, link down for specifics.
Format follows [Keep a Changelog](https://keepachangelog.com); versions are `[major.minor.patch]`.

## [Unreleased]

- **The pipeline now gates what ships** — the prod deploy waits for CI to pass (`workflow_run` on
  the `CI` workflow), the CI `verify` job runs the `api-guards` / `tokens` / `brands` / `tasks`
  checks, and gitleaks + dependency-review run on push, not only on PRs. Closes the top pipeline
  gaps from the verification audit (`docs/superpowers/specs/2026-08-27-close-verification-gaps-design.md`).
- **Removed the `method/` and `work/` folders** — the internal dev-framework site (rules, workflows,
  process, sprint templates, tooling, the page-builder roadmap) and the private sprint lab are deleted.
  Conventions now live in-repo (`.claude/` + app rules + `code/docs/`); reviewer agents/skills repoint
  to the surviving `.claude/rules/` + `DESIGN.md`. The delivery machinery that guarded them
  (`delivery-canary` + its CI step + `method`/`work` `export-ignore`) is removed as redundant.
- **Navigation + footer menus moved into Sanity** (editable per client, no config fallback,
  header dropdowns with icon + description). Detail → [app log](./code/projects/web/surfaces/website/CHANGELOG.md).
- **Per-area changelog system** — this roll-up plus the app/packages/modules/docs area logs, each
  owning its own history.
