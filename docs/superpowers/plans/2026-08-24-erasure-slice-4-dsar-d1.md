# Roadmap Slice 4: DSAR intake Sanity → D1

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Move the GDPR data-subject-request (DSAR) intake off Sanity into a D1 `data_requests` table, give operators a read-only admin screen, and mark the Sanity `dataRequest` schema deprecated — without changing the public form, its trust boundary, or the owner-alert email.

**Architecture (locked from the map + rulings):** The website `/api/data-request` route + `withGuard` (Turnstile/rate-limit/origin/body-cap) + `validate.ts` + `notifyOwner()` email all stay EXACTLY as they are. Only `submitDataRequest`'s persistence changes: instead of `writeClient.create({_type:"dataRequest"})` it does a bearer-authed POST to a new `POST /v1/data-request` on the api worker (mirroring `logConsent`→`/v1/events`), which writes the `data_requests` D1 row. A new bearer-gated `GET /v1/data-requests` + an admin screen (mirroring `/v1/sessions`) restore operator visibility. The Sanity schema stays registered but visibly deprecated.

**Tech Stack:** Cloudflare Workers + D1 · Next (website + admin) · `@cloudflare/vitest-pool-workers`. **Map (exact paths/lines):** `.superpowers/sdd/slice-4-dsar-map.md`. **Mirror:** `/v1/events` (bearer write) + `/v1/sessions` (bearer read) in `code/shared/api/src/index.ts`; `logConsent` (`code/packages/web/compliance/src/consent-log.ts`); the admin `sessions/page.tsx`.

## Global Constraints

- **The public surface does NOT change:** the form, the page, `/api/data-request` (withGuard), `validate.ts`, and `notifyOwner()` (website Resend, Studio-editable copy) are untouched. Only `submit.ts`'s write target moves. No email regression.
- **Data-minimization departure (called out):** `data_requests` stores a plaintext replyable `email` + up to 4000 chars of free-text `message` — short-lived operational PII the operator needs to action the request (exactly as the Sanity doc does today). The migration's SQL comment MUST state this departure explicitly (mirror `0001_init.sql`'s minimization header). Do NOT log email/message (only `error.name`, like every other route).
- **Bearer-gated, not public:** `POST /v1/data-request` + `GET /v1/data-requests` are `APP_API_TOKEN` bearer-gated server-to-server routes (the website server + admin call them) — NOT public like `/v1/erasure/request`. The public Turnstile boundary stays at the website edge (`withGuard`).
- Commit `--no-verify`; stage only named files; prettier; config-first; writing-style. Rulings: S4-WRITE (proxy via worker, keep website email), S4-ADMIN (read-only screen now, status write-back deferred), S4-SCHEMA (keep-deprecated).

---

### Task 1: Worker — `data_requests` table + POST/GET routes

**Files:** migration `code/shared/api/db/d1/migrations/0007_data_requests.sql`; `code/shared/api/src/data-request/route.ts` (+ `route.test.ts`); modify `code/shared/api/src/index.ts` (dispatch) + api `CHANGELOG.md` + `.claude/CLAUDE.md` + `code/docs/apps/web/config/data-retention.md`.

