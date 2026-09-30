# Admin actions for erasures and the cron — design

**Date:** 2026-09-30 · **Status:** approved in chat, spec for review · **Follows:**
`2026-09-30-cron-monitoring-design.md` (read-only monitoring) · **Cards:** 21 (cron), 10/12 (erasure)

## Goal

The admin can now **see** a stuck erasure and a failed cron run, but can't **act** on either. A GDPR
deadline can pass with no way to fix it. This adds three audited admin actions.

**Success =** from admin, an operator can (1) retry a stuck erasure and have the subject notified when
it succeeds, (2) run the cron once on demand, (3) close a request handled outside the system with a
required note — each re-authorized server-side and recorded in the admin audit trail.

## The gap

An erasure request becomes `confirmed` (not `completed`) when any store fails, and **always** when the
Clerk delete fails after its one inline retry (`confirm.ts`, `self.ts`). Nothing retries it again: the
public confirm link only accepts `email_sent` rows, so the subject can't re-confirm, and the cron only
flags it. It ends as "Deadline passed" on `/erasure` with no action available.

The erasure engine needs the subject's **raw email** (`runErasure(adapters, email, …)`; the Clerk
adapter looks the user up by email). A request row stores only a salted `email_fingerprint`, plus
`user_id` when the subject was signed in (always for the self-service path).

## Design

Every action follows the existing admin write pattern (Settings, role grants): a **server action**
re-checks `isAdmin` and audits via `POST /v1/events` (`kind: "admin"`), then calls a **bearer-gated api
route** (`requireAdminBearer` + `rateLimit`, `APP_API_TOKEN` server-side only).

### 1. Retry a stuck erasure — `POST /v1/erasure-requests/:id/retry`

- **Only for open `confirmed` rows**; anything else → `409 {error:"not_retryable"}`.
- **Resolve the email, never store it:**
  1. `user_id` set and the Clerk user still exists → the api reads its primary email from Clerk
     (`GET /users/{id}`). The usual stuck case (Clerk delete failed), so no typing.
  2. Otherwise the body must carry `email`; the api checks
     `fingerprintEmail(email, GDPR_FINGERPRINT_SALT) === row.email_fingerprint` (constant-time), exactly
     like the public confirm. Mismatch → `400 {error:"email_mismatch"}`. No email and no Clerk user →
     `422 {error:"email_required"}` — the admin then shows the email field.
- **One engine path:** move confirm's live pass into a shared
  `code/shared/api/src/erasure/execute.ts` — `executeErasure(env, row, email, ts)`: dry-run + live
  `runErasure`, the Clerk inline retry, the row update (`completed` / stays `confirmed`, `result`
  receipt), the `erasure.completed` audit row and the completion email (only when Clerk succeeded).
  `confirm.ts` and the retry route both call it; confirm keeps its own token/attempt/fingerprint checks.
- **Response:** `200 {ok:true}` completed · `207 {ok:true, partial:true, errors}` non-Clerk stores
  still failing (stays `confirmed`) · `502 {ok:false, clerk_failed:true}` Clerk still failing.
- Admin audit event `admin.erasure_retry`, target = request id (`erasure:<id>`), written by the server
  action whatever the outcome.

### 2. Run the cron now — `POST /v1/cron/run`

- The api reaches the cron through a **service binding** (`[[env.<env>.services]] binding = "CRON"`,
  `service = "indiecrafts-<env>-shared-cron"`) — private, worker-to-worker.
- The cron's `fetch` gains `POST /run`: it runs the **same** four passes as `scheduled` (one shared
  `runTick(env, scheduledTime)` function), writes a `cron_runs` row, and returns `{status, passes}`
  (`500` when a pass failed). `GET /` stays the health check.
- The cron gets **no public URL** (`workers_dev = false` in every env): only the service binding can
  reach `/run`. No token on the cron.
- The api route: `CRON` unbound → `503 {error:"cron_unbound"}`; otherwise forwards the cron's JSON.
- Admin: a **Run now** button on Scheduled jobs; audit event `admin.cron_run`, target `cron`.
- Rename: `project:rename` rewrites every `indiecrafts-<env>-…` resource name in `wrangler.toml`,
  including the `service =` target — pinned by a test.

### 3. Close a request manually — `POST /v1/erasure-requests/:id/close`

- Body `{note}` — required, trimmed, 5–500 characters, else `400 {error:"note_required"}`.
- **Only open rows** (the monitoring `OPEN` definition); else `409 {error:"not_open"}`.
- Sets `status = 'closed_manual'`, `completed_at = now`, and merges
  `{manualClose: {note, by, at}}` into the `result` JSON (`by` = the admin's Clerk user id, sent by the
  server action). No migration: `status` is free text and `closed_manual` is outside `OPEN`, so the
  row leaves the open list and the cron stops flagging it.
- Audit event `admin.erasure_close`, target `erasure:<id>`.

### 4. Admin UI

- **Erasure requests page:** each open row gets actions —
  - `confirmed` rows: **Retry** (one click; if the api answers `email_required`, an inline email field
    appears — `type="email"`, never persisted client-side), then a toast with the outcome.
  - every open row: **Close manually** — a dialog with the required note, confirm button disabled until
    valid.
  - Closed rows show `closed_manual` with the note in a tooltip/row detail.
- **Scheduled jobs page:** **Run now** button → toast with the run's status; the page refreshes.
- Buttons are `@indiecrafts/packages-web-ui` primitives; strings in `messages/{en,fr}.json`; every
  destructive/irreversible action states what it does before confirming.

## Error handling

- Server actions return `{ok:false, error}` (never throw to the client); the UI shows the translated
  error. `forbidden` when not admin.
- The api routes never 500 on a known condition: `409` wrong state, `400/422` input, `503` unbound
  binding, `502` Clerk still failing. The retry's audit + email follow `confirm.ts`'s rule: a failure
  writing them never turns a committed erasure into a 500.
- The typed email is used for the one request and never logged or stored (log error names only).

## Testing

- **api** (workerd, real D1): retry — not-confirmed → 409; email from Clerk (mocked Clerk client) →
  completed + completion email attempted; no Clerk user + no email → 422; wrong email → 400; Clerk
  still failing → stays confirmed, 502; `confirm.ts` behavior unchanged after the extraction (its
  existing tests stay green). close — note validation, not-open → 409, sets `closed_manual`, leaves the
  open list. cron/run — unbound → 503; bound (test service stub) → forwards the result.
- **cron**: `POST /run` runs the four passes and writes a history row; `GET /` still health;
  `workers_dev = false` in every env (config test).
- **admin**: server actions re-check admin (non-admin → `forbidden`) and audit with the right event;
  messages parity.
- **rename**: `renameResourcePrefix` rewrites the `service =` target.
- Manual: local api + cron (service binding via the local dev registry) + admin; retry a seeded stuck
  row, close one, run the cron from the button.

## Out of scope

- Bulk actions; retrying `pending`/`email_sent` rows (the subject still holds a live link).
- Emailing the operator (the breach-alert gap from the monitoring spec stays open).
- Editing or re-opening a closed request.

## Decisions (confirmed in chat)

1. Retry reads the email from Clerk when possible; otherwise the operator types it (verified against
   the fingerprint, never stored).
2. The cron loses its public workers.dev URL; the api calls it through a service binding.
