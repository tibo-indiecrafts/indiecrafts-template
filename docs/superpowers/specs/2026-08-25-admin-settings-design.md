# Admin-editable settings (retention + ops + backups visibility) — Design

**Status:** draft for review
**Date:** 2026-08-25
**Author:** thibault + Claude
**Related:** [audit-sessions-d1-eu](./2026-08-21-audit-sessions-d1-eu-design.md) ·
[gdpr-compliance-layer](./2026-08-23-gdpr-compliance-layer-design.md) ·
`code/docs/apps/web/config/data-retention.md`

## Goal

Let an operator change **worker-read operational knobs** — retention windows first — from
the admin UI, **without a code change or redeploy**. Today these are hard-coded constants in
the `cron`/`api` workers; changing one is an edit-plus-deploy. This makes them runtime config,
bounded and audited, while keeping the version-controlled defaults as the source of truth and
the disclosed baseline.

## Motivation (what the operator actually asked for)

"Avoid redeploys" — a live knob for a single deployment. **Not** per-client config and **not**
a DPO self-service portal. That scopes this to a runtime store the workers read at tick/request
time with a code-default fallback.

## Guiding principle — match each setting to its reader

The template already has **two** live, no-deploy settings surfaces. The store is chosen by
*who reads the value*, never by convenience. This is the rule that keeps the new D1 table from
becoming a junk drawer.

| Reader | Store | Edited how | Examples |
| --- | --- | --- | --- |
| Website / edge (+ editor-facing) | **Sanity `siteSettings`** singleton | Studio (already live, ~30s edge cache, fail-open) | maintenance mode (exists), brand, SEO, social, cookies, **website-read feature flags** |
| **Workers** (`cron` / `api`) | **D1 `site_settings`** (new) | admin UI → `PUT /v1/settings`, audited | retention windows, SLA warning, link TTLs |
| Infra / security | **Terraform / `@/config`** | version-controlled + deploy | CSP, WAF, edge rate limits, **backup retention** |

Corollary: content-shaped or website-read config already has a home (Sanity). The D1 table is
**only** for knobs the workers read that are too low-level for Sanity.

## Scope

### In

1. **D1 `site_settings`** key/value table (overrides only; empty = code defaults).
2. **Retention ×5** editable + guardrailed + audited:
   `retention.audit_days` (90), `retention.consent_days` (1095, 3yr floor),
   `retention.erasure_request_days` (1095, 3yr floor), `retention.data_request_days` (365),
   `retention.csp_days` (30).
3. **`ops.sla_warning_days`** (7) — cron's erasure-SLA lead time; same shape as retention.
4. **Link TTLs**, editable but **tightly clamped**:
   `ttl.export_download_hours` (1), `ttl.erasure_confirm_hours` (24).
5. **Backups: read-only visibility card** in admin (no control).
6. **Feature-flag placement rule** applied to the flags that exist today
   (`logAnonymousConsent` → Sanity, see §G). No speculative flag console.
7. Admin UI, api routes, cron read path, docs, tests.

### Out (deliberate)

- **Backup retention as an editable value** — it is an R2 bucket lifecycle rule
  (`backup_retention_days`, applied via `wrangler r2 bucket lifecycle`). No worker reads it; a
  D1 value could not actually control R2 expiry — the UI would claim control it lacks. Backups
  are a DR/security control; editability widens an admin-compromise blast radius. Stays
  version-controlled. (Visibility card only — §F.)
- **GDPR legal constants** — the erasure one-month SLA target (`DUE_MS = 30d`,
  `api/erasure/request.ts`) is the law, not a knob. Not editable.
- **CSP / WAF / edge rate limits** — security posture, version-controlled (matches the
  established CSP principle).
- **Per-client / per-env rows** — env differences stay in code/env vars.
- **A generic settings console / batch PUT** — one key per `PUT` (cleaner audit trail); add
  batch only if a "save all" UX demands it.
- **"Run backup now" button** — a safe additive capability, but a new worker→D1-export→R2 path,
  not a setting. Its own future slice.

## Component design

### A. Schema — migration `0008_site_settings.sql`

```sql
CREATE TABLE site_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,        -- integers stored as text (all current keys are ints)
  updated_at TEXT NOT NULL,        -- ISO 8601
  updated_by TEXT NOT NULL         -- Clerk user id of the admin who set it
);
```

Generic key/value (matches the "site_settings" framing) but **only the keys in §B ship**. An
empty table means every value falls back to its code default. The table stores *overrides only*.