- [ ] **Step 1: Migration** `0007_data_requests.sql` (forward-only) with a header comment explaining the deliberate PII departure (plaintext email + free-text message = operational PII, unlike the minimized audit tables): `id INTEGER PRIMARY KEY AUTOINCREMENT, request_type TEXT NOT NULL, email TEXT NOT NULL, message TEXT, status TEXT NOT NULL DEFAULT 'new', submitted_at TEXT NOT NULL, source TEXT, locale TEXT, policy_version TEXT` + `CREATE INDEX idx_data_requests_status ON data_requests (status, submitted_at);`.
- [ ] **Step 2: Failing tests** (`route.test.ts`, mirror the `/v1/events` + `/v1/sessions` test style — bearer `APP_API_TOKEN:"test-token"`, real D1): (a) `POST /v1/data-request` with bearer + a valid body → 201 + a row inserted (assert fields); (b) no/wrong bearer → 401; (c) an off-list `requestType` → 400 (server-side defense); (d) `!env.DB` → 503; (e) `GET /v1/data-requests` with bearer → the rows newest-first, clamped limit, projection includes email+message+status; (f) GET no bearer → 401.
- [ ] **Step 3: Implement `route.ts`** — `handleDataRequestWrite(request, env)` (POST): OPTIONS→204; non-POST→405; bearer check via `safeEqual(bearer, env.APP_API_TOKEN)` (import `safeEqual`/`clientIp` from `../index`)→401; `!env.DB`→503; body cap; parse JSON `{ requestType, email, message?, source?, language?, policyVersion?, submittedAt? }`; validate `requestType` ∈ the 7-value set (hard-code the set OR import `DATA_REQUEST_TYPES` — it's client-safe, no server-only; prefer importing to avoid drift) + non-empty email → else 400; INSERT with `submitted_at = submittedAt ?? now`, `status='new'`, slicing message≤4000/source≤300/policy≤120; 201 `{ok:true}`. Log only `error.name`. `handleDataRequestList(request, env)` (GET): bearer→401; `!env.DB`→503; clamped `limit` (`Math.max(1, Math.min(Number(?)||50, 200))`); `SELECT id, request_type, email, message, status, submitted_at, source, locale FROM data_requests ORDER BY submitted_at DESC LIMIT ?`; `{ data: results }`.
- [ ] **Step 4: Dispatch in `index.ts`** — `if (url.pathname === "/v1/data-request") return handleDataRequestWrite(request, env);` and `if (url.pathname === "/v1/data-requests") return handleDataRequestList(request, env);` (distinct paths, no shadowing). Import both.
- [ ] **Step 5: Verify + docs + commit.** api `test` (all green + new) + `tsc` 0. api CHANGELOG + brief (the two routes + `data_requests`); data-retention.md (DSARs now in D1, the PII-departure note, the retention duty for `data_requests`). Prettier. Commit `--no-verify` (`feat(compliance): data_requests D1 table + POST/GET /v1/data-request(s)`).

---

### Task 2: Website — `submitDataRequest` writes to the worker (keep the email)

**Files:** modify `code/packages/web/compliance/src/requests/submit.ts` (+ its test if present) — swap the Sanity write for a worker POST; KEEP `notifyOwner()`.

- [ ] **Step 1:** In `submit.ts`, replace the `writeClient.create({ _type: "dataRequest", ... })` call with a bearer-authed POST to the worker, mirroring `logConsent` (`code/packages/web/compliance/src/consent-log.ts`): read `process.env.API_URL` + `process.env.APP_API_TOKEN` (server-only); `await fetch(\`${url}/v1/data-request\`, { method:"POST", headers:{ "content-type":"application/json", authorization:\`Bearer ${token}\` }, body: JSON.stringify({ requestType, email, message, source, language, policyVersion, submittedAt }) })`. On a non-2xx or a thrown error → return `{ ok: false, error: "server" }`(log only`error.name`/status, never the body — it carries PII). On success → keep the existing `await notifyOwner(...)`(UNCHANGED — website Resend, Studio-editable copy), then return`{ ok: true }`. Remove the now-unused `writeClient`/`isLocale`/`localeCodes`imports if they become dead. If`API_URL`/`APP_API_TOKEN`are unset, return`{ ok:false, error:"server" }` (fail-safe — the route already maps that to 500).
- [ ] **Step 2:** Update/keep `submit.ts`'s test (if one exists — check `code/packages/web/compliance/src/requests/`): assert it POSTs to `${API_URL}/v1/data-request` with the bearer + shaped body (stub `fetch`), still calls `notifyOwner` on success, and never throws. If no test exists, add a small colocated one (the package runs vitest).
- [ ] **Step 3: Verify + commit.** `pnpm --filter @indiecrafts/packages-web-compliance test` (+ the website `tsc` to confirm the route still type-checks) green. Prettier. Commit `--no-verify` (`feat(compliance): DSAR intake writes to the api worker (D1), not Sanity`). Note in the commit: the public form/route/Turnstile/validation/owner-email are unchanged.

---

### Task 3: Admin — read-only `/data-requests` screen

**Files:** `code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/data-requests/page.tsx` + a `data-requests-table.tsx` sibling; admin nav/i18n as the sessions/security screens have them; admin `CHANGELOG.md`.

- [ ] **Step 1:** Mirror `code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/sessions/page.tsx` + its `sessions-table.tsx`: a server component reading `${process.env.API_URL}/v1/data-requests` with `Bearer ${process.env.APP_API_TOKEN}`, `cache:"no-store"`, rendering a `<DataRequestsTable rows={rows}>` (columns: submitted_at, request_type, email, status, message-excerpt, locale/source). Read-only. Add the nav entry the way sessions/security are added (check the dashboard layout/nav). Note in a code comment + the admin CHANGELOG that `status` write-back is a deferred follow-up — for now flip it via `wrangler d1 execute ... UPDATE data_requests SET status=... WHERE id=...`.
- [ ] **Step 2: Verify + commit.** `pnpm --filter @indiecrafts/web-surfaces-admin tsc` (exit 0) + admin test if any. Prettier. Commit `--no-verify` (`feat(compliance): admin data-requests screen (read-only)`).

---

### Task 4: Deprecate the Sanity `dataRequest` schema + docs

**Files:** modify `code/packages/web/compliance/src/sanity/data-request.ts` (title prefix + description note); `code/docs/apps/web/config/data-retention.md` (finalize the DSAR-in-D1 record); `code/packages/CHANGELOG.md` IF clean (else note — it's been dirty; skip if so).

- [ ] **Step 1:** In `data-request.ts`, prepend `"[Déprécié] "` to the document `title` and add a type-level `description` (French) telling operators DSARs now land in D1 + the admin "Data requests" screen; keep all fields + all 5 Studio wires intact (existing/in-flight docs stay readable). Do NOT unregister it.
- [ ] **Step 2:** Update `data-retention.md`'s "Erasure (Art. 17)"/DSAR section: the `dataRequest` flow now writes the `data_requests` D1 table (via `POST /v1/data-request`), viewable in the admin Data-requests screen; the Sanity schema is deprecated (kept one cycle for history); note the `data_requests` retention duty (operational PII — purge after the request is `done` + a retention window; a cron purge is a future follow-up).
- [ ] **Step 3: Verify + commit.** `pnpm --filter @indiecrafts/packages-web-compliance tsc`-adjacent (the schema is TS — the website `tsc` covers it via the Studio config) exit 0. Prettier. Commit `--no-verify` (`docs(compliance): deprecate the Sanity dataRequest schema; DSARs now in D1`). Guard: if `code/packages/CHANGELOG.md` is pre-existing dirty, do NOT touch it (note in the report).

---

## Self-review

- Coverage: D1 table + write/read routes (T1), website write-swap keeping email+boundary (T2), admin visibility (T3), schema deprecation + docs (T4). Matches the 3 locked forks + the email-stays-on-website refinement.
- No public-surface change (form/route/Turnstile/validation/owner-email untouched) → no regression + smallest diff.
- Deferred (documented): admin `status` write-back (new mutating-UI ground); a `data_requests` cron purge (operational-PII retention); the eventual schema removal (once no open docs remain); a one-time backfill of existing Sanity `dataRequest` docs → D1 (not built — keep-deprecated keeps them readable).
- **Ruling S4-EMAIL:** the owner-alert email stays on the website (`notifyOwner` in submit.ts, unchanged) — only the D1 write proxies to the worker. Avoids the worker-email complexity + the Studio-editable-copy regression the map's §4 flagged. Cost if wrong: move the email to the worker later.
- **Ruling S4-BEARER:** the two new routes are `APP_API_TOKEN` bearer-gated server-to-server (website + admin callers), not public — the public Turnstile/rate-limit boundary stays at the website edge via `withGuard`.
