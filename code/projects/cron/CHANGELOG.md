# Changelog — cron (`@indiecrafts/cron`)

Behaviour, schedule, and config changes for the cron worker, in plain language with
the _why_. The repo-wide roll-up → [root `CHANGELOG.md`](../../../CHANGELOG.md).

## [Unreleased]

### Added

- **Scaffold — a bare scheduled Cloudflare Worker (`@indiecrafts/cron`).** Deploy shell
  (no Next/OpenNext): `src/index.ts` (`scheduled` + a `/health` `fetch`), per-env
  `wrangler.toml` with `[triggers] crons` (hourly default), `scripts/deploy.mjs`
  (rename guard + prod-confirm + `wrangler deploy`). Task logic is imported from
  packages/modules, not written here. Ships `deploy:cron:<env>` + the shared
  `deploy:all:<env>` runner. _Why:_ workers are apps — a deployable belongs in
  `code/projects/`, not a package.
