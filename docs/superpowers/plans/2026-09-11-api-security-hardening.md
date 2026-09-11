# API Security Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the one HIGH and four MED findings from the API security audit, plus the LOW batch, across the `@indiecrafts/shared-api` worker (and the website `/api/*` where noted) — without changing behaviour on the happy paths.

**Architecture:** Surgical hardening of existing routes. The headline fix makes the Clerk user-delete a _required_ step on the mailed-token erasure path (mirroring the already-hardened self-service path). A shared sensitive-action auth gate (JWT verify + step-up) is extracted once and reused by erasure/self and export, removing a verbatim duplication. Rate-limiting is bound in-worker as defence-in-depth behind the Cloudflare WAF. Nothing here adds a dependency or a new framework.

**Tech Stack:** Cloudflare Workers (bare) · TypeScript · Vitest (workerd pool: `pnpm --filter @indiecrafts/shared-api exec vitest run <file>`) · Clerk backend SDK (dynamic import) · D1.

**Spec:** none written separately — this plan is the spec. It implements the verified findings from the in-session audit (2026-09-11), summarised in Global Constraints + each task's rationale.

## Global Constraints

- **Fail closed on the security path, never on the mandatory-email path.** A guard that can't run (missing binding/secret) must DENY a sensitive action, but a bookkeeping/email failure must never 500 an already-committed erasure. Both idioms already exist in the codebase — match them.
- **Never break the happy path.** Every change is additive gating or a behind-the-scenes refactor; a correctly-authenticated, step-verified request must behave exactly as today.
- **Tests run in the api's workerd pool:** `pnpm --filter @indiecrafts/shared-api exec vitest run <file>`. The routes are already unit-tested with injectable seams (`authenticate`, `buildAdapters`, `send`, `fetchStrings`) — reuse those seams; do NOT load the Clerk SDK or hit the network in a test.
- **Constant-time compares** for any secret/fingerprint/token comparison (`safeEqual` / `timingSafeEqual` — already imported).
- **Commit scope:** the working tree carries an unrelated parallel react-doctor WIP (`.claude/settings.json`, `.vscode/tasks.json`, root `package.json`, `.claude/hooks/react-doctor-changed.sh`) — NEVER stage those.
- **Log names, not values.** Every `logger.*` on this surface logs `(error as Error)?.name` or counts, never PII/secrets. Keep it that way.
- **No deploy inside tasks.** Provisioning the rate-limit binding + deploying is a final runbook step, not an implementer's job.

---

## File Structure

- `code/shared/api/src/auth/sensitive-action.ts` — **NEW** — the extracted shared gate: `authenticateClerkJwt(request, env)` (JWT verify + primary-email resolve + fva) and `requireStepUp(authed)` (the fva → 403 reverification check). Consumed by erasure/self + export. Removes the duplicated `defaultAuthenticate`.
- `code/shared/api/src/erasure/confirm.ts` — Task 1: Clerk-required hardening + email-on-success-only.
- `code/shared/api/src/erasure/self.ts` — Task 2: email-on-success-only; Task 5: consume the shared gate.
- `code/shared/api/src/export/route.ts` — Task 5: consume the shared gate; Task 6: enforce step-up.
- `code/shared/api/src/index.ts` — Task 3: apply the rate-limit guard to the currently-unlimited routes; Task 7: post-read body caps on the POSTs missing them.
- `code/shared/api/src/erasure/request.ts` — Task 4: fail closed when the public path has no throttle.
- `code/shared/api/src/consent/{marketing,email-preferences}.ts` — Task 3 (rate-limit), Task 7 (body cap).
- `code/shared/api/src/erasure/churn-store.ts` + the erasure adapters — Task 8: scrub churn free-text on erasure.
- `code/shared/api/src/consent/pref-token.ts` + `token.ts` consumer — Task 9: coarse expiry.
- `code/shared/api/wrangler.toml` — Task 3: bind `AGENT_RATELIMIT` (all envs).
- `code/projects/web/surfaces/website/src/app/api/emails/test/route.ts` + `consent-log/route.ts` — Task 7 (body cap + the anon branch limit).
- Tests colocated (`*.test.ts`) beside each; docs/changelog in the final task.

