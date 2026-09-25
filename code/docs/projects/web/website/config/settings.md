---
title: "Admin settings (retention · ops · link TTLs) + Backups visibility"
description: "A handful of worker-read operational knobs — retention windows, an SLA warning lead time, two link TTLs — are now runtime config an operator edits from the a…"
status: stable
---

# Admin settings (retention · ops · link TTLs) + Backups visibility

A handful of **worker-read operational knobs** — retention windows, an SLA warning lead
time, two link TTLs — are now runtime config an operator edits from the admin **Settings**
card, bounded and audited, **without a code change or redeploy**. Design:
`docs/superpowers/specs/2026-08-25-admin-settings-design.md`.

## Guiding principle — match each setting to its reader

The template has three live config surfaces. Which one a setting belongs to is decided by
**who reads the value**, never by convenience — this is what keeps the new D1 table from
becoming a junk drawer for every future flag.

| Reader                           | Store                                                 | Edited how                                        | Examples                                                                  |
| -------------------------------- | ----------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------- |
| Website / edge (+ editor-facing) | Sanity `siteSettings` singleton                       | Studio (already live, ~30s edge cache, fail-open) | maintenance mode, brand, SEO, social, cookies, website-read feature flags |
| **Workers** (`cron` / `api`)     | **D1 `site_settings`** (`main` D1, binding `MAIN_DB`) | Admin UI → `PUT /v1/settings`, audited            | retention windows, SLA warning, link TTLs                                 |
| Infra / security                 | Terraform / `@/config`                                | Version-controlled + deploy                       | CSP, WAF, edge rate limits, **backup retention**                          |

Content-shaped or website-read config already has a home in Sanity. The D1 table is
**only** for knobs the workers (`cron`/`api`) read that are too low-level for Sanity — see
[Feature flags](/projects/web/website/config/feature-flags) for the flag side of this rule.

## The settings registry

Defined once in `@indiecrafts/packages-shared-config` (`src/shared/settings.ts`) — a
version-controlled `SETTINGS` map of defaults + `[min, max]` bounds, imported by both the
`cron` (defaults + read path) and the `api` (validation + effective values):

| Key                              | Default | Bounds      | Unit  | Notes                                                                                     |
| -------------------------------- | ------- | ----------- | ----- | ----------------------------------------------------------------------------------------- |
| `retention.audit_days`           | 90      | 30 – 3650   | days  | `admin_audit` / `session_events` / `security_events` purge — **privacy-policy disclosed** |
| `retention.consent_days`         | 1095    | 1095 – 3650 | days  | `consent_events` purge — 3-year proof floor, **privacy-policy disclosed**                 |
| `retention.erasure_request_days` | 1095    | 1095 – 3650 | days  | `erasure_requests` purge — 3-year proof floor, **privacy-policy disclosed**               |
| `retention.data_request_days`    | 365     | 30 – 3650   | days  | `data_requests` purge                                                                     |
| `retention.csp_days`             | 30      | 7 – 365     | days  | `csp_reports` purge                                                                       |
| `ops.sla_warning_days`           | 7       | 1 – 30      | days  | cron's erasure-SLA lead time (Art. 12(3))                                                 |
| `ttl.export_download_hours`      | 1       | 1 – 24      | hours | `POST /v1/export` download link TTL                                                       |
| `ttl.erasure_confirm_hours`      | 24      | 1 – 168     | hours | erasure confirm-token TTL                                                                 |

The `def` values are the disclosed baseline ([data-retention.md](/projects/web/website/config/data-retention)) and the
guaranteed fallback — see [Retention windows are now admin-overridable](/projects/web/website/config/data-retention#retention-windows-are-now-admin-overridable)
for the compliance-facing detail and the privacy-policy-drift caution.

`coerceSetting(key, raw)` parses + clamps a raw override to its key's bounds (`null` for an
unknown key or a non-integer); `effectiveSettings(rows)` merges D1 override rows over the
code defaults, ignoring anything invalid. **An empty `site_settings` table is byte-identical
to today's hard-coded behavior** — this ships default-safe.

## Storage — D1 `site_settings` (`main` D1, binding `MAIN_DB`, migration `0007`)

```sql
CREATE TABLE site_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,        -- integers stored as text (every current key is an int)
  updated_at TEXT NOT NULL,        -- ISO 8601
  updated_by TEXT NOT NULL         -- Clerk user id of the admin who set it
);
```

Generic key/value, but only the eight keys above ship. The table stores **overrides only**
— a missing row means "use the code default."

## api — `GET`/`PUT /v1/settings` (bearer-gated)

- `GET /v1/settings` → one row per key: `{ key, value: effective, def, min, max, unit,
updatedAt, updatedBy }` — feeds the admin form its own bounds and "overridden" state.
- `PUT /v1/settings` → body `{ key, value, actor }`. `coerceSetting(key, value)` must be
  non-null **and equal** the submitted integer — an out-of-range value is **rejected with
  `422` + the allowed range**, not silently clamped, so the operator sees the bound instead
  of a surprise. On success: `INSERT … ON CONFLICT(key) DO UPDATE` (value/updated_at/
  updated_by) writes `site_settings` on **`MAIN_DB`** — primary, unguarded, so a failure
  surfaces as an error response. Then an `admin_audit` row (`event: "setting_changed"`,
  actor = the caller, target = the key, `ts`/`country` from the request) writes on
  **`AUDIT_DB`** — best-effort: wrapped in try/catch, logged and non-fatal on throw. **Not one
  atomic D1 batch** — `site_settings` and `admin_audit` now live on separate D1 instances,
  so a `AUDIT_DB` failure can leave a setting change with no audit row. The setting change itself
  always succeeds or fails cleanly; only the audit trail is best-effort.

