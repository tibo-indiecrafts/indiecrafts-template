# @indiecrafts/shared-agent — the AI agent worker (worker-cf)

Auto-loads under `code/shared/agent/**`. The **ONE dedicated bare Cloudflare Worker** hosting the AI agent
for every surface — `POST /v1/agent/:name` (+ `/health`). Consolidates the two former entry points (the
website's Next `/api/agent` route + the `api` worker's `/v1/agent`). The agent **core** is the
`@indiecrafts/packages-shared-agent` brick; this is its deploy shell + request guard. Area rules →
[`../../.claude/CLAUDE.md`](../../.claude/CLAUDE.md).

**Framework:** Cloudflare Workers · wrangler · TypeScript. **Platform class:** `worker-cf` (bare Worker, no
Next/OpenNext). Same runtime as `api`/`cron`/`workers`.

- **Dual-mode guard, inlined** (`withGuard` and the brick's `verifyTurnstile` `import "server-only"`, which
  breaks the esbuild build) — branch on `Origin`:
  - **Browser** (an allowlisted `Origin` — dev localhost + `WEB_ORIGIN`) → **Turnstile** token (body
    `cf-turnstile-response`) + CORS + rate-limit.
  - **Native** (no `Origin`) → **bearer** `APP_API_TOKEN` + rate-limit.
  - Then body-cap → `runAgent(SPECS[name], …, ANTHROPIC_API_KEY)`.
- **Secrets — single home** (`wrangler secret put … --env <env>` + `.dev.vars`): `ANTHROPIC_API_KEY` ·
  `APP_API_TOKEN` · `TURNSTILE_SECRET`. Never bundled into a client. Rate-limit = the `AGENT_RATELIMIT`
  native binding (`wrangler.toml`).
- **Callers** (all via `@indiecrafts/packages-shared-agent-client` `callAgent`): website
  `ContentResearchAgent` (browser, cross-origin + Turnstile) · mobile `lib/agent.ts` + hybrid main (bearer).
- **Deploy:** `pnpm deploy:shared:agent:<env>` → the shared `scripts/deploy/worker.mjs`. A row in
  `scripts/lib/apps.mjs` (slug `agent`); CI + `deploy:all` fan out automatically.

**Rules:** compose bricks; **no cross-app imports**; never expose a secret. `withGuard` is Next-only — keep
the guard **inline**. Agent core reference → [`code/docs/packages/agent.md`](../../../docs/packages/agent.md).