---

### Task 1: Make the Clerk delete a required step on `erasure/confirm.ts` (H1 + M1)

**Files:**

- Modify: `code/shared/api/src/erasure/confirm.ts` (the block after the live `runErasure`, ~L209-266)
- Test: `code/shared/api/src/erasure/confirm.test.ts`

**Interfaces:**

- Consumes: `runErasure`, the erasure adapters, `sendErasureCompleteEmail` (unchanged). Needs the `CLERK_STORE` constant — export it from `self.ts` (`export const CLERK_STORE = "clerk";`) and import it here (single source of truth).
- Produces: `handleErasureConfirm` now returns `502 {ok:false, clerk_failed:true, errors}` when the Clerk delete persistently fails; the completion email + `erasure.completed` audit fire ONLY on a live Clerk delete.

**Background (verified):** `self.ts:277-351` already special-cases the Clerk store (retry once → `502 clerk_failed`), but `confirm.ts:216` does a store-agnostic `hadErrors = receipt.errors.length > 0` and returns `207 {ok:true, partial:true}` + sends the "erasure complete" email + spends the single-use token even when the session kill-switch failed.

- [ ] **Step 1: Write the failing test.** In `confirm.test.ts`, add a case: adapters where the `clerk` adapter's `delete()` throws (D1/Sanity succeed), a valid confirm token. Assert: response status `502`, body `{ok:false, clerk_failed:true}`; the injected `send` (completion email) was NOT called; the `erasure_requests` row stays `status='confirmed'` (not `completed`). Use the existing injectable seams (`buildAdapters`, and the email seam — if confirm.ts doesn't yet inject `send`, add a `send: typeof sendErasureCompleteEmail = sendErasureCompleteEmail` param mirroring self.ts's testability, and thread it).
- [ ] **Step 2: Run it — expect FAIL** (`... exec vitest run src/erasure/confirm.test.ts`) — today it 207s and sends the email.
- [ ] **Step 3: Export the shared constant.** In `self.ts`, change `const CLERK_STORE = "clerk";` → `export const CLERK_STORE = "clerk";`. In `confirm.ts`, `import { CLERK_STORE } from "./self";` (or move it to a tiny shared `erasure/constants.ts` if you prefer no self→confirm coupling — either is fine; pick the smaller diff).
- [ ] **Step 4: Port the retry + fail-closed.** Replace the confirm.ts block from `const receipt = await runErasure(...)` through the final returns with the self.ts idiom:

```ts
let receipt = await runErasure(adapters, email, {
  mode: "erase",
  dryRun: false,
  ts,
  fingerprint: row.email_fingerprint,
});

// Clerk is the one global session/credential kill-switch. A failed Clerk delete
// must never be reported as a completed erasure — retry once, then fail closed.
let clerkStillFailing = false;
if (receipt.errors.some((e) => e.store === CLERK_STORE)) {
  const clerkAdapter = adapters.find((a) => a.name === CLERK_STORE);
  try {
    if (!clerkAdapter) throw new Error("clerk adapter not configured");
    const retried = await clerkAdapter.delete(email);
    receipt = {
      ...receipt,
      errors: receipt.errors.filter((e) => e.store !== CLERK_STORE),
      stores: [...receipt.stores, retried],
    };
  } catch (error) {
    clerkStillFailing = true;
    logger.error("erasure.confirm clerk retry failed", {
      name: (error as Error)?.name,
    });
  }
}
const hadErrors = receipt.errors.length > 0;
```

- [ ] **Step 5: Gate the row/audit/email on the Clerk result.** Keep the `UPDATE erasure_requests` writing `confirmed` when `hadErrors` (already correct — a Clerk failure lands in `hadErrors`, so the row stays `confirmed`/not `completed`, token re-usable per the status gate). Then guard the completion email + the `erasure.completed` audit row so they fire only when the erasure truly completed:

```ts
if (!clerkStillFailing) {
  // audit + completion email exactly as today (the existing try/catch blocks),
  // but only when the account was actually deleted.
}
```

