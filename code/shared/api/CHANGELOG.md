# Changelog — api (`@indiecrafts/api`)

Behaviour, config, and route changes for the API worker, in plain language with the
_why_. The repo-wide roll-up → [root `CHANGELOG.md`](../../../../CHANGELOG.md).

## [Unreleased]

### Added

- **Scaffold — a bare Cloudflare Worker (`@indiecrafts/api`).** HTTP API deploy shell
  (no Next/OpenNext): `src/index.ts` (`fetch` + a `/health` route), per-env
  `wrangler.toml`, `scripts/deploy.mjs` (rename guard + prod-confirm + `wrangler
deploy`). Logic is imported from packages/modules, not written here. Ships with
  `deploy:api:<env>` + the shared `deploy:all:<env>` runner. _Why:_ workers are apps —
  a deployable belongs in `code/projects/`, not a package.
