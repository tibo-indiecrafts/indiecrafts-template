# §07 Security / GDPR hardening — design

**Date:** 2026-09-04
**Status:** approved design → implementation plan
**Scope:** `code/shared/api` (erasure engine wiring, webhook, self-service auth, tests) ·
`code/packages/shared/compliance` + web `AccountDeletePanel` (step-up) ·
`code/shared/cron` (retention tests) · `code/shared/scripts/infra` + docs (salt guidance).

## Problem

A careful §07 audit (two specialized reviewers) confirmed the good patterns hold
(parameterized SQL, constant-time compares, fail-closed preflights, guard enforcement,
inert edge config) but found six items where the ledger status was too generous or a real
gap exists:

1. **HIGH — out-of-band Clerk delete does only a partial erasure.** The `POST
/v1/clerk-webhook` `user.deleted` handler (`api/src/index.ts:923-933`) only pseudonymizes
   `user_profiles`; it does NOT run the 5-adapter `runErasure` engine, leaving
   `session_events`, `security_events`, Sanity author/comment docs (and future orders)
   untouched — a real right-to-be-forgotten hole for the dashboard-deletion path.
2. **MED — no step-up reverification on self-service erasure anywhere.** `self.ts` checks
   only a Clerk session JWT + a typed-email match; the `beforeConfirm` seam on
   `DeleteAccountSection` is unused. The code carries an `@debt SECURITY` comment admitting it.
3. **MED — identical GDPR fingerprint salt across dev/staging/prod.** `gdpr-salt.mjs:11` +
   `wrangler.toml` + the api brief enshrine "identical across envs." Within-env stability is
   required; cross-env identity is not, and it makes lower-trust dev a correlation vector into
   prod's pseudonymized identities.
4. **LOW — `POST /v1/events` (the audit/session sink) has an auth gate but no
   anon-rejection test.** No unified `/v1` auth-contract test exists.
5. **LOW — 4 of 7 retention tables lack a purge integration test.** `consent_events`,
   `admin_audit`, `session_events`, `security_events` have no seeded-row test in
   `cron/src/index.test.ts` (only `csp_reports`/`data_requests`/`erasure_requests` do).
6. **NUANCE — "orders → notApplicable" wording.** The orders adapter is a no-op stub; there
   is no `notApplicable` type in the code. A ledger/comment wording fix, not code.

## Non-goals

- **No real orders erasure** — orders stays a registered no-op stub (no orders D1 exists);
  only the wording is corrected.
- **No mobile step-up modal** — `@clerk/clerk-expo` exposes no `useReverification`; a
  stale-`fva` mobile user's remedy is sign-out/sign-in, documented (see Fix 2).
- **No salt data migration** — the template ships the salt unset (set per-client at launch),
  so Fix 3 is a guidance change only.

## Design

### Fix 1 — Clerk `user.deleted` → the full erasure engine

**Consolidate the adapter factory.** `defaultAdapters(env)` is duplicated verbatim in
`confirm.ts` and `self.ts`. Extract one factory to a new
`code/shared/api/src/erasure/adapters.ts`:

```ts
export function buildErasureAdapters(
  env: Env,
  opts?: { includeClerk?: boolean },
): ErasureAdapter[];
```

- Always includes `d1-core`, `d1-audit`, `orders`.
- Includes `clerk` iff `opts.includeClerk !== false` **and** `env.CLERK_SECRET_KEY` is set.
- Includes `sanity` iff `env.SANITY_API_WRITE_TOKEN && env.SANITY_PROJECT_ID &&
env.SANITY_DATASET` are all set (so it never constructs a broken Sanity client).

`confirm.ts` and `self.ts` call it with the default (`includeClerk: true`) — behavior is
unchanged because they already 503-preflight when the Clerk/Sanity secrets are absent, so the
conditional includes always resolve to all five for them.

**Webhook path.** In the `user.deleted` branch (`index.ts`), replace the partial `UPDATE
user_profiles` with:

1. `SELECT email, email_fingerprint FROM user_profiles WHERE user_id = ?`. Clerk's
   `user.deleted` payload carries no email; the stored `email_fingerprint` is the erasure key
   and survives pseudonymization. If there is no row or no fingerprint, keep the current
   partial `UPDATE` (nothing to key the engine on) and return 200.
2. Run `runErasure(buildErasureAdapters(env, { includeClerk: false }), email, { mode: "erase",
dryRun: true, ts, fingerprint })` then the live pass (dry-run-then-live, mirroring
   `confirm.ts`/`self.ts`). The engine's `d1-core` adapter performs the `user_profiles`
   pseudonymize (replacing the removed partial UPDATE), `d1-audit` clears the audit rows,
   `sanity` pseudonymizes docs. The `clerk` adapter is excluded (the user is already gone).
