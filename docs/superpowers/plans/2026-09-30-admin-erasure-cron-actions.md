# Admin Erasure + Cron Actions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let an admin retry a stuck erasure, close a request manually with a note, and run the cron now — each audited and re-authorized server-side.

**Architecture:** Confirm's live erasure pass moves into `erasure/execute.ts` (shared by the public confirm and the new admin retry). Two bearer-gated api routes act on `erasure_requests`; a third forwards to the cron over a private service binding, where the cron's `fetch` gains `POST /run` running the same `runTick` as `scheduled`. The admin calls them through server actions that re-check `isAdmin` and audit.

**Tech Stack:** Cloudflare Workers + D1 + service bindings · vitest-pool-workers · Next.js 16 server actions + next-intl + shadcn.

**Spec:** `docs/superpowers/specs/2026-09-30-admin-erasure-cron-actions-design.md`

## Global Constraints

- Retry only open `confirmed` rows → else `409 {error:"not_retryable"}`; close only OPEN rows → else `409 {error:"not_open"}`.
- The typed email is never stored or logged; fingerprint check is constant-time (`safeEqual`).
- Close note: trimmed, 5–500 chars, else `400 {error:"note_required"}`; status `closed_manual`.
- Retry responses: `200 {ok:true}` · `207 {ok:true,partial:true,errors}` · `502 {ok:false,clerk_failed:true}` · `422 {error:"email_required"}` · `400 {error:"email_mismatch"}`.
- `POST /v1/cron/run`: `CRON` unbound → `503 {error:"cron_unbound"}`.
- Cron: `workers_dev = false` in dev/staging/prod; `/run` only via the service binding.
- Admin audit events: `admin.erasure_retry`, `admin.erasure_close` (target `erasure:<id>`), `admin.cron_run` (target `cron`).
- Admin strings in `messages/{en,fr}.json`; server actions return `{ok:false,error}`, never throw to the client.
- Branch → fast-forward main, never push; never stage the user's WIP.

## Review Focus

- Retry of a row whose Clerk user is gone and no email given → 422, nothing erased (Task 2 test).
- Confirm behaves exactly as before after the extraction (Task 1: existing confirm suite green unchanged).
- A non-admin calling a server action → `forbidden`, no api call, no audit (Task 4 test).
- Close on an already-closed row → 409, row untouched (Task 2 test).
- `/run` reachable only via the binding: the cron has no workers.dev URL in any env (Task 3 config test).

---

### Task 1: Extract `executeErasure` (api)

**Files:** Create `code/shared/api/src/erasure/execute.ts`; modify `confirm.ts`. Test: existing `confirm.test.ts` (must stay green, unchanged).

**Produces:** `executeErasure(env: Env, row: {id:number; user_id:string|null; email_fingerprint:string}, email: string, deps: {buildAdapters, send}, country: string|null): Promise<{ status: "completed"|"confirmed"; clerkFailed: boolean; errors: unknown[] }>` — dry-run + live `runErasure`, Clerk inline retry, row update (`status`, `confirmed_at` if null, `completed_at`, `result`), `erasure.completed` audit row + completion email when Clerk succeeded (both best-effort).

- [ ] Run `confirm.test.ts` → green baseline.
- [ ] Move lines from `const adapters = buildAdapters(env)` through the completion email into `execute.ts`; confirm maps the result to its 200/207/502 responses.
- [ ] Run `confirm.test.ts` + full api suite → green, unchanged tests. Commit `refactor(api): one erasure execution path (confirm + admin retry)`.

### Task 2: Retry + close routes (api)

**Files:** Create `code/shared/api/src/erasure/admin.ts` (+ `admin.test.ts`); modify `index.ts` (route wiring); add `findPrimaryEmail(userId)` to `ClerkErasureClient` + real client.

**Produces:** `handleErasureRetry(request, env, id, deps?)`, `handleErasureClose(request, env, id)`; routes `POST /v1/erasure-requests/:id/retry|close` behind `requireAdminBearer` + `rateLimit`.

- [ ] Failing tests (workerd, real D1, mocked Clerk/Sanity via the confirm test's `mockAdapters` shape):
  - retry: row `email_sent` → 409 `not_retryable`; `confirmed` + Clerk user found (`findPrimaryEmail` → email) → 200, row `completed`, send called; Clerk user gone + no body email → 422 `email_required`, row unchanged; body email wrong → 400 `email_mismatch`; body email right → 200; Clerk delete still failing → 502, stays `confirmed`, send NOT called.
  - close: note `"  "` → 400; row `completed` → 409; open row + note → 200, `status = 'closed_manual'`, `result.manualClose.note` saved, `completed_at` set; the monitoring open list no longer includes it.
  - both: 401 without the bearer (routed through `SELF`).
- [ ] Implement; `findPrimaryEmail` via `clerk.users.getUser(id)` → `primaryEmailAddress?.emailAddress ?? null`, `null` on 404.
- [ ] Full api suite green. Commit `feat(api): admin retry + manual close for erasure requests`.

### Task 3: Run the cron now (cron + api)

**Files:** cron `src/index.ts` (+ tests), cron `wrangler.toml` (`workers_dev = false` ×3), api `wrangler.toml` (`[[env.dev.services]] binding = "CRON" service = "indiecrafts-dev-shared-cron"`, staging/prod likewise), api `index.ts` (`POST /v1/cron/run`, `Env.CRON?: Fetcher`), scripts test for the config.

**Produces:** cron `runTick(env, scheduledTime): Promise<PassResult[]>` (used by `scheduled` and `POST /run`); cron `POST /run` → `{status, passes}` (500 if failed); api forwards.

- [ ] Failing tests: cron `POST /run` writes a history row and returns 200 `{status:"ok", passes:[4]}`; `GET /` health unchanged; api `/v1/cron/run` with `CRON` unbound → 503; with a stub `CRON` fetcher → forwards status + body; 401 without bearer. Scripts: every cron env has `workers_dev = false`; api binds `CRON` to the cron's own name per env; `renameResourcePrefix` rewrites the `service =` value.
- [ ] Implement. Commit `feat(cron): run a tick on demand through a private service binding`.

### Task 4: Admin actions + UI

**Files:** admin `(dashboard)/monitoring-actions.ts` (server actions), `erasure-table.tsx` (row actions: Retry with inline email fallback, Close dialog), `cron-runs-table.tsx` (Run now), `lib/audit.ts` (new event names), messages en/fr, tests.

**Produces:** `retryErasure(id, email?)`, `closeErasure(id, note)`, `runCronNow()` → `{ok:true, …} | {ok:false, error}`.

- [ ] Failing tests (vitest, mocked `auth()` + `fetch`): non-admin → `{ok:false,error:"forbidden"}`, no fetch; admin → calls the right api route with the bearer, audits the right event; `email_required` surfaced as `{ok:false,error:"email_required"}`.
- [ ] Implement actions + UI (shadcn `Button`, `Dialog`, `Input`, `Textarea`, `sonner` toast; `router.refresh()` after success).
- [ ] Admin tests + tsc green. Commit `feat(admin): retry, close and run-now actions`.

### Task 5: Docs, changelogs, card, manual run

- [ ] Docs: api page (3 routes), cron page (`/run`, no public URL), admin page (actions), data-retention (manual close), reference pages for new files; changelogs api/cron/admin/docs; `pnpm verify`, doc-coverage, docs:build, check:claude-md.
- [ ] Final review (fresh reviewer), fix Critical/Important, ff main.
- [ ] Manual: local api + cron + admin (service binding via the dev registry), seeded stuck row → retry / close / run now in the browser. Runbook cards 21 + 10 notes.
