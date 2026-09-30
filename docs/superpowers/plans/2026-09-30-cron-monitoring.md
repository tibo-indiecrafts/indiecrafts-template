# Cron Reliability + Admin Monitoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every cron pass run (or say why not), escalate missed GDPR deadlines, record each run, and give the admin two pages that show cron health and open erasure requests by deadline.

**Architecture:** The cron worker (`code/shared/cron`) splits into four independently-guarded passes and writes one `cron_runs` row per tick to the audit D1. The api worker (`code/shared/api`) gains a `monitoring.ts` module with two pure payload builders behind two bearer-gated GET routes. The admin surface reads them server-side (token never reaches the browser), following the existing Backups page pattern.

**Tech Stack:** Cloudflare Workers + D1 + R2 · vitest-pool-workers (cron, api) · Next.js 16 App Router + next-intl + shadcn (admin) · node:test (scripts).

**Spec:** `docs/superpowers/specs/2026-09-30-cron-monitoring-design.md`

## Global Constraints

- Pass names are exactly `audit_purge` · `main_purge` · `erasure_sla` · `export_cleanup`; statuses `ok` · `failed` · `skipped`.
- A failed pass records the error **name** only — never `message` (it can carry data).
- Open erasure request = `status = 'confirmed'` OR (`status IN ('pending','email_sent')` AND `token_expires_at >= now`).
- `stale` = no `cron_runs` row, or the newest is older than **2 hours** (`STALE_AFTER_MS = 7_200_000`).
- The due-soon window is the `ops.sla_warning_days` setting (default 7) in both workers.
- `GET /v1/erasure-requests` returns **no** `email_fingerprint` and **no** `user_id`.
- Both new routes: `GET` only, `requireAdminBearer` + `rateLimit`, `json(...)` helper (`cache-control: no-store`).
- Admin strings live in `messages/{en,fr}.json` (parity test enforces); UI uses `@indiecrafts/packages-web-ui` primitives; never a raw color.
- Migrations are forward-only; never edit a merged one.
- Commit on a branch, fast-forward `main`, never push. Never stage the user's WIP: `package.json`, `.vscode/tasks.json`, `.claude/settings.json`, `.claude/hooks/react-doctor-changed.sh`, the iOS `swiftpm/` folder.

## Review Focus

- **A request flagged "due soon" whose deadline then passes** → exactly one extra `erasure_sla_breach`/`high` event, never a second one (Task 1, test "escalates a due-soon request to breach once").
- **A lapsed, never-confirmed request** → closed as `expired`, never flagged, never counted as open (Task 1 + Task 3 tests).
- **One pass throws** → the other three still run, a `failed` history row is written, and the tick rejects (Task 2, test "a failing pass does not block the others").
- **The api or the admin env is unconfigured / unreachable** → admin pages render the empty state with a visible "api unreachable" line, never crash (Task 4, `cronHealth` + fetcher fallback tests).
- **A future env binds `EXPORT_BUCKET` on the api only** → `pnpm test:scripts` fails (Task 2, parity test).

---

### Task 1: Erasure SLA — escalation + lapsed-request expiry (cron)

**Files:**

- Create: `code/shared/api/db/main/migrations/0012_erasure_breach_flagged.sql`
- Modify: `code/shared/cron/src/index.ts` (SLA pass; remove `slaSeverity`)
- Test: `code/shared/cron/src/index.test.ts`

**Interfaces:**

- Produces: column `erasure_requests.breach_flagged_at TEXT`; `erasureSla(main: D1Database, audit: D1Database | undefined, nowIso: string, dueSoonIso: string): Promise<{ expired: number; dueSoon: number; breached: number }>` (module-private, consumed by Task 2).

- [ ] **Step 1: Migration**

```sql
-- 0012_erasure_breach_flagged.sql — marks an erasure request once its GDPR SLA deadline has
-- PASSED and been flagged high (erasure_sla_breach). `due_flagged_at` (0005) marks the earlier
-- "due soon" (medium) flag; together each request gets at most one of each. Forward-only.
ALTER TABLE erasure_requests ADD COLUMN breach_flagged_at TEXT;
```

- [ ] **Step 2: Rewrite the SLA tests (red)** — in `index.test.ts` `describe("scheduled() — erasure SLA flag + expired export cleanup")`:
  - `seedErasureRequest(userId, status, dueAt, dueFlaggedAt = null, tokenExpiresAt = dueAt)` — add the last param and bind it as `token_expires_at`.
  - `runTick(at = NOW)` — pass `scheduledTime: at`.
  - Add `breachFlaggedAtFor(userId)` and `statusFor(userId)` helpers (same shape as `dueFlaggedAtFor`).
  - Change "flags a breached request" to seed `"confirmed"`.
  - Replace "does not re-flag an already-flagged request" with the two tests below, and add the lapsed test.

```ts
it("escalates a due-soon request to breach once, never twice", async () => {
  await seedErasureRequest("user-escalate", "confirmed", dueSoonAt);
  await runTick(); // due soon → medium
  const after = new Date(NOW + 4 * 86_400_000).getTime(); // past dueSoonAt
  await runTick(after);
  await runTick(after + 3_600_000);
  expect(await securityEventsFor("user-escalate")).toEqual([
    { event_type: "erasure_sla_due", severity: "medium" },
    { event_type: "erasure_sla_breach", severity: "high" },
  ]);
  expect(await breachFlaggedAtFor("user-escalate")).toBe(
    new Date(after).toISOString(),
  );
});

it("a request first seen already breached gets only the high flag", async () => {
  await seedErasureRequest("user-late", "confirmed", breachedAt);
  await runTick();
  await runTick(NOW + 3_600_000);
  expect(await securityEventsFor("user-late")).toEqual([
    { event_type: "erasure_sla_breach", severity: "high" },
  ]);
  expect(await dueFlaggedAtFor("user-late")).toBe(nowIso);
});

it("closes a never-confirmed request whose link lapsed — expired, never flagged", async () => {
  await seedErasureRequest(
    "user-lapsed",
    "email_sent",
    breachedAt,
    null,
    breachedAt,
  );
  await runTick();
  expect(await statusFor("user-lapsed")).toBe("expired");
  expect(await securityEventsFor("user-lapsed")).toEqual([]);
});
```