Wrap the existing `erasure.completed` audit-insert try/catch AND the `sendErasureCompleteEmail` try/catch in `if (!clerkStillFailing) { … }`. (On a Clerk failure the subject gets no false "complete" email; the `confirmed` row + retained-summary flag it for manual finish, same contract as self.ts.)

- [ ] **Step 6: Return fail-closed.** Replace the tail returns:

```ts
if (clerkStillFailing)
  return json(
    { ok: false, clerk_failed: true, errors: receipt.errors },
    502,
    PUBLIC_CORS_POST,
  );
if (hadErrors)
  return json(
    { ok: true, partial: true, errors: receipt.errors },
    207,
    PUBLIC_CORS_POST,
  );
return json({ ok: true }, 200, PUBLIC_CORS_POST);
```

- [ ] **Step 7: Run the test — expect PASS**; then the full confirm suite (`... exec vitest run src/erasure/confirm.test.ts`) green.
- [ ] **Step 8: Commit** — `git add code/shared/api/src/erasure/confirm.ts code/shared/api/src/erasure/self.ts code/shared/api/src/erasure/confirm.test.ts` → `fix(api): treat the Clerk delete as required on the erasure confirm path`.

---

### Task 2: Completion email only on true success in `self.ts` (M1)

**Files:** Modify `code/shared/api/src/erasure/self.ts` (~L329-339); Test `code/shared/api/src/erasure/self.test.ts`.

**Background:** `self.ts:330` sends `sendErasureCompleteEmail` before the `clerk_failed` 502 return — so on a persistent Clerk failure the subject still gets an "erasure complete" email while the account is live.

