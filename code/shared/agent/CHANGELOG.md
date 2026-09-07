# Changelog — agent (`@indiecrafts/shared-agent`)

Behaviour, config, and route changes for the AI agent Worker (worker-cf), in plain
language with the _why_.

**Not here:** the agent core brick → [`code/packages/CHANGELOG.md`](../../packages/CHANGELOG.md);
docs-site → [`code/docs/CHANGELOG.md`](../../docs/CHANGELOG.md); the repo-wide roll-up →
[root `CHANGELOG.md`](../../../CHANGELOG.md).

Format follows [Keep a Changelog](https://keepachangelog.com). Categories:
**Added · Changed · Deprecated · Removed · Fixed**.

## [Unreleased]

### Changed

- **A malformed Anthropic reply now returns 502, not a 200 with unchecked data.** `runAgent` (the
  agent core brick) began validating output against the spec's `outputSchema`, so a reply missing a
  required field returns `{ ok: false }` and the Worker maps that to a 502 — instead of passing an
  unchecked object through as `200 { data }`. The Worker code is unchanged; its test mocks now
  register a schema-valid envelope (`{ ideas: [] }`) to match the enforced contract.

### Fixed

- **Rate-limit the browser path BEFORE the Turnstile siteverify call, not after.** The
  `AGENT_RATELIMIT` check ran after Turnstile verification, so a spoofed allowlisted `Origin` + a
  garbage token triggered an unthrottled outbound `siteverify` fetch on every attempt — a failing
  Turnstile check never reached a rate limit placed after it. The browser path now rate-limits
  first, before calling `siteverify`; the native bearer path's check order is unchanged (its auth
  makes no outbound call, so there was nothing to throttle-first there). **Why:** close the
  unauthenticated-amplification vector on the outbound siteverify call.
- **Validate/clamp `locale` at the worker boundary.** `body.locale` was only type-checked
  (`typeof === "string"`), then flowed unchanged into `runAgent`, which raw-interpolates it into
  the Anthropic system prompt. The worker now clamps anything not shaped like a BCP-47 locale
  (`/^[a-z]{2,3}(-[A-Z]{2})?$/`) to `"en"` before calling `runAgent`, instead of rejecting the
  whole request. **Why:** close a prompt-injection vector at the trust boundary.

### Added

- **Test coverage for the guard's non-auth paths.** 10 new cases alongside the existing 6
  guard-only ones: the Anthropic success path (mocked `tool_use` reply → 200), the 429 rate limit
  (21 requests against the real `AGENT_RATELIMIT` binding), both 413 body-cap checks (the fast
  content-length header check and the post-read actual-length check), Turnstile fail-closed
  (missing token, `{success:false}`, and a network-failing siteverify), an unknown agent name
  (404), a missing `ANTHROPIC_API_KEY` (503), and the locale clamp above (a garbage locale still
  succeeds, clamped to `"en"` before reaching Anthropic). Uses `cloudflare:test`'s `fetchMock` to
  intercept the outbound Anthropic + Turnstile calls — `SELF.fetch` runs the worker in a separate
  workerd isolate, so a plain `vi.stubGlobal("fetch", …)` wouldn't reach it. `vitest.config.ts` now
  runs against `env.dev` (for the real `AGENT_RATELIMIT` binding) with
  `ANTHROPIC_API_KEY`/`APP_API_TOKEN`/`TURNSTILE_SECRET` test values injected via
  `miniflare.bindings`.
- **`secrets:sync:agent:<env>` — bulk-push secrets from `.dev.vars`.** Uses the shared
  `shared/scripts/data/secrets.mjs` runner to `wrangler secret bulk` the agent's `.dev.vars`
  (`ANTHROPIC_API_KEY`, `APP_API_TOKEN`, `TURNSTILE_SECRET`) in one clobber-guarded, prod-confirmed call.
  Root alias `secrets:sync:shared:agent:<env>`.

### Fixed

- **The `AGENT_RATELIMIT` rate limiter is declared per env, not top-level (`wrangler.toml`).** The
  `[[unsafe.bindings]]` sat at the top level, which wrangler does **not** inherit into named
  environments — so every `--env dev|staging|prod` deploy shipped the agent **without** its rate
  limiter, leaving the LLM endpoint uncapped. Moved into `[[env.<env>.unsafe.bindings]]` (verified: the
  `env.AGENT_RATELIMIT` binding now shows in a `--env prod` dry-run). **Why:** the per-IP LLM
  spend/abuse cap was silently absent in every deployed environment.

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
