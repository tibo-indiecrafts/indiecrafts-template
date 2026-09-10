# Compliance Layer — Phase 1 (Foundation) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the compliance foundation — a D1 `user_profiles` store created on login and kept in sync with Clerk, a salted email-fingerprint primitive, salt tooling, and a one-time backfill — so every later phase (consent log, erasure, export) has a user record and a pseudonymisation key to build on.

**Architecture:** Extend the existing EU-D1 api worker (`code/shared/api`) and the `packages/shared/security` brick. `user_profiles` is written by two paths: the session-log sink upserts a bare row on each sign-in (stamps `last_login_at`); the Clerk webhook is the source of truth for email/name (upserts + re-fingerprints on change, pseudonymises on delete). `fingerprintEmail` is the pseudonymisation primitive. All logic is explicit worker/brick code + tests — D1 has no triggers.

**Tech Stack:** Cloudflare Workers + D1 (SQLite), TypeScript strict, wrangler, vitest — `@cloudflare/vitest-pool-workers` (workerd + local D1) for the api worker, the shared happy-dom pool for the brick — and `@clerk/backend` for the backfill.

**Spec:** `docs/superpowers/specs/2026-08-23-gdpr-compliance-layer-design.md`

## Global Constraints

- **Fingerprint = pseudonymisation, still personal data.** `fingerprintEmail` is a salted SHA-256 hex over `salt + email.toLowerCase().trim()`. Keep the fingerprint on pseudonymisation; drop it only at final purge (later phase). (Spec §5)
- **Salts:** one salt per purpose, **identical across all envs**, never committed. `GDPR_FINGERPRINT_SALT` is the re-identification key — rotate only with a re-fingerprint migration. (Spec §5)
- **Migrations forward-only** (expand → migrate → contract); D1 has no down-migrations. New files are named `NNNN_snake_label.sql`. (Spec §15, `0001_init.sql:4-5`)
- **Services are shells** — job logic lives in a brick, imported `workspace:*`; never inline it in `api/src`. The one exception matched here is single-statement SQL, which the worker already writes inline for `admin_audit`/`session_events`/`security_events`. (`code/shared/.claude/CLAUDE.md`)
- **api worker guard is inline** (`server-only` breaks the esbuild build): bearer via `safeEqual(bearer, env.APP_API_TOKEN)`, CF native rate-limit, CORS. Any new route follows that pattern. (`index.ts:38-93`)
- **`user_profiles` deliberately holds plaintext email + name** — a change from the audit tables' minimisation, required for profile-on-login + email-keyed erasure. Mitigations: EU-resident D1, bearer-gated api-only writes, pseudonymised on erasure, hard-deleted 90d after anonymisation, minimal fields. (Spec §24)
- Run all scripts **from the repo root**; wrangler runs via `pnpm --filter @indiecrafts/shared-api exec wrangler …`. (`code/shared/.claude/CLAUDE.md`)
- The api package is `@indiecrafts/shared-api`; its D1 registry row is `name: "audit", binding: "DB", dir: "code/shared/api/db/d1"` (`databases.mjs:67-76`). Migrations apply via `pnpm db:migrate audit <env>`.

---

### Task 1: `fingerprintEmail` primitive

Add the salted email-fingerprint function beside `hashIpAddress`. Pure, Web-Crypto only, consumed via the `/crypto` subpath (no barrel edit needed).

**Files:**

- Modify: `code/packages/shared/security/src/crypto.ts` (add after `verifyIpHash`, ~line 130)
- Test: `code/packages/shared/security/src/crypto.test.ts` (add a `describe` block)

**Interfaces:**

- Consumes: the module-private `utf8` (TextEncoder) and `toHex(buf)` already in `crypto.ts` — reuse, do not re-declare.
- Produces: `export async function fingerprintEmail(email: string, salt: string): Promise<string>` — 64-char lowercase hex. Consumed by Task 4 (webhook) and Task 6 (backfill).

- [ ] **Step 1: Write the failing test**

Add to `code/packages/shared/security/src/crypto.test.ts` (extend the existing `import` from `./crypto` to include `fingerprintEmail`):

```ts
import { fingerprintEmail } from "./crypto";

describe("fingerprintEmail", () => {
  it("is deterministic, salted, normalised, and one-way", async () => {
    const f = await fingerprintEmail("User@Example.com ", "salt");
    // case-folded + trimmed → same as the normalised form
    expect(f).toBe(await fingerprintEmail("user@example.com", "salt"));
    // salt-sensitive
    expect(f).not.toBe(
      await fingerprintEmail("user@example.com", "other-salt"),
    );
    // hex shape, not recoverable
    expect(f).toMatch(/^[0-9a-f]{64}$/);
    expect(f).not.toContain("example");
    // known-answer test — guards the algorithm and the Task 6 node:crypto twin
    expect(await fingerprintEmail("a@b.com", "salt")).toBe(
      "1a2f6d3f5e...", // Step 3 replaces this with the real hex
    );
    await expect(fingerprintEmail("", "salt")).rejects.toThrow();
    await expect(fingerprintEmail("a@b.com", "")).rejects.toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @indiecrafts/packages-shared-security test`
Expected: FAIL — `fingerprintEmail` is not exported.

- [ ] **Step 3: Write minimal implementation + fix the known-answer vector**

