# Changelog — agent (`@indiecrafts/shared-agent`)

Behaviour, config, and route changes for the AI agent Worker (worker-cf), in plain
language with the _why_.

**Not here:** the agent core brick → [`code/packages/CHANGELOG.md`](../../packages/CHANGELOG.md);
docs-site → [`code/docs/CHANGELOG.md`](../../docs/CHANGELOG.md); the repo-wide roll-up →
[root `CHANGELOG.md`](../../../CHANGELOG.md).

Format follows [Keep a Changelog](https://keepachangelog.com). Categories:
**Added · Changed · Deprecated · Removed · Fixed**.

## [Unreleased]

### Added

- **The dedicated AI agent Worker — one endpoint for every surface.** A new bare Cloudflare Worker
  (`code/shared/agent`) hosting `POST /v1/agent/:name` (+ `/health`), consolidating the two former entry
  points (the website's Next `/api/agent` route + the `api` worker's `/v1/agent`). A **dual-mode inlined
  guard** branches on `Origin`: browser callers (allowlisted `Origin` + a Turnstile token) vs native
  callers (bearer `APP_API_TOKEN`), both rate-limited (`AGENT_RATELIMIT`). `ANTHROPIC_API_KEY` +
  `APP_API_TOKEN` + `TURNSTILE_SECRET` live here as its single home. Registered in `scripts/lib/apps.mjs`
  (slug `agent`); deploy `pnpm deploy:shared:agent:<env>`. **Why:** the agent now deploys, scales, and rate-limits
  independently of the website + api, with one auth surface. Turnstile is re-implemented inline because the
  brick's `verifyTurnstile` (and `withGuard`) are `server-only` and break the bare-Worker esbuild build.
