# Admin-editable settings (retention + ops + backups visibility) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let an operator change the workers' operational knobs — retention windows, the erasure-SLA lead time, and the export/erasure link TTLs — from the admin UI without a redeploy, each bounded + audited, plus a read-only backups-history card.

**Architecture:** A generic `site_settings` key/value table in the api's EU D1 stores _overrides only_; one version-controlled registry in `@indiecrafts/packages-shared-config` owns defaults + per-key `[min,max]`. The `cron` reads effective values at tick and the `api` at request time, both falling back to code defaults on any miss. Admin edits through the existing bearer-forwarding pattern (`PUT /v1/settings`), every change written to `admin_audit`. Backups get a `backup_runs` log the backup scripts write, surfaced read-only via `GET /v1/backups/status`.

**Tech Stack:** Cloudflare Workers (`api`, `cron`) · D1 (SQLite) · TypeScript strict · Next.js 16 / React 19 (admin) · vitest-pool-workers · Node ESM scripts.

**Spec:** [`docs/superpowers/specs/2026-08-25-admin-settings-design.md`](../specs/2026-08-25-admin-settings-design.md)

## Global Constraints

- **Defaults live in code** (`@indiecrafts/packages-shared-config`) and are the disclosed baseline + the guaranteed fallback. The tables store overrides/records only. Empty tables ⇒ behaviour byte-identical to today.
- **Never block on a settings read.** Any failure (unbound `DB`, query error, invalid row) ⇒ code defaults. A bad override can never break the purge, an export, or a confirm link.
- **Bearer-gate every `/v1/*` route** (`safeEqual(bearer, env.APP_API_TOKEN)`), mirroring the existing routes in `code/shared/api/src/index.ts`. Admin-role enforcement is the admin app's job (the trust boundary); the api trusts the bearer caller and the `actor` it forwards.
- **`admin_audit` is minimized** — columns are `(ts, event, actor_user_id, target_user_id, country, ip_hash)`. A setting change writes `event="setting_changed"`, `target_user_id=<key>`, `ip_hash NULL`. The old→new value is **not** persisted (no free-text column by design); the current value + `updated_at`/`updated_by` live on the `site_settings` row.
- **`backup_runs.error` is a short non-PII label only** — never a dump path, email, or raw stack.
- **Admin strings live in `messages/{en,fr}.json`** under `admin.*`; never inline. No cross-app imports (admin ↔ api talk over HTTP).
- **`logAnonymousConsent` stays a code flag** — out of scope for editability (spec §G).
- Log each change in exactly one CHANGELOG at its home altitude (`code/packages/CHANGELOG.md` for shared-config, each app's own for cron/api/admin, `code/docs/CHANGELOG.md` for docs).
- **Migration numbering:** new files are `0008_site_settings.sql` and `0009_backup_runs.sql` in `code/shared/api/db/d1/migrations/`. The pre-existing duplicate `0004_*` pair is distinct filenames that sort deterministically (both apply fine) — cosmetic convention debt, **not** touched here.

---

## File Structure

**Created**

- `code/packages/shared/config/src/shared/settings.ts` — the settings registry + `coerceSetting`/`effectiveSettings`.
- `code/packages/shared/config/src/shared/settings.test.ts` — registry unit tests.
- `code/shared/api/db/d1/migrations/0008_site_settings.sql` — the `site_settings` table.
- `code/shared/api/db/d1/migrations/0009_backup_runs.sql` — the `backup_runs` table.
- `code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/settings/page.tsx` — Settings screen (server: read).
- `code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/settings-form.tsx` — Settings form (client: edit + save).
- `code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/backups/page.tsx` — Backups screen (read-only).
- `code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/backups-table.tsx` — Backups runs table (client).

**Modified**

- `code/packages/shared/config/src/shared/index.ts` + `src/index.ts` — re-export the settings module.
- `code/shared/cron/src/index.ts` — replace the inline constants with the registry + `loadSettings(db)`; purge + SLA use effective values.
- `code/shared/cron/src/index.test.ts` — seed a `site_settings` override; assert the purge uses it.
- `code/shared/api/src/index.ts` — add `GET/PUT /v1/settings` and `GET /v1/backups/status`.
- `code/shared/api/src/index.test.ts` — settings + backups route tests.
- `code/shared/api/src/export/route.ts` + `code/shared/api/src/erasure/request.ts` — read TTLs from settings (cached, clamped, fallback).
- `code/shared/scripts/lib/backup-common.mjs` — a `recordBackupRun(...)` writer (wrangler `d1 execute` into the api D1).
- `code/shared/scripts/data/backup.mjs` + `code/shared/scripts/data/migrate.mjs` — call the writer per run.
- `code/shared/scripts/data/backup.test.mjs` (or a new `backup-common.test.mjs`) — the writer builds a valid INSERT + fails soft.
- `code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/actions.ts` — a `saveSetting` server action.
- `code/projects/web/surfaces/admin/src/lib/audit.ts` — extend the event union with `admin.setting_change` (used only if the admin action, not the api, writes the audit — see Task 5 note; the spec routes the audit through the api, so this may be unused).
- `code/projects/web/surfaces/admin/messages/{en,fr}.json` — `admin.settings` + `admin.backups` groups; add the dashboard nav entries.
- Docs: `code/docs/apps/web/config/data-retention.md`, new `code/docs/apps/web/config/settings.md`, `code/docs/.vitepress/config.mts` sidebar; the api/admin/cron/docs CHANGELOGs.

---

## Task 1: Settings registry in shared-config

**Files:**

- Create: `code/packages/shared/config/src/shared/settings.ts`
- Create: `code/packages/shared/config/src/shared/settings.test.ts`
- Modify: `code/packages/shared/config/src/shared/index.ts`, `code/packages/shared/config/src/index.ts`

**Interfaces:**

- Produces: `SETTINGS` (record), `type SettingKey`, `coerceSetting(key: string, raw: string): number | null`, `effectiveSettings(rows: {key:string; value:string}[]): Record<SettingKey, number>`, `SETTING_DEFAULTS: Record<SettingKey, number>`.

- [ ] **Step 1: Write the failing test** — `settings.test.ts`

```ts
import { describe, it, expect } from "vitest";
import {
  SETTINGS,
  coerceSetting,
  effectiveSettings,
  SETTING_DEFAULTS,
} from "./settings";

describe("coerceSetting", () => {
  it("returns an in-range integer unchanged", () => {
    expect(coerceSetting("retention.audit_days", "120")).toBe(120);
  });
  it("clamps below the floor and above the ceiling", () => {
    expect(coerceSetting("retention.consent_days", "10")).toBe(1095); // floor
    expect(coerceSetting("retention.csp_days", "9999")).toBe(365); // ceiling
  });
  it("rejects an unknown key or a non-integer", () => {
    expect(coerceSetting("nope", "1")).toBeNull();
    expect(coerceSetting("retention.audit_days", "1.5")).toBeNull();
    expect(coerceSetting("retention.audit_days", "abc")).toBeNull();
  });
});

describe("effectiveSettings", () => {
  it("returns pure defaults for no rows", () => {
    expect(effectiveSettings([])).toEqual(SETTING_DEFAULTS);
  });
  it("applies a valid override and ignores invalid/unknown rows", () => {
    const got = effectiveSettings([
      { key: "retention.audit_days", value: "120" },
      { key: "retention.consent_days", value: "1" }, // clamped to floor 1095
      { key: "bogus", value: "5" }, // ignored
      { key: "ops.sla_warning_days", value: "x" }, // ignored
    ]);
    expect(got["retention.audit_days"]).toBe(120);
    expect(got["retention.consent_days"]).toBe(1095);
    expect(got["ops.sla_warning_days"]).toBe(
      SETTINGS["ops.sla_warning_days"].def,
    );
  });
});
```

- [ ] **Step 2: Run it to verify it fails**
      Run: `pnpm --filter @indiecrafts/packages-shared-config test`
      Expected: FAIL — `./settings` not found.

- [ ] **Step 3: Write `settings.ts`**

```ts
/**
 * Worker-read operational settings: version-controlled defaults + per-key bounds.
 * The `def` values are the source of truth and the disclosed baseline; the D1
 * `site_settings` table holds only operator overrides, clamped to [min,max] here.
 * Imported by the `cron` (defaults + fallback) and the `api` (validation + effective
 * values). React-free — safe in a bare Worker.
 */
export const SETTINGS = {
  "retention.audit_days": { def: 90, min: 30, max: 3650, unit: "days" },
  "retention.consent_days": { def: 1095, min: 1095, max: 3650, unit: "days" },
  "retention.erasure_request_days": {
    def: 1095,
    min: 1095,
    max: 3650,
    unit: "days",
  },
  "retention.data_request_days": { def: 365, min: 30, max: 3650, unit: "days" },
  "retention.csp_days": { def: 30, min: 7, max: 365, unit: "days" },
  "ops.sla_warning_days": { def: 7, min: 1, max: 30, unit: "days" },
  "ttl.export_download_hours": { def: 1, min: 1, max: 24, unit: "hours" },
  "ttl.erasure_confirm_hours": { def: 24, min: 1, max: 168, unit: "hours" },
} as const satisfies Record<
  string,
  { def: number; min: number; max: number; unit: "days" | "hours" }
>;

export type SettingKey = keyof typeof SETTINGS;

export const SETTING_DEFAULTS = Object.fromEntries(
  Object.entries(SETTINGS).map(([k, r]) => [k, r.def]),
) as Record<SettingKey, number>;

/** Parse + clamp an override string to its key's [min,max]; null if unknown/non-integer. */
export function coerceSetting(key: string, raw: string): number | null {
  const rule = (SETTINGS as Record<string, { min: number; max: number }>)[key];
  if (!rule) return null;
  const n = Number(raw);
  if (!Number.isInteger(n)) return null;
  return Math.min(rule.max, Math.max(rule.min, n));
}

/** Merge DB override rows over the defaults; unknown/invalid rows ignored. */
export function effectiveSettings(
  rows: { key: string; value: string }[],
): Record<SettingKey, number> {
  const out = { ...SETTING_DEFAULTS };
  for (const { key, value } of rows) {
    const v = coerceSetting(key, value);
    if (v !== null) out[key as SettingKey] = v;
  }
  return out;
}
```

- [ ] **Step 4: Re-export** — add to `src/shared/index.ts`: `export * from "./settings";` and confirm `src/index.ts` re-exports `./shared` (it does via the package's `.` entry; if `src/index.ts` uses explicit re-exports, add `export * from "./shared/settings";`).

- [ ] **Step 5: Run tests to verify they pass**
      Run: `pnpm --filter @indiecrafts/packages-shared-config test`
      Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add code/packages/shared/config/src/shared/settings.ts code/packages/shared/config/src/shared/settings.test.ts code/packages/shared/config/src/shared/index.ts code/packages/shared/config/src/index.ts
git commit -m "feat(config): settings registry — defaults + bounds + clamp/merge"
```

---

## Task 2: Migration 0008 + cron reads overrides

**Files:**

- Create: `code/shared/api/db/d1/migrations/0008_site_settings.sql`
- Modify: `code/shared/cron/src/index.ts`, `code/shared/cron/src/index.test.ts`

**Interfaces:**

- Consumes: `SETTINGS`, `SETTING_DEFAULTS`, `SettingKey`, `effectiveSettings` (Task 1).
- Produces: `loadSettings(db?: D1Database): Promise<Record<SettingKey, number>>` in the cron.

- [ ] **Step 1: Create the migration**

```sql
-- 0008_site_settings.sql — operator overrides for worker-read operational knobs.
-- Overrides only; an absent key falls back to its code default (packages-shared-config).
CREATE TABLE site_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  updated_by TEXT NOT NULL
);
```

- [ ] **Step 2: Write the failing test** — extend `code/shared/cron/src/index.test.ts`, inside `describe("retention purges", …)`, add:

```ts
it("purges csp_reports on an operator override (7 days) instead of the 30-day default", async () => {
  // Override the CSP window down to 7 days.
  await env
    .DB!.prepare(
      "INSERT INTO site_settings (key, value, updated_at, updated_by) VALUES ('retention.csp_days', '7', ?, 'user_test')",
    )
    .bind(new Date(NOW).toISOString())
    .run();

  const old = new Date(NOW - 10 * 86_400_000).toISOString(); // 10d — kept at 30d, purged at 7d
  await seedCspReport("website|report|img-src|/c|https://z", old);

  await runScheduled(NOW);

  const row = await env
    .DB!.prepare(
      "SELECT group_key FROM csp_reports WHERE group_key = 'website|report|img-src|/c|https://z'",
    )
    .first();
  expect(row).toBeNull();
});
```

- [ ] **Step 3: Run it to verify it fails**
      Run: `pnpm --filter @indiecrafts/shared-cron test`
      Expected: FAIL — the 10-day-old row survives (default 30d still in force).

- [ ] **Step 4: Rewrite the cron to read settings** — in `code/shared/cron/src/index.ts`:
  - Delete the five `*_RETENTION_DAYS` consts and `SLA_WARNING_DAYS`; import from the registry:
    ```ts
    import {
      effectiveSettings,
      type SettingKey,
    } from "@indiecrafts/packages-shared-config";
    ```
  - Add the loader:
    ```ts
    /** Effective settings for this tick: defaults merged with clamped D1 overrides.
     *  Never throws — any read failure falls back to code defaults. */
    async function loadSettings(
      db?: D1Database,
    ): Promise<Record<SettingKey, number>> {
      if (!db) return effectiveSettings([]);
      try {
        const { results } = await db
          .prepare("SELECT key, value FROM site_settings")
          .all<{ key: string; value: string }>();
        return effectiveSettings(results);
      } catch (error) {
        logger.error("settings read failed; using defaults", {
          name: (error as Error)?.name,
        });
        return effectiveSettings([]);
      }
    }
    ```
  - At the top of `scheduled(...)`, before the cutoffs: `const settings = await loadSettings(env.DB);`
  - Replace each `retentionCutoff(controller.scheduledTime, X_RETENTION_DAYS)` with the effective value, e.g. `retentionCutoff(controller.scheduledTime, settings["retention.audit_days"])`, `settings["retention.consent_days"]`, `settings["retention.csp_days"]`, `settings["retention.data_request_days"]`, `settings["retention.erasure_request_days"]`; and `slaDueSoonCutoff(controller.scheduledTime, settings["ops.sla_warning_days"])`.
  - Keep `retentionCutoff`/`slaDueSoonCutoff`/`slaSeverity` exported (their unit tests stay green).

- [ ] **Step 5: Run tests to verify they pass**
      Run: `pnpm --filter @indiecrafts/shared-cron test`
      Expected: PASS — the new override test + all existing purge/SLA tests (empty table ⇒ defaults).

- [ ] **Step 6: Commit**

```bash
git add code/shared/api/db/d1/migrations/0008_site_settings.sql code/shared/cron/src/index.ts code/shared/cron/src/index.test.ts
git commit -m "feat(cron): read retention/SLA windows from site_settings, default-safe"
```

---

## Task 3: Settings API — GET + PUT `/v1/settings`

**Files:**

- Modify: `code/shared/api/src/index.ts`, `code/shared/api/src/index.test.ts`

**Interfaces:**

- Consumes: `SETTINGS`, `coerceSetting`, `effectiveSettings`, `SettingKey` (Task 1); the `json`/`safeEqual`/`cors` helpers already in `index.ts`.
- Produces HTTP: `GET /v1/settings` → `{ settings: Array<{key,value,def,min,max,unit,updatedAt,updatedBy}> }`; `PUT /v1/settings` `{key,value,actor}` → `{ ok: true }` | `422`/`401`/`400`/`503`.

- [ ] **Step 1: Write the failing tests** — add to `code/shared/api/src/index.test.ts` (bearer `test-token` per `vitest.config.ts`):

```ts
describe("/v1/settings", () => {
  const auth = { authorization: "Bearer test-token" };

  it("401s without the bearer", async () => {
    const res = await SELF.fetch("https://api.test/v1/settings");
    expect(res.status).toBe(401);
  });

  it("GET returns every key with its bounds + effective value", async () => {
    const res = await SELF.fetch("https://api.test/v1/settings", {
      headers: auth,
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      settings: Array<{ key: string; value: number; min: number }>;
    };
    const audit = body.settings.find((s) => s.key === "retention.audit_days");
    expect(audit?.value).toBe(90); // default, no override yet
  });

  it("PUT stores a valid override and writes an admin_audit row", async () => {
    const res = await SELF.fetch("https://api.test/v1/settings", {
      method: "PUT",
      headers: { ...auth, "content-type": "application/json" },
      body: JSON.stringify({
        key: "retention.audit_days",
        value: 120,
        actor: "user_admin",
      }),
    });
    expect(res.status).toBe(200);
    const row = await env.DB.prepare(
      "SELECT value FROM site_settings WHERE key = 'retention.audit_days'",
    ).first<{ value: string }>();
    expect(row?.value).toBe("120");
    const audit = await env.DB.prepare(
      "SELECT event, target_user_id FROM admin_audit WHERE event = 'setting_changed'",
    ).first<{ event: string; target_user_id: string }>();
    expect(audit).toEqual({
      event: "setting_changed",
      target_user_id: "retention.audit_days",
    });
  });

  it("PUT 422s an out-of-range value (below the consent floor) and stores nothing", async () => {
    const res = await SELF.fetch("https://api.test/v1/settings", {
      method: "PUT",
      headers: { ...auth, "content-type": "application/json" },
      body: JSON.stringify({
        key: "retention.consent_days",
        value: 10,
        actor: "user_admin",
      }),
    });
    expect(res.status).toBe(422);
    const body = (await res.json()) as { min: number; max: number };
    expect(body.min).toBe(1095);
  });

  it("PUT 422s an unknown key and a non-integer", async () => {
    for (const value of [
      { key: "nope", value: 1 },
      { key: "retention.audit_days", value: 1.5 },
    ]) {
      const res = await SELF.fetch("https://api.test/v1/settings", {
        method: "PUT",
        headers: { ...auth, "content-type": "application/json" },
        body: JSON.stringify({ ...value, actor: "user_admin" }),
      });
      expect(res.status).toBe(422);
    }
  });
});
```

- [ ] **Step 2: Run to verify it fails**
      Run: `pnpm --filter @indiecrafts/shared-api test`
      Expected: FAIL — route not found (falls through to 404).

- [ ] **Step 3: Implement the route** — in `index.ts`, add before the fall-through, a block modelled on `/v1/csp-reports` for the bearer check:

```ts
// ── Settings — GET (view) / PUT (edit) /v1/settings (bearer-gated; workers read these) ──
if (url.pathname === "/v1/settings") {
  if (request.method === "OPTIONS")
    return new Response(null, { status: 204, headers: cors });
  const bearer = (request.headers.get("authorization") ?? "").replace(
    /^Bearer\s+/i,
    "",
  );
  if (!env.APP_API_TOKEN || !bearer || !safeEqual(bearer, env.APP_API_TOKEN))
    return json({ error: "unauthorized" }, 401, cors);
  if (!env.DB) return json({ error: "unavailable" }, 503, cors);

  if (request.method === "GET") {
    const { results } = await env.DB.prepare(
      "SELECT key, value, updated_at, updated_by FROM site_settings",
    ).all<{
      key: string;
      value: string;
      updated_at: string;
      updated_by: string;
    }>();
    const overrides = new Map(results.map((r) => [r.key, r]));
    const effective = effectiveSettings(results);
    const settings = (Object.keys(SETTINGS) as SettingKey[]).map((key) => {
      const o = overrides.get(key);
      return {
        key,
        value: effective[key],
        def: SETTINGS[key].def,
        min: SETTINGS[key].min,
        max: SETTINGS[key].max,
        unit: SETTINGS[key].unit,
        updatedAt: o?.updated_at ?? null,
        updatedBy: o?.updated_by ?? null,
      };
    });
    return json({ settings }, 200, cors);
  }

  if (request.method === "PUT") {
    let body: { key?: unknown; value?: unknown; actor?: unknown };
    try {
      body = (await request.json()) as typeof body;
    } catch {
      return json({ error: "invalid" }, 400, cors);
    }
    const key = typeof body.key === "string" ? body.key : "";
    const actor =
      typeof body.actor === "string" ? body.actor.slice(0, 128) : "";
    const raw = typeof body.value === "number" ? String(body.value) : "";
    if (!key || !actor || raw === "")
      return json({ error: "invalid" }, 400, cors);
    const rule = (SETTINGS as Record<string, { min: number; max: number }>)[
      key
    ];
    const coerced = coerceSetting(key, raw);
    // Reject rather than silently clamp — the operator sees the bound.
    if (!rule || coerced === null || coerced !== Number(raw))
      return json(
        { error: "out_of_range", min: rule?.min, max: rule?.max },
        422,
        cors,
      );

    const ts = new Date().toISOString();
    await env.DB.batch([
      env.DB.prepare(
        "INSERT INTO site_settings (key, value, updated_at, updated_by) VALUES (?, ?, ?, ?) " +
          "ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at, updated_by = excluded.updated_by",
      ).bind(key, raw, ts, actor),
      env.DB.prepare(
        "INSERT INTO admin_audit (ts, event, actor_user_id, target_user_id, country, ip_hash) VALUES (?, 'setting_changed', ?, ?, ?, NULL)",
      ).bind(ts, actor, key, request.headers.get("cf-ipcountry")),
    ]);
    return json({ ok: true }, 200, cors);
  }

  return json({ error: "method_not_allowed" }, 405, cors);
}
```

Add the import: `import { SETTINGS, coerceSetting, effectiveSettings, type SettingKey } from "@indiecrafts/packages-shared-config";`

- [ ] **Step 4: Run tests to verify they pass**
      Run: `pnpm --filter @indiecrafts/shared-api test`
      Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add code/shared/api/src/index.ts code/shared/api/src/index.test.ts
git commit -m "feat(api): GET/PUT /v1/settings — bounded, audited operator overrides"
```

---

## Task 4: api link TTLs read from settings

**Files:**

- Modify: `code/shared/api/src/export/route.ts`, `code/shared/api/src/erasure/request.ts`, `code/shared/api/src/index.test.ts`

**Interfaces:**

- Consumes: `effectiveSettings`, `SettingKey` (Task 1); the `site_settings` table (Task 2 migration).
- Produces: a shared `readSettings(db, cacheRef)` helper (small, per-isolate ~30s cache) reused by both routes. Put it in a new `code/shared/api/src/settings-cache.ts` and import from both.

- [ ] **Step 1: Write the failing test** — in `index.test.ts`, assert an override changes the stored `expires_at` window. Simplest: set `ttl.export_download_hours` to `2`, drive `POST /v1/export` (authenticated path already covered by existing export tests — reuse their setup), and assert the returned/stored `expires_at` is ~2h out, not 1h. If the export test scaffolding is heavy, instead unit-test the helper directly:

```ts
// settings-cache.test.ts
import { describe, it, expect } from "vitest";
import { env } from "cloudflare:test";
import { readSettings } from "./settings-cache";

describe("readSettings", () => {
  it("returns defaults then an override after it is set", async () => {
    const ref = {
      value: null as null | { at: number; data: Record<string, number> },
    };
    const a = await readSettings(env.DB, ref, 0); // ttl 0 → always fresh
    expect(a["ttl.export_download_hours"]).toBe(1);
    await env.DB.prepare(
      "INSERT INTO site_settings (key,value,updated_at,updated_by) VALUES ('ttl.export_download_hours','2','t','user_x')",
    ).run();
    const b = await readSettings(env.DB, ref, 0);
    expect(b["ttl.export_download_hours"]).toBe(2);
  });
});
```

- [ ] **Step 2: Run to verify it fails**
      Run: `pnpm --filter @indiecrafts/shared-api test`
      Expected: FAIL — `./settings-cache` not found.

- [ ] **Step 3: Implement `settings-cache.ts`**

```ts
import {
  effectiveSettings,
  type SettingKey,
} from "@indiecrafts/packages-shared-config";

type CacheRef = {
  value: null | { at: number; data: Record<SettingKey, number> };
};

/** Per-isolate cached effective settings (default ~30s). Fail-open to defaults. */
export async function readSettings(
  db: D1Database | undefined,
  ref: CacheRef,
  ttlMs = 30_000,
  now = Date.now(),
): Promise<Record<SettingKey, number>> {
  if (ref.value && now - ref.value.at < ttlMs) return ref.value.data;
  let data: Record<SettingKey, number>;
  try {
    const { results } = db
      ? await db
          .prepare("SELECT key, value FROM site_settings")
          .all<{ key: string; value: string }>()
      : { results: [] as { key: string; value: string }[] };
    data = effectiveSettings(results);
  } catch {
    data = effectiveSettings([]);
  }
  ref.value = { at: now, data };
  return data;
}
```

- [ ] **Step 4: Wire the two routes** — in `export/route.ts` replace the `DOWNLOAD_TTL_MS` constant use with `const ttlH = (await readSettings(env.DB, moduleCacheRef))["ttl.export_download_hours"]; const expiresAt = new Date(now + ttlH * 3_600_000).toISOString();` (declare a module-level `const moduleCacheRef = { value: null }`). In `erasure/request.ts` do the same for `TOKEN_TTL_MS` → `ttl.erasure_confirm_hours`. Leave `DUE_MS` (the legal SLA target) untouched.

- [ ] **Step 5: Run tests to verify they pass**
      Run: `pnpm --filter @indiecrafts/shared-api test`
      Expected: PASS (new helper test + existing export/erasure tests still green with defaults).

- [ ] **Step 6: Commit**

```bash
git add code/shared/api/src/settings-cache.ts code/shared/api/src/settings-cache.test.ts code/shared/api/src/export/route.ts code/shared/api/src/erasure/request.ts
git commit -m "feat(api): export/erasure link TTLs read from site_settings (cached, default-safe)"
```

---

## Task 5: Migration 0009 + backup_runs writer

**Files:**

- Create: `code/shared/api/db/d1/migrations/0009_backup_runs.sql`
- Modify: `code/shared/scripts/lib/backup-common.mjs`, `code/shared/scripts/data/backup.mjs`, `code/shared/scripts/data/migrate.mjs`
- Create/Modify test: `code/shared/scripts/data/backup-common.test.mjs`

**Interfaces:**

- Produces: `recordBackupRun(env, { dbName, kind, r2Key, bytes, status, error, startedAt, finishedAt })` — writes one row into the api's D1 via `wrangler d1 execute`, from the api owner dir; **fails soft** (logs, never throws).
- Consumes: `DATABASES`/`APPS` registries (for the api D1 name + owner dir), already imported in `backup.mjs`.

- [ ] **Step 1: Create the migration**

```sql
-- 0009_backup_runs.sql — backup history for the admin read-only card. Written by the
-- backup scripts (wrangler d1 execute); read by GET /v1/backups/status.
CREATE TABLE backup_runs (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  db_name     TEXT NOT NULL,
  env         TEXT NOT NULL,
  kind        TEXT NOT NULL,          -- 'scheduled' | 'pre-migration' | 'manual'
  r2_key      TEXT,
  bytes       INTEGER,
  status      TEXT NOT NULL,          -- 'ok' | 'failed'
  error       TEXT,
  started_at  TEXT NOT NULL,
  finished_at TEXT
);
CREATE INDEX idx_backup_runs_recent ON backup_runs (db_name, env, started_at DESC);
```

- [ ] **Step 2: Write the failing test** — `backup-common.test.mjs`: the writer builds a correct INSERT and never throws when the spawn "fails".

```js
import assert from "node:assert";
import { buildBackupRunInsert } from "./backup-common.mjs"; // pure SQL/arg builder, unit-testable

const { sql, params } = buildBackupRunInsert({
  dbName: "audit",
  env: "prod",
  kind: "manual",
  r2Key: "audit/x.sql",
  bytes: 10,
  status: "ok",
  error: null,
  startedAt: "2026-08-25T00:00:00Z",
  finishedAt: "2026-08-25T00:00:05Z",
});
assert.match(sql, /INSERT INTO backup_runs/);
assert.equal(params.length, 9);
assert.equal(params[0], "audit");
console.log("ok");
```

- [ ] **Step 3: Run to verify it fails**
      Run: `node code/shared/scripts/data/backup-common.test.mjs` (or `pnpm test:scripts`)
      Expected: FAIL — `buildBackupRunInsert` not exported.

- [ ] **Step 4: Implement** in `backup-common.mjs`:
  - `buildBackupRunInsert(run)` → `{ sql, params }` (pure; the 9-arg INSERT above).
  - `recordBackupRun(env, run)` → resolve the `audit` db from `DATABASES` + its owner (`api`) dir from `APPS`; `spawnSync("wrangler", ["d1","execute", <api-d1-name>, "--env", env, "--remote", "--command", sql-with-quoted-params])` from the api dir. Wrap in try/catch → on any failure, `console.warn` and return (never throw). _(Use `--command` with inlined, escaped literals, or write the SQL to a temp file and `--file` — pick whichever avoids shell-escaping bugs; params are all controlled/short.)_

- [ ] **Step 5: Call the writer** — in `backup.mjs`, around each recipe call in the `for (const db of targets)` loop: capture `startedAt` before, then on success `recordBackupRun(env, { dbName: db.name, kind: all ? "manual" : "manual", r2Key, bytes, status: "ok", error: null, startedAt, finishedAt })`; in the `catch (e)` block, `recordBackupRun(env, { ..., status: "failed", error: String(e.message).slice(0,200), finishedAt })`. In `migrate.mjs`'s pre-migration snapshot path, record with `kind: "pre-migration"`. (Have `backupD1`/`backupSanity` return `{ r2Key, bytes }` so the loop can log them.)

- [ ] **Step 6: Run tests to verify they pass**
      Run: `node code/shared/scripts/data/backup-common.test.mjs` then `pnpm test:scripts`
      Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add code/shared/api/db/d1/migrations/0009_backup_runs.sql code/shared/scripts/lib/backup-common.mjs code/shared/scripts/data/backup.mjs code/shared/scripts/data/migrate.mjs code/shared/scripts/data/backup-common.test.mjs
git commit -m "feat(scripts): record each backup run to backup_runs (fail-soft)"
```

---

## Task 6: Backups status API — `GET /v1/backups/status`

**Files:**

- Modify: `code/shared/api/src/index.ts`, `code/shared/api/src/index.test.ts`

**Interfaces:**

- Produces HTTP: `GET /v1/backups/status` → `{ bucket, retentionDays, preMigrationSnapshots, runs: Array<{dbName,env,kind,status,bytes,error,startedAt,finishedAt}> }` (runs newest-first, capped at 20).
- `bucket`/`retentionDays`/`preMigrationSnapshots` come from env/config constants surfaced on the api (add `BACKUP_BUCKET`, `BACKUP_RETENTION_DAYS` to `[vars]` in the api `wrangler.toml`, or a small constant module — prefer `[vars]` so they track the Terraform value).

- [ ] **Step 1: Write the failing test**

```ts
describe("/v1/backups/status", () => {
  const auth = { authorization: "Bearer test-token" };
  it("401s without the bearer", async () => {
    expect(
      (await SELF.fetch("https://api.test/v1/backups/status")).status,
    ).toBe(401);
  });
  it("returns recent runs newest-first", async () => {
    await env.DB.prepare(
      "INSERT INTO backup_runs (db_name,env,kind,status,started_at,finished_at) VALUES ('audit','prod','manual','ok','2026-08-24T00:00:00Z','2026-08-24T00:00:03Z')",
    ).run();
    const res = await SELF.fetch("https://api.test/v1/backups/status", {
      headers: auth,
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      runs: Array<{ dbName: string; status: string }>;
    };
    expect(body.runs[0]).toMatchObject({ dbName: "audit", status: "ok" });
  });
});
```

- [ ] **Step 2: Run to verify it fails** → 404. `pnpm --filter @indiecrafts/shared-api test`

- [ ] **Step 3: Implement** the bearer-gated GET block (mirror Task 3's auth): read `SELECT ... FROM backup_runs ORDER BY started_at DESC LIMIT 20`, map to camelCase, and attach `bucket: env.BACKUP_BUCKET ?? null`, `retentionDays: Number(env.BACKUP_RETENTION_DAYS ?? 30)`, `preMigrationSnapshots: true`. Empty/absent DB ⇒ `runs: []`.

- [ ] **Step 4: Run tests** → PASS.

- [ ] **Step 5: Commit**

```bash
git add code/shared/api/src/index.ts code/shared/api/src/index.test.ts code/shared/api/wrangler.toml
git commit -m "feat(api): GET /v1/backups/status — read-only backup history"
```

---

## Task 7: Admin Settings card

**Files:**

- Create: `.../(dashboard)/settings/page.tsx`, `.../(dashboard)/settings-form.tsx`
- Modify: `.../(dashboard)/actions.ts`, `admin/messages/{en,fr}.json`, the dashboard nav/index page

**Interfaces:**

- Consumes: `GET/PUT /v1/settings` (Tasks 3). Mirrors `data-requests/page.tsx` for the read and `actions.ts` `requireAdmin()` for the write.

- [ ] **Step 1** — `settings/page.tsx` (server): `fetchSettings()` GET `/v1/settings` with `API_URL`+`APP_API_TOKEN` bearer (copy the `data-requests/page.tsx` fetch shape); `setRequestLocale`; render `<main>` heading + `<SettingsForm settings={...} />`. Strings via `getTranslations("admin.settings")`.

- [ ] **Step 2** — `settings-form.tsx` (client): grouped number inputs (Retention / Ops / Link TTLs), each with unit + `min`/`max` attrs + default + an "overridden" badge when `updatedAt`; on Save call the `saveSetting` server action per changed field; show the privacy-policy-drift reminder next to `retention.audit_days`/`consent_days`/`erasure_request_days`. Visible `focus-visible` ring; no state-by-color-only; one `<main>` lives in the page, not here.

- [ ] **Step 3** — `actions.ts` `saveSetting`:

```ts
export async function saveSetting(key: string, value: number): Promise<Result> {
  let actor: string;
  try {
    actor = await requireAdmin();
  } catch {
    return { ok: false, error: "forbidden" };
  }
  const url = process.env.API_URL,
    token = process.env.APP_API_TOKEN;
  if (!url || !token) return { ok: false, error: "failed" };
  try {
    const res = await fetch(`${url}/v1/settings`, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ key, value, actor }),
    });
    return res.ok ? { ok: true } : { ok: false, error: "failed" };
  } catch {
    return { ok: false, error: "failed" };
  }
}
```

- [ ] **Step 4** — add `admin.settings.*` copy to `messages/{en,fr}.json` (title, subtitle, group labels, each key label, unit words, "overridden", save, saved, error, the drift reminder), and a dashboard nav entry.

- [ ] **Step 5: Verify** — `pnpm --filter @indiecrafts/web-surfaces-admin tsc` clean; render at 375/768/1280 per the visual-verification rule and screenshot the card (the settings form is a real UI change). Add a small `settings-form` story/test if the admin app has the story harness; otherwise a light server-action unit test.

- [ ] **Step 6: Commit**

```bash
git add "code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/settings" "code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/settings-form.tsx" "code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/actions.ts" code/projects/web/surfaces/admin/messages/en.json code/projects/web/surfaces/admin/messages/fr.json
git commit -m "feat(admin): Settings card — edit retention/ops/TTL knobs"
```

---

## Task 8: Admin Backups card (read-only)

**Files:**

- Create: `.../(dashboard)/backups/page.tsx`, `.../(dashboard)/backups-table.tsx`
- Modify: `admin/messages/{en,fr}.json`, dashboard nav

- [ ] **Step 1** — `backups/page.tsx` (server): fetch `GET /v1/backups/status`; render bucket + retention + pre-migration + a runs table; empty ⇒ "no backup history". Copy the `data-requests/page.tsx` shape.
- [ ] **Step 2** — `backups-table.tsx` (client): rows newest-first; a failed/stuck (`finishedAt == null`) run flagged by icon+text (never color alone).
- [ ] **Step 3** — `admin.backups.*` copy + nav entry.
- [ ] **Step 4: Verify** — tsc clean; screenshot at the three widths.
- [ ] **Step 5: Commit**

```bash
git commit -m "feat(admin): read-only Backups history card"
```

---

## Task 9: Docs + changelogs

**Files:**

- Modify: `code/docs/apps/web/config/data-retention.md`, `code/docs/.vitepress/config.mts`
- Create: `code/docs/apps/web/config/settings.md`
- Modify: `code/shared/api/CHANGELOG.md`, `code/shared/cron/CHANGELOG.md`, `code/projects/web/surfaces/admin/CHANGELOG.md`, `code/packages/CHANGELOG.md`, `code/docs/CHANGELOG.md`

- [ ] **Step 1** — `data-retention.md`: note retention windows are now bounded-overridable via admin (defaults + floors unchanged); add the privacy-policy-drift caution.
- [ ] **Step 2** — new `settings.md`: the admin settings surface + the match-by-reader table (worker→D1, website→Sanity, infra→version-controlled); backups read-only + history. Add the sidebar line in `config.mts` (same change).
- [ ] **Step 3** — one CHANGELOG line per area at its home altitude, each with a plain-language _why_.
- [ ] **Step 4: Commit**

```bash
git commit -m "docs(settings): admin settings surface + retention-override notes"
```

---

## Self-Review

- **Spec coverage:** retention×5 + SLA (T1–T3) ✅ · link TTLs (T4) ✅ · site_settings schema (T2) ✅ · backups history + card (T5,T6,T8) ✅ · settings card (T7) ✅ · audit on write (T3) ✅ · defaults-safe fallback (T1,T2,T4) ✅ · `logAnonymousConsent` stays code flag — no task, correct ✅ · docs (T9) ✅. Migration-dup: intentionally not renumbered (Global Constraints) — new files sort after regardless.
- **Placeholders:** none — each code step carries real code or a precise "mirror `<named live file>`" for boilerplate the repo already establishes.
- **Type consistency:** `SETTINGS`/`SettingKey`/`coerceSetting`/`effectiveSettings` names match across T1→T4; the api `json`/`safeEqual`/`cors` helpers exist in `index.ts`; `admin_audit` column list matches the live `/v1/events` insert; cron migration source (`../api/db/d1/migrations`) sees `0008` for T2's test.
- **Open detail (settle in T5/T6):** cap the runs list (20) and whether to prune old `backup_runs` on the cron retention pass — add an `ops.backup_history_days` key only if wanted; default: leave unbounded for now (low volume).

## Execution Handoff

Plan saved to `docs/superpowers/plans/2026-08-25-admin-settings.md`. Two execution options:

1. **Subagent-Driven (recommended)** — a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — tasks in this session with checkpoints.

Which approach?
