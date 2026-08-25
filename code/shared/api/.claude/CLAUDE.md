# @indiecrafts/shared-api — standalone API (worker-cf)

Auto-loads under `code/shared/api/**`. A **dedicated JSON/GraphQL API** for the non-web clients (`mobile`,
`hybrid`, partners). The web app keeps its own co-located `/api` routes; this is the shared, versioned API
those clients call — its own domain, its own deploy. **Activated bare-Worker scaffold — `/health` + the
audit + session sink (`POST /v1/events` → EU D1, `GET /v1/sessions`)**, bearer-gated by `APP_API_TOKEN` +
CORS allowlist + the native rate-limit binding; `withGuard` is Next-only, so the guard is inline. More
routes TBD. (The AI agent moved to its own [`code/shared/agent`](../agent/.claude/CLAUDE.md) Worker.)
Owns **two EU D1s** (both `--location weur`): **`DB`** (`audit` — the append-only firehose:
`session_events`, `security_events`, `admin_audit`, `csp_reports`, `backup_runs`) and **`CORE_DB`**
(`core` — identity/rights/settings: `user_profiles`, `consent_events`, `data_requests`,
`erasure_requests`, `export_requests`, `site_settings`). Split so a firehose write-spike or migration
can't threaten identity data; `cron` holds both bindings too (retention + settings/SLA/export
bookkeeping). `PUT /v1/settings` writes `site_settings` on `CORE_DB` (primary) then an `admin_audit`
row on `DB` (best-effort, no longer one atomic batch) — see
[Admin settings](../../../docs/apps/web/config/settings.md).
`POST /v1/clerk-webhook` also keeps `user_profiles` in sync with Clerk (source of truth for email):
upsert + re-fingerprint on `user.created`/`user.updated`, pseudonymise on `user.deleted`. Secrets:
`APP_API_TOKEN` · `IP_HASH_SALT` · `CLERK_WEBHOOK_SECRET` · `GDPR_FINGERPRINT_SALT` (email fingerprint
salt, identical across envs — see `wrangler.toml`). `POST /v1/events` also accepts `kind:csp-report` →
the `csp_reports` D1 table (aggregated CSP violation reports, Report-Only pipeline; 30-day `cron` purge).
`GET /v1/csp-reports` reads it back (bearer-gated, same shape as `GET /v1/security`) for the admin CSP
dashboard. `src/erasure/` holds the store-agnostic erasure
adapters — `core` D1 + `audit` D1 (real, split by table; the audit adapter takes a read-only handle to
`core` to resolve `user_id`) + Clerk/Sanity/orders (dependency-injected) — implementing
`@indiecrafts/packages-shared-compliance` `ErasureAdapter`, run by its `runErasure`/`runExport`
orchestrator. The `/v1/erasure` routes are live: `GET/POST /v1/erasure/request` (Turnstile-gated,
anti-enumeration), `GET/POST /v1/erasure/confirm` (token + typed-email fingerprint + TTL + attempt
cap → runs the engine live), `GET /v1/erasure/status/:token` (public, no-PII status), and
`POST /v1/erasure/self` (authenticated self-service; Clerk-JWT + typed-email gate → runs the
engine directly, no email round-trip — the signed-in surfaces' account-delete control will call it).
`WEBSITE_URL` (`[vars]`) sets the confirm-link origin the token email points at; unset falls back to
the worker's own origin. The two erasure emails (`src/erasure/email.ts`) read their copy from the
Studio-editable `emailStrings` singleton (`erasureToken`/`erasureComplete` groups) over raw GROQ-HTTP
(mirrors `fetchAnnouncementDocs`, same Sanity `[vars]`/secret, no new deps), with a per-field fallback
to hard-coded English — a missing/unreachable Sanity, or a group's `enabled: false`, never stops the
send. `POST /v1/export` (authenticated; Clerk-JWT) runs `runExport`, stores the
bundle in the `EXPORT_BUCKET` R2 bucket, and returns a single-use 1-hour download link; `GET
/v1/export/download?token=` streams the bundle and deletes it from R2 on first download. Secret/
binding: `EXPORT_BUCKET` (`[[r2_buckets]]`, operator-provisioned — routes answer 503 until bound).
**DSAR intake** — `src/data-request/route.ts` holds the GDPR request-form write + read, migrated off
Sanity: `POST /v1/data-request` (bearer-gated; the website's `/api/data-request` route proxies here)
inserts into the `data_requests` table (`core` D1, migration 0006), and `GET /v1/data-requests` (bearer-gated)
lists rows newest-first for the admin screen. A deliberate departure from this D1's minimization
convention: `data_requests` stores a plaintext `email` + free-text `message` (operational PII the
operator needs to action the request).

**Framework:** Cloudflare Workers · wrangler · TypeScript. **Platform class:** `worker-cf` (a bare Worker,
no Next/OpenNext). Same runtime as the `workers`/`cron` slots.

**Next steps** (not built yet): add **Hono** — `src/index.ts` becomes a Hono app (`app.get("/v1/...")`
reading Sanity via `@indiecrafts/packages-web-sanity`, guarded by `@indiecrafts/packages-shared-security` `withGuard` + a bearer/JWT check);
version routes (`/v1`); CORS-allowlist the mobile/hybrid origins. Compose
`@indiecrafts/packages-shared-config`/`logger`/`security`/`sanity`/`schema` (add `@types/node` — see the `workers` brief's
isomorphic-types caveat).

- **Deploy:** `pnpm deploy:shared:api:<dev|staging|prod>` → the shared `shared/scripts/deploy/worker.mjs` (rename guard +
  `wrangler deploy`); or `pnpm deploy:all:<env>`. Bind KV/D1/queues via `shared/scripts/infra/bindings.mjs`.
- **Registry:** a row in [`scripts/lib/apps.mjs`](../../../shared/scripts/lib/apps.mjs); full deploy model →
  [`code/docs/shared/architecture/platform-deploy.md`](../../../docs/shared/architecture/platform-deploy.md).

**Rules:** compose bricks; **no cross-app imports**; auth every mutating route; never expose a write token.
