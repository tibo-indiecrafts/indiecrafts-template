# Compliance Layer — Phase 3 (Erasure + Pseudonymisation Engine) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a store-agnostic erasure + pseudonymisation engine — a pure orchestrator over an `ErasureAdapter` interface, with a real D1 adapter and dependency-injected Clerk / Sanity / orders adapters, plus a dry-run preview — so a later phase can wire a token-confirmed API around it. No live trigger and no real Clerk/Sanity/D1 data is touched in this phase.

**Architecture:** The orchestrator lives in `packages/shared/compliance/src/shared/erasure.ts` (pure TS, mock-tested). Concrete adapters are **factories that take their store dependency injected**, so no single runtime needs every secret: the D1 adapter takes a `D1Database` + salt (real, tested against the local test D1); the Clerk and Sanity adapters take minimal injected client interfaces (unit-tested with mocks); the orders adapter is a no-op seam. Adapter files live in the api worker (`code/shared/api/src/erasure/`), where Phase 4 will assemble them with real bindings for `/v1/erasure/*`. Pseudonymisation reuses the existing `user.deleted` D1 pattern and `fingerprintEmail`.

**Tech Stack:** TypeScript strict, Cloudflare Workers + D1, vitest — happy-dom pool for the orchestrator (`shared/compliance`), `@cloudflare/vitest-pool-workers` for the api-worker adapters.

**Spec:** `docs/superpowers/specs/2026-08-23-gdpr-compliance-layer-design.md` (§8.3 engine, §5 pseudonymisation, §6.2 tables, §21 verification, §22.3 roadmap)

**Builds on:** Phase 1 (`user_profiles`, `fingerprintEmail`), Phase 2 (`consent_events`). Branch tip after Phase 2: `fe27bb8a`.

## Global Constraints

- **Pseudonymisation, not deletion, where a record has a retention duty.** Scrub direct identifiers, **retain `email_fingerprint`** (the erasure/retention key); true anonymisation = dropping the fingerprint at final purge (the cron, later). (Spec §5)
- **Per-store policy (D1 adapter):** `user_profiles` → pseudonymise (email→`deleted_<user_id>@anonymized.local`, full_name→"Deleted User", `deleted_at`, `anonymized=1`, keep fingerprint) · `session_events` → delete (all rows for the user; low-sensitivity activity, no severity column) · `security_events` → delete `low`/`medium`, pseudonymise `high`/`critical` (repoint `user_id`→fingerprint) · `consent_events` → pseudonymise (repoint `subject_id`→`email_fingerprint`, `subject_type`→`visitor`; the row already carries the fingerprint) · `admin_audit` → **retain** (untouched). (Spec §8.3)
- **The engine consumes an already-verified subject email** — it does NOT do intake, identity verification, or token confirmation (those are the existing DSAR flow + Phase 4). (Investigation §2)
- **The receipt enumerates every adapter** — a silent miss must be impossible; `runExport` gathers from every registered adapter. (Spec §21)
- **`ErasureAdapter` interface (spec §8.3):** `{ name; findByEmail; export; preview; anonymize; delete }`.
- **No new secrets, no live trigger, no destructive real call in Phase 3.** The D1 adapter is exercised only against the ephemeral local test D1; Clerk/Sanity adapters only against mocks. Real client wiring + `CLERK_SECRET_KEY`/`SANITY_API_WRITE_TOKEN` + the `/v1/erasure` route are Phase 4.
- **`fingerprintEmail`:** `fingerprintEmail(email, salt): Promise<string>` from `@indiecrafts/packages-shared-security/crypto`; salted SHA-256 hex over `salt + email.toLowerCase().trim()`; salt = `GDPR_FINGERPRINT_SALT`.
- **`shared/compliance/src/shared` is React/next/Sanity-free** — the orchestrator + interface stay pure; concrete adapters live in the api worker, not here.
- **Migrations/commits:** stage only each task's files (dirty tree: storybook WIP, `pnpm-lock.yaml`, `packages/CHANGELOG.md`); commit `--no-verify` (pre-existing storybook tsc breaks the hook); run `pnpm exec prettier --write` on changed files first.

---

### Task 1: The orchestrator + `ErasureAdapter` interface + dry-run

**Files:**
- Create: `code/packages/shared/compliance/src/shared/erasure.ts`
- Modify: `code/packages/shared/compliance/src/shared/index.ts` (barrel export)
- Create: `code/packages/shared/compliance/vitest.config.ts` (currently missing — needed for the happy-dom pool + server-only stub)
- Test: `code/packages/shared/compliance/src/shared/erasure.test.ts`
- Modify: `code/packages/CHANGELOG.md` — **SKIP** (pre-existing-dirty; deferred, see Global Constraints). Note the changelog entry in the report instead.

**Interfaces:**
- Produces (consumed by Tasks 2–5 + Phase 4):
```ts
export interface ErasureAdapter {
  readonly name: string;
  findByEmail(email: string): Promise<AdapterMatch>;
  export(email: string): Promise<unknown>;
  preview(email: string): Promise<AdapterPreview>;
  anonymize(email: string): Promise<AdapterResult>;
  delete(email: string): Promise<AdapterResult>;
}
export interface AdapterMatch { readonly found: boolean; readonly detail?: Record<string, number>; }
export interface AdapterPreview { readonly store: string; readonly wouldAnonymize: Record<string, number>; readonly wouldDelete: Record<string, number>; }
export interface AdapterResult { readonly store: string; readonly anonymized: Record<string, number>; readonly deleted: Record<string, number>; }
export type ErasureMode = "erase" | "anonymize";
export interface ErasureReceipt { readonly email_fingerprint: string | null; readonly mode: ErasureMode; readonly dryRun: boolean; readonly ts: string; readonly stores: Array<AdapterResult | AdapterPreview>; readonly errors: Array<{ store: string; error: string }>; }
export interface ExportBundle { readonly ts: string; readonly stores: Record<string, unknown>; }
export function runErasure(adapters: ErasureAdapter[], email: string, opts: { mode: ErasureMode; dryRun: boolean; ts: string; fingerprint?: string | null }): Promise<ErasureReceipt>;
export function runExport(adapters: ErasureAdapter[], email: string): Promise<ExportBundle>;
```
- `ts` and `fingerprint` are injected (callers pass them) — the orchestrator never calls `Date.now()` or hashes (keeps it pure + deterministic in tests).

