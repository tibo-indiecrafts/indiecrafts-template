# Changelog — workers (`@indiecrafts/shared-workers`)

Behaviour, config, and job changes for the background-jobs Worker (worker-cf), in plain
language with the _why_.

**Not here:** shared-brick changes → [`code/packages/CHANGELOG.md`](../../packages/CHANGELOG.md);
docs-site → [`code/docs/CHANGELOG.md`](../../docs/CHANGELOG.md); the repo-wide roll-up →
[root `CHANGELOG.md`](../../../CHANGELOG.md).

Format follows [Keep a Changelog](https://keepachangelog.com). Categories:
**Added · Changed · Deprecated · Removed · Fixed**.

## [Unreleased]

_Activated bare-Worker scaffold for queue/event consumers + background jobs (the task logic lives in a
`code/packages` / `code/modules` brick). Log the first real job here._

### Changed

- **Local dev now runs `--remote`, like `api`/`cron`.** The `dev` script is `wrangler dev --env dev
--remote` — the worker runs on the Cloudflare `dev` edge, not local miniflare — so all four workers
  share one uniform local-dev model. It has no `dev` bindings yet, so this binds nothing today; it keeps
  the worker consistent and ready for when a real binding lands. **Why:** "no miniflare tier" now holds
  for every worker, not just the two with D1.

### Fixed

- **`pnpm dev` now selects the `dev` environment (`wrangler dev --env dev`).** The dev script omitted
  `--env dev` (unlike `api`/`cron`), so local dev loaded the top-level config instead of `[env.dev]`.
  Its `NEXT_PUBLIC_ENVIRONMENT` var was therefore unbound, and `GET /health` reported
  `env: "unknown"`. With `--env dev` it binds `[env.dev]` (vars + observability) and `/health` reports
  `env: "development"`. **Why:** parity with the other workers, a correct local env label, and any
  future `[env.dev]` bindings resolve locally.