Add to `code/packages/shared/security/src/crypto.ts` after `verifyIpHash`:

```ts
/**
 * Salted, deterministic, one-way fingerprint of an email — the pseudonymisation
 * key. Same email + salt → same fingerprint, so a record can be matched for
 * erasure/retention without storing plaintext, but the address is not
 * recoverable. With the salt RETAINED this is pseudonymised data (still personal
 * data under GDPR); true anonymisation is dropping the fingerprint at final purge.
 */
export async function fingerprintEmail(
  email: string,
  salt: string,
): Promise<string> {
  if (!email || !salt)
    throw new Error("email and salt are required for fingerprinting");
  const digest = await crypto.subtle.digest(
    "SHA-256",
    utf8.encode(salt + email.toLowerCase().trim()),
  );
  return toHex(digest);
}
```

Then compute the real known-answer hex and paste it into the test (this exact value is reused in Task 6 to catch drift):

Run: `node -e "console.log(require('crypto').createHash('sha256').update('salt'+'a@b.com').digest('hex'))"`
Copy the 64-char output into the `toBe("…")` in Step 1's test. **Record it here for Task 6:** `__________`.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @indiecrafts/packages-shared-security test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add code/packages/shared/security/src/crypto.ts code/packages/shared/security/src/crypto.test.ts
git commit -m "feat(security): fingerprintEmail — salted pseudonymisation key"
```

---

### Task 2: D1 migration `0002_user_profiles` + test harness

Create the `user_profiles` table and wire the api worker's test pool to a local D1 with migrations applied, so Tasks 3–4 can assert real writes. (Only `user_profiles` ships now; the other identity tables in spec §6.2 land with the phases that use them — creating them now would be speculative.)

**Files:**

- Create: `code/shared/api/db/d1/migrations/0002_user_profiles.sql`
- Modify: `code/shared/api/vitest.config.ts`
- Create: `code/shared/api/src/test-setup.ts`
- Create: `code/shared/api/src/test-env.d.ts`
- Test: `code/shared/api/src/user-profiles.test.ts`
- Modify: `code/shared/api/CHANGELOG.md`

**Interfaces:**

- Produces: table `user_profiles(user_id TEXT PK, email, full_name, locale, email_fingerprint, created_at NOT NULL, last_login_at, deleted_at, anonymized INTEGER DEFAULT 0)` + index `idx_user_profiles_fingerprint`. Test-pool env gains a local D1 bound as `DB` (migrations applied via `test-setup.ts`) and `APP_API_TOKEN: "test-token"`. Consumed by Tasks 3, 4.

- [ ] **Step 1: Write the migration**

Create `code/shared/api/db/d1/migrations/0002_user_profiles.sql`:

```sql
-- The small user DB (identity tier), created/updated on login. Forward-only
-- (D1 has no down-migrations — expand → migrate → contract). Written by two
-- paths: the session-log sink (upsert, stamps last_login_at) and the Clerk
-- webhook (source of truth for email; re-fingerprints on change; pseudonymises
-- on user.deleted). Primary target of erasure pseudonymisation.
--
-- Unlike the audit tables, this deliberately holds plaintext email + name —
-- required for profile-on-login + email-keyed erasure. Mitigated: EU-resident
-- D1, bearer-gated api-only writes, pseudonymised on erasure, anonymised rows
-- hard-deleted after 90 days, minimal fields.
CREATE TABLE user_profiles (
  user_id           TEXT PRIMARY KEY,            -- Clerk user id
  email             TEXT,                        -- from Clerk; null until synced
  full_name         TEXT,
  locale            TEXT,
  email_fingerprint TEXT,                        -- salted SHA-256; survives pseudonymisation
  created_at        TEXT NOT NULL,               -- ISO8601
  last_login_at     TEXT,
  deleted_at        TEXT,                        -- set on pseudonymisation
  anonymized        INTEGER NOT NULL DEFAULT 0   -- 0|1 (SQLite has no boolean)
);
CREATE INDEX idx_user_profiles_fingerprint ON user_profiles (email_fingerprint);
```

- [ ] **Step 2: Wire the test pool to a local D1 with migrations**

Replace `code/shared/api/vitest.config.ts` with:

```ts
import {
  defineWorkersConfig,
  readD1Migrations,
} from "@cloudflare/vitest-pool-workers/config";

export default defineWorkersConfig(async () => {
  // Read every db/d1/migrations/*.sql so tests run against the real schema.
  const migrations = await readD1Migrations("./db/d1/migrations");
  return {
    test: {
      include: ["src/**/*.test.ts"],
      setupFiles: ["./src/test-setup.ts"],
      poolOptions: {
        workers: {
          wrangler: { configPath: "./wrangler.toml" },
          miniflare: {
            // wrangler.toml binds DB per-env only; the test pool reads the base
            // config, so create the local ephemeral D1 here.
            d1Databases: ["DB"],
            bindings: {
              // The bearer the authenticated-route tests send. Safe: the
              // existing no-bearer 401 tests are unaffected.
              APP_API_TOKEN: "test-token",
              // Passed to test-setup.ts to apply migrations.
              TEST_MIGRATIONS: migrations,
            },
          },
        },
      },
    },
  };
});
```

Create `code/shared/api/src/test-setup.ts`:

```ts
import { applyD1Migrations, env } from "cloudflare:test";