- [ ] **Step 1: Failing test.** In `self.test.ts`, extend/add the clerk-persistent-failure case (there is already a test that returns 502 `clerk_failed`) to also assert the injected `send`/complete-email seam was NOT called in that case. Run → FAIL (it's called today).
- [ ] **Step 2: Guard the send.** Wrap the existing `sendErasureCompleteEmail` try/catch (self.ts ~L329-339) in `if (!clerkStillFailing) { … }`.
- [ ] **Step 3: Run → PASS**; full self suite green.
- [ ] **Step 4: Commit** — `git add code/shared/api/src/erasure/self.ts code/shared/api/src/erasure/self.test.ts` → `fix(api): don't send an "erasure complete" email when the Clerk delete failed`.

---

### Task 3: Bind the in-worker rate limiter and apply it to the unthrottled routes (M2)

**Files:**

- Modify: `code/shared/api/wrangler.toml` (uncomment + fill `AGENT_RATELIMIT` for every env)
- Modify: `code/shared/api/src/index.ts` (apply the guard to `/v1/announcements`, `/v1/consent/marketing-email`, `/v1/consent/email-preferences`) and `code/shared/api/src/erasure/confirm.ts` (`/v1/erasure/confirm`)
- Test: `code/shared/api/src/index.test.ts` (a 429 assertion for one newly-limited route, via a stubbed `AGENT_RATELIMIT`)

**Background (verified):** `wrangler.toml:97` has the `AGENT_RATELIMIT` binding commented out; `index.ts:329` and every route gate on `if (env.AGENT_RATELIMIT)`, so a default deploy self-limits nothing and relies solely on the CF WAF `/api/*` rule (infra). The public bundle-token write `/v1/events`, the public `/v1/announcements` (outbound Sanity fetch), the JWT consent routes, and `/v1/erasure/confirm` have no in-worker limit.

- [ ] **Step 1: Bind the limiter, all envs.** In `wrangler.toml`, uncomment the base binding at L97 and add it under each `[env.<env>]` (the ratelimit binding is per-env like D1). Distinct `namespace_id` per env (any stable integer per env):

```toml
[[unsafe.bindings]]
name = "AGENT_RATELIMIT"
type = "ratelimit"
namespace_id = "1001"
simple = { limit = 20, period = 60 }
```

Repeat under `[env.dev]`, `[env.staging]`, `[env.prod]` with `namespace_id` `2001`/`3001`/`4001` (per-env isolation). (Provisioning happens at deploy — final task.)

- [ ] **Step 2: Extract the guard once.** In `index.ts`, add a tiny helper next to `clientIp` (real code):

```ts
/** Apply the CF native rate-limit (keyed on caller IP), no-op when unbound. Returns a
 *  429 Response to short-circuit on limit, else null. Defence-in-depth behind the WAF. */
export async function rateLimited(
  request: Request,
  env: Env,
  cors: Record<string, string>,
): Promise<Response | null> {
  if (!env.AGENT_RATELIMIT) return null;
  const { success } = await env.AGENT_RATELIMIT.limit({
    key: clientIp(request),
  });
  return success ? null : json({ error: "rate_limited" }, 429, cors);
}
```

- [ ] **Step 3: Apply it** to the four routes at the top of each handler, before the expensive work: `const rl = await rateLimited(request, env, <that route's cors>); if (rl) return rl;` — `/v1/announcements` (PUBLIC_CORS), `/v1/consent/marketing-email` + `/v1/consent/email-preferences` (their JWT cors), and in `confirm.ts` `/v1/erasure/confirm` (PUBLIC_CORS_POST). Leave `/v1/geo` as-is (cheap, no DB/fetch) unless you want it too.
- [ ] **Step 4: Test.** In `index.test.ts`, add one case: bind a stub `AGENT_RATELIMIT.limit` that returns `{success:false}` and assert a newly-limited route → 429. Run → PASS.
- [ ] **Step 5: Commit** — `git add code/shared/api/src/index.ts code/shared/api/src/erasure/confirm.ts code/shared/api/wrangler.toml code/shared/api/src/index.test.ts` → `feat(api): bind the in-worker rate limiter and apply it to the unthrottled routes`.

---

### Task 4: Fail closed when the public erasure-request path has no throttle (M4)

**Files:** Modify `code/shared/api/src/erasure/request.ts` (the preflight, ~L47-52 + L120-125); Test `code/shared/api/src/erasure/request.test.ts`.

**Background (verified):** `request.ts` rate-limits only `if (env.AGENT_RATELIMIT)` and Turnstile _passes_ when `TURNSTILE_SECRET` is unset (`:52`). A deploy leaving both unset makes `/v1/erasure/request` an unthrottled, unchallenged POST → email-bomb a known victim + unbounded D1 inserts.

- [ ] **Step 1: Failing test.** In `request.test.ts`, add a case: env with neither `AGENT_RATELIMIT` nor `TURNSTILE_SECRET` → assert `503 {error:"unavailable"}` (the route refuses rather than accepting an unthrottled public POST). Run → FAIL (today it accepts).
- [ ] **Step 2: Preflight guard.** Near the top of `handleErasureRequest` (after the method/secret checks, before the body read), add:

```ts
// The public erasure-request path MUST have at least one abuse control — a bot
// challenge or a rate limit. Neither configured → refuse, don't run an unthrottled,
// unchallenged public POST that can email-bomb a known victim.
if (!env.TURNSTILE_SECRET && !env.AGENT_RATELIMIT)
  return json({ error: "unavailable" }, 503, PUBLIC_CORS_POST);
```

(Binding the limiter in Task 3 satisfies this in every real deploy; this is the belt-and-braces that stops a *mis*configured deploy from being wide open.)

- [ ] **Step 3: Run → PASS**; full request suite green (the existing anti-enumeration/Turnstile tests set one of the two, so they stay green).
- [ ] **Step 4: Commit** — `git add code/shared/api/src/erasure/request.ts code/shared/api/src/erasure/request.test.ts` → `fix(api): refuse the public erasure-request when it has no abuse control`.

---

### Task 5: Extract one shared sensitive-action auth gate (refactor + M3 prep)

**Files:**

- Create: `code/shared/api/src/auth/sensitive-action.ts`
- Modify: `code/shared/api/src/erasure/self.ts` + `code/shared/api/src/export/route.ts` (both consume it; delete their local `defaultAuthenticate`)
- Test: `code/shared/api/src/auth/sensitive-action.test.ts`

**Background (verified):** `defaultAuthenticate` is byte-for-byte duplicated in `self.ts:64-110` and `export/route.ts:54-91` (the export copy comments "replicated here"). Export's copy hard-codes `fvaMinutes: null`, so export can never enforce step-up.

**Interfaces:**

- Produces `authenticateClerkJwt(request, env): Promise<SelfAuth | null>` — the union of both copies (JWT verify → `sub` → `exportUser` primary email → the runtime-validated `fva[0]`). `SelfAuth` moves here (or is re-exported); `self.ts` keeps exporting it for back-compat.
- Produces `requireStepUp(authed, cors, afterMinutes = REVERIFY_WINDOW_MIN): Response | null` — the fva check that returns the `reverificationError` 403 (lifted verbatim from self.ts) or null.

- [ ] **Step 1: Failing test.** In `sensitive-action.test.ts`, test `requireStepUp`: `fvaMinutes: null` → a 403 whose body is the reverification shape; `fvaMinutes: 5` (≤ window) → null; `fvaMinutes: 999` → 403. (Test `authenticateClerkJwt` via an injected `verifyToken`/client only if a seam exists; otherwise the route tests already cover it — don't load the SDK.) Run → FAIL (module doesn't exist).
- [ ] **Step 2: Create the module.** Move `defaultAuthenticate`'s body verbatim into `authenticateClerkJwt` (keep the `fva` reading from self.ts's richer copy). Lift the step-up block from self.ts into `requireStepUp`. Import `REVERIFY_WINDOW_MIN`, `reverificationError`, `createRealClerkClient`, `SelfAuth` from their current homes.
- [ ] **Step 3: Rewire self.ts.** Delete self.ts's local `defaultAuthenticate`; default the `authenticate` param to the imported `authenticateClerkJwt`; replace the inline step-up block with `const stepUp = requireStepUp(authed, PUBLIC_CORS_POST); if (stepUp) return stepUp;`. Behaviour identical.
- [ ] **Step 4: Rewire export/route.ts.** Delete export's local `defaultAuthenticate`; default `authenticate` to `authenticateClerkJwt`. (Applying `requireStepUp` is Task 6.)
- [ ] **Step 5: Run** the new test + the full self + export suites — all green (pure refactor, no behaviour change yet). `... exec vitest run src/auth/sensitive-action.test.ts src/erasure/self.test.ts src/export/route.test.ts`.
- [ ] **Step 6: Commit** — `git add code/shared/api/src/auth/ code/shared/api/src/erasure/self.ts code/shared/api/src/export/route.ts code/shared/api/src/auth/sensitive-action.test.ts` → `refactor(api): one shared Clerk sensitive-action gate (dedupe defaultAuthenticate)`.

