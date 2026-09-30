# Cron reliability + admin monitoring — design

**Date:** 2026-09-30 · **Status:** draft, awaiting review · **Card:** QA Runbook card 21 (Cron)

## Goal

The scheduled worker (`code/shared/cron`) must do what it claims, and the operator must be able to
**see** that it does — in the admin, without reading Workers Logs. Today three defects make the cron
fail silently, and no admin view shows whether it ran.

**Success =** every pass runs (or says why it didn't), a missed GDPR deadline always raises a
high-severity flag, one broken pass never blocks the others, and two admin pages show the run
history and the open erasure requests by deadline.

## Defects this fixes

| #   | Defect                                                                                                                                      | Effect today                                                                                                                                                                 |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | `EXPORT_BUCKET` is bound on the api (dev) but on the cron in **no** env.                                                                    | Unread export bundles (a full personal-data copy) and their `export_requests` rows are never deleted. The test passes only because the harness binds the bucket.             |
| D2  | The SLA pass flags a request once (`due_flagged_at IS NULL`).                                                                               | A request flagged "due soon" (medium) never gets the "breach" (high) flag when the one-month deadline passes.                                                                |
| D3  | Passes run in sequence and the first error rethrows.                                                                                        | A failing audit purge also skips the main purge, the SLA check and the export cleanup. Cloudflare does not retry a failed cron run; the next chance is the next hourly tick. |
| D4  | A request whose confirmation link was never clicked stays `email_sent` forever (it becomes `expired` only if someone tries the stale link). | The SLA pass counts it as open, so D2's fix would raise false breach flags.                                                                                                  |

## Design

### 1. Cron passes (code/shared/cron/src/index.ts)

Four named passes, each in its own `try/catch`, each returning a `PassResult`:

```ts
type PassResult = {
  name: "audit_purge" | "main_purge" | "erasure_sla" | "export_cleanup";
  status: "ok" | "failed" | "skipped";
  counts: Record<string, number>; // rows touched, by table/kind
  reason?: string; // skipped: which binding is missing
  error?: string; // failed: the error NAME only (no message — may carry data)
};
```

- A pass whose binding is missing returns `skipped` with a `reason` (e.g. `"EXPORT_BUCKET unbound"`).
- After all four run, the worker writes one `cron_runs` row (§2), then **throws an `AggregateError`**
  if any pass failed — the run is still marked failed in Cloudflare, but every pass had its chance.
- Logic stays inline in `src/index.ts` (one consumer — the repo's ≥2-consumer extraction rule). The
  brief's contrary NEVER is corrected (§6).

**`erasure_sla` pass (D2 + D4):**

1. _Expire lapsed requests:_ `UPDATE erasure_requests SET status = 'expired' WHERE status IN
('pending','email_sent') AND token_expires_at < now`. An unverified request the subject never
   confirmed cannot be actioned; it is closed, not flagged. (Count: `expired`.)
2. _Due soon (medium, once):_ open requests (`status IN ('email_sent','confirmed')`) with
   `due_flagged_at IS NULL AND now <= due_at < now + ops.sla_warning_days` → `security_events`
   `erasure_sla_due`/`medium`; set `due_flagged_at`.
3. _Breached (high, once):_ open requests with `breach_flagged_at IS NULL AND due_at < now` →
   `erasure_sla_breach`/`high`; set `breach_flagged_at` (and `due_flagged_at` if still null).
   A request first seen already breached gets only the high flag.

New migration `code/shared/api/db/main/migrations/0012_erasure_breach_flagged.sql`:
`ALTER TABLE erasure_requests ADD COLUMN breach_flagged_at TEXT;` (forward-only, like 0005).

**`export_cleanup` pass (D1):** unchanged SQL/R2 logic; `skipped` when the bucket is unbound.
`code/shared/cron/wrangler.toml` binds `EXPORT_BUCKET` in every env where the api binds it (dev
today: `indiecrafts-dev-shared-api-exports`). A unit test reads both `wrangler.toml` files and
fails if an env binds `EXPORT_BUCKET` on the api but not on the cron (or to a different bucket) —
the drift that caused D1 can't recur.

### 2. Run history — `cron_runs` (audit D1)

Migration `code/shared/api/db/audit/migrations/0004_cron_runs.sql`:

```sql
CREATE TABLE cron_runs (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  started_at   TEXT NOT NULL,   -- ISO, the scheduled time
  finished_at  TEXT NOT NULL,
  status       TEXT NOT NULL,   -- 'ok' | 'failed' (failed = any pass failed)
  passes       TEXT NOT NULL    -- JSON PassResult[] — counts + error names, no personal data
);
CREATE INDEX idx_cron_runs_recent ON cron_runs (started_at DESC);
```

Written by the cron at the end of each tick (skipped if `AUDIT_DB` is unbound; a write failure is
logged, never masks the pass results). Purged by the `audit_purge` pass at the audit window
(90 days ≈ 2,160 hourly rows).

### 3. API routes (code/shared/api/src/index.ts)

Both bearer-gated (`requireAdminBearer` + `rateLimit`), `GET` only, same shape as
`GET /v1/backups/status`.

**`GET /v1/cron/status`**

```json
{
  "lastRunAt": "…", "stale": false,
  "runs": [{ "startedAt": "…", "finishedAt": "…", "status": "ok", "passes": [ … ] }],
  "erasure": { "open": 2, "dueSoon": 1, "breached": 0 },
  "exports": { "outstanding": 0, "expiredUnswept": 0 }
}
```

- `runs`: the last 24 (a day of hourly ticks). `stale`: no run, or the last run is older than
  2 hours (`STALE_AFTER_MS`, tied in a comment to the hourly `crons` trigger).
- `erasure` / `exports`: live counts from `MAIN_DB`, so the page is right even if the cron is down.
  `expiredUnswept` > 0 means the export cleanup is not doing its job.

**`GET /v1/erasure-requests`**

```json
{
  "open": [{ "id": 12, "status": "confirmed", "requestedAt": "…", "dueAt": "…",
             "state": "dueSoon", "dueFlaggedAt": "…", "breachFlaggedAt": null }],
  "recentClosed": [ … up to 20, newest first … ]
}
```

- `state` ∈ `breached | dueSoon | onTrack` (open) or `closed`; computed server-side with the same
  `ops.sla_warning_days` window the cron uses (one definition).
- **No `email_fingerprint`, no `user_id`** — the view monitors the deadline; the engine does the
  work. Open requests sorted by `due_at` ascending.

### 4. Admin (code/projects/web/surfaces/admin)

- **`/cron` — "Scheduled jobs"** (nav: Operations, after Backups). A status line (last run, OK /
  failed / stale / never ran), the live counts (erasure open · due soon · breached; exports
  outstanding · expired-unswept), and a table of the last 24 runs: time, status, per-pass badges
  (`ok` / `failed: <ErrorName>` / `skipped: <reason>`) with the counts.
- **`/erasure` — "Erasure requests"** (nav: Compliance). Open requests by deadline with a state badge
  (breached = destructive, due soon = warning, on track = neutral) and the flag timestamps; a
  "recently closed" table below.
- **System page:** the `cron` worker row stops saying "no public HTTP surface" and shows the same
  status badge, linking to `/cron`.
- Pattern: server components fetching the api with the server-side token (`fetchBackupsStatus`
  shape, `EMPTY` fallback on any failure), strings in `messages/{en,fr}.json`, shadcn `Table` /
  `Badge` / `Card`, nav entries in `user-interface/lib/nav.ts`.

### 5. Error handling

- Cron: a pass never throws out of its own `try`; the aggregate throw happens after the history row.
- API: unbound DB → empty lists / zero counts, `200` (the page shows "not configured", like backups).
- Admin: any fetch failure → the `EMPTY` state with a visible "api unreachable" line, never a crash.

### 6. Docs + instructions

- Cron brief: drop the contradictory NEVER (inline logic is right at one consumer); "retried" →
  "re-runs on the next hourly tick"; four passes; the history row.
- Docs: `code/docs/shared/cron/index.md` (passes, history, the monitoring pages),
  `code/docs/shared/api/index.md` (two routes), `code/docs/projects/web/admin/index.md` (two pages),
  `data-retention.md` (unverified requests expire; `cron_runs` retention), reference pages for every
  new source file (doc-coverage). CHANGELOGs: cron, api, admin, docs — one entry each.
- QA Runbook card 21: correct binding names and the full retention list; tick what passes.

## Testing

- **cron** (vitest-pool-workers, real D1 + R2): each pass isolated — a forced audit-purge failure
  still runs the other three and writes a `failed` history row, then the tick throws; SLA: due-soon
  → medium once; the same request past due → high once; first-seen-breached → high only; lapsed
  `email_sent` → `expired`, never flagged; export pass `skipped` when unbound; the wrangler binding
  parity test.
- **api**: both routes — bearer required, shape, `state` computation at the window edges, no PII
  fields in the payload, stale flag.
- **admin**: nav test (two new items), messages parity (en/fr), page render with the `EMPTY` state.
- Gates: `pnpm verify`, `test:stories` unaffected, `docs:build`, `check:doc-coverage`.
- **Manual (browser):** local api + cron (`wrangler dev --test-scheduled`) + admin; seed erasure
  rows; trigger `/__scheduled`; confirm both pages. Launch only those three.

## Out of scope

- Alerting (email/Slack) on a failed or stale run — the page and the high-severity security events
  (already emailed by the security-alert path) cover monitoring for now.
- Provisioning `EXPORT_BUCKET` in staging/prod (operator step; the parity test keeps cron in step).
- A cron "run now" button in admin (control, not monitoring).

## Decisions to confirm

1. Unverified requests (`email_sent` past the link's TTL) are **closed as `expired`**, not flagged.
2. The erasure view shows **no identifiers** (no fingerprint, no user id).
3. `stale` = no run for **2 hours**.