Delete the `describe("slaSeverity")` block and drop `slaSeverity` from the import.

- [ ] **Step 3: Run — expect FAIL**

Run: `pnpm --filter @indiecrafts/shared-cron test`
Expected: the escalation, first-seen-breached (event count) and lapsed tests FAIL.

- [ ] **Step 4: Implement** — in `src/index.ts` replace the SLA `try` block with a call to this function (defined above `export default`), and delete `slaSeverity`:

```ts
type DueRow = {
  id: number;
  user_id: string | null;
  email_fingerprint: string;
  due_at: string;
};
/** Open = the engine still owes this request an outcome (spec: Global Constraints). */
const OPEN =
  "(status = 'confirmed' OR (status IN ('pending','email_sent') AND token_expires_at >= ?1))";

async function flagSla(
  audit: D1Database | undefined,
  row: DueRow,
  type: string,
  severity: "medium" | "high",
  nowIso: string,
) {
  if (!audit) return;
  await audit
    .prepare(
      "INSERT INTO security_events (ts, event_type, severity, surface, user_id, country, ip_hash, description) VALUES (?, ?, ?, 'api', ?, NULL, NULL, ?)",
    )
    .bind(
      nowIso,
      type,
      severity,
      row.user_id ?? row.email_fingerprint,
      `erasure request ${row.id} due ${row.due_at}`,
    )
    .run();
}

/** GDPR Art. 12(3) one-month SLA: close lapsed unverified requests, then flag each open
 *  request at most twice — "due soon" (medium) once, "breached" (high) once. */
async function erasureSla(
  main: D1Database,
  audit: D1Database | undefined,
  nowIso: string,
  dueSoonIso: string,
) {
  const expired = await main
    .prepare(
      "UPDATE erasure_requests SET status = 'expired' WHERE status IN ('pending','email_sent') AND token_expires_at < ?",
    )
    .bind(nowIso)
    .run();
  const { results: breached } = await main
    .prepare(
      `SELECT id, user_id, email_fingerprint, due_at FROM erasure_requests WHERE ${OPEN} AND breach_flagged_at IS NULL AND due_at < ?1`,
    )
    .bind(nowIso)
    .all<DueRow>();
  for (const row of breached) {
    await flagSla(audit, row, "erasure_sla_breach", "high", nowIso);
    await main
      .prepare(
        "UPDATE erasure_requests SET breach_flagged_at = ?1, due_flagged_at = COALESCE(due_flagged_at, ?1) WHERE id = ?2",
      )
      .bind(nowIso, row.id)
      .run();
  }
  const { results: dueSoon } = await main
    .prepare(
      `SELECT id, user_id, email_fingerprint, due_at FROM erasure_requests WHERE ${OPEN} AND due_flagged_at IS NULL AND due_at >= ?1 AND due_at < ?2`,
    )
    .bind(nowIso, dueSoonIso)
    .all<DueRow>();
  for (const row of dueSoon) {
    await flagSla(audit, row, "erasure_sla_due", "medium", nowIso);
    await main
      .prepare("UPDATE erasure_requests SET due_flagged_at = ? WHERE id = ?")
      .bind(nowIso, row.id)
      .run();
  }
  return {
    expired: expired.meta?.changes ?? 0,
    dueSoon: dueSoon.length,
    breached: breached.length,
  };
}
```

In `scheduled`, the interim call site (Task 2 replaces it) is:

```ts
try {
  const sla = await erasureSla(env.MAIN_DB, env.AUDIT_DB, nowIso, dueSoon);
  logger.info("erasure SLA flag", sla);
} catch (error) {
  logger.error("erasure SLA flag failed", { name: (error as Error)?.name });
  throw error;
}
```

- [ ] **Step 5: Run — expect PASS**

Run: `pnpm --filter @indiecrafts/shared-cron test`
Expected: all tests pass (including the untouched due-soon, `it.each` closed-status and export tests).

- [ ] **Step 6: Commit** — `git add` the migration, `index.ts`, `index.test.ts`; message `fix(cron): escalate a missed erasure deadline to breach; close lapsed unverified requests`.

---

### Task 2: Independent passes + run history + export binding (cron)

**Files:**

- Create: `code/shared/api/db/audit/migrations/0004_cron_runs.sql`
- Create: `code/shared/scripts/lib/wrangler-parity.test.mjs`
- Modify: `code/shared/cron/src/index.ts`, `code/shared/cron/wrangler.toml`
- Test: `code/shared/cron/src/index.test.ts`

**Interfaces:**

- Consumes: `erasureSla` (Task 1).
- Produces: table `cron_runs(id, started_at, finished_at, status, passes)`; exported types `PassName`, `PassResult` from `code/shared/cron/src/index.ts`; the `passes` JSON is `PassResult[]` — consumed by Task 3 (api) and Task 4 (admin) as `{ name, status, counts, reason?, error? }`.

- [ ] **Step 1: Migration**

```sql
-- 0004_cron_runs.sql — one row per scheduled cron tick, written by the cron worker, read by
-- GET /v1/cron/status (admin "Scheduled jobs"). `passes` = JSON PassResult[] — counts + error
-- NAMES only, no personal data. Purged at the audit retention window.
CREATE TABLE cron_runs (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  started_at  TEXT NOT NULL,
  finished_at TEXT NOT NULL,
  status      TEXT NOT NULL,  -- 'ok' | 'failed'
  passes      TEXT NOT NULL
);
CREATE INDEX idx_cron_runs_recent ON cron_runs (started_at DESC);
```

- [ ] **Step 2: Failing tests** — new `describe("scheduled() — passes + run history")` in `index.test.ts`:

```ts
describe("scheduled() — passes + run history", () => {
  const NOW = Date.UTC(2026, 0, 15);
  const tick = async (e: Env = env, at = NOW) => {
    const ctx = createExecutionContext();
    const controller = {
      cron: "0 * * * *",
      scheduledTime: at,
      noRetry() {},
    } as unknown as ScheduledController;
    await worker.scheduled(controller, e, ctx);
    await waitOnExecutionContext(ctx);
  };
  const lastRun = async () =>
    env.AUDIT_DB.prepare(
      "SELECT status, passes FROM cron_runs ORDER BY id DESC LIMIT 1",
    ).first<{ status: string; passes: string }>();

  it("writes one ok history row with every pass's counts", async () => {
    await tick();
    const row = await lastRun();
    expect(row?.status).toBe("ok");
    const passes = JSON.parse(row!.passes) as PassResult[];
    expect(passes.map((p) => [p.name, p.status])).toEqual([
      ["audit_purge", "ok"],
      ["main_purge", "ok"],
      ["erasure_sla", "ok"],
      ["export_cleanup", "ok"],
    ]);
    expect(passes[2].counts).toEqual({ expired: 0, dueSoon: 0, breached: 0 });
  });

  it("a failing pass does not block the others — history says which, then the tick rejects", async () => {
    await env.AUDIT_DB.prepare("DROP TABLE csp_reports").run();
    await env.MAIN_DB.prepare(
      "INSERT INTO erasure_requests (status, token_hash, token_expires_at, user_id, email_fingerprint, requested_at, due_at) VALUES ('confirmed','h','2026-01-01T00:00:00Z','user-still-flagged','fp','2025-12-01T00:00:00Z','2026-01-01T00:00:00Z')",
    ).run();
    await expect(tick()).rejects.toThrow(/1 pass\(es\) failed/);
    const row = await lastRun();
    expect(row?.status).toBe("failed");
    const passes = JSON.parse(row!.passes) as PassResult[];
    expect(passes[0]).toMatchObject({
      name: "audit_purge",
      status: "failed",
      error: "Error",
    });
    expect(passes[2]).toMatchObject({
      name: "erasure_sla",
      status: "ok",
      counts: { breached: 1 },
    });
    expect(row!.passes).not.toMatch(/no such table/); // error NAME only, never the message
  });

  it("skips the export cleanup (with a reason) when EXPORT_BUCKET is unbound", async () => {
    await tick({ ...env, EXPORT_BUCKET: undefined });
    const passes = JSON.parse((await lastRun())!.passes) as PassResult[];
    expect(passes[3]).toEqual({
      name: "export_cleanup",
      status: "skipped",
      counts: {},
      reason: "EXPORT_BUCKET unbound",
    });
  });

  it("purges cron_runs past the audit window", async () => {
    await env.AUDIT_DB.prepare(
      "INSERT INTO cron_runs (started_at, finished_at, status, passes) VALUES ('2025-01-01T00:00:00Z','2025-01-01T00:00:01Z','ok','[]')",
    ).run();
    await tick();
    expect(
      await env.AUDIT_DB.prepare(
        "SELECT id FROM cron_runs WHERE started_at = '2025-01-01T00:00:00Z'",
      ).first(),
    ).toBeNull();
  });
});
```

Add `type PassResult` to the `./index` import. (vitest-pool-workers isolates storage per test, so the `DROP TABLE` does not leak.)

- [ ] **Step 3: Run — expect FAIL** — `pnpm --filter @indiecrafts/shared-cron test` → the four new tests fail (no `cron_runs` writes, no `PassResult` export).

- [ ] **Step 4: Implement** — restructure `scheduled` around four pass functions. Keep `loadSettings`, `retentionCutoff`, `slaDueSoonCutoff`, `erasureSla`, `fetch`. Replace the body of `scheduled` and add:

```ts
export type PassName =
  "audit_purge" | "main_purge" | "erasure_sla" | "export_cleanup";
export type PassResult = {
  name: PassName;
  status: "ok" | "failed" | "skipped";
  counts: Record<string, number>;
  reason?: string; // skipped: which binding is missing
  error?: string; // failed: the error NAME only — a message can carry data
};

const skipped = (name: PassName, reason: string): PassResult => ({
  name,
  status: "skipped",
  counts: {},
  reason,
});

/** Run one pass in isolation: a throw becomes a `failed` result, never an early exit. */
async function runPass(
  name: PassName,
  work: () => Promise<Record<string, number>>,
): Promise<PassResult> {
  try {
    return { name, status: "ok", counts: await work() };
  } catch (error) {
    const errorName = (error as Error)?.name ?? "Error";
    logger.error(`${name} failed`, { name: errorName });
    return { name, status: "failed", counts: {}, error: errorName };
  }
}

const changes = (r: D1Result) => r.meta?.changes ?? 0;

async function auditPurge(db: D1Database, cutoff: string, cspCutoff: string) {
  return {
    admin_audit: changes(
      await db
        .prepare("DELETE FROM admin_audit WHERE ts < ?")
        .bind(cutoff)
        .run(),
    ),
    session_events: changes(
      await db
        .prepare("DELETE FROM session_events WHERE ts < ?")
        .bind(cutoff)
        .run(),
    ),
    security_events: changes(
      await db
        .prepare("DELETE FROM security_events WHERE ts < ?")
        .bind(cutoff)
        .run(),
    ),
    csp_reports: changes(
      await db
        .prepare("DELETE FROM csp_reports WHERE last_seen < ?")
        .bind(cspCutoff)
        .run(),
    ),
    cron_runs: changes(
      await db
        .prepare("DELETE FROM cron_runs WHERE started_at < ?")
        .bind(cutoff)
        .run(),
    ),
  };
}
```

`mainPurge(db, c)` returns `{ consent_events, data_requests, erasure_requests, churn_freetext, churn_events, user_profiles }` using the **existing** six statements and cutoffs unchanged (same SQL, each wrapped in `changes(...)`). `exportCleanup(db, bucket, nowIso)` keeps the existing select/delete loop and returns `{ deleted: expiredExports.length }`.

```ts
async function recordRun(
  db: D1Database | undefined,
  startedAt: string,
  passes: PassResult[],
) {
  if (!db) return;
  const status = passes.some((p) => p.status === "failed") ? "failed" : "ok";
  try {
    await db
      .prepare(
        "INSERT INTO cron_runs (started_at, finished_at, status, passes) VALUES (?, ?, ?, ?)",
      )
      .bind(startedAt, new Date().toISOString(), status, JSON.stringify(passes))
      .run();
  } catch (error) {
    logger.error("cron run history write failed", {
      name: (error as Error)?.name,
    });
  }
}
```

New `scheduled` body (after the existing cutoff computations):

