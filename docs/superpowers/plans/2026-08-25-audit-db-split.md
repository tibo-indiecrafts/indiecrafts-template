# Split the api D1 into `core` + `audit` — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the single EU D1 owned by `@indiecrafts/shared-api` into two D1s — `core` (identity/rights/settings) and `audit` (telemetry firehose) — both owned by the `api` worker, so a firehose migration or write spike can't threaten identity/consent data.

**Architecture:** The `api` worker holds two D1 bindings, `CORE_DB` and `DB` (audit). Consumers reach data only through the `api` HTTP surface, so nothing outside the worker changes. Erasure/export already run across independent stores via `runErasure(adapters[])`; the single D1 adapter splits into two adapters and joins that array. No cross-DB transaction is introduced (there is none today across D1+Clerk+Sanity).

**Tech Stack:** Cloudflare Workers · wrangler · D1 (SQLite) · TypeScript · vitest.

**Spec:** `docs/superpowers/specs/2026-08-25-audit-db-split-design.md` (read it alongside this plan).

## Global Constraints

- **Table assignment (verbatim):** `core` = `user_profiles`, `consent_events`, `data_requests`, `erasure_requests`, `export_requests`, `site_settings`. `audit` = `session_events`, `security_events`, `admin_audit`, `csp_reports`, `backup_runs`.
- **Bindings:** `CORE_DB` = core; `DB` = audit (unchanged name). Both on the `api` worker and the `cron` worker.
- **Erasure behaviour must not change** — same tables scrubbed, same policy (user_profiles→pseudonymise, consent_events→pseudonymise, session_events→delete, security_events→pseudonymise high/critical + delete rest, admin_audit→retain).
- **No new cross-DB transaction.** Completeness is measured by the `runErasure` receipt (`stores[]` present, `errors[]` empty), not a DB transaction.
- **Verify at every step:** `pnpm --filter @indiecrafts/shared-api tsc` and `pnpm --filter @indiecrafts/shared-api test`. tsc stays green throughout (both bindings are valid `Env` fields); the erasure tests are the correctness gate.
- **No live data** (template; wrangler has `PASTE_D1_ID_HERE`) — migrations may be renumbered freely; no data migration.
- **Run from repo root.** Direct-to-`main` is this repo's convention.

---

## File structure

- `code/shared/scripts/lib/databases.mjs` — add the `core` DB row; repoint `audit` `dir`.
- `code/shared/api/db/core/migrations/*` — new; the 7 core-table migrations, renumbered.
- `code/shared/api/db/audit/migrations/*` — renamed from `db/d1/migrations/`; the 3 audit migrations, renumbered (fixes the duplicate-`0004` collision).
- `code/shared/api/wrangler.toml` — add a `CORE_DB` `[[env.<env>.d1_databases]]` block per env.
- `code/shared/api/src/env.d.ts` (or wherever `Env` is typed) — add `CORE_DB?: D1Database`.
- `code/shared/api/src/erasure/d1.ts` — split `createD1ErasureAdapter` → `createCoreErasureAdapter` + `createAuditErasureAdapter`.
- `code/shared/api/src/erasure/confirm.ts` + `self.ts` — update the adapter array.
- `code/shared/api/src/{index.ts, settings-cache.ts, data-request/route.ts, erasure/request.ts, erasure/status.ts, export/route.ts}` — binding sweep (core-table queries → `env.CORE_DB`).
- `code/shared/cron/src/index.ts` — add `CORE_DB`; route passes per binding.
- Docs: `api`/`cron`/`db` briefs, setup + config docs, `CHANGELOG`.

---

## Task 1: Scaffold the `core` DB (structural, no behaviour change)

**Files:**
- Modify: `code/shared/scripts/lib/databases.mjs`
- Rename: `code/shared/api/db/d1/` → `code/shared/api/db/audit/`, then move 7 files into `code/shared/api/db/core/migrations/`
- Modify: `code/shared/api/wrangler.toml`
- Modify: `code/shared/api/src/env.d.ts` (the `Env` interface)
- Test: `code/shared/scripts/lib/databases.test.mjs`

**Interfaces:**
- Produces: registry rows `audit` (binding `DB`, dir `code/shared/api/db/audit`) + `core` (binding `CORE_DB`, dir `code/shared/api/db/core`); `Env.CORE_DB?: D1Database`.

- [ ] **Step 1: Registry — add the `core` row and repoint `audit`.** In `databases.mjs`, replace the stale `audit` comment + row with:

```js
  // Two EU D1s, both owned by `api`, both `--location weur` (create-time + immutable):
  //   core  (binding CORE_DB) — identity/rights/settings: user_profiles, consent_events,
  //         data_requests, erasure_requests, export_requests, site_settings.
  //   audit (binding DB) — append-only telemetry firehose: session_events, security_events,
  //         admin_audit, csp_reports, backup_runs; retention-purged by the `cron` worker.
  // Split so a firehose migration/write-spike can't threaten identity data (spec 2026-08-25).
  {
    name: "core",
    kind: "d1",
    owner: "api",
    binding: "CORE_DB",
    altitude: "global",
    dir: "code/shared/api/db/core",
    backup: "wrangler",
    order: 8,
  },
  {
    name: "audit",
    kind: "d1",
    owner: "api",
    binding: "DB",
    altitude: "global",
    dir: "code/shared/api/db/audit",
    backup: "wrangler",
    order: 10,
  },
```

Also delete the commented reserved `core` slot further down (now real).

- [ ] **Step 2: Reorganize migrations** (fixes the duplicate-`0004`). Run from repo root:

```bash
cd code/shared/api/db
git mv d1 audit
mkdir -p core/migrations
git mv audit/migrations/0002_user_profiles.sql      core/migrations/0001_user_profiles.sql
git mv audit/migrations/0003_consent_events.sql     core/migrations/0002_consent_events.sql
git mv audit/migrations/0004_erasure_requests.sql   core/migrations/0003_erasure_requests.sql
git mv audit/migrations/0005_export_requests.sql    core/migrations/0004_export_requests.sql
git mv audit/migrations/0006_erasure_due_flagged.sql core/migrations/0005_erasure_due_flagged.sql
git mv audit/migrations/0007_data_requests.sql      core/migrations/0006_data_requests.sql
git mv audit/migrations/0008_site_settings.sql      core/migrations/0007_site_settings.sql
git mv audit/migrations/0004_csp_reports.sql        audit/migrations/0002_csp_reports.sql
git mv audit/migrations/0009_backup_runs.sql        audit/migrations/0003_backup_runs.sql
```

Result: `audit/migrations/` = `0001_init.sql` (admin_audit + session_events + security_events), `0002_csp_reports.sql`, `0003_backup_runs.sql`. `core/migrations/` = the 7 above.

- [ ] **Step 3: wrangler — add a `CORE_DB` block per env.** After each `[[env.<env>.d1_databases]]` `binding = "DB"` block in `code/shared/api/wrangler.toml`, add (substitute `dev`/`staging`/`prod`):

```toml
[[env.dev.d1_databases]]
binding = "CORE_DB"
database_name = "indiecrafts-dev-shared-api-core"
database_id = "PASTE_CORE_D1_ID_HERE"
```

Update the header comment (lines ~122-130) to describe two D1s (`DB` = audit firehose, `CORE_DB` = identity/rights/settings), both `--location weur`.

- [ ] **Step 4: Add the binding to `Env`.** In the `Env` interface (grep `interface Env` under `code/shared/api/src`), add beside `DB?: D1Database;`:

```ts
  /** EU D1 (binding CORE_DB) — identity/rights/settings: user_profiles, consent_events,
   *  data_requests, erasure_requests, export_requests, site_settings. */
  CORE_DB?: D1Database;
```

- [ ] **Step 5: Update the registry test.** In `databases.test.mjs`, add assertions that a `core` row exists (kind `d1`, owner `api`, binding `CORE_DB`) and `audit`'s `dir` is `code/shared/api/db/audit`.

Run: `node --test code/shared/scripts/lib/databases.test.mjs` (or `pnpm test` in that scope) — Expected: PASS.

- [ ] **Step 6: Verify + commit.**

Run: `pnpm --filter @indiecrafts/shared-api tsc` — Expected: PASS (CORE_DB is defined but unused so far).

```bash
git add code/shared/scripts/lib/databases.mjs code/shared/scripts/lib/databases.test.mjs code/shared/api/db code/shared/api/wrangler.toml code/shared/api/src
git commit -m "refactor(db): scaffold the core D1 (registry, migrations split, CORE_DB binding)"
```

---

## Task 2: Split the D1 erasure adapter (test-first — the correctness centerpiece)

**Files:**
- Modify: `code/shared/api/src/erasure/d1.ts` (split into two adapters)
- Test: `code/shared/api/src/erasure/d1.test.ts` (split into core + audit fixtures)