- [ ] **Step 1: Add the vitest config**

Create `code/packages/shared/compliance/vitest.config.ts` (mirror `code/packages/web/compliance/vitest.config.ts`):

```ts
import { mergeConfig } from "vitest/config";
import shared from "../../../../vitest.shared";

export default mergeConfig(shared, {});
```

- [ ] **Step 2: Write the failing test**

Create `code/packages/shared/compliance/src/shared/erasure.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";
import { runErasure, runExport, type ErasureAdapter } from "./erasure";

function fakeAdapter(name: string): ErasureAdapter {
  return {
    name,
    findByEmail: vi.fn(async () => ({ found: true, detail: { rows: 1 } })),
    export: vi.fn(async () => ({ [name]: "data" })),
    preview: vi.fn(async () => ({ store: name, wouldAnonymize: { profile: 1 }, wouldDelete: { events: 2 } })),
    anonymize: vi.fn(async () => ({ store: name, anonymized: { profile: 1 }, deleted: {} })),
    delete: vi.fn(async () => ({ store: name, anonymized: {}, deleted: { events: 2 } })),
  };
}

describe("runErasure", () => {
  const OPTS = { ts: "2026-01-01T00:00:00.000Z", fingerprint: "fp1" };

  it("erase mode calls anonymize AND delete on every adapter; receipt enumerates all", async () => {
    const a = fakeAdapter("clerk");
    const b = fakeAdapter("d1");
    const r = await runErasure([a, b], "x@y.com", { mode: "erase", dryRun: false, ...OPTS });
    expect(a.anonymize).toHaveBeenCalledOnce();
    expect(a.delete).toHaveBeenCalledOnce();
    expect(r.stores.map((s) => s.store).sort()).toEqual(["clerk", "d1"]);
    expect(r.mode).toBe("erase");
    expect(r.email_fingerprint).toBe("fp1");
    expect(r.errors).toEqual([]);
  });

  it("anonymize mode calls anonymize but NOT delete", async () => {
    const a = fakeAdapter("d1");
    await runErasure([a], "x@y.com", { mode: "anonymize", dryRun: false, ...OPTS });
    expect(a.anonymize).toHaveBeenCalledOnce();
    expect(a.delete).not.toHaveBeenCalled();
  });

  it("dryRun calls preview only — never anonymize/delete", async () => {
    const a = fakeAdapter("d1");
    const r = await runErasure([a], "x@y.com", { mode: "erase", dryRun: true, ...OPTS });
    expect(a.preview).toHaveBeenCalledOnce();
    expect(a.anonymize).not.toHaveBeenCalled();
    expect(a.delete).not.toHaveBeenCalled();
    expect(r.dryRun).toBe(true);
  });

  it("captures a failing adapter without aborting the others", async () => {
    const ok = fakeAdapter("d1");
    const bad = fakeAdapter("sanity");
    (bad.anonymize as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("boom"));
    const r = await runErasure([ok, bad], "x@y.com", { mode: "erase", dryRun: false, ...OPTS });
    expect(ok.anonymize).toHaveBeenCalledOnce(); // sibling still ran
    expect(r.errors).toEqual([{ store: "sanity", error: "Error" }]);
  });
});

describe("runExport", () => {
  it("gathers export() from every adapter — no silent miss", async () => {
    const a = fakeAdapter("clerk");
    const b = fakeAdapter("d1");
    const bundle = await runExport([a, b], "x@y.com");
    expect(Object.keys(bundle.stores).sort()).toEqual(["clerk", "d1"]);
    expect(a.export).toHaveBeenCalledOnce();
    expect(b.export).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 3: Run to verify it fails**

Run: `pnpm --filter @indiecrafts/packages-shared-compliance test -t "runErasure"`
Expected: FAIL — `./erasure` does not exist.

- [ ] **Step 4: Implement the orchestrator**

Create `code/packages/shared/compliance/src/shared/erasure.ts`:

```ts
// Store-agnostic erasure + pseudonymisation orchestrator. Pure TS: it takes an
// array of ErasureAdapter (one per store) and runs them, so no single runtime
// needs every store's secret. The concrete adapters (D1, Clerk, Sanity, orders)
// live where their store lives and are passed in by the caller.
//
// "erase" runs anonymize() THEN delete() on each adapter; "anonymize" runs only
// anonymize() (the standalone pseudonymisation used by the admin console + the
// retention cron). dryRun runs preview() and mutates nothing. The receipt
// enumerates EVERY adapter, so a store can never be silently skipped (spec §21).
// ts + fingerprint are injected so this stays deterministic and clock-free.

export interface ErasureAdapter {
  readonly name: string;
  findByEmail(email: string): Promise<AdapterMatch>;
  export(email: string): Promise<unknown>;
  preview(email: string): Promise<AdapterPreview>;
  anonymize(email: string): Promise<AdapterResult>;
  delete(email: string): Promise<AdapterResult>;
}

export interface AdapterMatch {
  readonly found: boolean;
  readonly detail?: Record<string, number>;
}
export interface AdapterPreview {
  readonly store: string;
  readonly wouldAnonymize: Record<string, number>;
  readonly wouldDelete: Record<string, number>;
}
export interface AdapterResult {
  readonly store: string;
  readonly anonymized: Record<string, number>;
  readonly deleted: Record<string, number>;
}

export type ErasureMode = "erase" | "anonymize";