```ts
const { AUDIT_DB: audit, MAIN_DB: main, EXPORT_BUCKET: bucket } = env;
const passes: PassResult[] = [
  audit
    ? await runPass("audit_purge", () => auditPurge(audit, cutoff, cspCutoff))
    : skipped("audit_purge", "AUDIT_DB unbound"),
  main
    ? await runPass("main_purge", () =>
        mainPurge(main, {
          consentCutoff,
          dataRequestCutoff,
          erasureRequestCutoff,
          churnFreeTextCutoff,
          churnCutoff,
          profileCutoff,
        }),
      )
    : skipped("main_purge", "MAIN_DB unbound"),
  main
    ? await runPass("erasure_sla", () =>
        erasureSla(main, audit, nowIso, dueSoon),
      )
    : skipped("erasure_sla", "MAIN_DB unbound"),
  !main
    ? skipped("export_cleanup", "MAIN_DB unbound")
    : !bucket
      ? skipped("export_cleanup", "EXPORT_BUCKET unbound")
      : await runPass("export_cleanup", () =>
          exportCleanup(main, bucket, nowIso),
        ),
];
logger.info("cron passes", { passes });
await recordRun(audit, nowIso, passes);
const failed = passes.filter((p) => p.status === "failed");
// Cloudflare does not retry a failed cron run — the next hourly tick re-runs every pass.
if (failed.length)
  throw new AggregateError(
    failed.map((p) => new Error(`${p.name}: ${p.error}`)),
    `cron: ${failed.length} pass(es) failed`,
  );
```

Fix the stale `Env` doc comments (`binding \`DB\``→`AUDIT_DB`) and the header comment ("the task belongs in a package" → inline by the ≥2-consumer rule).

- [ ] **Step 5: Bind the bucket** — `code/shared/cron/wrangler.toml`, after the dev `MAIN_DB` block:

```toml
# Same bucket the api's POST /v1/export writes to (code/shared/api/wrangler.toml) — the
# export_cleanup pass sweeps bundles that expired unread. Bind it in every env the api does
# (pnpm test:scripts → wrangler-parity fails otherwise).
[[env.dev.r2_buckets]]
binding = "EXPORT_BUCKET"
bucket_name = "indiecrafts-dev-shared-api-exports"
```

Also fix the header comment block's `DB — audit firehose` → `AUDIT_DB`.

- [ ] **Step 6: Parity test** — `code/shared/scripts/lib/wrangler-parity.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { wranglerEnvSection } from "./project.mjs";

const read = (p) =>
  readFileSync(fileURLToPath(new URL(p, import.meta.url)), "utf8");
const API = read("../../api/wrangler.toml");
const CRON = read("../../cron/wrangler.toml");
const bucket = (section) =>
  section.match(
    /r2_buckets\]\]\s*\nbinding = "EXPORT_BUCKET"\s*\nbucket_name = "([^"]+)"/,
  )?.[1] ?? null;

// The cron's export_cleanup pass deletes what the api's POST /v1/export writes. An env that
// binds the bucket on the api but not the cron leaves unread GDPR exports forever.
for (const env of ["dev", "staging", "prod"]) {
  test(`${env}: the cron binds the api's EXPORT_BUCKET`, () => {
    const api = bucket(wranglerEnvSection(API, env));
    if (api) assert.equal(bucket(wranglerEnvSection(CRON, env)), api);
  });
}
```

- [ ] **Step 7: Run — expect PASS** — `pnpm --filter @indiecrafts/shared-cron test` (all) and `pnpm test:scripts` (parity 3/3). Sanity-check the parity test bites: temporarily comment the new cron r2 block → `pnpm test:scripts` fails on `dev`; restore.

- [ ] **Step 8: Commit** — migration, `index.ts`, `index.test.ts`, `wrangler.toml`, parity test; message `fix(cron): passes run independently, every tick is recorded, the export cleanup is bound`.

---

### Task 3: Monitoring routes (api)

**Files:**

- Create: `code/shared/api/src/monitoring.ts`
- Create: `code/shared/api/src/monitoring.test.ts`
- Modify: `code/shared/api/src/index.ts` (route wiring, next to `/v1/backups/status`)

**Interfaces:**

- Consumes: `cron_runs` (Task 2), `breach_flagged_at` (Task 1), `readSettings` (`./settings-cache`).
- Produces (JSON, consumed by Task 4):
  - `CronStatus = { lastRunAt: string | null; stale: boolean; runs: { startedAt: string; finishedAt: string; status: "ok" | "failed"; passes: PassResult[] }[]; erasure: { open: number; dueSoon: number; breached: number }; exports: { outstanding: number; expiredUnswept: number } }`
  - `ErasureRequests = { open: ErasureRow[]; recentClosed: ErasureRow[] }`, `ErasureRow = { id: number; status: string; requestedAt: string; dueAt: string; state: "breached" | "dueSoon" | "onTrack" | "closed"; dueFlaggedAt: string | null; breachFlaggedAt: string | null }`

- [ ] **Step 1: Failing tests** — `src/monitoring.test.ts` (runs in workerd with the migrated D1, like `index.test.ts`):

```ts
/// <reference types="@cloudflare/vitest-pool-workers" />
import { env, SELF } from "cloudflare:test";
import { beforeEach, describe, expect, it } from "vitest";
import { erasureState } from "./monitoring";

const auth = { authorization: "Bearer test-token" };
const NOW = Date.now();
const iso = (days: number) => new Date(NOW + days * 86_400_000).toISOString();
const seed = (status: string, dueDays: number, tokenDays = 30) =>
  env.MAIN_DB.prepare(
    "INSERT INTO erasure_requests (status, token_hash, token_expires_at, user_id, email_fingerprint, requested_at, due_at) VALUES (?, 'h', ?, 'user_secret', 'fp_secret', ?, ?)",
  )
    .bind(status, iso(tokenDays), iso(dueDays - 30), iso(dueDays))
    .run();

describe("erasureState", () => {
  const now = iso(0),
    soon = iso(7);
  it.each([
    ["completed", iso(-1), "closed"],
    ["confirmed", iso(-1), "breached"],
    ["confirmed", iso(3), "dueSoon"],
    ["confirmed", iso(20), "onTrack"],
  ])("%s due %s → %s", (status, due, state) => {
    expect(erasureState(status, due, iso(30), now, soon)).toBe(state);
  });
  it("a lapsed unverified request is closed", () => {
    expect(erasureState("email_sent", iso(20), iso(-1), now, soon)).toBe(
      "closed",
    );
  });
});