> **Pre-req (separate bug):** the merge left a migration-number collision —
> `0004_csp_reports.sql` **and** `0004_erasure_requests.sql`. `applyD1Migrations` /
> `wrangler d1 migrations apply` need unique, ordered numbers. Renumber one (and the chain) so
> the new migration lands cleanly at `0008`. Track/fix this before or alongside this work.

### B. Source of truth — one module in `@indiecrafts/packages-shared-config`

Both workers already depend on this package. Add a pure-data registry + a `clamp` helper,
imported by `cron` (defaults/fallback) and `api` (validation + effective values). It replaces
the inline constants in `cron/src/index.ts` and the TTL constants in the `api`.

```ts
// packages-shared-config — settings registry (React-free, pure data)
export const SETTINGS = {
  "retention.audit_days":           { def: 90,   min: 30,   max: 3650, unit: "days"  },
  "retention.consent_days":         { def: 1095, min: 1095, max: 3650, unit: "days"  }, // 3yr proof floor
  "retention.erasure_request_days": { def: 1095, min: 1095, max: 3650, unit: "days"  }, // 3yr proof floor
  "retention.data_request_days":    { def: 365,  min: 30,   max: 3650, unit: "days"  },
  "retention.csp_days":             { def: 30,   min: 7,    max: 365,  unit: "days"  },
  "ops.sla_warning_days":           { def: 7,    min: 1,    max: 30,   unit: "days"  },
  "ttl.export_download_hours":      { def: 1,    min: 1,    max: 24,   unit: "hours" },
  "ttl.erasure_confirm_hours":     { def: 24,   min: 1,    max: 168,  unit: "hours" },
} as const;

export type SettingKey = keyof typeof SETTINGS;

/** Parse + clamp an override string to its key's [min,max]; null if unknown/invalid. */
export function coerceSetting(key: string, raw: string): number | null {
  const rule = (SETTINGS as Record<string, { min: number; max: number }>)[key];
  if (!rule) return null;
  const n = Number(raw);
  if (!Number.isInteger(n)) return null;
  return Math.min(rule.max, Math.max(rule.min, n));
}

/** Merge DB overrides over defaults; unknown/invalid rows ignored. */
export function effectiveSettings(rows: { key: string; value: string }[]): Record<SettingKey, number> {
  const out = Object.fromEntries(
    Object.entries(SETTINGS).map(([k, r]) => [k, r.def]),
  ) as Record<SettingKey, number>;
  for (const { key, value } of rows) {
    const v = coerceSetting(key, value);
    if (v !== null) out[key as SettingKey] = v;
  }
  return out;
}
```

The `def` values are the disclosed baseline (privacy policy) and the guaranteed fallback.

### C. Cron read path

At tick, the cron reads overrides once and merges:

```ts
async function loadSettings(db?: D1Database): Promise<Record<SettingKey, number>> {
  if (!db) return effectiveSettings([]);                 // fallback: pure defaults
  try {
    const { results } = await db
      .prepare("SELECT key, value FROM site_settings")
      .all<{ key: string; value: string }>();
    return effectiveSettings(results);
  } catch (error) {
    logger.error("settings read failed; using defaults", { name: (error as Error)?.name });
    return effectiveSettings([]);                         // never block the purge on a read
  }
}
```

The purge + SLA flag use `settings["retention.*"]` and `settings["ops.sla_warning_days"]`
instead of the removed constants. Behaviour is **identical** to today when the table is empty.

### D. api routes — `/v1/settings` (bearer-gated)

- `GET /v1/settings` → for each key: `{ key, value: effective, def, min, max, unit, updatedAt, updatedBy }`.
  Feeds the admin form with its own bounds and "overridden" state.
- `PUT /v1/settings` → body `{ key, value }`.
  Validation: `coerceSetting(key, value)` must be non-null **and equal** the submitted integer
  (reject silently-clamped values with `422` + the allowed range, so the operator sees the bound
  rather than a surprise clamp). Unknown key / non-integer → `422`.
  On success: `INSERT … ON CONFLICT(key) DO UPDATE` (`value`, `updated_at`, `updated_by`) **and**
  an `admin_audit` row: `event = "setting_changed"`, actor = caller, target = key, label =
  `"<key>: <old> → <new>"`.

Admin-role enforcement is the **admin app's** responsibility (the trust boundary), same as
`session-log` / `consent-log`: the admin server action resolves Clerk `auth()`, checks the
`admin` role, then forwards to the bearer-gated api with `updated_by = <clerk user id>`. The api
trusts the bearer caller. No new auth mechanism.

### E. api link-TTL reads (export / erasure)

`export/route.ts` (`DOWNLOAD_TTL_MS`) and `erasure/request.ts` (`TOKEN_TTL_MS`) currently use
constants. They read the effective value from `site_settings` at request time (one small helper,
clamped, defaults-on-miss), so the operator's override takes effect without redeploy. `DUE_MS`
(the legal SLA target) is untouched.