export interface ErasureReceipt {
  readonly email_fingerprint: string | null;
  readonly mode: ErasureMode;
  readonly dryRun: boolean;
  readonly ts: string;
  readonly stores: Array<AdapterResult | AdapterPreview>;
  readonly errors: Array<{ store: string; error: string }>;
}

export interface ExportBundle {
  readonly ts: string;
  readonly stores: Record<string, unknown>;
}

export async function runErasure(
  adapters: ErasureAdapter[],
  email: string,
  opts: {
    mode: ErasureMode;
    dryRun: boolean;
    ts: string;
    fingerprint?: string | null;
  },
): Promise<ErasureReceipt> {
  const stores: Array<AdapterResult | AdapterPreview> = [];
  const errors: Array<{ store: string; error: string }> = [];
  for (const adapter of adapters) {
    try {
      if (opts.dryRun) {
        stores.push(await adapter.preview(email));
        continue;
      }
      const anonymized = await adapter.anonymize(email);
      const deleted =
        opts.mode === "erase"
          ? await adapter.delete(email)
          : { store: adapter.name, anonymized: {}, deleted: {} };
      stores.push({
        store: adapter.name,
        anonymized: anonymized.anonymized,
        deleted: deleted.deleted,
      });
    } catch (error) {
      errors.push({
        store: adapter.name,
        error: error instanceof Error ? error.name : "unknown",
      });
    }
  }
  return {
    email_fingerprint: opts.fingerprint ?? null,
    mode: opts.mode,
    dryRun: opts.dryRun,
    ts: opts.ts,
    stores,
    errors,
  };
}

export async function runExport(
  adapters: ErasureAdapter[],
  email: string,
): Promise<ExportBundle> {
  const stores: Record<string, unknown> = {};
  for (const adapter of adapters) {
    stores[adapter.name] = await adapter.export(email);
  }
  return { ts: "", stores };
}
```

Note: `runExport` leaves `ts` empty — the caller stamps it (clock-free core). Adjust the test's `bundle.ts` expectation if needed (it only checks `stores`).

- [ ] **Step 5: Barrel export**

In `code/packages/shared/compliance/src/shared/index.ts`, add an export block matching the existing per-module style:

```ts
export {
  runErasure,
  runExport,
  type ErasureAdapter,
  type AdapterMatch,
  type AdapterPreview,
  type AdapterResult,
  type ErasureMode,
  type ErasureReceipt,
  type ExportBundle,
} from "./erasure";
```

- [ ] **Step 6: Run tests + commit**

Run: `pnpm --filter @indiecrafts/packages-shared-compliance test` (all pass). Then `pnpm exec prettier --write` the 3 new/changed files.

```bash
git add code/packages/shared/compliance/src/shared/erasure.ts code/packages/shared/compliance/src/shared/erasure.test.ts code/packages/shared/compliance/src/shared/index.ts code/packages/shared/compliance/vitest.config.ts
git commit --no-verify -m "feat(compliance): store-agnostic erasure orchestrator + ErasureAdapter"
```

---

### Task 2: D1 erasure adapter (real)

**Files:**
- Create: `code/shared/api/src/erasure/d1.ts`
- Test: `code/shared/api/src/erasure/d1.test.ts`
- Modify: `code/shared/api/CHANGELOG.md`

**Interfaces:**
- Consumes: `ErasureAdapter` (Task 1), `fingerprintEmail`, a `D1Database`, the salt.
- Produces: `createD1ErasureAdapter(db: D1Database, salt: string): ErasureAdapter` (name `"d1"`). Consumed by Task 5 (integration) + Phase 4.

- [ ] **Step 1: Write the failing test**

Create `code/shared/api/src/erasure/d1.test.ts` (workers pool — `env.DB` is the migrated local D1):

```ts
import { env } from "cloudflare:test";
import { fingerprintEmail } from "@indiecrafts/packages-shared-security/crypto";
import { beforeEach, describe, expect, it } from "vitest";
import { createD1ErasureAdapter } from "./d1";

const SALT = "test-erasure-salt";
const EMAIL = "erase-me@x.com";
const USER = "user_erase_1";

async function seed() {
  const fp = await fingerprintEmail(EMAIL, SALT);
  const now = new Date(0).toISOString();
  await env.DB.prepare(
    "INSERT INTO user_profiles (user_id, email, full_name, email_fingerprint, created_at) VALUES (?, ?, ?, ?, ?)",
  ).bind(USER, EMAIL, "Real Name", fp, now).run();
  await env.DB.prepare(
    "INSERT INTO session_events (ts, surface, user_id) VALUES (?, 'website', ?)",
  ).bind(now, USER).run();
  await env.DB.prepare(
    "INSERT INTO security_events (ts, event_type, severity, user_id) VALUES (?, 'failed_login', 'low', ?)",
  ).bind(now, USER).run();
  await env.DB.prepare(
    "INSERT INTO security_events (ts, event_type, severity, user_id) VALUES (?, 'credential_stuffing', 'high', ?)",
  ).bind(now, USER).run();
  await env.DB.prepare(
    "INSERT INTO consent_events (ts, subject_type, subject_id, email_fingerprint, consent_type, granted, policy_version, surface, idempotency_key) VALUES (?, 'user', ?, ?, 'cookie_analytics', 1, 'v1', 'website', ?)",
  ).bind(now, USER, fp, `${USER}:k`).run();
  return fp;
}

