# API production-readiness (QA card 20, f20-7) — design

**Status:** approved in chat 2026-09-30 ("Approved — spec, plan, build").
**Why:** card 20's re-verification found the api meets its routing/auth contract but fails four of the
five production-readiness checks (Medium, "5 things I check before calling an API production-ready"),
the admin shows too little of the api's health, and `pnpm dev` runs the Workers against the real dev
D1 while the brief calls it "the local stack". The api brief now states the five rules
(`code/shared/api/.claude/CLAUDE.md`, "Production-ready contract"); this makes the code meet them.

**Success:** every item below has a test that failed first; `pnpm verify` + `pnpm docs:build` green;
card 20 fully ticked except what needs the user's hands (listed at the end).

## 1. Health + admin status

- `GET /health` without a bearer stays `{ ok: true }` (public uptime probe, no detail).
- With the bearer: `{ ok, version, commit, db: { audit, main }, bindings: { kv, exportBucket, cron,
rateLimit } }`. `db.*` = `"ok" | "error" | "unbound"` (`SELECT 1` each). `bindings.*` = `"bound" |
"unbound"`. `ok` is false when a bound D1 errors.
- `version`/`commit` come from `env.BUILD_VERSION` / `env.BUILD_COMMIT`; absent → `"dev"`.
  `code/shared/scripts/deploy/worker.mjs` passes them on `wrangler deploy` (`--var BUILD_VERSION:<package
version> --var BUILD_COMMIT:<git short sha>`), for every worker it deploys.
- Admin **System**: the workers table gains version + commit for the api; the Databases card lists
  `audit (D1)` and `main (D1)` from `db.*`; a Bindings line lists the four bindings. en + fr copy.

## 2. Rate limits that say when to retry

- Cloudflare's native limiter only returns allowed/denied (20 requests / 60 s per namespace), so no
  "remaining" count exists to report. Every `429 rate_limited` gets `Retry-After: 60` and
  `RateLimit-Policy: 20;w=60` (IETF draft field). `429 too_many_attempts` (the erasure-confirm attempt
  cap — permanent for that link) gets neither.
- The limits (bearer routes, public routes, the attempt cap) are written on the api docs page.

## 3. Actionable errors

- A single post-processor in the api's `fetch` (`src/http.ts`, `finalize(response, requestId)`) — not a
  rewrite of the 11 local `json()` helpers (they only build `{ error }`; one exit point is a smaller,
  safer diff with the same contract):
  - every response gets `X-Request-Id`;
  - every JSON error body (`status >= 400` with an `error` string) gains `message` (a short English
    developer message from a code → message map, generic fallback) and `requestId`;
  - `429 rate_limited` gains the headers from §2.
- `requestId` = the `cf-ray` request header, else `crypto.randomUUID()` (local dev). Error logs carry it.
- A top-level catch turns an uncaught throw into `500 { error: "internal", message, requestId }`
  (logged with the id). A D1 `no such table` / `no such column` becomes `503 { error: "schema_behind",
message: "The database is missing migrations — run the db:migrate script for this env." }`.
- Additive: every caller reads `.error`, which is unchanged.

## 4. Timeouts on every outbound call

- `src/http.ts` exports `fetchWithTimeout(input, init, ms = 5000)` (`AbortSignal.timeout`) and
  `withTimeout(promise, ms = 5000, label)` (for SDK calls that take no signal).