To avoid a D1 read on every hot-path request, the api caches the settings map per-isolate for a
short TTL (~30s), mirroring `lib/maintenance.ts`. Fail-open to defaults.

### F. Backups — read-only status (`GET /v1/backups/status`, bearer-gated)

Returns what admin *displays*, no control:

```ts
{
  bucket: string,               // from config (per-env db-backup bucket name)
  retentionDays: number,        // committed backup_retention_days (config constant surfaced)
  preMigrationSnapshots: boolean,// from config (shouldBackupBeforeMigrate policy)
  lastBackupAt: string | null,  // newest object time from an R2 listing, or null/"unknown"
}
```

`lastBackupAt` = the api lists the backup R2 bucket (bind read-only) and takes the newest
object's upload time. If the bucket is unbound, return `null` → the card shows "unknown". No new
D1 table; add a `backup_runs` log only if run *history* is later wanted (deferred).

### G. Feature flags — placement, not a console

Classify each flag by reader (§ principle), place it, stop. Today:

- `logAnonymousConsent` — read in `website/src/app/api/consent-log/route.ts` (**website**) →
  moves to a Sanity `siteSettings` "Compliance / feature flags" group, editor-toggled in Studio
  (the same live no-deploy path as maintenance mode). It does **not** enter the D1 table.

No generic flag system is built (one flag today = YAGNI). The spec records the rule so the next
flag lands in the right store by default.

### H. Admin UI

Two cards in the dashboard, strings in `messages/{en,fr}.json` (never inline):

1. **Settings** card — grouped number inputs (Retention / Ops / Link TTLs), each with label,
   unit, min/max hint, default, and an "overridden" badge; a Save action → server action in the
   existing `(dashboard)/actions.ts` → `PUT /v1/settings`. Shows `updated_at` / `updated_by`.
2. **Backups** card — read-only rows from `GET /v1/backups/status`.

### I. Compliance coupling (the one non-obvious bit)

The 90-day audit window is *disclosed to data subjects* (`data-retention.md` checklist).
Changing a disclosed/proof key silently drifts the disclosure. The Settings card shows an inline
reminder next to `retention.audit_days`, `retention.consent_days`, `retention.erasure_request_days`:
**"Changing this means updating your privacy-policy disclosure."** A visible nudge, not
enforcement — cheap, and it stops silent drift.

## Auth & audit model

- api: bearer (`APP_API_TOKEN`) as today.
- Admin-gating: admin app resolves Clerk `auth()` + `admin` role, forwards `updated_by`.
- Every write → `admin_audit` (`event:"setting_changed"`, old→new). Backups status is read-only.

## Error handling / fallback

- Any settings read failure (unbound DB, query error, invalid row) → **code defaults**. A bad
  override can never break the purge, an export, or a confirm link.
- `PUT` rejects out-of-range / unknown / non-integer with `422` + the allowed range.
- Backups status degrades to `"unknown"` when the bucket is unbound.

## Testing

- **shared-config:** `coerceSetting` (in-range, below-floor, above-ceiling, unknown key,
  non-integer); `effectiveSettings` (empty → defaults, override applied, invalid ignored).
- **cron:** `loadSettings` defaults-when-empty / clamped-override / fallback-on-unbound; extend
  the existing purge + SLA tests to seed an override and assert the effective value is used.
- **api:** `PUT` validation matrix (200 + audit row; 422s) ; `GET /v1/settings` shape;
  export/erasure TTL honors an override + falls back; `GET /v1/backups/status` shape (bound vs
  unbound bucket).
- **admin:** Settings card renders inputs + save action; Backups card renders read-only.

## Docs + changelog

- `data-retention.md`: retention values are now bounded-overridable via admin; document
  defaults + floors + the privacy-policy-drift note.
- New short `config/settings.md` (admin settings surface + the match-by-reader table).
- Log in the `api`, `admin`, `cron`, and docs CHANGELOGs (home altitude each).

## Rollout

Ships defaults-safe: the table starts empty, so behaviour is byte-identical to today until an
operator sets a value. Migration `0008` + the cron/api reads can deploy before any UI. No data
migration; no backfill.

## Open questions

1. `GET /v1/backups/status` `lastBackupAt` — R2 listing (no new table) vs a `backup_runs` log
   (enables history). Spec picks listing; confirm history isn't wanted now.
2. Sanity `siteSettings` "feature flags" group — confirm the admin/Studio is the intended editor
   for `logAnonymousConsent` (vs leaving it a code flag). Spec assumes Studio.