// Apply db/d1/migrations/*.sql to the ephemeral test D1 before any test runs.
await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
```

Create `code/shared/api/src/test-env.d.ts`:

```ts
import type { Env } from "./index";

declare module "cloudflare:test" {
  interface ProvidedEnv extends Env {
    // Populated in vitest.config.ts via readD1Migrations().
    TEST_MIGRATIONS: D1Migration[];
  }
}
```

- [ ] **Step 3: Write the failing schema test**

Create `code/shared/api/src/user-profiles.test.ts`:

```ts
import { env } from "cloudflare:test";
import { describe, expect, it } from "vitest";

describe("migration 0002 — user_profiles", () => {
  it("creates the table with the expected columns", async () => {
    const { results } = await env.DB.prepare(
      "PRAGMA table_info(user_profiles)",
    ).all<{ name: string }>();
    const cols = results.map((r) => r.name);
    expect(cols).toEqual(
      expect.arrayContaining([
        "user_id",
        "email",
        "full_name",
        "locale",
        "email_fingerprint",
        "created_at",
        "last_login_at",
        "deleted_at",
        "anonymized",
      ]),
    );
  });
});
```

- [ ] **Step 4: Run tests to verify the whole api suite is green**

Run: `pnpm --filter @indiecrafts/shared-api test`
Expected: the new schema test PASSES; the three existing `index.test.ts` tests (health 200, security 401, webhook 503) still PASS — setting `APP_API_TOKEN` and binding a local `DB` does not change their assertions.

- [ ] **Step 5: Apply the migration locally to confirm it is valid SQL**

Run: `pnpm db:migrate audit dev --dry-run`
Then: `pnpm db:migrate audit dev`
Expected: `0002_user_profiles.sql` applies to the local (miniflare) D1 with no error.

- [ ] **Step 6: Commit**

Add a line to `code/shared/api/CHANGELOG.md` under an `## Unreleased` heading: `- feat(compliance): D1 user_profiles table (migration 0002) + workers-pool D1 test harness.`

```bash
git add code/shared/api/db/d1/migrations/0002_user_profiles.sql code/shared/api/vitest.config.ts code/shared/api/src/test-setup.ts code/shared/api/src/test-env.d.ts code/shared/api/src/user-profiles.test.ts code/shared/api/CHANGELOG.md
git commit -m "feat(compliance): user_profiles D1 table + test harness (migration 0002)"
```

---

### Task 3: Profile upsert on login

Extend the `/v1/events` `kind:"session"` branch to upsert a bare `user_profiles` row on every sign-in. Email/name are NOT in the session payload (kept minimal) — this creates the row if missing and stamps `last_login_at`; the webhook and backfill fill email/name.

**Files:**

- Modify: `code/shared/api/src/index.ts:288-292` (the `session_events` insert block)
- Test: `code/shared/api/src/user-profiles.test.ts` (add cases)

**Interfaces:**

- Consumes: `env.DB` (bound), the existing `userId`/`ts` locals in the session branch.
- Produces: after any `kind:"session"` POST, a `user_profiles` row exists for `userId` with `created_at` set once and `last_login_at` refreshed. Idempotent by PK.

- [ ] **Step 1: Write the failing test**

Add to `code/shared/api/src/user-profiles.test.ts`:

```ts
import { SELF } from "cloudflare:test";

async function postSession(userId: string) {
  return SELF.fetch("https://example.com/v1/events", {
    method: "POST",
    headers: {
      authorization: "Bearer test-token",
      "content-type": "application/json",
    },
    body: JSON.stringify({ kind: "session", surface: "website", userId }),
  });
}

describe("login upsert", () => {
  it("creates a profile row on first sign-in and refreshes it on the next", async () => {
    const first = await postSession("user_login_1");
    expect(first.status).toBe(201);

    const a = await env.DB.prepare(
      "SELECT created_at, last_login_at FROM user_profiles WHERE user_id = ?",
    )
      .bind("user_login_1")
      .first<{ created_at: string; last_login_at: string }>();
    expect(a?.created_at).toBeTruthy();
    expect(a?.last_login_at).toBeTruthy();

    const second = await postSession("user_login_1");
    expect(second.status).toBe(201);

    const { results } = await env.DB.prepare(
      "SELECT created_at, last_login_at FROM user_profiles WHERE user_id = ?",
    )
      .bind("user_login_1")
      .all<{ created_at: string; last_login_at: string }>();
    // exactly one row — upsert, not insert
    expect(results.length).toBe(1);
    // created_at is stable; last_login_at never goes backwards
    expect(results[0].created_at).toBe(a?.created_at);
    expect(results[0].last_login_at >= a!.last_login_at).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @indiecrafts/shared-api test -t "login upsert"`
Expected: FAIL — no `user_profiles` row is written (query returns 0 rows).

- [ ] **Step 3: Write the implementation**

In `code/shared/api/src/index.ts`, inside the `else if (body.kind === "session")` branch, immediately after the `INSERT INTO session_events …` `.run();` (line ~292), add:

```ts
// Create the profile row on first sign-in; refresh last_login_at on
// every sign-in. Email/name are NOT in the session payload (kept
// minimal) — the Clerk webhook + backfill fill them. Idempotent by PK.
await env.DB.prepare(
  "INSERT INTO user_profiles (user_id, created_at, last_login_at) VALUES (?, ?, ?) " +
    "ON CONFLICT(user_id) DO UPDATE SET last_login_at = excluded.last_login_at",
)
  .bind(userId, ts, ts)
  .run();
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm --filter @indiecrafts/shared-api test`
Expected: PASS (the whole suite).