- Wrapped: Resend (`erasure/email.ts`, the api's other `fetch` sends), Sanity GROQ/mutate
  (`erasure/sanity-client.ts`, `erasure/request.ts`), Turnstile verify, Clerk SDK calls
  (`erasure/clerk-client.ts`, `erasure/admin.ts`, `auth/clerk-jwt.ts` `verifyToken`). A timeout is a
  normal failure of that call (existing error paths apply: fail closed / 502 / 503 as today).
- The api does not add retries of its own (its callers retry — §5); a timeout is an error, never hangs.

## 5. Safe retries: Idempotency-Key + a shared client

**Server (api).** Optional `Idempotency-Key` header on `POST /v1/events` and `POST /v1/export`:

- Table `idempotency_keys` in `AUDIT_DB` (migration `db/audit/migrations/0005_idempotency_keys.sql`):
  `scope TEXT, key TEXT, request_hash TEXT, status INTEGER NULL, body TEXT, created_at TEXT,
PRIMARY KEY (scope, key)`. `scope` = route + caller (`bearer` for the server token, the Clerk user id
  for JWT routes).
- Flow: invalid key (empty, > 255 chars, non-printable) → `400 invalid_idempotency_key`. Reserve the
  row (`INSERT OR IGNORE`, status NULL). Existing row: same hash + stored status → replay the stored
  status + body (+ `Idempotent-Replayed: true`); same hash + NULL status → `409 idempotency_in_progress`;
  different hash → `422 idempotency_key_reused`. After the handler: 2xx/4xx → store; 5xx/429 → delete
  the reservation so a retry re-runs.
- The cron's `audit_purge` deletes `idempotency_keys` older than 24 h (fixed, not a setting).

**Client.** `@indiecrafts/packages-shared-utils/api-fetch` — `apiFetch(url, init)`: 10 s timeout, one
retry on a network error / timeout / 5xx / 429 (waits `Retry-After` when ≤ 5 s, else 300–800 ms
jittered backoff), never on other 4xx; a POST gets an `Idempotency-Key` (`crypto.randomUUID()`) kept
across the retry. Callers moved to it: the admin's api calls (`lib/audit.ts`, `lib/monitoring.ts`,
`monitoring-actions.ts`, `actions.ts`) and the append senders (`web/auth/session-log.ts`,
`web/compliance/consent-log.ts`, `web/security-reports/forward.ts`,
`shared/compliance/shared/export-self.ts`). Other read callers keep plain `fetch` (a follow-up).

## 6. `/v1` versioning policy

New page `code/docs/shared/api/versioning.md` (+ sidebar): additive changes (new route, new optional
field, new error code) stay in `/v1`; anything that breaks a caller (removed/renamed field or route,
changed meaning, stricter validation) ships as `/v2` alongside `/v1` for ≥ 90 days; the old route
answers with `Deprecation` (RFC 9745) + `Sunset` (RFC 8594) headers and a `Link` to the docs; every
change is logged in the api changelog. The api brief links it.

## 7. `pnpm dev` runs locally

- `code/shared/{api,cron,workers}` `dev` → `wrangler dev --env dev --port … --inspector-port …
--persist-to ../../../.wrangler/state` (one shared local D1/KV/R2 state, so the cron sees the api's
  data; `.wrangler/` is gitignored); the cron keeps `--test-scheduled`. Each gains `dev:remote` (today's
  `--remote` command). Root `dev:remote` runs the three remote.
- Root `db:migrate:local` (`code/shared/scripts/data/migrate-local.mjs`): applies the api's audit + main
  migrations `--local --persist-to .wrangler/state`; `dev:setup` runs it.
- Root `CLAUDE.md`, the workers docs page and the api/cron briefs say local by default, `dev:remote`
  for the real dev bindings.

## Out of scope

- Retries inside the api; moving the remaining read-only callers to `apiFetch`.
- A migrations-behind indicator on the admin (the `503 schema_behind` error covers it).
- Applying the two pending migrations to the real dev D1 (a write to shared data — the user runs it).

## Testing

TDD per item: api vitest (workerd) for health, `finalize`, 429 headers, idempotency (replay, 409, 422,
5xx not stored), timeouts (a never-resolving fetch mock aborts), schema_behind; cron test for the 24 h
purge; utils vitest for `apiFetch`; admin vitest for the System page data + callers; node:test for
`migrate-local.mjs` and the deploy `--var` args; a local end-to-end run (`pnpm dev`-equivalent) with curl.

## Manual checks left to the user

1. `pnpm db:migrate:all:dev` — the real dev D1 is missing `0004_cron_runs` + `0012_erasure_breach_flagged`
   (and gets `0005_idempotency_keys`).
2. Admin → System (after the Clerk role claim) shows the api version, both D1s and the bindings.