---

### Task 6: Enforce step-up on `/v1/export` (M3)

**Files:** Modify `code/shared/api/src/export/route.ts`; Test `code/shared/api/src/export/route.test.ts`.

**Background:** Export hands out a full PII bundle on `sub` alone; a revoked-but-unexpired JWT works for the token TTL. Step-up (the same fva gate as erasure/self) closes the window. No typed-email — export is read-only of the caller's own data, so match deletion's _step-up_ but not its typed-email friction (simple + secure + flexible: the gate is parameterised, export opts into step-up only).

- [ ] **Step 1: Failing test.** In `route.test.ts`, add: an authed caller with `fvaMinutes: null` (or `> window`) → assert `403` + the reverification body, and `runExport`/`EXPORT_BUCKET.put` NOT called. A caller with `fvaMinutes: 5` → the existing success path (link returned). Run → FAIL (today export ignores fva).
- [ ] **Step 2: Apply the gate.** In `handleExport`, right after `const authed = await authenticate(...); if (!authed) return 401`, add:

```ts
const stepUp = requireStepUp(authed, PUBLIC_CORS_POST);
if (stepUp) return stepUp;
```

(import `requireStepUp` from `../auth/sensitive-action`).

- [ ] **Step 3: Run → PASS**; full export suite green.
- [ ] **Step 4: Commit** — `git add code/shared/api/src/export/route.ts code/shared/api/src/export/route.test.ts` → `fix(api): require step-up reverification before a full data export`.

---

### Task 7: Post-read body caps + the consent-log anon limit (LOW batch)