- [ ] **Step 5: Commit**

```bash
git add code/shared/api/src/index.ts code/shared/api/src/user-profiles.test.ts
git commit -m "feat(compliance): upsert user_profiles on sign-in"
```

---

### Task 4: Clerk webhook profile sync

Extend `/v1/clerk-webhook` to keep `user_profiles` in sync with Clerk — the source of truth for email. Upsert on `user.created`/`user.updated` (re-fingerprint on email change); pseudonymise on `user.deleted`. Idempotent by PK, so Clerk retries are safe.

**Files:**

- Modify: `code/shared/api/src/index.ts` — Env interface (line ~56), the crypto import (line 8), the `/v1/clerk-webhook` route (after the role→admin block, ~line 489)
- Modify: `code/shared/api/wrangler.toml` (document the new secret near line 86)
- Modify: `code/shared/api/.claude/CLAUDE.md` (secret list)
- Test: `code/shared/api/src/clerk-profile-sync.test.ts`
- Modify: `code/shared/api/CHANGELOG.md`

**Interfaces:**

- Consumes: `fingerprintEmail` (Task 1), `env.DB`, `env.GDPR_FINGERPRINT_SALT` (new, optional), the existing `verifySvix` + `json` helpers.
- Produces: `user.created`/`user.updated` → upserted/re-fingerprinted `user_profiles` row (`created_at` preserved on update); `user.deleted` → `email='deleted_<id>@anonymized.local'`, `full_name='Deleted User'`, `deleted_at` set, `anonymized=1`, fingerprint retained.

- [ ] **Step 1: Write the failing test**

Create `code/shared/api/src/clerk-profile-sync.test.ts`:

```ts
import {
  createExecutionContext,
  env,
  waitOnExecutionContext,
} from "cloudflare:test";
import { fingerprintEmail } from "@indiecrafts/packages-shared-security/crypto";
import { describe, expect, it } from "vitest";
import worker from "./index";

const SECRET = "whsec_dGVzdHNlY3JldA=="; // base64("testsecret")
const SALT = "test-fingerprint-salt";

// Sign a body the same way verifySvix() verifies it (Web Crypto, workerd).
async function svixHeaders(id: string, ts: string, body: string) {
  const secretBytes = Uint8Array.from(
    atob(SECRET.replace(/^whsec_/, "")),
    (c) => c.charCodeAt(0),
  );
  const key = await crypto.subtle.importKey(
    "raw",
    secretBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${id}.${ts}.${body}`),
  );
  const sig = btoa(String.fromCharCode(...new Uint8Array(mac)));
  return {
    "svix-id": id,
    "svix-timestamp": ts,
    "svix-signature": `v1,${sig}`,
    "content-type": "application/json",
  };
}

async function postWebhook(payload: unknown) {
  const body = JSON.stringify(payload);
  const ts = String(Math.floor(Date.now() / 1000));
  const req = new Request("https://example.com/v1/clerk-webhook", {
    method: "POST",
    body,
    headers: await svixHeaders("msg_1", ts, body),
  });
  const ctx = createExecutionContext();
  // Override env per-test so the global 503-no-secret test stays valid.
  const res = await worker.fetch(
    req,
    { ...env, CLERK_WEBHOOK_SECRET: SECRET, GDPR_FINGERPRINT_SALT: SALT },
    ctx,
  );
  await waitOnExecutionContext(ctx);
  return res;
}

const created = (id: string, email: string, first = "", last = "") => ({
  type: "user.created",
  data: {
    id,
    primary_email_address_id: "e1",
    email_addresses: [{ id: "e1", email_address: email }],
    first_name: first,
    last_name: last,
  },
});