describe("GET /v1/erasure-requests", () => {
  beforeEach(async () => {
    await seed("confirmed", 20);
    await seed("confirmed", -1);
    await seed("confirmed", 3);
    await seed("completed", -5);
    await seed("email_sent", 25, -1); // lapsed
  });
  it("401s without the bearer", async () => {
    expect(
      (await SELF.fetch("https://api.test/v1/erasure-requests")).status,
    ).toBe(401);
  });
  it("lists open requests by deadline, with state, and no identifiers", async () => {
    const res = await SELF.fetch("https://api.test/v1/erasure-requests", {
      headers: auth,
    });
    const text = await res.text();
    expect(res.status).toBe(200);
    expect(text).not.toMatch(/user_secret|fp_secret|email_fingerprint|user_id/);
    const body = JSON.parse(text) as {
      open: { state: string }[];
      recentClosed: { state: string }[];
    };
    expect(body.open.map((r) => r.state)).toEqual([
      "breached",
      "dueSoon",
      "onTrack",
    ]);
    expect(body.recentClosed.map((r) => r.state)).toEqual(["closed", "closed"]);
  });
});

describe("GET /v1/cron/status", () => {
  it("401s without the bearer", async () => {
    expect((await SELF.fetch("https://api.test/v1/cron/status")).status).toBe(
      401,
    );
  });
  it("is stale with no runs; counts open erasure + exports live", async () => {
    await seed("confirmed", -1);
    await seed("confirmed", 3);
    await env.MAIN_DB.prepare(
      "INSERT INTO export_requests (token_hash, r2_key, email_fingerprint, created_at, expires_at) VALUES ('t','k','fp',?,?)",
    )
      .bind(iso(-1), iso(-0.5))
      .run();
    const body = (await (
      await SELF.fetch("https://api.test/v1/cron/status", { headers: auth })
    ).json()) as {
      stale: boolean;
      lastRunAt: string | null;
      erasure: Record<string, number>;
      exports: Record<string, number>;
    };
    expect(body).toMatchObject({
      stale: true,
      lastRunAt: null,
      erasure: { open: 2, dueSoon: 1, breached: 1 },
      exports: { outstanding: 0, expiredUnswept: 1 },
    });
  });
  it("is fresh right after a run and returns it with parsed passes", async () => {
    const at = new Date(NOW - 10 * 60_000).toISOString();
    await env.AUDIT_DB.prepare(
      "INSERT INTO cron_runs (started_at, finished_at, status, passes) VALUES (?, ?, 'ok', ?)",
    )
      .bind(
        at,
        at,
        JSON.stringify([
          { name: "audit_purge", status: "ok", counts: { admin_audit: 2 } },
        ]),
      )
      .run();
    const body = (await (
      await SELF.fetch("https://api.test/v1/cron/status", { headers: auth })
    ).json()) as {
      stale: boolean;
      runs: { passes: { counts: Record<string, number> }[] }[];
    };
    expect(body.stale).toBe(false);
    expect(body.runs[0].passes[0].counts.admin_audit).toBe(2);
  });
});
```

- [ ] **Step 2: Run — expect FAIL** — `pnpm --filter @indiecrafts/shared-api test -- monitoring` → module not found / 404s.

- [ ] **Step 3: Implement `src/monitoring.ts`**

```ts
/**
 * Build the admin monitoring payloads: cron run health and open erasure requests by deadline.
 *
 * @see docs/reference/shared/api/src/monitoring.md
 */

/** The cron runs hourly (`[triggers] crons = ["0 * * * *"]`) — two missed ticks = stale. */
export const STALE_AFTER_MS = 2 * 60 * 60 * 1000;

type Bindings = { AUDIT_DB?: D1Database; MAIN_DB?: D1Database };
export type ErasureState = "breached" | "dueSoon" | "onTrack" | "closed";

/** One definition of "open" for SQL (?1 = now) — mirrors the cron's erasure_sla pass. */
const OPEN =
  "(status = 'confirmed' OR (status IN ('pending','email_sent') AND token_expires_at >= ?1))";

export function erasureState(
  status: string,
  dueAt: string,
  tokenExpiresAt: string,
  nowIso: string,
  dueSoonIso: string,
): ErasureState {
  const open =
    status === "confirmed" ||
    ((status === "pending" || status === "email_sent") &&
      tokenExpiresAt >= nowIso);
  if (!open) return "closed";
  if (dueAt < nowIso) return "breached";
  return dueAt < dueSoonIso ? "dueSoon" : "onTrack";
}

const count = async (db: D1Database, sql: string, ...binds: unknown[]) =>
  (
    await db
      .prepare(sql)
      .bind(...binds)
      .first<{ n: number }>()
  )?.n ?? 0;

export async function cronStatus(env: Bindings, now: number, warnDays: number) {
  const nowIso = new Date(now).toISOString();
  const soonIso = new Date(now + warnDays * 86_400_000).toISOString();
  let runs: {
    startedAt: string;
    finishedAt: string;
    status: string;
    passes: unknown[];
  }[] = [];
  if (env.AUDIT_DB) {
    const { results } = await env.AUDIT_DB.prepare(
      "SELECT started_at, finished_at, status, passes FROM cron_runs ORDER BY started_at DESC LIMIT 24",
    ).all<{
      started_at: string;
      finished_at: string;
      status: string;
      passes: string;
    }>();
    runs = results.map((r) => ({
      startedAt: r.started_at,
      finishedAt: r.finished_at,
      status: r.status,
      passes: JSON.parse(r.passes) as unknown[],
    }));
  }
  const lastRunAt = runs[0]?.startedAt ?? null;
  const erasure = { open: 0, dueSoon: 0, breached: 0 };
  const exports = { outstanding: 0, expiredUnswept: 0 };
  if (env.MAIN_DB) {
    const db = env.MAIN_DB;
    erasure.open = await count(
      db,
      `SELECT COUNT(*) AS n FROM erasure_requests WHERE ${OPEN}`,
      nowIso,
    );
    erasure.breached = await count(
      db,
      `SELECT COUNT(*) AS n FROM erasure_requests WHERE ${OPEN} AND due_at < ?1`,
      nowIso,
    );
    erasure.dueSoon = await count(
      db,
      `SELECT COUNT(*) AS n FROM erasure_requests WHERE ${OPEN} AND due_at >= ?1 AND due_at < ?2`,
      nowIso,
      soonIso,
    );
    exports.outstanding = await count(
      db,
      "SELECT COUNT(*) AS n FROM export_requests WHERE expires_at >= ?",
      nowIso,
    );
    exports.expiredUnswept = await count(
      db,
      "SELECT COUNT(*) AS n FROM export_requests WHERE expires_at < ?",
      nowIso,
    );
  }
  const stale = !lastRunAt || now - Date.parse(lastRunAt) > STALE_AFTER_MS;
  return { lastRunAt, stale, runs, erasure, exports };
}