**Files:**

- Modify: `code/shared/api/src/index.ts` (`/v1/profiles/consent` ~L657, `/v1/settings` PUT ~L821), `code/shared/api/src/consent/marketing.ts` (~L88), `code/shared/api/src/consent/email-preferences.ts` (`handleEmailPreferences` ~L226)
- Modify: `code/projects/web/surfaces/website/src/app/api/emails/test/route.ts` (~L57), `code/projects/web/surfaces/website/src/app/api/consent-log/route.ts` (~L20-53)
- Test: the colocated route tests + `code/shared/api/src/index.test.ts`

**Background (verified):** these POST handlers trust the `content-length` header only; a chunked request without the header skips the 4000/2000-byte cap (bounded only by the platform limit). All are auth-gated (low), but the codebase's own idiom (`/v1/events`, `clerk-webhook`, `erasure/self`) re-checks actual bytes. The website `consent-log` anon branch (when `logAnonymousConsent` is on) has no cap/limit.

- [ ] **Step 1: Failing test (one representative).** In `index.test.ts`, POST to `/v1/profiles/consent` with a valid bearer, no `content-length`, and a body over `BODY_MAX` → assert `400 {error:"invalid"}` (or 413). Run → FAIL.
- [ ] **Step 2: Add the post-read check** to each listed handler, mirroring the existing idiom — after `const bodyText = await request.text();` (or wrapping the `request.json()`), `if (bodyText.length > BODY_MAX) return json({error:"invalid"}, 400, <cors>);` before parsing. For routes that call `request.json()` directly, switch to `request.text()` + `JSON.parse` so the byte check runs first. Use each file's existing `BODY_MAX`/cap constant.
- [ ] **Step 3: consent-log anon branch.** In the website `consent-log` route, apply the same `rateLimit` + `bodyMax` the `csp-report` route uses on its anonymous path (reuse `src/config/security.ts` limits), so the `!userId` branch isn't an unbounded public writer when the flag is on.
- [ ] **Step 4: Run** the touched suites → PASS; `pnpm --filter @indiecrafts/web-surfaces-website exec tsc --noEmit` + `pnpm --filter @indiecrafts/shared-api exec tsc --noEmit` clean.
- [ ] **Step 5: Commit** — stage the six files + their tests → `fix(api,web): re-check body size after read on the remaining POSTs; cap the anon consent-log branch`.

---

### Task 8: Scrub churn free-text on erasure (LOW / data-minimisation)

**Files:** Modify `code/shared/api/src/erasure/churn-store.ts` (add a `scrubChurnFreeText(db, userId)` that nulls `feedback`/`competitor`, keeps the aggregate row) + call it from the erasure paths (`self.ts`, `confirm.ts`) after a successful erase; Test `code/shared/api/src/erasure/churn-store.test.ts`.

**Background (verified):** `churn_events` keeps the Clerk `user_id` + user-typed `feedback`/`competitor` indefinitely and is untouched by the erasure engine. After Clerk deletion `user_id` is pseudonymous, but a user can self-enter PII in the free text, which then survives their own erasure. Keep the aggregate (reason/day counts for win-back analytics), drop the free text.