**Interfaces:**
- Consumes: `ErasureAdapter` from `@indiecrafts/packages-shared-compliance/shared`; `fingerprintEmail` from `@indiecrafts/packages-shared-security/crypto`.
- Produces:
  - `createCoreErasureAdapter(coreDb: D1Database, salt: string): ErasureAdapter` — name `"d1-core"`; owns `user_profiles`, `consent_events`.
  - `createAuditErasureAdapter(auditDb: D1Database, coreDb: D1Database, salt: string): ErasureAdapter` — name `"d1-audit"`; owns `session_events`, `security_events`; reads `coreDb.user_profiles` to resolve `user_id`.
  - `resolveSubject(coreDb, email, salt): Promise<{ userId: string | null; fp: string }>` — shared resolver (reads `core.user_profiles`).

- [ ] **Step 1: Write the failing tests.** In `d1.test.ts`, seed a `core` fixture (user_profiles + consent_events) and an `audit` fixture (session_events + security_events), then:

```ts
// Core adapter pseudonymises identity, leaves audit alone.
it("core adapter pseudonymises user_profiles + consent_events", async () => {
  const core = createCoreErasureAdapter(coreDb, SALT);
  const res = await core.anonymize(EMAIL);
  expect(res.store).toBe("d1-core");
  expect(res.anonymized.user_profiles).toBe(1);
  expect(res.anonymized.consent_events).toBeGreaterThanOrEqual(1);
  const prof = await coreDb.prepare("SELECT email, anonymized FROM user_profiles WHERE user_id = ?").bind(USER).first();
  expect(prof.email).toMatch(/@anonymized\.local$/);
  expect(prof.anonymized).toBe(1);
});

// Audit adapter resolves user_id FROM core, then scrubs audit.
it("audit adapter resolves via core and scrubs session/security", async () => {
  const audit = createAuditErasureAdapter(auditDb, coreDb, SALT);
  await audit.anonymize(EMAIL);       // security_events high/critical → fingerprint
  const del = await audit.delete(EMAIL); // session_events + low/med security deleted
  expect(del.store).toBe("d1-audit");
  expect(del.deleted.session_events).toBeGreaterThanOrEqual(1);
  const sess = await auditDb.prepare("SELECT COUNT(*) c FROM session_events WHERE user_id = ?").bind(USER).first();
  expect(sess.c).toBe(0);
});
```

- [ ] **Step 2: Run tests to verify they fail.** Run: `pnpm --filter @indiecrafts/shared-api test src/erasure/d1.test.ts` — Expected: FAIL (`createCoreErasureAdapter`/`createAuditErasureAdapter` not defined).

- [ ] **Step 3: Implement the split.** Replace `d1.ts` with two adapters sharing the resolver. The SQL is copied verbatim from the current adapter, partitioned by DB:

```ts
import { fingerprintEmail } from "@indiecrafts/packages-shared-security/crypto";
import type { ErasureAdapter, AdapterPreview, AdapterResult } from "@indiecrafts/packages-shared-compliance/shared";

// Resolve the Clerk user_id + fingerprint for an email from core.user_profiles.
// Falls back to a plaintext email match (a profile row can predate the fingerprint).
export async function resolveSubject(coreDb: D1Database, email: string, salt: string) {
  const fp = await fingerprintEmail(email, salt);
  const row = await coreDb
    .prepare("SELECT user_id FROM user_profiles WHERE email_fingerprint = ? OR LOWER(email) = ?")
    .bind(fp, email.toLowerCase().trim())
    .first<{ user_id: string }>();
  return { userId: row?.user_id ?? null, fp };
}

// CORE adapter — identity + consent (pseudonymise).
export function createCoreErasureAdapter(coreDb: D1Database, salt: string): ErasureAdapter {
  const countFor = async (sql: string, ...b: unknown[]) =>
    (await coreDb.prepare(sql).bind(...b).first<{ c: number }>())?.c ?? 0;
  return {
    name: "d1-core",
    async findByEmail(email) {
      const { fp } = await resolveSubject(coreDb, email, salt);
      const n = await countFor("SELECT COUNT(*) c FROM user_profiles WHERE email_fingerprint = ?", fp);
      return { found: n > 0, detail: { user_profiles: n } };
    },
    async export(email) {
      const { userId, fp } = await resolveSubject(coreDb, email, salt);
      const all = async (sql: string, ...b: unknown[]) => (await coreDb.prepare(sql).bind(...b).all()).results;
      return {
        user_profiles: await all("SELECT * FROM user_profiles WHERE email_fingerprint = ?", fp),
        consent_events: await all("SELECT * FROM consent_events WHERE subject_id = ? OR email_fingerprint = ?", userId ?? "", fp),
      };
    },
    async preview(email): Promise<AdapterPreview> {
      const { userId, fp } = await resolveSubject(coreDb, email, salt);
      if (!userId) return { store: "d1-core", wouldAnonymize: {}, wouldDelete: {} };
      return {
        store: "d1-core",
        wouldAnonymize: {
          user_profiles: await countFor("SELECT COUNT(*) c FROM user_profiles WHERE email_fingerprint = ?", fp),
          consent_events: await countFor("SELECT COUNT(*) c FROM consent_events WHERE subject_id = ?", userId),
        },
        wouldDelete: {},
      };
    },
    async anonymize(email): Promise<AdapterResult> {
      const { userId, fp } = await resolveSubject(coreDb, email, salt);
      if (!userId) return { store: "d1-core", anonymized: {}, deleted: {} };
      const p = await coreDb
        .prepare("UPDATE user_profiles SET email = ?, full_name = ?, deleted_at = ?, anonymized = 1 WHERE user_id = ?")
        .bind(`deleted_${userId}@anonymized.local`, "Deleted User", new Date().toISOString(), userId).run();
      const con = await coreDb
        .prepare("UPDATE consent_events SET subject_id = ?, subject_type = 'visitor' WHERE subject_id = ?")
        .bind(fp, userId).run();
      return { store: "d1-core", anonymized: { user_profiles: p.meta?.changes ?? 0, consent_events: con.meta?.changes ?? 0 }, deleted: {} };
    },
    async delete() {
      return { store: "d1-core", anonymized: {}, deleted: {} }; // core pseudonymises; nothing hard-deleted
    },
  };
}

// AUDIT adapter — session/security firehose. Reads core to resolve user_id, writes audit.
export function createAuditErasureAdapter(auditDb: D1Database, coreDb: D1Database, salt: string): ErasureAdapter {
  const countFor = async (sql: string, ...b: unknown[]) =>
    (await auditDb.prepare(sql).bind(...b).first<{ c: number }>())?.c ?? 0;
  return {
    name: "d1-audit",
    async findByEmail(email) {
      const { userId } = await resolveSubject(coreDb, email, salt);
      if (!userId) return { found: false };
      const n = await countFor("SELECT COUNT(*) c FROM session_events WHERE user_id = ?", userId);
      return { found: n > 0, detail: { session_events: n } };
    },
    async export(email) {
      const { userId } = await resolveSubject(coreDb, email, salt);
      const all = async (sql: string, ...b: unknown[]) => (await auditDb.prepare(sql).bind(...b).all()).results;
      return {
        session_events: userId ? await all("SELECT * FROM session_events WHERE user_id = ?", userId) : [],
        security_events: userId ? await all("SELECT * FROM security_events WHERE user_id = ?", userId) : [],
      };
    },
    async preview(email): Promise<AdapterPreview> {
      const { userId } = await resolveSubject(coreDb, email, salt);
      if (!userId) return { store: "d1-audit", wouldAnonymize: {}, wouldDelete: {} };
      return {
        store: "d1-audit",
        wouldAnonymize: {
          security_events_high: await countFor("SELECT COUNT(*) c FROM security_events WHERE user_id = ? AND severity IN ('high','critical')", userId),
        },
        wouldDelete: {
          session_events: await countFor("SELECT COUNT(*) c FROM session_events WHERE user_id = ?", userId),
          security_events_deleted: await countFor("SELECT COUNT(*) c FROM security_events WHERE user_id = ? AND severity NOT IN ('high','critical')", userId),
        },
      };
    },
    async anonymize(email): Promise<AdapterResult> {
      const { userId, fp } = await resolveSubject(coreDb, email, salt);
      if (!userId) return { store: "d1-audit", anonymized: {}, deleted: {} };
      const sec = await auditDb
        .prepare("UPDATE security_events SET user_id = ? WHERE user_id = ? AND severity IN ('high','critical')")
        .bind(fp, userId).run();
      return { store: "d1-audit", anonymized: { security_events: sec.meta?.changes ?? 0 }, deleted: {} };
    },
    async delete(email): Promise<AdapterResult> {
      const { userId } = await resolveSubject(coreDb, email, salt);
      if (!userId) return { store: "d1-audit", anonymized: {}, deleted: {} };
      const ses = await auditDb.prepare("DELETE FROM session_events WHERE user_id = ?").bind(userId).run();
      const sec = await auditDb
        .prepare("DELETE FROM security_events WHERE user_id = ? AND severity NOT IN ('high','critical')")
        .bind(userId).run();
      return { store: "d1-audit", anonymized: {}, deleted: { session_events: ses.meta?.changes ?? 0, security_events: sec.meta?.changes ?? 0 } };
    },
  };
}
```