export async function erasureRequests(
  env: Bindings,
  now: number,
  warnDays: number,
) {
  if (!env.MAIN_DB) return { open: [], recentClosed: [] };
  const nowIso = new Date(now).toISOString();
  const soonIso = new Date(now + warnDays * 86_400_000).toISOString();
  type Row = {
    id: number;
    status: string;
    requested_at: string;
    due_at: string;
    token_expires_at: string;
    due_flagged_at: string | null;
    breach_flagged_at: string | null;
  };
  // Explicit column list — never email_fingerprint / user_id (monitoring, not identification).
  const COLS =
    "id, status, requested_at, due_at, token_expires_at, due_flagged_at, breach_flagged_at";
  const view = (r: Row) => ({
    id: r.id,
    status: r.status,
    requestedAt: r.requested_at,
    dueAt: r.due_at,
    state: erasureState(
      r.status,
      r.due_at,
      r.token_expires_at,
      nowIso,
      soonIso,
    ),
    dueFlaggedAt: r.due_flagged_at,
    breachFlaggedAt: r.breach_flagged_at,
  });
  const open = await env.MAIN_DB.prepare(
    `SELECT ${COLS} FROM erasure_requests WHERE ${OPEN} ORDER BY due_at ASC LIMIT 200`,
  )
    .bind(nowIso)
    .all<Row>();
  const closed = await env.MAIN_DB.prepare(
    `SELECT ${COLS} FROM erasure_requests WHERE NOT ${OPEN} ORDER BY requested_at DESC LIMIT 20`,
  )
    .bind(nowIso)
    .all<Row>();
  return {
    open: open.results.map(view),
    recentClosed: closed.results.map(view),
  };
}
```

- [ ] **Step 4: Wire the routes** — in `src/index.ts`, import `{ cronStatus, erasureRequests }` from `./monitoring` and `readSettings` (already imported? if not, from `./settings-cache`); add a module-level `const monitoringSettings: { value: null | { at: number; data: Record<SettingKey, number> } } = { value: null };` (or reuse the existing api settings cache object if one exists at module scope). Directly after the `/v1/backups/status` block:

```ts
// ── Monitoring — GET /v1/cron/status + GET /v1/erasure-requests (bearer-gated, read-only;
// the admin "Scheduled jobs" + "Erasure requests" pages). Payloads: ./monitoring.ts.
if (
  url.pathname === "/v1/cron/status" ||
  url.pathname === "/v1/erasure-requests"
) {
  if (request.method === "OPTIONS")
    return new Response(null, { status: 204, headers: cors });
  if (request.method !== "GET")
    return json({ error: "method_not_allowed" }, 405, cors);
  const denied =
    requireAdminBearer(request, env, cors) ??
    (await rateLimit(request, env, cors));
  if (denied) return denied;
  const warnDays = (await readSettings(env.MAIN_DB, monitoringSettings))[
    "ops.sla_warning_days"
  ];
  const body =
    url.pathname === "/v1/cron/status"
      ? await cronStatus(env, Date.now(), warnDays)
      : await erasureRequests(env, Date.now(), warnDays);
  return json(body, 200, cors);
}
```

- [ ] **Step 5: Run — expect PASS** — `pnpm --filter @indiecrafts/shared-api test` (whole api suite green).

- [ ] **Step 6: Commit** — `feat(api): GET /v1/cron/status + GET /v1/erasure-requests for the admin`.

---

### Task 4: Admin pages — Scheduled jobs + Erasure requests + System badge

**Files:**

- Create: `code/projects/web/surfaces/admin/src/lib/monitoring.ts` (types, fetchers, `cronHealth`)
- Create: `code/projects/web/surfaces/admin/src/lib/monitoring.test.ts`
- Create: `.../src/app/[locale]/(dashboard)/cron/page.tsx`, `.../(dashboard)/cron-runs-table.tsx`
- Create: `.../src/app/[locale]/(dashboard)/erasure/page.tsx`, `.../(dashboard)/erasure-table.tsx`
- Modify: `.../src/user-interface/lib/nav.ts` (+ `nav.test.ts`), `.../(dashboard)/system/page.tsx`, `messages/en.json`, `messages/fr.json`

**Interfaces:**

- Consumes: `CronStatus`, `ErasureRequests` JSON (Task 3).
- Produces: `cronHealth(status: CronStatus | null): "unreachable" | "never" | "stale" | "failed" | "ok"`; `fetchCronStatus(): Promise<CronStatus | null>`; `fetchErasureRequests(): Promise<ErasureRequests | null>` (`null` = unreachable / unconfigured).

- [ ] **Step 1: Failing tests** — `src/lib/monitoring.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { cronHealth, type CronStatus } from "./monitoring";

const base: CronStatus = {
  lastRunAt: "2026-09-30T10:00:00Z",
  stale: false,
  runs: [
    {
      startedAt: "2026-09-30T10:00:00Z",
      finishedAt: "2026-09-30T10:00:01Z",
      status: "ok",
      passes: [],
    },
  ],
  erasure: { open: 0, dueSoon: 0, breached: 0 },
  exports: { outstanding: 0, expiredUnswept: 0 },
};