3. Write an `erasure_requests` proof row (status `completed`/`confirmed`) + an `admin_audit`
   `erasure.clerk_deleted` row (mirroring `self.ts`'s bookkeeping). **No completion email** —
   the subject is deleted.
4. The engine never throws; per-adapter failures land in `receipt.errors` (logged). Return
   200 regardless (a webhook 503 would make Clerk retry a partial that won't improve). Retries
   are idempotent — pseudonymize + delete are idempotent, keyed on the stable fingerprint.

### Fix 2 — Step-up reverification (client modal + server `fva`)

**Server (`self.ts`).** After `verifyToken` resolves the claims, read the **`fva`** claim
(factor-verification-age; Clerk emits `[firstFactorAgeMinutes, secondFactorAgeMinutes]`, with
`-1` for a factor not applicable). Require `fva[0]` present and `0 <= fva[0] <=
REVERIFY_WINDOW_MIN` (a new constant, `REVERIFY_WINDOW_MIN = 10`). If the claim is absent or
stale, return a **reverification-required** response before the engine runs. This makes a raw
API call unable to bypass step-up. `defaultAuthenticate` is extended to surface `fva` (e.g.
return `{ userId, email, fvaMinutes }` or a distinct `reverificationRequired` signal); the
handler maps it to the response.

**Critical contract (from the app panel's own `@debt` comment):** `useReverification` fires
its modal **only** when the wrapped call surfaces a `session_reverification_required` error —
"the erasure worker doesn't emit that error, so wrapping it would resolve immediately without
real re-auth." So the server response must match **Clerk's reverification-error shape**, not a
plain `{ error: "reverification_required" }` 403. The verify-first task determines the exact
shape (likely `@clerk/backend`'s `reverificationError()` helper / a specific
status + body Clerk's client recognizes); the client half is only correct once the server emits
that recognized signal. This interdependence is why Fix 2 is built server-first, contract-verified,
then client.

**Client — all self-service surfaces.** The self-service delete (→ `POST /v1/erasure/self`)
is mounted on **four** surfaces (admin has none): `website` + `app`
(`AccountDeletePanel.tsx`, `@clerk/nextjs`), `hybrid` (`renderer/src/auth.tsx`,
`@clerk/clerk-react`), and `mobile` (`app/account.tsx`, `@clerk/clerk-expo`). The web
`DeleteAccountSection` (used by website + app + hybrid) already exposes
`beforeConfirm?: () => Promise<boolean>`. Wire it to Clerk's `useReverification` on **all
three web-runtime surfaces** (website, app, hybrid — every one's Clerk SDK exposes
`useReverification`): each panel passes a `beforeConfirm` that runs reverification, showing the
re-auth modal, then proceeds to the erasure POST. Each surface's `@debt SECURITY` comment (all
three carry one) is replaced with the real wiring. NOTE: the app panel's existing comment
already hints the mechanism ("`useReverification` only triggers on a
`session_reverification_required` error from the wrapped call") — the verify-first task below
confirms the exact trigger contract per SDK.

**Verify-first (build-time).** The exact contract between a custom Worker 403 and
`useReverification` / the `fva` claim shape is version-specific (`@clerk/backend@3.16.7`,
`@clerk/nextjs`, `@clerk/clerk-react`). The plan's FIRST Fix-2 task confirms: (a) the `fva`
claim name/shape in the verified token, and (b) how `useReverification` detects the
reverification requirement — before the client half is built.

**Mobile.** The server enforces `fva` uniformly. `clerk-expo` has no `useReverification`, so a
stale-`fva` mobile user cannot show a modal — their remedy is sign-out/sign-in (which refreshes
`fva`), then delete. Update the `@debt SECURITY` comment in mobile's `account.tsx` to state
this documented limitation (step-up is now server-enforced; mobile re-logs-in rather than
re-verifies inline).

### Fix 3 — Distinct GDPR salt per environment (guidance only)

No code enforces the shared salt. Change the guidance in three places:

- `gdpr-salt.mjs:11` — "Rule: ONE salt per purpose, IDENTICAL across all envs" → "Rule: a
  DISTINCT, independently-generated salt per environment; STABLE within an env (rotating it
  breaks every email-keyed erasure/consent lookup); never committed." Update the usage note so
  `gdpr:salt:set:<env>` generates a separate value per env (do not paste the same value).
- `code/shared/api/wrangler.toml` — the `GDPR_FINGERPRINT_SALT` comment ("identical across
  envs") → the per-env rule.
- `code/shared/api/.claude/CLAUDE.md` — the "identical across envs — see wrangler.toml"
  clause.
- Any gdpr/salt doc under `code/docs` that repeats the shared-salt rule.

No migration, no code change (the `generate` command already emits a fresh salt per call).

### Fix 4 — `/v1` auth-contract test

Add a table-driven test (in `api/src/index.test.ts` or a new `auth-contract.test.ts`) that,
via `it.each`, sends each **bearer/JWT-gated mutating `/v1` route** a request with **no
credentials** and asserts a 401 (or the route's documented 503 when a binding preflight fires
first). The table covers at least: `POST /v1/events`, `PUT /v1/settings`, `POST
/v1/data-request`, `POST /v1/export`, `GET /v1/sessions`, `GET /v1/security`,
`GET /v1/csp-reports`. It **excludes** the deliberately-public routes (`POST
/v1/erasure/request`, `POST /v1/erasure/confirm`, `GET /v1/erasure/status/:token`,
`POST /v1/csp-report` if public). The test makes the currently-missing `/v1/events`
anon-rejection assertion explicit.

### Fix 5 — Retention purge integration tests

In `cron/src/index.test.ts`, add a seeded-row purge test for each of `consent_events`,
`admin_audit`, `session_events`, `security_events`, mirroring the existing pattern: seed one
row older than the table's cutoff + one fresh row, run the scheduled tick, assert the old row
is deleted and the fresh row survives. Use each table's real cutoff (audit tables 90d,
`consent_events` 3yr).

### Fix 6 — Orders wording

Correct the ledger §07 text ("orders now notApplicable" → "orders is a registered no-op stub;
no orders store exists yet") and add a one-line clarifying comment in `orders.ts`. No behavior
change.

## Testing

- **Fix 1:** a worker test — `user.deleted` runs the engine, the `clerk` adapter is NOT
  invoked (assert via an injected adapter set / spy), `user_profiles` is pseudonymized and the
  audit rows cleared, an `admin_audit erasure.clerk_deleted` row is written, no email sent.
  Reuse the injectable `buildAdapters` seam pattern from `confirm.ts`/`self.ts`.
- **Fix 2 server:** a `self.ts` test — a token with a stale/absent `fva` → 403
  `reverification_required` (engine not run); a fresh `fva` → proceeds. Injectable
  `authenticate` already exists.
- **Fix 4 + Fix 5** are themselves the tests.
- **Fix 2 client + Fix 3 + Fix 6** are wiring/docs — covered by `tsc` + the server tests +
  review.
- Framework: `vitest` (the api/cron/compliance convention).

## Verification

- `pnpm tsc` (all workspaces) + `pnpm test` (api + cron + compliance) green.
- `pnpm check:api-guards` / `check:typed-routing` / `check:tasks` green.
- Grep confirms no second `defaultAdapters` copy remains (both routes use the shared factory).

## Rollout / sequencing (for the plan)

1. **Fix 1** — extract `buildErasureAdapters`, repoint `confirm.ts`/`self.ts`, rewrite the
   webhook `user.deleted` path, with the worker test.
2. **Fix 2** — (a) verify the Clerk `fva` + `useReverification` contract (per SDK: `@clerk/nextjs`
   for website/app, `@clerk/clerk-react` for hybrid); (b) server `fva` enforcement in `self.ts` +
   test (applies to ALL four surfaces uniformly); (c) client `beforeConfirm`/`useReverification`
   on the website + app + hybrid panels; (d) mobile `@debt` comment update (documented re-login
   remedy — `clerk-expo` has no `useReverification`).
3. **Fix 3** — salt guidance (script + wrangler.toml + brief + docs).
4. **Fix 4** — the `/v1` auth-contract test.
5. **Fix 5** — the 4 retention purge tests.
6. **Fix 6** — orders wording + ledger.

## Risks

- **Fix 2 Clerk contract** — the `fva`/`useReverification` mechanics are version-specific; the
  verify-first task de-risks it. If the mechanism proves materially more involved than a claim
  read + a hook wrap, Fix 2 is split into its own follow-up and the other five still land.
- **Fix 1 best-effort on unarmed Sanity** — by design the webhook runs whatever adapters are
  armed and logs `receipt.errors`; on a template with Sanity unset, `user_profiles` + audit
  are still erased (better than the current partial), Sanity is skipped (the factory omits it).
- **Fix 3** — no migration for the template; a note in the docs must warn an existing operator
  NOT to change a _live_ prod salt (that would break existing fingerprint lookups) — the
  per-env rule is for fresh provisioning.