- [ ] **Step 1: Failing test.** In `churn-store.test.ts`: seed a churn row with `feedback`/`competitor` set, call `scrubChurnFreeText(db, userId)`, assert the row still exists with `reason` intact but `feedback`/`competitor` NULL. Run → FAIL (function doesn't exist).
- [ ] **Step 2: Implement** `scrubChurnFreeText` — `UPDATE churn_events SET feedback = NULL, competitor = NULL WHERE user_id = ?` (parameterised). Export it.
- [ ] **Step 3: Wire it** into the erasure paths after the successful engine run (guard on `!hadErrors`/`!clerkStillFailing`, best-effort try/catch so it never 500s a committed erasure), keyed on the authenticated/row `user_id`.
- [ ] **Step 4: Run → PASS**; self + confirm suites still green.
- [ ] **Step 5: Commit** → `fix(api): scrub churn free-text feedback on erasure (keep the aggregate)`.

---

### Task 9: Coarse expiry on the no-login preference token (LOW)

**Files:** Modify `code/shared/api/src/consent/pref-token.ts` (+ its HMAC in `@indiecrafts/packages-shared-gated-delivery` if the payload shape changes) and the verify sites in `consent/email-preferences.ts`; Test `code/shared/api/src/consent/pref-token.test.ts`.

**Background (verified):** `signPrefToken` mints an HMAC over `{uid}` with no expiry and no single-use — a leaked email link is a permanent (low-sensitivity) read+write capability on marketing prefs. The design note says links in already-sent mail must keep working, so use a _long_ default (not a short one) that still bounds a leaked link.

- [ ] **Step 1: Decide + note the window.** Default `PREF_TOKEN_TTL_DAYS = 365` (long enough that real email links keep working, short enough that a leaked link doesn't live forever). Make it overridable via an env/settings value if trivial; otherwise the constant is fine (flexible-by-const).
- [ ] **Step 2: Failing test.** In `pref-token.test.ts`: a token signed with `exp` in the past → verify returns null/expired; a fresh token → verifies. Run → FAIL.
- [ ] **Step 3: Implement.** Add `exp` (issued-at + TTL) to the signed payload; on verify, reject when `now > exp` (constant-time compare unchanged for the HMAC). Keep the payload back-compatible if feasible (treat a missing `exp` as "legacy, still valid" for one release, OR accept that outstanding links re-issue on next email — pick the smaller, documented choice).
- [ ] **Step 4: Graceful expiry UX.** The preference-centre GET/POST already returns a JSON error shape — ensure an expired token yields a clear "link expired, request a new one" response, not a 500.
- [ ] **Step 5: Run → PASS**; consent suites green.
- [ ] **Step 6: Commit** → `fix(api): give the no-login preference token a bounded (1-year) expiry`.

---

### Task 10: Docs, changelog, runbook (+ the deploy provisioning note)

**Files:** `code/shared/api/CHANGELOG.md`; `code/docs/apps/web/config/*` (a short "API security controls" note or extend `security-hardening.md`); the api brief if a route's contract changed (`/v1/export` now step-up-gated; `/v1/erasure/confirm` can 502).

- [ ] **Step 1: Changelog** — one entry per fix group (Clerk-required erasure on both paths; step-up on export; in-worker rate limiter bound + applied; erasure-request fail-closed; the LOW batch). Note the **runbook step**: provision the `AGENT_RATELIMIT` namespaces + redeploy each env, and confirm the CF WAF `/api/*` rule is still the primary limiter.
- [ ] **Step 2: Brief** — update `code/shared/api/.claude/CLAUDE.md`: `/v1/export` requires step-up; `/v1/erasure/confirm` returns 502 `clerk_failed` on a persistent Clerk failure (same contract as `/v1/erasure/self`).
- [ ] **Step 3: Commit** → `docs(api): record the API security hardening (controls + runbook)`.

---

## Self-Review

- **Coverage:** H1 → T1; M1 → T1+T2; M2 → T3; M3 → T5+T6; M4 → T4; LOW batch (body caps, consent limit, churn free-text, pref-token expiry) → T7/T8/T9; the `defaultAuthenticate` duplication → T5. The by-design LOWs (audit `actor` self-asserted by the trusted bearer; download link not single-use — both documented `ponytail:` ceilings) are **accepted, not tasked** — note them in T10's changelog as explicit risk-acceptance. ✅
- **Placeholders:** none — every task cites verified file:line and gives the real idiom (ported from the already-hardened `self.ts`). ✅
- **Type consistency:** `authenticateClerkJwt`/`requireStepUp`/`SelfAuth`/`CLERK_STORE`/`rateLimited` used consistently across T1/T3/T5/T6; `requireStepUp(authed, cors)` signature identical in self + export. ✅
- **Ordering:** T1/T2 (the hole) first; T5 before T6 (extract before reuse); T3 before T4 (binding the limiter satisfies T4's belt-and-braces in real deploys). ✅
- **No happy-path change:** every gate is additive; the refactor is behaviour-preserving (tests assert the success paths stay green). ✅