describe("cronHealth", () => {
  it("unreachable when the api could not be read", () =>
    expect(cronHealth(null)).toBe("unreachable"));
  it("never when there is no run", () =>
    expect(
      cronHealth({ ...base, lastRunAt: null, runs: [], stale: true }),
    ).toBe("never"));
  it("stale before failed — an old failure is still stale", () =>
    expect(
      cronHealth({
        ...base,
        stale: true,
        runs: [{ ...base.runs[0], status: "failed" }],
      }),
    ).toBe("stale"));
  it("failed when the last run failed", () =>
    expect(
      cronHealth({ ...base, runs: [{ ...base.runs[0], status: "failed" }] }),
    ).toBe("failed"));
  it("ok otherwise", () => expect(cronHealth(base)).toBe("ok"));
});
```

And in `nav.test.ts` add: `expect(activeKey("/en/cron")).toBe("cron"); expect(activeKey("/erasure")).toBe("erasure");`

- [ ] **Step 2: Run — expect FAIL** — `pnpm --filter @indiecrafts/web-surfaces-admin test`.

- [ ] **Step 3: `src/lib/monitoring.ts`**

```ts
/**
 * Read the api's monitoring payloads server-side and derive the cron health badge.
 *
 * @see docs/reference/projects/web/admin/src/lib/monitoring.md
 */
export type PassResult = {
  name: string;
  status: "ok" | "failed" | "skipped";
  counts: Record<string, number>;
  reason?: string;
  error?: string;
};
export type CronRun = {
  startedAt: string;
  finishedAt: string;
  status: "ok" | "failed";
  passes: PassResult[];
};
export type CronStatus = {
  lastRunAt: string | null;
  stale: boolean;
  runs: CronRun[];
  erasure: { open: number; dueSoon: number; breached: number };
  exports: { outstanding: number; expiredUnswept: number };
};
export type ErasureRow = {
  id: number;
  status: string;
  requestedAt: string;
  dueAt: string;
  state: "breached" | "dueSoon" | "onTrack" | "closed";
  dueFlaggedAt: string | null;
  breachFlaggedAt: string | null;
};
export type ErasureRequests = {
  open: ErasureRow[];
  recentClosed: ErasureRow[];
};
export type CronHealth = "unreachable" | "never" | "stale" | "failed" | "ok";

/** Stale wins over failed: an old failure means the cron stopped, not just that it failed. */
export function cronHealth(status: CronStatus | null): CronHealth {
  if (!status) return "unreachable";
  if (!status.lastRunAt) return "never";
  if (status.stale) return "stale";
  return status.runs[0]?.status === "failed" ? "failed" : "ok";
}

