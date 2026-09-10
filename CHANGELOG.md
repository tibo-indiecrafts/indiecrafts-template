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

- **Removed the reserved `aws` + `vercel` infra-provider scaffold** — `cloudflare` is now the only IaC
  provider in the infra registry (`PROVIDERS` → `["cloudflare"]` in `code/shared/scripts/lib/infra-registry.mjs`,
  JSDoc + provider comment trimmed), the runner's unsupported-provider message is reworded
  (`code/shared/scripts/infra/run.mjs`, guard unchanged), `code/projects/_registry.md` drops the
  reserved-provider mentions, and the 12 placeholder `infra/{aws,vercel}/README.md` markers are deleted
  (each held only a "reserved slot" README). Reasserts the Cloudflare-only deploy model; a future
  provider re-adds its own registry row + stack dir. Also dropped the dead `*.vercel.app` dev/test CSP
  entry (detail in the [packages log](./code/packages/CHANGELOG.md)).
- **The pipeline now gates what ships** — the prod deploy waits for CI to pass (`workflow_run` on
  the `CI` workflow), the CI `verify` job runs the `api-guards` / `typed-routing` / `tokens` /
  `brands` / `tasks` checks, and gitleaks + dependency-review run on push, not only on PRs. Closes
  the top pipeline gaps from the verification audit (`docs/superpowers/specs/2026-08-27-close-verification-gaps-design.md`).
- **The commit hook now formats every surface, not just the website** — a root `lint-staged`
  (`.lintstagedrc.json`) runs `prettier --write` on all staged files (honouring the root
  `.prettierignore`, which excludes the web app it formats itself), then the website step keeps its
  own `eslint --fix` + `tsc`. A format slip in a worker, package, script, mobile, or hybrid file is
  now caught pre-commit instead of at CI's `format:check`. (eslint + tsc for non-web stay CI-only.)
- **Post-deploy smoke is now functional, not just reachability** — an app can declare a `smoke`
  probe in the registry (`apps.mjs`): after the root 200 check, the deploy GETs its health/version
  route (`/api/version` for the Next apps, `/health` for the workers) and fails the deploy unless the
  body carries the expected marker — so a 200 from a broken runtime or a stale build is caught, not
  shipped. Apps with no such route keep the root-reachability check. On a smoke failure the deploy
  now **auto-rolls-back** (`wrangler rollback --message`, scoped to deploy-succeeded-but-smoke-failed
  so a broken deploy is left for a human), reverting the app to its previous version.
- **Removed the `method/` and `work/` folders** — the internal dev-framework site (rules, workflows,
  process, sprint templates, tooling, the page-builder roadmap) and the private sprint lab are deleted.
  Conventions now live in-repo (`.claude/` + app rules + `code/docs/`); reviewer agents/skills repoint
  to the surviving `.claude/rules/` + `DESIGN.md`. The delivery machinery that guarded them
  (`delivery-canary` + its CI step + `method`/`work` `export-ignore`) is removed as redundant.
- **Navigation + footer menus moved into Sanity** (editable per client, no config fallback,
  header dropdowns with icon + description). Detail → [app log](./code/projects/web/surfaces/website/CHANGELOG.md).
- **Per-area changelog system** — this roll-up plus the app/packages/modules/docs area logs, each
  owning its own history.