describe("clerk webhook → user_profiles", () => {
  it("user.created upserts a fingerprinted profile", async () => {
    const res = await postWebhook(
      created("user_c", "Jane@Example.com", "Jane", "Doe"),
    );
    expect(res.status).toBe(200);
    const row = await env.DB.prepare(
      "SELECT * FROM user_profiles WHERE user_id = ?",
    )
      .bind("user_c")
      .first<Record<string, unknown>>();
    expect(row?.email).toBe("Jane@Example.com");
    expect(row?.full_name).toBe("Jane Doe");
    expect(row?.email_fingerprint).toBe(
      await fingerprintEmail("Jane@Example.com", SALT),
    );
    expect(row?.anonymized).toBe(0);
  });

  it("is idempotent — replaying user.created keeps one row", async () => {
    await postWebhook(created("user_dup", "dup@x.com"));
    await postWebhook(created("user_dup", "dup@x.com"));
    const { results } = await env.DB.prepare(
      "SELECT user_id FROM user_profiles WHERE user_id = ?",
    )
      .bind("user_dup")
      .all();
    expect(results.length).toBe(1);
  });

  it("user.updated re-fingerprints on email change, keeps created_at", async () => {
    await postWebhook(created("user_u", "old@x.com"));
    const before = await env.DB.prepare(
      "SELECT created_at FROM user_profiles WHERE user_id = ?",
    )
      .bind("user_u")
      .first<{ created_at: string }>();
    await postWebhook({
      type: "user.updated",
      data: {
        id: "user_u",
        primary_email_address_id: "e2",
        email_addresses: [{ id: "e2", email_address: "new@x.com" }],
      },
    });
    const after = await env.DB.prepare(
      "SELECT email, email_fingerprint, created_at FROM user_profiles WHERE user_id = ?",
    )
      .bind("user_u")
      .first<Record<string, unknown>>();
    expect(after?.email).toBe("new@x.com");
    expect(after?.email_fingerprint).toBe(
      await fingerprintEmail("new@x.com", SALT),
    );
    expect(after?.created_at).toBe(before?.created_at);
  });

  it("user.deleted pseudonymises but keeps the row + fingerprint", async () => {
    await postWebhook(created("user_d", "d@x.com", "Dee"));
    const fpBefore = (
      await env.DB.prepare(
        "SELECT email_fingerprint FROM user_profiles WHERE user_id = ?",
      )
        .bind("user_d")
        .first<{ email_fingerprint: string }>()
    )?.email_fingerprint;
    await postWebhook({
      type: "user.deleted",
      data: { id: "user_d", deleted: true },
    });
    const row = await env.DB.prepare(
      "SELECT * FROM user_profiles WHERE user_id = ?",
    )
      .bind("user_d")
      .first<Record<string, unknown>>();
    expect(row?.email).toBe("deleted_user_d@anonymized.local");
    expect(row?.full_name).toBe("Deleted User");
    expect(row?.anonymized).toBe(1);
    expect(row?.deleted_at).toBeTruthy();
    expect(row?.email_fingerprint).toBe(fpBefore); // retained for retention matching
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @indiecrafts/shared-api test -t "clerk webhook"`
Expected: FAIL — the webhook returns 200 but writes no `user_profiles` row (queries return null).

- [ ] **Step 3: Add the env var and import**

In `code/shared/api/src/index.ts`, change the crypto import (line 8) to:

```ts
import {
  hashIpAddress,
  fingerprintEmail,
} from "@indiecrafts/packages-shared-security/crypto";
```

Add to the `Env` interface after `IP_HASH_SALT` (line ~57):

```ts
  /** `wrangler secret put GDPR_FINGERPRINT_SALT` — salt for the email pseudonymisation
   *  fingerprint on user_profiles/consent/erasure. MUST be identical across envs.
   *  Optional (fingerprints are left null until set). */
  GDPR_FINGERPRINT_SALT?: string;
```

- [ ] **Step 4: Add the profile-sync logic**

In the `/v1/clerk-webhook` route, after the existing role→admin `if` block and before `return json({ ok: true }, 200, cors);` (line ~489), add:

```ts
// ── Compliance: keep user_profiles in sync with Clerk (source of truth for
//    email). Upsert on create/update (re-fingerprints on email change);
//    pseudonymise on delete. Idempotent by PK — Clerk retries are safe.
//    No idempotency-key store: every op here is idempotent by primary key.
if (
  env.DB &&
  (evt.type === "user.created" ||
    evt.type === "user.updated" ||
    evt.type === "user.deleted")
) {
  const userId = typeof data.id === "string" ? data.id : null;
  if (userId) {
    const now = new Date().toISOString();
    try {
      if (evt.type === "user.deleted") {
        await env.DB.prepare(
          "UPDATE user_profiles SET email = ?, full_name = ?, deleted_at = ?, anonymized = 1 WHERE user_id = ?",
        )
          .bind(
            `deleted_${userId}@anonymized.local`,
            "Deleted User",
            now,
            userId,
          )
          .run();
      } else {
        // Webhook payload is snake_case (unlike the @clerk/backend SDK).
        const emails =
          (data.email_addresses as
            Array<{ id?: string; email_address?: string }> | undefined) ?? [];
        const primaryId = data.primary_email_address_id as string | undefined;
        const email =
          emails.find((e) => e.id === primaryId)?.email_address ??
          emails[0]?.email_address ??
          null;
        const first =
          typeof data.first_name === "string" ? data.first_name : "";
        const last = typeof data.last_name === "string" ? data.last_name : "";
        const fullName = [first, last].filter(Boolean).join(" ") || null;
        const fingerprint =
          email && env.GDPR_FINGERPRINT_SALT
            ? await fingerprintEmail(email, env.GDPR_FINGERPRINT_SALT)
            : null;
        await env.DB.prepare(
          "INSERT INTO user_profiles (user_id, email, full_name, email_fingerprint, created_at, last_login_at) " +
            "VALUES (?, ?, ?, ?, ?, NULL) " +
            "ON CONFLICT(user_id) DO UPDATE SET email = excluded.email, full_name = excluded.full_name, email_fingerprint = excluded.email_fingerprint",
        )
          .bind(userId, email, fullName, fingerprint, now)
          .run();
      }
    } catch (error) {
      logger.error("clerk profile sync failed", {
        name: (error as Error)?.name,
      });
      return json({ error: "server" }, 502, cors);
    }
  }
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `pnpm --filter @indiecrafts/shared-api test`
Expected: PASS — the four new sync tests plus the existing 503-no-secret test (which uses `SELF.fetch` with no `CLERK_WEBHOOK_SECRET`, so it stays 503).

- [ ] **Step 6: Document the secret**

- In `code/shared/api/wrangler.toml`, near the other secret comments (~line 86), add: `# GDPR_FINGERPRINT_SALT — wrangler secret put GDPR_FINGERPRINT_SALT --env <env> (identical across envs)`.
- In `code/shared/api/.claude/CLAUDE.md`, add `GDPR_FINGERPRINT_SALT` to the secret list and note the webhook now syncs `user_profiles`.
- Add to `code/shared/api/CHANGELOG.md` Unreleased: `- feat(compliance): Clerk webhook syncs user_profiles (upsert/re-fingerprint/pseudonymise) + GDPR_FINGERPRINT_SALT.`

- [ ] **Step 7: Commit**

```bash
git add code/shared/api/src/index.ts code/shared/api/src/clerk-profile-sync.test.ts code/shared/api/wrangler.toml code/shared/api/.claude/CLAUDE.md code/shared/api/CHANGELOG.md
git commit -m "feat(compliance): Clerk webhook syncs user_profiles"
```

---

### Task 5: Salt tooling (`gdpr:salt:*`)

Add a runner to generate, set, and inspect `GDPR_FINGERPRINT_SALT` on the api worker, mirroring the repo's per-app wrangler-secret pattern. Cloudflare never returns secret values, so "verify/status" confirm presence only.

**Files:**

- Create: `code/shared/scripts/infra/gdpr-salt.mjs`
- Create: `code/shared/scripts/infra/gdpr-salt.test.mjs`
- Modify: `package.json` (root `scripts`)

**Interfaces:**

- Produces: root scripts `gdpr:salt:generate`, `gdpr:salt:set:{dev,staging,prod}`, `gdpr:salt:status:{dev,staging,prod}`; exported `generateSalt(): string` (64-char hex). (`verify` is folded into `status` — both list secrets; deviation from spec §5's 4-verb list noted, since CF returns no values to "verify" against.)
- Consumes: `APPS` from `../lib/apps.mjs`, `assertRenamed` from `../lib/project.mjs`.

- [ ] **Step 1: Write the failing test**

Create `code/shared/scripts/infra/gdpr-salt.test.mjs`:

```js
import assert from "node:assert/strict";
import { test } from "node:test";
import { generateSalt } from "./gdpr-salt.mjs";

test("generateSalt returns a fresh 32-byte hex salt", () => {
  const a = generateSalt();
  assert.match(a, /^[0-9a-f]{64}$/);
  assert.notEqual(a, generateSalt()); // random each call
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test code/shared/scripts/infra/gdpr-salt.test.mjs`
Expected: FAIL — cannot import `generateSalt` (module does not exist).

- [ ] **Step 3: Write the runner**

Create `code/shared/scripts/infra/gdpr-salt.mjs`:

```js
#!/usr/bin/env node
// Manage GDPR_FINGERPRINT_SALT on the api worker. Mirrors the per-app
// wrangler-secret pattern (sync-secrets.mjs). Cloudflare never returns secret
// values, so status/verify confirm PRESENCE only.
//
// Usage:
//   pnpm gdpr:salt:generate            → prints a fresh salt to stdout
//   pnpm gdpr:salt:set:<env>           → wrangler prompts; paste the salt
//   pnpm gdpr:salt:status:<env>        → lists the worker's secrets
//
// Rule: ONE salt per purpose, IDENTICAL across all envs, never committed.
import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { APPS } from "../lib/apps.mjs";
import { assertRenamed } from "../lib/project.mjs";

export const generateSalt = () => randomBytes(32).toString("hex");

const pkg =
  APPS.find((a) => a.slug === "api")?.pkg ?? "@indiecrafts/shared-api";

function wrangler(args) {
  return spawnSync("pnpm", ["--filter", pkg, "exec", "wrangler", ...args], {
    stdio: "inherit",
  });
}

// Executed only as a CLI, not when imported by the test.
if (import.meta.url === `file://${process.argv[1]}`) {
  const [action, env] = process.argv.slice(2);

  if (action === "generate") {
    process.stdout.write(`${generateSalt()}\n`);
    process.exit(0);
  }

  if (
    !["set", "status"].includes(action) ||
    !["dev", "staging", "prod"].includes(env)
  ) {
    console.error("Usage: gdpr-salt.mjs <generate | set <env> | status <env>>");
    process.exit(1);
  }

  assertRenamed("api", env); // clobber guard (dev is exempt)

  const r =
    action === "set"
      ? wrangler(["secret", "put", "GDPR_FINGERPRINT_SALT", "--env", env])
      : wrangler(["secret", "list", "--env", env]);
  process.exit(r.status ?? 0);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test code/shared/scripts/infra/gdpr-salt.test.mjs`
Expected: PASS.

- [ ] **Step 5: Wire the root scripts**

Add to `package.json` `scripts` (near the `secrets:sync:*` block, lines ~84-86):

```json
"gdpr:salt:generate": "node code/shared/scripts/infra/gdpr-salt.mjs generate",
"gdpr:salt:set:dev": "node code/shared/scripts/infra/gdpr-salt.mjs set dev",
"gdpr:salt:set:staging": "node code/shared/scripts/infra/gdpr-salt.mjs set staging",
"gdpr:salt:set:prod": "node code/shared/scripts/infra/gdpr-salt.mjs set prod",
"gdpr:salt:status:dev": "node code/shared/scripts/infra/gdpr-salt.mjs status dev",
"gdpr:salt:status:staging": "node code/shared/scripts/infra/gdpr-salt.mjs status staging",
"gdpr:salt:status:prod": "node code/shared/scripts/infra/gdpr-salt.mjs status prod"
```

- [ ] **Step 6: Smoke-test the generate script end to end**

Run: `pnpm gdpr:salt:generate`
Expected: prints a 64-char hex string. (Do NOT run `set` against a real env in this step.)

- [ ] **Step 7: Commit**

```bash
git add code/shared/scripts/infra/gdpr-salt.mjs code/shared/scripts/infra/gdpr-salt.test.mjs package.json
git commit -m "feat(compliance): gdpr:salt tooling for GDPR_FINGERPRINT_SALT"
```

---

### Task 6: Backfill existing users into `user_profiles`

A one-time script that lists every Clerk user and seeds a `user_profiles` row (email + name + fingerprint) via `wrangler d1 execute`, so existing users are visible to erasure without waiting for their next login. The testable core is the pure `buildUpsertSql`.

**Files:**

- Create: `code/shared/scripts/data/backfill-profiles.mjs`
- Create: `code/shared/scripts/data/backfill-profiles.test.mjs`
- Modify: `package.json` (root `scripts` + add `@clerk/backend` devDep)

**Interfaces:**

- Consumes: `@clerk/backend` `createClerkClient` (reads `CLERK_SECRET_KEY`), `GDPR_FINGERPRINT_SALT` from env, `APPS`/`assertRenamed`.
- Produces: root script `db:backfill:profiles:{dev,staging,prod}`; exported `buildUpsertSql(users, salt, now): string` where `users` are `{ id, email, fullName }`. The node:crypto fingerprint MUST equal `fingerprintEmail` (Task 1).

- [ ] **Step 1: Write the failing test**

Create `code/shared/scripts/data/backfill-profiles.test.mjs` (uses the known-answer hex recorded in Task 1 Step 3):

```js
import assert from "node:assert/strict";
import { test } from "node:test";
import { buildUpsertSql } from "./backfill-profiles.mjs";

test("buildUpsertSql escapes quotes and fingerprints deterministically", () => {
  const sql = buildUpsertSql(
    [{ id: "u1", email: "O'Hara@X.com", fullName: "O'Hara" }],
    "salt",
    "2026-01-01T00:00:00.000Z",
  );
  assert.ok(sql.includes("'O''Hara@X.com'")); // SQL-escaped apostrophe
  assert.ok(sql.includes("ON CONFLICT(user_id) DO UPDATE"));
  assert.match(sql, /[0-9a-f]{64}/); // fingerprint present
});

test("fingerprint matches fingerprintEmail's known-answer vector", () => {
  // Same input + expected hex asserted in packages/shared/security crypto.test.ts.
  const sql = buildUpsertSql(
    [{ id: "u2", email: "a@b.com", fullName: null }],
    "salt",
    "2026-01-01T00:00:00.000Z",
  );
  assert.ok(sql.includes("<PASTE_TASK1_HEX_HERE>"));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test code/shared/scripts/data/backfill-profiles.test.mjs`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Write the script**

Create `code/shared/scripts/data/backfill-profiles.mjs`:

```js
#!/usr/bin/env node
// One-time seed: list every Clerk user and upsert a user_profiles row so
// existing users are visible to erasure before their next login. Idempotent
// (ON CONFLICT). Requires CLERK_SECRET_KEY + GDPR_FINGERPRINT_SALT in env, and
// wrangler auth. Usage: pnpm db:backfill:profiles:<env>
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createClerkClient } from "@clerk/backend";
import { APPS } from "../lib/apps.mjs";
import { assertRenamed } from "../lib/project.mjs";

// MUST match fingerprintEmail() in
// code/packages/shared/security/src/crypto.ts — salted SHA-256 hex over
// `salt + email.toLowerCase().trim()`. Crosses the TS/mjs boundary for a
// one-time seed; the known-answer test guards against drift.
const fingerprint = (email, salt) =>
  createHash("sha256")
    .update(salt + email.toLowerCase().trim())
    .digest("hex");

const sqlStr = (v) =>
  v == null ? "NULL" : `'${String(v).replace(/'/g, "''")}'`;

export function buildUpsertSql(users, salt, now) {
  return users
    .map((u) => {
      const email = u.email ?? null;
      const fp = email ? fingerprint(email, salt) : null;
      return (
        "INSERT INTO user_profiles (user_id, email, full_name, email_fingerprint, created_at) VALUES (" +
        [
          sqlStr(u.id),
          sqlStr(email),
          sqlStr(u.fullName),
          sqlStr(fp),
          sqlStr(now),
        ].join(", ") +
        ") ON CONFLICT(user_id) DO UPDATE SET email = excluded.email, full_name = excluded.full_name, email_fingerprint = excluded.email_fingerprint;"
      );
    })
    .join("\n");
}

async function listAllUsers(clerk) {
  const users = [];
  const limit = 50; // SDK cap per call
  for (let offset = 0; ; offset += limit) {
    const { data, totalCount } = await clerk.users.getUserList({
      limit,
      offset,
      orderBy: "-created_at",
    });
    for (const u of data) {
      // @clerk/backend is camelCase (unlike the webhook payload's snake_case).
      const email =
        u.emailAddresses.find((e) => e.id === u.primaryEmailAddressId)
          ?.emailAddress ??
        u.emailAddresses[0]?.emailAddress ??
        null;
      const fullName =
        [u.firstName, u.lastName].filter(Boolean).join(" ") || null;
      users.push({ id: u.id, email, fullName });
    }
    if (offset + limit >= totalCount || data.length === 0) break;
  }
  return users;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const env = process.argv[2];
  if (!["dev", "staging", "prod"].includes(env)) {
    console.error("Usage: backfill-profiles.mjs <dev|staging|prod>");
    process.exit(1);
  }
  const secretKey = process.env.CLERK_SECRET_KEY;
  const salt = process.env.GDPR_FINGERPRINT_SALT;
  if (!secretKey || !salt) {
    console.error("Set CLERK_SECRET_KEY and GDPR_FINGERPRINT_SALT in env.");
    process.exit(1);
  }
  assertRenamed("api", env);

  const clerk = createClerkClient({ secretKey });
  const users = await listAllUsers(clerk);
  if (users.length === 0) {
    console.log("No Clerk users — nothing to backfill.");
    process.exit(0);
  }
  // ponytail: single SQL file for the whole set. Chunk if users.length > ~10k.
  const now = new Date().toISOString();
  const sql = buildUpsertSql(users, salt, now);
  const dir = mkdtempSync(join(tmpdir(), "backfill-"));
  const file = join(dir, "backfill.sql");
  writeFileSync(file, sql, { mode: 0o600 });
  const pkg =
    APPS.find((a) => a.slug === "api")?.pkg ?? "@indiecrafts/shared-api";
  const scope =
    env === "dev" ? ["--env", "dev", "--local"] : ["--env", env, "--remote"];
  try {
    console.log(
      `Backfilling ${users.length} users into user_profiles (${env})…`,
    );
    const r = spawnSync(
      "pnpm",
      [
        "--filter",
        pkg,
        "exec",
        "wrangler",
        "d1",
        "execute",
        "DB",
        ...scope,
        "--file",
        file,
      ],
      { stdio: "inherit" },
    );
    process.exit(r.status ?? 0);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
```

- [ ] **Step 4: Paste the known-answer hex**

Replace `<PASTE_TASK1_HEX_HERE>` in the test (Step 1) with the hex recorded in Task 1 Step 3.

- [ ] **Step 5: Add `@clerk/backend` and wire root scripts**

Run: `pnpm add -Dw @clerk/backend`
Add to `package.json` `scripts`:

```json
"db:backfill:profiles:dev": "node code/shared/scripts/data/backfill-profiles.mjs dev",
"db:backfill:profiles:staging": "node code/shared/scripts/data/backfill-profiles.mjs staging",
"db:backfill:profiles:prod": "node code/shared/scripts/data/backfill-profiles.mjs prod"
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `node --test code/shared/scripts/data/backfill-profiles.test.mjs`
Expected: PASS (both cases, including the known-answer match).

- [ ] **Step 7: Commit**

```bash
git add code/shared/scripts/data/backfill-profiles.mjs code/shared/scripts/data/backfill-profiles.test.mjs package.json pnpm-lock.yaml
git commit -m "feat(compliance): one-time Clerk→D1 user_profiles backfill"
```

---

## Phase 1 exit check

- [ ] `pnpm --filter @indiecrafts/packages-shared-security test` — green (Task 1)
- [ ] `pnpm --filter @indiecrafts/shared-api test` — green (Tasks 2–4)
- [ ] `node --test code/shared/scripts/infra/gdpr-salt.test.mjs code/shared/scripts/data/backfill-profiles.test.mjs` — green (Tasks 5–6)
- [ ] `pnpm verify:quick` (tsc + lint) — green across the touched workspaces
- [ ] Operator steps (out of code, per spec §23): `pnpm gdpr:salt:generate` → `pnpm gdpr:salt:set:<env>` on the api worker; point Clerk's webhook at `/v1/clerk-webhook` for `user.created/updated/deleted`; run `db:backfill:profiles:<env>` once with `CLERK_SECRET_KEY` + `GDPR_FINGERPRINT_SALT` set.

## Self-review notes

- **Spec coverage (§22 phase 1):** D1 `0002` + `user_profiles` → Task 2; `fingerprintEmail` → Task 1; salt tooling → Task 5; profile upsert on login → Task 3; idempotent Clerk-webhook sync → Task 4; backfill → Task 6. All six items covered.
- **Deliberate scope cuts (ponytail):** (1) `0002` creates only `user_profiles`; `consent_events`/`data_requests`/`erasure_requests`/`content_reports` (spec §6.2) land with the phases that use them. (2) No idempotency-key store — every webhook op is idempotent by primary key; add one when a non-idempotent append (consent_events, Phase 2) arrives. (3) `verify` folded into `status` — Cloudflare returns no secret value to verify against.
- **Drift guard:** the backfill's node:crypto fingerprint and Task 1's Web-Crypto `fingerprintEmail` are pinned to the same known-answer hex, asserted in both test suites.
- **Type note:** the Clerk **webhook** payload is snake_case (`email_addresses`, `first_name`); the **@clerk/backend SDK** is camelCase (`emailAddresses`, `firstName`). Task 4 and Task 6 handle each correctly — do not conflate them.