/** GET a bearer-gated api path with the server-side token; null on missing config or any failure. */
async function getApi<T>(path: string): Promise<T | null> {
  const url = process.env.API_URL;
  const token = process.env.APP_API_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(`${url}${path}`, {
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

export const fetchCronStatus = () => getApi<CronStatus>("/v1/cron/status");
export const fetchErasureRequests = () =>
  getApi<ErasureRequests>("/v1/erasure-requests");
```

- [ ] **Step 4: Nav + messages** — `nav.ts`: import `Clock, Hourglass` from `lucide-react`; compliance group gets `{ key: "erasure", href: "/erasure", icon: Hourglass }` after `dataRequests`; operations gets `{ key: "cron", href: "/cron", icon: Clock }` after `backups`. Messages — `admin.nav.cron` ("Scheduled jobs" / "Tâches planifiées"), `admin.nav.erasure` ("Erasure requests" / "Demandes d'effacement"), and:

```jsonc
// en.json — admin.cron
"cron": {
  "title": "Scheduled jobs", "subtitle": "The hourly cron: retention purge, erasure deadlines, export cleanup.",
  "health": { "ok": "Healthy", "failed": "Last run failed", "stale": "Stale — no run for over 2 hours", "never": "Never ran", "unreachable": "API unreachable or not configured" },
  "lastRun": "Last run", "erasureOpen": "Erasure requests open", "erasureDueSoon": "Due soon", "erasureBreached": "Deadline passed",
  "exportsOutstanding": "Exports awaiting download", "exportsUnswept": "Expired exports not yet deleted",
  "runs": "Recent runs", "started": "Started", "status": "Status", "passes": "Passes", "empty": "No runs recorded yet.",
  "pass": { "audit_purge": "Audit purge", "main_purge": "Main purge", "erasure_sla": "Erasure deadlines", "export_cleanup": "Export cleanup" },
  "passStatus": { "ok": "OK", "failed": "Failed", "skipped": "Skipped" }
},
// en.json — admin.erasure
"erasure": {
  "title": "Erasure requests", "subtitle": "Open GDPR erasure requests by deadline (one month, Art. 12(3)).",
  "open": "Open", "recentClosed": "Recently closed", "id": "#", "status": "Status", "requested": "Requested", "due": "Due",
  "state": { "breached": "Deadline passed", "dueSoon": "Due soon", "onTrack": "On track", "closed": "Closed" },
  "flagged": "Flagged", "empty": "No open requests.", "unreachable": "API unreachable or not configured"
}
```

French (`fr.json`, same keys): cron — "Tâches planifiées", "Le cron horaire : purge de rétention, échéances d'effacement, nettoyage des exports.", health `{ ok: "En bonne santé", failed: "Dernière exécution en échec", stale: "Inactif — aucune exécution depuis plus de 2 heures", never: "Jamais exécuté", unreachable: "API injoignable ou non configurée" }`, "Dernière exécution", "Demandes d'effacement ouvertes", "Échéance proche", "Échéance dépassée", "Exports en attente de téléchargement", "Exports expirés non supprimés", "Exécutions récentes", "Début", "Statut", "Étapes", "Aucune exécution enregistrée.", pass `{ audit_purge: "Purge audit", main_purge: "Purge principale", erasure_sla: "Échéances d'effacement", export_cleanup: "Nettoyage des exports" }`, passStatus `{ ok: "OK", failed: "Échec", skipped: "Ignorée" }`; erasure — "Demandes d'effacement", "Demandes RGPD d'effacement ouvertes, par échéance (un mois, art. 12(3)).", "Ouvertes", "Récemment clôturées", "#", "Statut", "Demandée", "Échéance", state `{ breached: "Échéance dépassée", dueSoon: "Échéance proche", onTrack: "Dans les délais", closed: "Clôturée" }`, "Signalée", "Aucune demande ouverte.", "API injoignable ou non configurée". Add `admin.system.cronLink`: "View scheduled jobs" / "Voir les tâches planifiées".

- [ ] **Step 5: Tables + pages** — `cron-runs-table.tsx` (client, `useTranslations("admin.cron")`): props `{ status: CronStatus | null }`; renders a `dl` grid (health badge via `cronHealth` — `ok` → `outline`, `failed`/`stale`/`unreachable` → `destructive` with the `FlagIcon` + text, `never` → `secondary`; last run; the five counts, breached/unswept > 0 as `destructive` badges), then a `Table` of `status.runs` (started · status badge · one `Badge` per pass: `t(\`pass.${p.name}\`)` + `t(\`passStatus.${p.status}\`)`+ counts joined`k: v`+`p.error ?? p.reason`); `runs.length === 0`→`t("empty")`. `erasure-table.tsx`(client,`useTranslations("admin.erasure")`): props `{ data: ErasureRequests | null }`; `null`→`t("unreachable")`; two `Table`s (open, recentClosed) with columns id · status · requested · due · state badge (`breached`→`destructive`, `dueSoon`→`secondary`+ text,`onTrack`/`closed`→`outline`) · flagged (`breachFlaggedAt ?? dueFlaggedAt`, formatted, else "—"). Every badge carries text — never color alone. Pages mirror `backups/page.tsx`: `setRequestLocale`, `PageHeader`with the title/subtitle keys, a`Card`with the table, data from`fetchCronStatus()`/`fetchErasureRequests()`.

- [ ] **Step 6: System badge** — `system/page.tsx`: `NON_HTTP_WORKERS = ["workers"]`; fetch `cronStatus = await fetchCronStatus()` alongside the other health reads; render a `cron` row whose badge text is `tCron(\`health.${cronHealth(cronStatus)}\`)` (`getTranslations("admin.cron")`) with the same variant mapping as the cron page, plus a `Link` (`@/i18n/routing`or the admin's existing link helper — match`nav`'s usage) to `/cron`with`t("cronLink")`.

- [ ] **Step 7: Run — expect PASS** — `pnpm --filter @indiecrafts/web-surfaces-admin test` (monitoring, nav, messages parity), `pnpm --filter @indiecrafts/web-surfaces-admin tsc`.

- [ ] **Step 8: Commit** — `feat(admin): Scheduled jobs + Erasure requests pages; System shows cron health`.

---

### Task 5: Docs, briefs, changelogs, runbook card 21

**Files:**

- Modify: `code/shared/cron/.claude/CLAUDE.md`, `code/docs/shared/cron/index.md`, `code/docs/shared/api/index.md`, `code/docs/projects/web/admin/index.md`, `code/docs/projects/web/website/config/data-retention.md`
- Create reference pages: `code/docs/reference/shared/api/src/monitoring.md`, `code/docs/reference/projects/web/admin/src/lib/monitoring.md`, `code/docs/reference/projects/web/admin/src/app/locale/(dashboard)/{cron-runs-table,erasure-table}.md`, `.../(dashboard)/{cron,erasure}/page.md` (frontmatter `title`/`description`/`status: stable`, sections Purpose · Exports · Source — copy `backups/page.md`'s shape)
- Modify: `code/shared/cron/CHANGELOG.md`, `code/shared/api/CHANGELOG.md`, `code/projects/web/surfaces/admin/CHANGELOG.md`, `code/docs/CHANGELOG.md`
- Modify (artifact, not repo): QA Runbook card 21

- [ ] **Step 1: Cron brief** — replace the "NEVER put the task logic here" bullet with: "Logic stays inline in `src/index.ts` — one consumer (the repo's ≥2-consumer extraction rule). Each pass is a function run by `runPass` (a throw becomes a `failed` result); every tick writes a `cron_runs` row." Replace "marked failed and retried" with "marked failed (Cloudflare does not retry; the next hourly tick re-runs every pass)". Four passes, `breach_flagged_at`, `EXPORT_BUCKET` bound in dev + the parity test; monitoring → admin `/cron` + `/erasure`. Keep ≤ 90 lines (`pnpm check:claude-md`).
- [ ] **Step 2: Docs pages** — cron: passes table (name · what · counts), history row, stale rule, the two admin pages, local test (`wrangler dev --test-scheduled` → `curl localhost:8789/__scheduled`). api: the two routes in the Authenticated table (+ payload summary). admin: the two pages + the System badge. data-retention: unverified requests expire when their link lapses; `cron_runs` purged at the audit window.
- [ ] **Step 3: Reference pages** — one per new source file (list above); `pnpm check:doc-coverage` must pass.
- [ ] **Step 4: Changelogs** — one entry per area (cron: the three fixes; api: two routes + migrations; admin: two pages + badge; docs: pages updated). Plain-language _why_.
- [ ] **Step 5: Gates** — `pnpm verify`, `pnpm check:doc-coverage`, `pnpm docs:build`, `pnpm test:scripts`, `pnpm check:claude-md` — all green.
- [ ] **Step 6: Commit** — `docs: cron passes, monitoring routes and admin pages`; fast-forward `main`, delete the branch.
- [ ] **Step 7: Card 21** — fix step text (`AUDIT_DB`/`MAIN_DB`, full retention list, four passes, escalation, history), tick verified steps + N/A extras with reasons, dated note naming the commits; `admin-21` stays open for the human browser check.

---

### Task 6: Manual verification setup (only what's needed)

- [ ] **Step 1:** Launch api (`:8787`) + cron (`:8789`, `--test-scheduled`) + admin (`:3001`) as ONE background task sharing one local D1 persist dir (so api, cron and admin see the same rows); apply both migration sets locally.
- [ ] **Step 2:** Seed local D1: one breached `confirmed`, one due-soon `confirmed`, one on-track, one lapsed `email_sent`, one `completed`; one expired unread `export_requests` row.
- [ ] **Step 3:** `curl localhost:8789/__scheduled` once; confirm with curl that `/v1/cron/status` shows a run and the flags.
- [ ] **Step 4:** Open admin `/cron`, `/erasure`, `/system` in the browser for the user; report exactly what to look at. Stop the servers when the user confirms.