Note: `admin_audit` is untouched by erasure (retained), same as today — it simply has no adapter statement.

- [ ] **Step 4: Run tests to verify they pass.** Run: `pnpm --filter @indiecrafts/shared-api test src/erasure/d1.test.ts` — Expected: PASS.

- [ ] **Step 5: Commit.**

```bash
git add code/shared/api/src/erasure/d1.ts code/shared/api/src/erasure/d1.test.ts
git commit -m "refactor(erasure): split the D1 adapter into core + audit (audit resolves via core)"
```

---

## Task 3: Wire the two adapters into the erasure/export composition

**Files:**
- Modify: `code/shared/api/src/erasure/confirm.ts` (`defaultAdapters`, ~line 83)
- Modify: `code/shared/api/src/erasure/self.ts` (its adapter array)
- Test: `code/shared/api/src/erasure/confirm.test.ts` (completeness receipt)

**Interfaces:**
- Consumes: `createCoreErasureAdapter`, `createAuditErasureAdapter` from `./d1` (Task 2).

- [ ] **Step 1: Update the imports + arrays.** In `confirm.ts` replace `import { createD1ErasureAdapter } from "./d1";` with `import { createCoreErasureAdapter, createAuditErasureAdapter } from "./d1";`, and in `defaultAdapters` replace the single `createD1ErasureAdapter(env.DB!, env.GDPR_FINGERPRINT_SALT!)` line with:

```ts
    createCoreErasureAdapter(env.CORE_DB!, env.GDPR_FINGERPRINT_SALT!),
    createAuditErasureAdapter(env.DB!, env.CORE_DB!, env.GDPR_FINGERPRINT_SALT!),
```

Apply the identical change in `self.ts`.

- [ ] **Step 2: Update the completeness test.** In `confirm.test.ts`, assert the receipt's `stores[]` now contains both `"d1-core"` and `"d1-audit"` (plus clerk/sanity/orders) and `errors` is empty.

- [ ] **Step 3: Verify + commit.**

Run: `pnpm --filter @indiecrafts/shared-api test src/erasure` — Expected: PASS. Then `pnpm --filter @indiecrafts/shared-api tsc` — Expected: PASS.

```bash
git add code/shared/api/src/erasure/confirm.ts code/shared/api/src/erasure/self.ts code/shared/api/src/erasure/confirm.test.ts
git commit -m "refactor(erasure): compose core + audit D1 adapters in the erasure/export runs"
```

---

## Task 4: Binding sweep — route core-table queries to `CORE_DB`

**Files (each is a sub-commit; verify tsc + tests after each):**
- `code/shared/api/src/settings-cache.ts` — `site_settings` → `CORE_DB`
- `code/shared/api/src/data-request/route.ts` — `data_requests` → `CORE_DB`
- `code/shared/api/src/erasure/request.ts` — `erasure_requests` → `CORE_DB`
- `code/shared/api/src/erasure/status.ts` — `erasure_requests` → `CORE_DB`
- `code/shared/api/src/export/route.ts` — `export_requests` → `CORE_DB`; `session_events`/`security_events` stay `DB`
- `code/shared/api/src/index.ts` — the mixed router: `user_profiles`/`consent_events`/`data_requests`/`erasure_requests`/`export_requests`/`site_settings` → `CORE_DB`; `session_events`/`security_events`/`admin_audit`/`csp_reports`/`backup_runs` stay `DB`

**The rule (apply to every `env.DB`/`DB` query in each file):** the binding is chosen by the **table the query touches** — a core table → `env.CORE_DB`; an audit table → `env.DB`. A function that takes a `db: D1Database` param must be called with the binding matching its query's table (split the call site if it serves both).

