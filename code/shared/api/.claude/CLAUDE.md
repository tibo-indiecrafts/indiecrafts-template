# @indiecrafts/shared-api — standalone API (worker-cf)

Auto-loads under `code/shared/api/**`. A **dedicated JSON/GraphQL API** for the non-web clients (`mobile`,
`hybrid`, partners). The web app keeps its own co-located `/api` routes; this is the shared, versioned API
those clients call — its own domain, its own deploy. **Activated bare-Worker scaffold — `/health` + the
audit + session sink (`POST /v1/events` → EU D1, `GET /v1/sessions`)**, bearer-gated by `APP_API_TOKEN` +
CORS allowlist + the native rate-limit binding; `withGuard` is Next-only, so the guard is inline. More
routes TBD. (The AI agent moved to its own [`code/shared/agent`](../agent/.claude/CLAUDE.md) Worker.)
`POST /v1/clerk-webhook` also keeps `user_profiles` in sync with Clerk (source of truth for email):
upsert + re-fingerprint on `user.created`/`user.updated`, pseudonymise on `user.deleted`. Secrets:
`APP_API_TOKEN` · `IP_HASH_SALT` · `CLERK_WEBHOOK_SECRET` · `GDPR_FINGERPRINT_SALT` (email fingerprint
salt, identical across envs — see `wrangler.toml`). `src/erasure/` holds the store-agnostic erasure
adapters — D1 (real) + Clerk/Sanity/orders (dependency-injected) — implementing
`@indiecrafts/packages-shared-compliance` `ErasureAdapter`, run by its `runErasure`/`runExport`
orchestrator. The `/v1/erasure` routes are live: `GET/POST /v1/erasure/request` (Turnstile-gated,
anti-enumeration), `GET/POST /v1/erasure/confirm` (token + typed-email fingerprint + TTL + attempt
cap → runs the engine live), `GET /v1/erasure/status/:token` (public, no-PII status), and
`POST /v1/erasure/self` (authenticated self-service; Clerk-JWT + typed-email gate → runs the
engine directly, no email round-trip — the signed-in surfaces' account-delete control calls it).

**Framework:** Cloudflare Workers · wrangler · TypeScript. **Platform class:** `worker-cf` (a bare Worker,
no Next/OpenNext). Same runtime as the `workers`/`cron` slots.

**Next steps** (not built yet): add **Hono** — `src/index.ts` becomes a Hono app (`app.get("/v1/...")`
reading Sanity via `@indiecrafts/packages-web-sanity`, guarded by `@indiecrafts/packages-shared-security` `withGuard` + a bearer/JWT check);
version routes (`/v1`); CORS-allowlist the mobile/hybrid origins. Compose
`@indiecrafts/packages-shared-config`/`logger`/`security`/`sanity`/`schema` (add `@types/node` — see the `workers` brief's
isomorphic-types caveat).

- **Deploy:** `pnpm deploy:api:<dev|staging|prod>` → the shared `shared/scripts/deploy/worker.mjs` (rename guard +
  `wrangler deploy`); or `pnpm deploy:all:<env>`. Bind KV/D1/queues via `shared/scripts/infra/bindings.mjs`.
- **Registry:** a row in [`scripts/lib/apps.mjs`](../../../shared/scripts/lib/apps.mjs); full deploy model →
  [`code/docs/shared/architecture/platform-deploy.md`](../../../docs/shared/architecture/platform-deploy.md).

**Rules:** compose bricks; **no cross-app imports**; auth every mutating route; never expose a write token.
