# `@indiecrafts/shared-api` — standalone API (worker-cf)

Auto-loads under `code/shared/api/**`. The shared, versioned HTTP JSON API that the web surfaces' servers and
partners call — its own domain, its own deploy. A bare Cloudflare Worker (no Next/OpenNext): `withGuard` is
Next-only, so the guard is inline — bearer, CORS allowlist, and the native `RATELIMIT` binding on every
bearer route. The website keeps its own co-located `/api` routes.

**Routes, bindings, secrets, invariants → [`code/docs/shared/api/index.md`](../../../docs/shared/api/index.md).**
Update that page in the same change as a route.

## Map

- `src/index.ts` — the router (`route`): one `if (url.pathname === …)` block per route. The default `fetch`
  wraps it: request id → `src/idempotency.ts` (events, export) → top-level catch → `finalize` (`src/http.ts`:
  error envelope, 429 hints, timeouts for outbound calls).
- `src/consent/` — marketing opt-in, per-category email preferences (Sanity `emailPreferences`, never-throws),
  legal re-acceptance. `src/resend-audience.ts` mirrors every decision to Resend (Contacts + Topics).
- `src/erasure/` — store-agnostic adapters (`d1` core + audit · `clerk` · `sanity` · `orders`) for the
  `@indiecrafts/packages-shared-compliance` `runErasure` / `runExport` engine; `email.ts` for its two emails.
- `src/export/` — `POST /v1/export` → R2 `EXPORT_BUCKET` → single-use download link.
- `src/data-request/` — DSAR intake, admin list + detail, status moves with history
  (`data_requests`, `data_request_events`, `MAIN_DB`); `email.ts` for the receipt + closing emails.
- `src/clerk-email/` — Clerk auth-email take-over; `src/security/` — incident alert email.
- `src/auth/` — Clerk-JWT verification + the step-up `sensitive-action` gate.
- `db/{main,audit}/migrations/` — the two EU D1s this worker owns; `db/kv/` — the KV namespaces.

## Production-ready contract (every route)

A route ships only when it meets all five (checklist: QA card 20, `f20-7`):

- **Duplicates are safe** — a retried mutation changes nothing twice: idempotent by key (`ON CONFLICT` /
  `INSERT OR IGNORE`, Svix id) or an `Idempotency-Key` mapped to the stored result (TTL 24 h).
- **Rate limits say when to retry** — a `429` carries `Retry-After` (+ remaining/reset headers); the
  limits are written in the api docs page.
- **`/v1` is a contract** — a breaking change is a new version with a documented deprecation window,
  never a silent behaviour change under the same path.
- **Every outbound call has a timeout** shorter than the caller's (`AbortSignal.timeout`); retry only
  timeouts and 5xx, with backoff + jitter — never a 4xx.
- **Errors are actionable** — `{ error: "<code>", message, requestId }` (the `cf-ray` id), and the
  status tells the client whether to retry (5xx/429/503) or fix the request (4xx).

## Rules

- **Two D1s, both EU** (`--location weur`): `AUDIT_DB` (`audit` — append-only firehose) and `MAIN_DB`
  (`main` — identity, rights, settings). Split so a firehose spike can never threaten identity data;
  `cron` binds both. A new table goes in the D1 its data belongs to.
- **One bearer:** `APP_API_TOKEN` — first-party servers only, never bundled into a client. User-scoped
  routes take a Clerk JWT; destructive ones (`erasure/self`, `export`) add step-up reverification.
- **Never throw on Sanity reads** — every GROQ-HTTP read falls back (seeded category, English copy).
- **The Clerk delete is required on erasure** — failure is `502 {clerk_failed:true}`, never a false "complete".
- **`GDPR_FINGERPRINT_SALT` is distinct per env and never rotated** — rotating orphans every email lookup.
- **Never edit a merged migration** — add a new numbered one.
- **Deploy:** `pnpm deploy:shared:api:<dev|staging|prod>` (rename guard + migrations + `wrangler deploy`).
  Bind KV/D1/queues via `shared/scripts/infra/bindings.mjs`; registry row in
  [`scripts/lib/apps.mjs`](../../../shared/scripts/lib/apps.mjs).
- Compose bricks; **no cross-app imports**; auth every mutating route; never expose a write token.