Admin-role enforcement is the **admin app's** job, matching every other admin write: the
`saveSetting` server action re-checks `isAdmin(await auth())` (Clerk), then forwards to the
bearer-gated api with `updated_by`/`actor` = the caller's Clerk user id. The api trusts the
bearer caller — no new auth mechanism.

Two link-TTL reads (`export/route.ts`'s download TTL, `erasure/request.ts`'s confirm-token
TTL) read their effective value from `site_settings` too, cached per-isolate for ~30s
(mirrors `lib/maintenance.ts`) to avoid a D1 read on every hot-path request; fail-open to
the code default on any read error.

## cron — reading the overrides

At tick, the cron calls `loadSettings(env.MAIN_DB)` once and merges the overrides over the
defaults; a read failure (unbound `MAIN_DB`, query error) falls back to pure defaults
rather than blocking the purge or the SLA flag:

```ts
async function loadSettings(
  db?: D1Database,
): Promise<Record<SettingKey, number>> {
  if (!db) return effectiveSettings([]);
  try {
    const { results } = await db
      .prepare("SELECT key, value FROM site_settings")
      .all();
    return effectiveSettings(results);
  } catch {
    return effectiveSettings([]); // never block the purge on a settings read
  }
}
```

The retention purge and the erasure-SLA flag now read `settings["retention.*"]` and
`settings["ops.sla_warning_days"]` instead of the removed hard-coded constants.

## Admin UI — Settings card

`(dashboard)/settings` reads `GET /v1/settings` server-side (the api token stays
server-side, never reaches the browser) and renders grouped number inputs — **Retention /
Ops / Link TTLs**, matching the key prefixes — each with its label, unit, min/max hint, the
code default, and an "Overridden" badge when a D1 row exists. Save calls the `saveSetting`
server action once per changed key (a `PUT /v1/settings` each — no batch endpoint; a
cleaner per-key audit trail was chosen over a "save all"). `retention.audit_days`,
`retention.consent_days`, and `retention.erasure_request_days` — the three disclosed keys —
carry an inline reminder: **"Changing this means updating your privacy-policy
disclosure."**

## Backups — read-only visibility card + history

**Backup retention itself stays out of scope** — it's an R2 bucket lifecycle rule
(`backup_retention_days`, applied via `wrangler r2 bucket lifecycle`), not a D1 value a
worker reads, so a settings-card control would claim control it doesn't have. Backups are a
DR/security control; widening who can edit them widens an admin-compromise blast radius.
The admin **Backups** card is **visibility only**.

Migration `0003` (`audit` D1, binding `AUDIT_DB`) adds `backup_runs` — one row per backup run,
written by the backup scripts (`code/shared/scripts/data/backup.mjs` + the pre-migration
path in `migrate.mjs`) via a fail-soft helper (a logging failure never aborts the backup
itself):

```sql
CREATE TABLE backup_runs (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  db_name     TEXT NOT NULL,        -- which database (content / core / audit / …)
  env         TEXT NOT NULL,        -- dev / staging / prod
  kind        TEXT NOT NULL,        -- 'scheduled' | 'pre-migration' | 'manual'
  r2_key      TEXT,                 -- the object key in the db-backup bucket (null if local-only)
  bytes       INTEGER,
  status      TEXT NOT NULL,        -- 'ok' | 'failed'
  error       TEXT,                 -- short failure label (never PII), null on ok
  started_at  TEXT NOT NULL,
  finished_at TEXT                  -- null while running / on a hard crash — itself a signal
);
CREATE INDEX idx_backup_runs_recent ON backup_runs (db_name, env, started_at DESC);
```

`GET /v1/backups/status` (bearer-gated) returns the bucket name + `retentionDays` +
`preMigrationSnapshots` (from env/config) plus the newest 20 `backup_runs` rows. The admin
`(dashboard)/backups` card renders a summary strip and a recent-runs table, newest first,
and flags a row as **Failed** or **Stuck** (icon + text, never color alone) when
`status === "failed"` or `finishedAt` is still `null`. No `AUDIT_DB` binding, or no rows yet →
the card shows "No backup history recorded yet."

## Feature-flag placement — the same rule, for the future

No generic flag console is built here (one worker-read flag today would be YAGNI). The
match-by-reader rule above is recorded so a **future** flag lands in the right store by
default: a website-read flag → Sanity Studio; a worker-read, purely cosmetic flag → this D1
table. A flag with **data-processing or legal consequences never gets a casual toggle** —
`features.compliance.logAnonymousConsent` (website-read; starts processing personal data
for signed-out visitors when flipped on) stays a version-controlled code flag, not
admin/Studio-editable, on that basis. See [Feature flags](/projects/web/website/config/feature-flags).

## Out of scope (deliberate)

- **Backup retention as an editable value** — stays a version-controlled R2 lifecycle rule (§ above).
- **The GDPR erasure one-month SLA target** (`DUE_MS`, `api/erasure/request.ts`) — the law, not a knob.
- **CSP / WAF / edge rate limits** — security posture, stays version-controlled.
- **Per-client / per-env rows** — env differences stay in code/env vars.
- **A generic settings console / batch `PUT`** — one key per write keeps the audit trail simple.