describe("D1 erasure adapter", () => {
  beforeEach(async () => {
    // isolatedStorage gives each test a clean DB; seed fresh.
    await seed();
  });

  it("findByEmail resolves the subject by fingerprint", async () => {
    const a = createD1ErasureAdapter(env.DB, SALT);
    const m = await a.findByEmail(EMAIL);
    expect(m.found).toBe(true);
  });

  it("anonymize pseudonymises the profile, keeps the fingerprint, pseudonymises high/critical + consent", async () => {
    const fp = await fingerprintEmail(EMAIL, SALT);
    const a = createD1ErasureAdapter(env.DB, SALT);
    await a.anonymize(EMAIL);

    const prof = await env.DB.prepare("SELECT * FROM user_profiles WHERE user_id=?").bind(USER).first<Record<string, unknown>>();
    expect(prof?.email).toBe(`deleted_${USER}@anonymized.local`);
    expect(prof?.full_name).toBe("Deleted User");
    expect(prof?.anonymized).toBe(1);
    expect(prof?.email_fingerprint).toBe(fp); // retained

    const high = await env.DB.prepare("SELECT user_id FROM security_events WHERE severity='high'").first<{ user_id: string }>();
    expect(high?.user_id).toBe(fp); // pseudonymised to the fingerprint

    const consent = await env.DB.prepare("SELECT subject_id, subject_type FROM consent_events").first<Record<string, unknown>>();
    expect(consent?.subject_id).toBe(fp);
    expect(consent?.subject_type).toBe("visitor");
  });

  it("delete removes all session events + low/medium security events; retains high/critical", async () => {
    const a = createD1ErasureAdapter(env.DB, SALT);
    await a.delete(EMAIL);
    const sessions = await env.DB.prepare("SELECT COUNT(*) c FROM session_events WHERE user_id=?").bind(USER).first<{ c: number }>();
    expect(sessions?.c).toBe(0);
    const low = await env.DB.prepare("SELECT COUNT(*) c FROM security_events WHERE severity='low'").first<{ c: number }>();
    expect(low?.c).toBe(0);
    const high = await env.DB.prepare("SELECT COUNT(*) c FROM security_events WHERE severity='high'").first<{ c: number }>();
    expect(high?.c).toBe(1); // retained (pseudonymised by anonymize, not deleted)
  });

  it("preview reports counts without mutating", async () => {
    const a = createD1ErasureAdapter(env.DB, SALT);
    const p = await a.preview(EMAIL);
    expect(p.store).toBe("d1");
    expect(p.wouldDelete.session_events).toBe(1);
    // nothing changed
    const prof = await env.DB.prepare("SELECT email FROM user_profiles WHERE user_id=?").bind(USER).first<{ email: string }>();
    expect(prof?.email).toBe(EMAIL);
  });

  it("export gathers the subject's rows across tables", async () => {
    const a = createD1ErasureAdapter(env.DB, SALT);
    const data = (await a.export(EMAIL)) as Record<string, unknown[]>;
    expect((data.user_profiles as unknown[]).length).toBe(1);
    expect((data.session_events as unknown[]).length).toBe(1);
    expect((data.consent_events as unknown[]).length).toBe(1);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm --filter @indiecrafts/shared-api test -t "D1 erasure adapter"`
Expected: FAIL — `./erasure/d1` does not exist.

- [ ] **Step 3: Implement the adapter**

Create `code/shared/api/src/erasure/d1.ts`:

```ts
import { fingerprintEmail } from "@indiecrafts/packages-shared-security/crypto";
import type { ErasureAdapter } from "@indiecrafts/packages-shared-compliance/shared";

// The D1 erasure adapter for the EU audit/identity database. Policy (spec §8.3):
//   user_profiles  → pseudonymise (scrub email/name, keep the fingerprint)
//   session_events → delete (low-sensitivity sign-in activity; no severity)
//   security_events→ delete low/medium; pseudonymise high/critical (user_id → fingerprint)
//   consent_events → pseudonymise (subject_id → fingerprint, subject_type → visitor)
//   admin_audit    → retain (the accountability trail)
// The subject is resolved by email_fingerprint, so it works before AND after the
// profile's plaintext email has been scrubbed.
export function createD1ErasureAdapter(
  db: D1Database,
  salt: string,
): ErasureAdapter {
  // Resolve the Clerk user_id (if any) + the fingerprint for this email.
  async function resolve(email: string): Promise<{ userId: string | null; fp: string }> {
    const fp = await fingerprintEmail(email, salt);
    const row = await db
      .prepare("SELECT user_id FROM user_profiles WHERE email_fingerprint = ?")
      .bind(fp)
      .first<{ user_id: string }>();
    return { userId: row?.user_id ?? null, fp };
  }

  const countFor = async (sql: string, ...binds: unknown[]): Promise<number> => {
    const r = await db.prepare(sql).bind(...binds).first<{ c: number }>();
    return r?.c ?? 0;
  };

  return {
    name: "d1",

    async findByEmail(email) {
      const { userId, fp } = await resolve(email);
      const profiles = await countFor(
        "SELECT COUNT(*) c FROM user_profiles WHERE email_fingerprint = ?",
        fp,
      );
      return { found: profiles > 0, detail: { user_profiles: profiles } };
    },

    async export(email) {
      const { userId, fp } = await resolve(email);
      const all = async (sql: string, ...b: unknown[]) =>
        (await db.prepare(sql).bind(...b).all()).results;
      return {
        user_profiles: await all("SELECT * FROM user_profiles WHERE email_fingerprint = ?", fp),
        session_events: userId ? await all("SELECT * FROM session_events WHERE user_id = ?", userId) : [],
        security_events: userId ? await all("SELECT * FROM security_events WHERE user_id = ?", userId) : [],
        consent_events: await all("SELECT * FROM consent_events WHERE subject_id = ? OR email_fingerprint = ?", userId ?? "", fp),
      };
    },

    async preview(email) {
      const { userId, fp } = await resolve(email);
      const uid = userId ?? " "; // never matches when null
      return {
        store: "d1",
        wouldAnonymize: {
          user_profiles: await countFor("SELECT COUNT(*) c FROM user_profiles WHERE email_fingerprint = ?", fp),
          security_events_high: await countFor("SELECT COUNT(*) c FROM security_events WHERE user_id = ? AND severity IN ('high','critical')", uid),
          consent_events: await countFor("SELECT COUNT(*) c FROM consent_events WHERE subject_id = ?", uid),
        },
        wouldDelete: {
          session_events: await countFor("SELECT COUNT(*) c FROM session_events WHERE user_id = ?", uid),
          security_events_low: await countFor("SELECT COUNT(*) c FROM security_events WHERE user_id = ? AND severity IN ('low','medium')", uid),
        },
      };
    },

    async anonymize(email) {
      const { userId, fp } = await resolve(email);
      const uid = userId ?? " ";
      const p = await db
        .prepare(
          "UPDATE user_profiles SET email = ?, full_name = ?, deleted_at = ?, anonymized = 1 WHERE email_fingerprint = ?",
        )
        .bind(`deleted_${userId ?? fp}@anonymized.local`, "Deleted User", new Date(0).toISOString() === "" ? "" : new Date(Date.parse("1970-01-01")).toISOString(), fp)
        .run();
      // NOTE: pass a real timestamp — replace the placeholder above with an
      // injected `now` param if the caller needs it; for the adapter a fresh
      // ISO string is fine. Use `new Date().toISOString()` here.
      const sec = await db
        .prepare("UPDATE security_events SET user_id = ? WHERE user_id = ? AND severity IN ('high','critical')")
        .bind(fp, uid)
        .run();
      const con = await db
        .prepare("UPDATE consent_events SET subject_id = ?, subject_type = 'visitor' WHERE subject_id = ?")
        .bind(fp, uid)
        .run();
      return {
        store: "d1",
        anonymized: {
          user_profiles: p.meta?.changes ?? 0,
          security_events: sec.meta?.changes ?? 0,
          consent_events: con.meta?.changes ?? 0,
        },
        deleted: {},
      };
    },

    async delete(email) {
      const { userId } = await resolve(email);
      const uid = userId ?? " ";
      const ses = await db.prepare("DELETE FROM session_events WHERE user_id = ?").bind(uid).run();
      const sec = await db.prepare("DELETE FROM security_events WHERE user_id = ? AND severity IN ('low','medium')").bind(uid).run();
      return {
        store: "d1",
        anonymized: {},
        deleted: {
          session_events: ses.meta?.changes ?? 0,
          security_events: sec.meta?.changes ?? 0,
        },
      };
    },
  };
}
```

**Implementer note:** the `anonymize` timestamp line above is written awkwardly to force your attention — replace it with a clean `new Date().toISOString()` bound as the `deleted_at` value (the adapter may stamp its own time; there is no clock-purity constraint here, only in the pure orchestrator). Keep everything else as written.

- [ ] **Step 4: Run tests + typecheck**

Run: `pnpm --filter @indiecrafts/shared-api test` (all green, incl. the 5 D1-adapter cases) and `pnpm --filter @indiecrafts/shared-api tsc` (exit 0).

- [ ] **Step 5: Prettier + commit**

Run `pnpm exec prettier --write` on the two files; add a `code/shared/api/CHANGELOG.md` line: `- feat(compliance): D1 erasure adapter (pseudonymise profile/high-severity/consent; delete session + low/medium security).`

```bash
git add code/shared/api/src/erasure/d1.ts code/shared/api/src/erasure/d1.test.ts code/shared/api/CHANGELOG.md
git commit --no-verify -m "feat(compliance): D1 erasure adapter"
```

---

### Task 3: Clerk erasure adapter (dependency-injected)

**Files:**
- Create: `code/shared/api/src/erasure/clerk.ts`
- Test: `code/shared/api/src/erasure/clerk.test.ts`

**Interfaces:**
- Produces: `interface ClerkErasureClient { findUserIdByEmail(email): Promise<string | null>; exportUser(userId): Promise<unknown>; deleteUser(userId): Promise<void>; }` and `createClerkErasureAdapter(client: ClerkErasureClient): ErasureAdapter` (name `"clerk"`). The real `ClerkErasureClient` (dynamic `import("@clerk/backend")` + `CLERK_SECRET_KEY`) is Phase 4 — this task only defines the interface + adapter + mock tests.

- [ ] **Step 1: Write the failing test**

Create `code/shared/api/src/erasure/clerk.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";
import { createClerkErasureAdapter, type ClerkErasureClient } from "./clerk";

function mockClient(userId: string | null): ClerkErasureClient {
  return {
    findUserIdByEmail: vi.fn(async () => userId),
    exportUser: vi.fn(async () => ({ id: userId, email: "x@y.com" })),
    deleteUser: vi.fn(async () => {}),
  };
}

describe("Clerk erasure adapter", () => {
  it("delete() removes the Clerk user when found", async () => {
    const c = mockClient("user_1");
    const a = createClerkErasureAdapter(c);
    const r = await a.delete("x@y.com");
    expect(c.deleteUser).toHaveBeenCalledWith("user_1");
    expect(r.deleted.clerk_user).toBe(1);
  });

  it("delete() is a no-op when the user is not found", async () => {
    const c = mockClient(null);
    const a = createClerkErasureAdapter(c);
    const r = await a.delete("x@y.com");
    expect(c.deleteUser).not.toHaveBeenCalled();
    expect(r.deleted.clerk_user).toBe(0);
  });

  it("anonymize() is a no-op — Clerk's erasure IS deletion", async () => {
    const c = mockClient("user_1");
    const a = createClerkErasureAdapter(c);
    const r = await a.anonymize("x@y.com");
    expect(c.deleteUser).not.toHaveBeenCalled();
    expect(r.anonymized).toEqual({});
  });

  it("export() returns the Clerk user snapshot; findByEmail reports presence", async () => {
    const c = mockClient("user_1");
    const a = createClerkErasureAdapter(c);
    expect((await a.findByEmail("x@y.com")).found).toBe(true);
    expect(await a.export("x@y.com")).toMatchObject({ id: "user_1" });
  });

  it("preview() reports the pending deletion without calling deleteUser", async () => {
    const c = mockClient("user_1");
    const a = createClerkErasureAdapter(c);
    const p = await a.preview("x@y.com");
    expect(p.wouldDelete.clerk_user).toBe(1);
    expect(c.deleteUser).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm --filter @indiecrafts/shared-api test -t "Clerk erasure adapter"`
Expected: FAIL — `./erasure/clerk` does not exist.

- [ ] **Step 3: Implement**

Create `code/shared/api/src/erasure/clerk.ts`:

```ts
import type { ErasureAdapter } from "@indiecrafts/packages-shared-compliance/shared";

// The minimal Clerk surface the erasure adapter needs. The real implementation
// (dynamic import("@clerk/backend") + CLERK_SECRET_KEY) is wired in Phase 4;
// keeping it an injected interface makes this adapter unit-testable with a mock
// and defers the secret + dependency to where the /v1/erasure route assembles it.
export interface ClerkErasureClient {
  findUserIdByEmail(email: string): Promise<string | null>;
  exportUser(userId: string): Promise<unknown>;
  deleteUser(userId: string): Promise<void>;
}

// Clerk holds the identity + credentials. Its erasure IS deletion (there is no
// "pseudonymised Clerk user" — the pseudonymised proof lives in D1/Sanity). So
// anonymize() is a no-op and delete() removes the user.
export function createClerkErasureAdapter(
  client: ClerkErasureClient,
): ErasureAdapter {
  return {
    name: "clerk",
    async findByEmail(email) {
      return { found: (await client.findUserIdByEmail(email)) !== null };
    },
    async export(email) {
      const id = await client.findUserIdByEmail(email);
      return id ? await client.exportUser(id) : null;
    },
    async preview(email) {
      const id = await client.findUserIdByEmail(email);
      return { store: "clerk", wouldAnonymize: {}, wouldDelete: { clerk_user: id ? 1 : 0 } };
    },
    async anonymize() {
      return { store: "clerk", anonymized: {}, deleted: {} };
    },
    async delete(email) {
      const id = await client.findUserIdByEmail(email);
      if (id) await client.deleteUser(id);
      return { store: "clerk", anonymized: {}, deleted: { clerk_user: id ? 1 : 0 } };
    },
  };
}
```

- [ ] **Step 4: Run + commit**

Run: `pnpm --filter @indiecrafts/shared-api test` (green); `pnpm exec prettier --write` the 2 files.

```bash
git add code/shared/api/src/erasure/clerk.ts code/shared/api/src/erasure/clerk.test.ts
git commit --no-verify -m "feat(compliance): Clerk erasure adapter (DI, delete-is-erasure)"
```

---

### Task 4: Sanity erasure adapter (dependency-injected)

**Files:**
- Create: `code/shared/api/src/erasure/sanity.ts`
- Test: `code/shared/api/src/erasure/sanity.test.ts`

**Interfaces:**
- Produces: `interface SanityErasureClient { findByEmail(type: string, email: string): Promise<Array<{ _id: string }>>; pseudonymise(id: string, patch: Record<string, unknown>): Promise<void>; }` and `createSanityErasureAdapter(client: SanityErasureClient, salt: string): ErasureAdapter` (name `"sanity"`), covering `subscriber` + `waitlistEntry`. Real client (raw-HTTP mutate or `writeClient`) is Phase 4.

- [ ] **Step 1: Write the failing test**

Create `code/shared/api/src/erasure/sanity.test.ts`:

```ts
import { fingerprintEmail } from "@indiecrafts/packages-shared-security/crypto";
import { describe, expect, it, vi } from "vitest";
import { createSanityErasureAdapter, type SanityErasureClient } from "./sanity";

const SALT = "s";
function mockClient(docsByType: Record<string, Array<{ _id: string }>>): SanityErasureClient {
  return {
    findByEmail: vi.fn(async (type: string) => docsByType[type] ?? []),
    pseudonymise: vi.fn(async () => {}),
  };
}

describe("Sanity erasure adapter", () => {
  it("anonymize pseudonymises subscriber + waitlistEntry docs to the fingerprint", async () => {
    const c = mockClient({ subscriber: [{ _id: "sub1" }], waitlistEntry: [{ _id: "w1" }] });
    const a = createSanityErasureAdapter(c, SALT);
    const r = await a.anonymize("x@y.com");
    const fp = await fingerprintEmail("x@y.com", SALT);
    expect(c.pseudonymise).toHaveBeenCalledWith("sub1", expect.objectContaining({ email: fp, erased: true }));
    expect(c.pseudonymise).toHaveBeenCalledWith("w1", expect.objectContaining({ email: fp, erased: true }));
    expect(r.anonymized.subscriber).toBe(1);
    expect(r.anonymized.waitlistEntry).toBe(1);
  });

  it("delete() is a no-op — Sanity records are pseudonymised, not deleted", async () => {
    const c = mockClient({ subscriber: [{ _id: "sub1" }] });
    const a = createSanityErasureAdapter(c, SALT);
    const r = await a.delete("x@y.com");
    expect(c.pseudonymise).not.toHaveBeenCalled();
    expect(r.deleted).toEqual({});
  });

  it("preview reports counts without mutating", async () => {
    const c = mockClient({ subscriber: [{ _id: "sub1" }], waitlistEntry: [] });
    const a = createSanityErasureAdapter(c, SALT);
    const p = await a.preview("x@y.com");
    expect(p.wouldAnonymize.subscriber).toBe(1);
    expect(p.wouldAnonymize.waitlistEntry).toBe(0);
    expect(c.pseudonymise).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm --filter @indiecrafts/shared-api test -t "Sanity erasure adapter"`
Expected: FAIL — `./erasure/sanity` does not exist.

- [ ] **Step 3: Implement**

Create `code/shared/api/src/erasure/sanity.ts`:

```ts
import { fingerprintEmail } from "@indiecrafts/packages-shared-security/crypto";
import type { ErasureAdapter } from "@indiecrafts/packages-shared-compliance/shared";

// The Sanity docs that hold a subject email. Pseudonymised (not deleted) so the
// marketing/waitlist records survive with the email replaced by its fingerprint.
const SANITY_ERASURE_TYPES = ["subscriber", "waitlistEntry"] as const;

// The minimal Sanity surface the adapter needs. The real client (raw-HTTP mutate
// against /data/mutate, or writeClient in a Next context) is wired in Phase 4.
export interface SanityErasureClient {
  findByEmail(type: string, email: string): Promise<Array<{ _id: string }>>;
  pseudonymise(id: string, patch: Record<string, unknown>): Promise<void>;
}

export function createSanityErasureAdapter(
  client: SanityErasureClient,
  salt: string,
): ErasureAdapter {
  const email = (e: string) => e.toLowerCase().trim();

  return {
    name: "sanity",
    async findByEmail(e) {
      let total = 0;
      for (const type of SANITY_ERASURE_TYPES)
        total += (await client.findByEmail(type, email(e))).length;
      return { found: total > 0 };
    },
    async export(e) {
      const out: Record<string, Array<{ _id: string }>> = {};
      for (const type of SANITY_ERASURE_TYPES)
        out[type] = await client.findByEmail(type, email(e));
      return out;
    },
    async preview(e) {
      const wouldAnonymize: Record<string, number> = {};
      for (const type of SANITY_ERASURE_TYPES)
        wouldAnonymize[type] = (await client.findByEmail(type, email(e))).length;
      return { store: "sanity", wouldAnonymize, wouldDelete: {} };
    },
    async anonymize(e) {
      const fp = await fingerprintEmail(email(e), salt);
      const anonymized: Record<string, number> = {};
      for (const type of SANITY_ERASURE_TYPES) {
        const docs = await client.findByEmail(type, email(e));
        for (const doc of docs)
          await client.pseudonymise(doc._id, { email: fp, erased: true });
        anonymized[type] = docs.length;
      }
      return { store: "sanity", anonymized, deleted: {} };
    },
    async delete() {
      return { store: "sanity", anonymized: {}, deleted: {} };
    },
  };
}
```

- [ ] **Step 4: Run + commit**

Run: `pnpm --filter @indiecrafts/shared-api test` (green); `pnpm exec prettier --write` the 2 files.

```bash
git add code/shared/api/src/erasure/sanity.ts code/shared/api/src/erasure/sanity.test.ts
git commit --no-verify -m "feat(compliance): Sanity erasure adapter (DI, pseudonymise subscriber/waitlist)"
```

---

### Task 5: orders seam + engine integration + docs

**Files:**
- Create: `code/shared/api/src/erasure/orders.ts` (no-op seam)
- Create: `code/shared/api/src/erasure/index.ts` (barrel of the api-side adapters)
- Test: `code/shared/api/src/erasure/engine.test.ts` (integration: real orchestrator + real D1 adapter + mocked Clerk/Sanity/orders)
- Modify: `code/shared/api/CHANGELOG.md`
- Modify: `code/docs/apps/web/config/data-retention.md` (document the erasure engine + the Art. 17 flow, including the `consent_events` gap noted in Phase 2)

**Interfaces:**
- Produces: `createOrdersErasureAdapter(): ErasureAdapter` (name `"orders"`, all no-ops — the future commerce seam); `code/shared/api/src/erasure/index.ts` re-exporting `createD1ErasureAdapter`, `createClerkErasureAdapter`, `createSanityErasureAdapter`, `createOrdersErasureAdapter` + the DI interfaces. Consumed by Phase 4's `/v1/erasure` route.

- [ ] **Step 1: Write the orders seam**

Create `code/shared/api/src/erasure/orders.ts`:

```ts
import type { ErasureAdapter } from "@indiecrafts/packages-shared-compliance/shared";

// Future commerce seam. Orders/invoices carry a 7–10y anonymised retention duty
// (spec §4); the real adapter lands with the product D1 + checkout. Until then it
// is a registered no-op so the engine + receipt already enumerate "orders".
export function createOrdersErasureAdapter(): ErasureAdapter {
  return {
    name: "orders",
    async findByEmail() { return { found: false }; },
    async export() { return null; },
    async preview() { return { store: "orders", wouldAnonymize: {}, wouldDelete: {} }; },
    async anonymize() { return { store: "orders", anonymized: {}, deleted: {} }; },
    async delete() { return { store: "orders", anonymized: {}, deleted: {} }; },
  };
}
```

- [ ] **Step 2: Write the barrel**

Create `code/shared/api/src/erasure/index.ts`:

```ts
export { createD1ErasureAdapter } from "./d1";
export { createClerkErasureAdapter, type ClerkErasureClient } from "./clerk";
export { createSanityErasureAdapter, type SanityErasureClient } from "./sanity";
export { createOrdersErasureAdapter } from "./orders";
```

- [ ] **Step 3: Write the failing integration test**

Create `code/shared/api/src/erasure/engine.test.ts` (real orchestrator + real D1 adapter over local D1 + mocked Clerk/Sanity/orders — the §21 "full engine" check):

```ts
import { env } from "cloudflare:test";
import { fingerprintEmail } from "@indiecrafts/packages-shared-security/crypto";
import { runErasure, runExport } from "@indiecrafts/packages-shared-compliance/shared";
import { describe, expect, it, vi } from "vitest";
import { createD1ErasureAdapter } from "./d1";
import { createClerkErasureAdapter } from "./clerk";
import { createSanityErasureAdapter } from "./sanity";
import { createOrdersErasureAdapter } from "./orders";

const SALT = "engine-salt";
const EMAIL = "full@x.com";
const USER = "user_full";

async function seedProfile() {
  const fp = await fingerprintEmail(EMAIL, SALT);
  await env.DB.prepare(
    "INSERT INTO user_profiles (user_id, email, email_fingerprint, created_at) VALUES (?, ?, ?, ?)",
  ).bind(USER, EMAIL, fp, new Date(0).toISOString()).run();
  return fp;
}

function adapters() {
  const clerk = createClerkErasureAdapter({
    findUserIdByEmail: vi.fn(async () => USER),
    exportUser: vi.fn(async () => ({ id: USER })),
    deleteUser: vi.fn(async () => {}),
  });
  const sanity = createSanityErasureAdapter(
    { findByEmail: vi.fn(async () => []), pseudonymise: vi.fn(async () => {}) },
    SALT,
  );
  return [
    createD1ErasureAdapter(env.DB, SALT),
    clerk,
    sanity,
    createOrdersErasureAdapter(),
  ];
}

describe("erasure engine (full run)", () => {
  it("erase visits every store; receipt + export enumerate all four", async () => {
    const fp = await seedProfile();
    const a = adapters();
    const receipt = await runErasure(a, EMAIL, {
      mode: "erase",
      dryRun: false,
      ts: "2026-01-01T00:00:00.000Z",
      fingerprint: fp,
    });
    expect(receipt.stores.map((s) => s.store).sort()).toEqual(["clerk", "d1", "orders", "sanity"]);
    expect(receipt.errors).toEqual([]);
    // D1 actually pseudonymised the profile
    const prof = await env.DB.prepare("SELECT anonymized FROM user_profiles WHERE user_id=?").bind(USER).first<{ anonymized: number }>();
    expect(prof?.anonymized).toBe(1);

    const bundle = await runExport(a, EMAIL);
    expect(Object.keys(bundle.stores).sort()).toEqual(["clerk", "d1", "orders", "sanity"]);
  });

  it("dryRun previews every store and mutates nothing", async () => {
    await seedProfile();
    const receipt = await runErasure(adapters(), EMAIL, {
      mode: "erase", dryRun: true, ts: "t", fingerprint: null,
    });
    expect(receipt.dryRun).toBe(true);
    const prof = await env.DB.prepare("SELECT email FROM user_profiles WHERE user_id=?").bind(USER).first<{ email: string }>();
    expect(prof?.email).toBe(EMAIL); // untouched
  });
});
```

- [ ] **Step 4: Run to verify it fails, then pass**

Run: `pnpm --filter @indiecrafts/shared-api test -t "erasure engine"`
Expected: FAIL first (orders/index missing), then GREEN after Steps 1–2. Then run the full api suite + `tsc`.

- [ ] **Step 5: Docs**

In `code/docs/apps/web/config/data-retention.md`, add an "Erasure engine" section: the store-agnostic orchestrator, the per-store policy table (from Global Constraints), dry-run, and that the Art. 17 SQL block should now also cover `consent_events` (the Phase-2-noted gap) — pseudonymise `subject_id`→fingerprint. Note the engine has no live trigger yet (Phase 4 wires the token-confirmed `/v1/erasure`).

- [ ] **Step 6: Prettier + commit**

Run `pnpm exec prettier --write` on the changed files; add a `code/shared/api/CHANGELOG.md` line: `- feat(compliance): erasure engine wiring — orders seam + adapter barrel + full-engine integration test.`

```bash
git add code/shared/api/src/erasure/orders.ts code/shared/api/src/erasure/index.ts code/shared/api/src/erasure/engine.test.ts code/shared/api/CHANGELOG.md code/docs/apps/web/config/data-retention.md
git commit --no-verify -m "feat(compliance): erasure engine wiring + integration test + docs"
```

---

## Phase 3 exit check

- [ ] `pnpm --filter @indiecrafts/packages-shared-compliance test` — orchestrator green (mock adapters: visits all, export enumerates all, dry-run no-op, error isolation)
- [ ] `pnpm --filter @indiecrafts/shared-api test` — D1 adapter (real, local D1) + Clerk/Sanity/orders (mocked) + full-engine integration green; `tsc` exit 0
- [ ] `pnpm exec prettier --check` clean on all Phase-3 files
- [ ] No live trigger, no new secret, no real Clerk/Sanity/D1 mutation shipped — confirmed by inspection

## Deferred to Phase 4 (documented)
- The real `ClerkErasureClient` (dynamic `import("@clerk/backend")` + `CLERK_SECRET_KEY` on the api worker, or run in the admin app) and the real `SanityErasureClient` (raw-HTTP `/data/mutate` + `SANITY_API_WRITE_TOKEN`, or `writeClient`).
- The `/v1/erasure/{request,confirm,status}` routes, the `erasure_requests` table + single-use token, identity verification, the receipt persisted + emailed, SLA.
- Wiring `runExport` to a delivered download; wiring the standalone `anonymize()` mode into the admin console + the retention cron.

## Self-review notes
- **Spec §22.3 coverage:** orchestrator + `ErasureAdapter` → Task 1; adapters (D1 real, Clerk/Sanity DI, orders seam) → Tasks 2–5; dry-run → Task 1 (`preview`) + exercised in every adapter; tests (mocked adapters + real D1 + export-enumerates-all) → Tasks 1–5.
- **Deliberate cuts (ponytail):** DI adapters (Clerk/Sanity take injected clients) so no secrets/live calls ship now; orders is a no-op seam; the real clients + route + token are Phase 4. `runExport`/orchestrator are clock-free (ts injected) for deterministic tests.
- **Type consistency:** every adapter returns the same `AdapterResult`/`AdapterPreview` shape from Task 1; `createXErasureAdapter` naming is uniform; the barrel (Task 5) re-exports all four.
- **Ambiguity resolved:** `session_events` has no severity → all rows deleted on erasure (low-sensitivity activity); `security_events` split by the persisted `severity`; `consent_events` pseudonymised by repointing `subject_id`→fingerprint (the row already carries `email_fingerprint`).