- [ ] **Step 1: Sweep each file.** For a file, run `grep -nE "env\.DB|FROM |INTO |UPDATE |DELETE FROM " code/shared/api/src/<file>` to list every query, classify each by table (lists above), and switch core-table ones to `env.CORE_DB`. Do the six files in the order listed (leaf files first, `index.ts` last).

- [ ] **Step 2: Prove the sweep is complete.** Run:

```bash
cd code/shared/api/src
# No core table may still be read/written through env.DB anywhere:
grep -rnE "user_profiles|consent_events|data_requests|erasure_requests|export_requests|site_settings" . --include='*.ts' | grep -v "\.test\." | grep -iE "\bDB\b" | grep -v CORE_DB
```
Expected: **no output** (every core-table query now uses `CORE_DB`). Any line printed is a missed site — fix it.

- [ ] **Step 3: Verify + commit** (once per file, or grouped after Step 2 passes).

Run: `pnpm --filter @indiecrafts/shared-api tsc` and `pnpm --filter @indiecrafts/shared-api test` — Expected: PASS.

```bash
git add code/shared/api/src
git commit -m "refactor(api): route core-table queries to CORE_DB (binding sweep)"
```

---

## Task 5: Cron — route retention/settings passes per binding

**Files:**
- Modify: `code/shared/cron/src/index.ts`
- Test: the cron tests beside it

**Interfaces:**
- Consumes: `Env.CORE_DB`, `Env.DB`.

- [ ] **Step 1: Add the binding + route the passes.** Add `CORE_DB?: D1Database;` to the cron `Env`. Then route: `loadSettings` (reads `site_settings`), the erasure-SLA flag (`erasure_requests`), the export-cleanup (`export_requests`), and the `consent_events` retention purge → `env.CORE_DB`; the `session_events`/`security_events`/`admin_audit`/`csp_reports` retention purges → `env.DB`. Update the `Env` doc-comment (currently says "the same database... admin_audit, session_events...") to name the two DBs.

- [ ] **Step 2: Split the cron tests per binding** — one fixture for `CORE_DB` (settings + erasure_requests + export_requests + consent_events), one for `DB` (session/security/csp), asserting each pass hits the right store.

- [ ] **Step 3: Verify + commit.**

Run: `pnpm --filter @indiecrafts/shared-cron tsc && pnpm --filter @indiecrafts/shared-cron test` — Expected: PASS.

```bash
git add code/shared/cron/src
git commit -m "refactor(cron): route retention + settings passes to CORE_DB / DB"
```

---

## Task 6: Docs, briefs, changelog

**Files:**
- Modify: `code/shared/api/.claude/CLAUDE.md`, `code/shared/cron/.claude/CLAUDE.md`, `code/shared/db/.claude/CLAUDE.md`
- Modify: `code/docs/apps/web/config/{data-retention,security-hardening,settings}.md`, `code/docs/apps/web/setup/*` (the "create the D1" step → "create two D1s")
- Modify: `code/docs/CHANGELOG.md` (or the app CHANGELOG, per the change's home)

- [ ] **Step 1: Update the briefs + docs** to describe the two-D1 layout (`CORE_DB` = identity/rights/settings, `DB` = audit firehose), both `--location weur`, both owned by `api`; the setup step provisions two D1s and pastes two IDs; note the free-plan D1 count (`dev`/`staging`/`prod` × 2 = 6 — verify against current CF limits).

- [ ] **Step 2: Changelog** — one entry: "Split the api D1 into `core` + `audit` for identity/audit blast-domain isolation; erasure now runs a core + audit adapter through the same multi-store receipt; fixes the duplicate-`0004` migration."

- [ ] **Step 3: Commit.**

```bash
git add code/shared/api/.claude/CLAUDE.md code/shared/cron/.claude/CLAUDE.md code/shared/db/.claude/CLAUDE.md code/docs
git commit -m "docs(db): document the core + audit D1 split"
```

---

## Final verification

- [ ] `pnpm --filter @indiecrafts/shared-api tsc` — PASS
- [ ] `pnpm --filter @indiecrafts/shared-api test` — PASS (erasure receipt enumerates d1-core + d1-audit + clerk + sanity + orders, `errors` empty)
- [ ] `pnpm --filter @indiecrafts/shared-cron tsc && pnpm --filter @indiecrafts/shared-cron test` — PASS
- [ ] The Task 4 Step 2 grep prints nothing (no core table still on `env.DB`)
- [ ] `node --test code/shared/scripts/lib/databases.test.mjs` — PASS
