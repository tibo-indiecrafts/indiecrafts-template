# Compliance Layer — Phase 2 (Consent Logging) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the cookie consent decision — today 100% client-side (localStorage + Consent Mode) — into a server-side, append-only proof log in D1, account-scoped when the visitor is signed in, on top of the geo-gating foundation already shipped.

**Architecture:** A new `consent_events` D1 table (append-only, 3-year retention). Every consent decision flows through the existing `applyConsent` funnel, which now also fires a fire-and-forget POST to a same-origin `/api/consent-log` route. That route resolves the signed-in `userId` via Clerk `auth()` (the trust boundary — the client never claims identity), reads `cf-ipcountry`, gates anonymous logging behind a flag, and forwards to the api's `POST /v1/events` with a new `kind:"consent"` branch that writes one row per consent type and links logged-in rows to the erasure key. The cron purges the table on a 3-year schedule.

**Tech Stack:** Cloudflare Workers + D1, TypeScript strict, Next.js 16 (App Router route handlers), Clerk (`auth()`), vitest — `@cloudflare/vitest-pool-workers` for the api/cron, happy-dom for the bricks.

**Spec:** `docs/superpowers/specs/2026-08-23-gdpr-compliance-layer-design.md` (§6.2 `consent_events`, §7.1 capture, §10 API, §13 retention, §18 flags)

**Foundation:** commit `9feefd9d` — the geo→regulation→consent-mode gating layer (`resolveRegulation`/`resolveConsentMode`, `CookieBanner mode` prop, `/v1/geo`, per-surface `consent` config). Phase 2 builds directly on it.

## Global Constraints

- **`consent_events` retention is ~3 years (1095 days), NOT the 90-day audit window.** The cron uses a separate cutoff. (Spec §13)
- **Trust boundary:** the client POST never carries a client-claimed `userId`. The same-origin route resolves `userId` from Clerk `auth()` server-side, exactly as `session-log` does. (Investigation §5)
- **Account-scoped:** a consent row is always logged when `userId` is present. Anonymous (signed-out) rows are logged **only** when `features.compliance.logAnonymousConsent` is on, keyed by a first-party `consent_id` cookie. (Spec §7.1, §18)
- **One row per `(decision, consent_type)`;** `idempotency_key = \`${decisionId}:${consent_type}\``, written with `INSERT OR IGNORE` (retry-safe append-only). (Spec §6.2)
- **Data minimization:** store `country` (2-letter) + a salted `ip_hash`, never a raw IP; the email is never in the POST — a logged-in row's `email_fingerprint` is read server-side from `user_profiles`. (Spec §5, Art. 5(1)(c))
- **Allowed `consent_type` values:** `cookie_analytics`, `cookie_marketing`, `marketing_email`, `terms`, `privacy`, `content_guidelines`. Phase 2 populates `cookie_analytics` + `cookie_marketing`; the rest arrive in later phases. (Spec §6.2)
- **Migrations forward-only** (`NNNN_snake_label.sql`); the api vitest harness auto-applies any file in `db/d1/migrations/` via `applyD1Migrations` — zero test-setup edits.
- **Services are shells:** the forwarder is a thin `fetch` (mirror `packages/web/auth/src/session-log.ts`); no Clerk/Sanity in `packages/web/compliance`. The route (in the app) owns Clerk `auth()`.
- **Commits:** the pre-existing working tree is dirty (storybook WIP, `pnpm-lock.yaml`, `packages/CHANGELOG.md`). Stage ONLY each task's own files (never `git add -A`). Commit `--no-verify` (the pre-commit hook's `tsc` trips on pre-existing storybook errors) and run `pnpm exec prettier --write` on new/changed files first (CI `format:check` gate).

---

### Task 1: D1 migration `0003_consent_events`

**Files:**

- Create: `code/shared/api/db/d1/migrations/0003_consent_events.sql`
- Test: `code/shared/api/src/consent-events.test.ts`
- Modify: `code/shared/api/CHANGELOG.md`

**Interfaces:**

- Produces: table `consent_events(id PK, ts, subject_type, subject_id, email_fingerprint?, consent_type, granted INTEGER, policy_version, surface, source?, country?, ip_hash?, idempotency_key UNIQUE)` + indexes on `ts`, `subject_id`, `email_fingerprint`. Consumed by Tasks 2 (writes) and 5 (purge).

- [ ] **Step 1: Write the migration**

Create `code/shared/api/db/d1/migrations/0003_consent_events.sql`:

```sql
-- Append-only consent proof log. Forward-only (D1 has no down-migrations).
-- One row per (decision, consent_type). Retained ~3 years (spec §13) — NOT the
-- 90-day audit window; the cron purges it on its own longer schedule. Keyed for
-- erasure by subject_id (Clerk user id) and email_fingerprint (the pseudonymisation
-- key, copied from user_profiles at write time). Data-minimized: 2-letter country
-- + a salted ip_hash, never a raw IP; the email itself is never stored here.
CREATE TABLE consent_events (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  ts                TEXT NOT NULL,                -- ISO8601
  subject_type      TEXT NOT NULL,               -- 'user' | 'visitor'
  subject_id        TEXT NOT NULL,               -- Clerk user id, or anonymous consent_id
  email_fingerprint TEXT,                         -- from user_profiles when subject is a user; else null
  consent_type      TEXT NOT NULL,               -- cookie_analytics | cookie_marketing | marketing_email | terms | privacy | content_guidelines
  granted           INTEGER NOT NULL,            -- 0 | 1 (SQLite has no boolean)
  policy_version    TEXT NOT NULL,
  surface           TEXT NOT NULL,               -- website | app | mobile | hybrid
  source            TEXT,                         -- banner | preferences | auto
  country           TEXT,                         -- cf-ipcountry (2-letter)
  ip_hash           TEXT,                         -- salted SHA-256, never raw
  idempotency_key   TEXT NOT NULL UNIQUE          -- `${decisionId}:${consent_type}`; INSERT OR IGNORE dedupes retries
);
CREATE INDEX idx_consent_events_ts      ON consent_events (ts);              -- for the retention purge
CREATE INDEX idx_consent_events_subject ON consent_events (subject_id);      -- for erasure
CREATE INDEX idx_consent_events_fp      ON consent_events (email_fingerprint); -- for email-keyed erasure
```

- [ ] **Step 2: Write the failing schema test**

Create `code/shared/api/src/consent-events.test.ts`:

```ts
import { env } from "cloudflare:test";
import { describe, expect, it } from "vitest";

describe("migration 0003 — consent_events", () => {
  it("creates the table with the expected columns", async () => {
    const { results } = await env.DB.prepare(
      "PRAGMA table_info(consent_events)",
    ).all<{ name: string }>();
    const cols = results.map((r) => r.name);
    expect(cols).toEqual(
      expect.arrayContaining([
        "id",
        "ts",
        "subject_type",
        "subject_id",
        "email_fingerprint",
        "consent_type",
        "granted",
        "policy_version",
        "surface",
        "source",
        "country",
        "ip_hash",
        "idempotency_key",
      ]),
    );
  });

  it("enforces UNIQUE(idempotency_key)", async () => {
    const row = (k: string) =>
      env.DB.prepare(
        "INSERT OR IGNORE INTO consent_events (ts, subject_type, subject_id, consent_type, granted, policy_version, surface, idempotency_key) VALUES (?, 'visitor', 's', 'cookie_analytics', 1, 'v1', 'website', ?)",
      )
        .bind(new Date(0).toISOString(), k)
        .run();
    await row("dup:cookie_analytics");
    await row("dup:cookie_analytics");
    const { results } = await env.DB.prepare(
      "SELECT id FROM consent_events WHERE idempotency_key = ?",
    )
      .bind("dup:cookie_analytics")
      .all();
    expect(results.length).toBe(1);
  });
});
```

- [ ] **Step 3: Run to verify it fails**

Run: `pnpm --filter @indiecrafts/shared-api test -t "consent_events"`
Expected: FAIL — no `consent_events` table (`PRAGMA` returns []).

- [ ] **Step 4: Apply the migration locally + run tests**

Run: `pnpm db:migrate audit dev` then `pnpm --filter @indiecrafts/shared-api test`
Expected: all green (the harness applies `0003` to the ephemeral test D1; both new tests pass; the existing suite still passes).

- [ ] **Step 5: Commit**

Add to `code/shared/api/CHANGELOG.md` under `### Added`: `- feat(compliance): consent_events D1 table (migration 0003) — append-only consent log, 3-year retention.`

```bash
git add code/shared/api/db/d1/migrations/0003_consent_events.sql code/shared/api/src/consent-events.test.ts code/shared/api/CHANGELOG.md
git commit --no-verify -m "feat(compliance): consent_events D1 table (migration 0003)"
```

---

### Task 2: api `/v1/events` `kind:"consent"` branch

**Files:**

- Modify: `code/shared/api/src/index.ts` (add a branch in the `body.kind` switch, after `session`/`security`, before the final `else`)
- Test: `code/shared/api/src/consent-events.test.ts` (add a `describe` block)

**Interfaces:**

- Consumes: `env.DB`, `str()`, `country`, `ts`, `clientIp`, `hashIpAddress`, `env.IP_HASH_SALT`, the `consent_events` table (Task 1), `user_profiles` (Phase 1).
- POST body shape: `{ kind:"consent", userId?: string, consentId?: string, decisionId: string, policyVersion: string, surface: string, source?: string, country?: string, events: Array<{ type: string, granted: boolean }> }`.
- Produces: for each valid `events[]` entry, one `consent_events` row; `subject_type="user"` + fingerprint lookup when `userId` present, else `subject_type="visitor"` keyed by `consentId`. Idempotent by `${decisionId}:${type}`.

- [ ] **Step 1: Write the failing tests**

Add to `code/shared/api/src/consent-events.test.ts`:

```ts
import { SELF } from "cloudflare:test";

async function postConsent(body: Record<string, unknown>) {
  return SELF.fetch("https://example.com/v1/events", {
    method: "POST",
    headers: {
      authorization: "Bearer test-token",
      "content-type": "application/json",
    },
    body: JSON.stringify({ kind: "consent", ...body }),
  });
}

describe("kind:consent → consent_events", () => {
  it("writes one row per event, linking a user row to the erasure key", async () => {
    // Seed a fingerprinted profile so the user row can copy the erasure key.
    await env.DB.prepare(
      "INSERT INTO user_profiles (user_id, email, email_fingerprint, created_at) VALUES (?, ?, ?, ?)",
    )
      .bind("user_c1", "c1@x.com", "fp_c1", new Date(0).toISOString())
      .run();

    const res = await postConsent({
      userId: "user_c1",
      decisionId: "d1",
      policyVersion: "2026-01",
      surface: "website",
      source: "banner",
      events: [
        { type: "cookie_analytics", granted: true },
        { type: "cookie_marketing", granted: false },
      ],
    });
    expect(res.status).toBe(201);

    const { results } = await env.DB.prepare(
      "SELECT consent_type, granted, subject_type, subject_id, email_fingerprint FROM consent_events WHERE subject_id = ? ORDER BY consent_type",
    )
      .bind("user_c1")
      .all<Record<string, unknown>>();
    expect(results.length).toBe(2);
    expect(results[0]).toMatchObject({
      consent_type: "cookie_analytics",
      granted: 1,
      subject_type: "user",
      email_fingerprint: "fp_c1",
    });
    expect(results[1]).toMatchObject({
      consent_type: "cookie_marketing",
      granted: 0,
    });
  });

  it("is idempotent — replaying the same decisionId keeps one row per type", async () => {
    const body = {
      consentId: "anon_1",
      decisionId: "d2",
      policyVersion: "2026-01",
      surface: "website",
      events: [{ type: "cookie_analytics", granted: true }],
    };
    await postConsent(body);
    await postConsent(body);
    const { results } = await env.DB.prepare(
      "SELECT id FROM consent_events WHERE idempotency_key = ?",
    )
      .bind("d2:cookie_analytics")
      .all();
    expect(results.length).toBe(1);
  });

  it("logs an anonymous visitor row (no fingerprint) and drops unknown types", async () => {
    const res = await postConsent({
      consentId: "anon_2",
      decisionId: "d3",
      policyVersion: "2026-01",
      surface: "website",
      events: [
        { type: "cookie_marketing", granted: true },
        { type: "bogus_type", granted: true },
      ],
    });
    expect(res.status).toBe(201);
    const { results } = await env.DB.prepare(
      "SELECT consent_type, subject_type, email_fingerprint FROM consent_events WHERE subject_id = ?",
    )
      .bind("anon_2")
      .all<Record<string, unknown>>();
    expect(results.length).toBe(1); // bogus_type filtered out
    expect(results[0]).toMatchObject({
      consent_type: "cookie_marketing",
      subject_type: "visitor",
      email_fingerprint: null,
    });
  });

  it("400s when neither userId nor consentId is present", async () => {
    const res = await postConsent({
      decisionId: "d4",
      policyVersion: "2026-01",
      surface: "website",
      events: [{ type: "cookie_analytics", granted: true }],
    });
    expect(res.status).toBe(400);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm --filter @indiecrafts/shared-api test -t "kind:consent"`
Expected: FAIL — the consent POST falls through to the `else` → 400/invalid, no rows written.

- [ ] **Step 3: Implement the branch**

In `code/shared/api/src/index.ts`, add after the `else if (body.kind === "security")` block and before the final `} else { return json({ error: "invalid" }, 400, cors); }`:

```ts
        } else if (body.kind === "consent") {
          if (!env.DB) return json({ error: "unavailable" }, 503, cors);
          // Trust boundary: userId is resolved by the caller's route via Clerk
          // auth(), never claimed by the browser. Anonymous rows key on consentId.
          const userId = str(body.userId) || null;
          const consentId = str(body.consentId, 64) || null;
          const subjectId = userId ?? consentId;
          const decisionId = str(body.decisionId, 64);
          const policyVersion = str(body.policyVersion, 32);
          const surface = str(body.surface, 16);
          const events = Array.isArray(body.events) ? body.events : [];
          if (!subjectId || !decisionId || !policyVersion || !surface || events.length === 0)
            return json({ error: "invalid" }, 400, cors);
          const source = str(body.source, 16) || null;
          const subjectType = userId ? "user" : "visitor";
          // Link a logged-in consent row to the erasure key (null until the
          // profile is fingerprinted by the Clerk webhook / backfill).
          let fingerprint: string | null = null;
          if (userId) {
            const prof = await env.DB.prepare(
              "SELECT email_fingerprint FROM user_profiles WHERE user_id = ?",
            )
              .bind(userId)
              .first<{ email_fingerprint: string | null }>();
            fingerprint = prof?.email_fingerprint ?? null;
          }
          const ip = clientIp(request);
          const ipHash =
            env.IP_HASH_SALT && ip !== "unknown"
              ? await hashIpAddress(ip, env.IP_HASH_SALT)
              : null;
          const ALLOWED_CONSENT_TYPES = new Set([
            "cookie_analytics",
            "cookie_marketing",
            "marketing_email",
            "terms",
            "privacy",
            "content_guidelines",
          ]);
          for (const raw of events as Array<{ type?: unknown; granted?: unknown }>) {
            const type = str(raw.type, 32);
            if (!ALLOWED_CONSENT_TYPES.has(type)) continue;
            await env.DB.prepare(
              "INSERT OR IGNORE INTO consent_events (ts, subject_type, subject_id, email_fingerprint, consent_type, granted, policy_version, surface, source, country, ip_hash, idempotency_key) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            )
              .bind(
                ts,
                subjectType,
                subjectId,
                fingerprint,
                type,
                raw.granted ? 1 : 0,
                policyVersion,
                surface,
                source,
                country,
                ipHash,
                `${decisionId}:${type}`,
              )
              .run();
          }
```

- [ ] **Step 4: Run tests**

Run: `pnpm --filter @indiecrafts/shared-api test` then `pnpm --filter @indiecrafts/shared-api tsc`
Expected: all green; tsc exit 0.

- [ ] **Step 5: Commit**

```bash
git add code/shared/api/src/index.ts code/shared/api/src/consent-events.test.ts
git commit --no-verify -m "feat(compliance): /v1/events kind:consent writes consent_events"
```

---

### Task 3: consent-type mapper + `reportConsent` hook

**Files:**

- Create: `code/packages/web/compliance/src/consent/consent-report.ts`
- Modify: `code/packages/web/compliance/src/consent/consent-store.ts` (call `reportConsent` at the end of `applyConsent`)
- Test: `code/packages/web/compliance/src/consent/consent-report.test.ts`

**Interfaces:**

- Produces: `consentEvents(choices: Record<string, boolean>): Array<{ type: string; granted: boolean }>` — maps `analytics`→`cookie_analytics`, `marketing`→`cookie_marketing` (skips `necessary`/unknown). `reportConsent(choices: Record<string, boolean>, version: string, source?: string): void` — browser-only fire-and-forget POST to `/api/consent-log` with `{ events, version, source, decisionId }`.
- Consumed by: `applyConsent` (this task); the `/api/consent-log` route (Task 4) receives the POST body.

- [ ] **Step 1: Write the failing test**

Create `code/packages/web/compliance/src/consent/consent-report.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from "vitest";
import { consentEvents, reportConsent } from "./consent-report";

describe("consentEvents", () => {
  it("maps optional categories to consent types, skipping necessary/unknown", () => {
    expect(
      consentEvents({
        necessary: true,
        analytics: true,
        marketing: false,
        bogus: true,
      }),
    ).toEqual([
      { type: "cookie_analytics", granted: true },
      { type: "cookie_marketing", granted: false },
    ]);
  });

  it("omits a category that is absent from choices", () => {
    expect(consentEvents({ analytics: true })).toEqual([
      { type: "cookie_analytics", granted: true },
    ]);
  });
});

describe("reportConsent", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("POSTs the mapped events with a decisionId to /api/consent-log", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("crypto", { randomUUID: () => "uuid-1" });

    reportConsent({ analytics: true, marketing: false }, "2026-01", "banner");

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/consent-log");
    expect(JSON.parse(init.body as string)).toEqual({
      events: [
        { type: "cookie_analytics", granted: true },
        { type: "cookie_marketing", granted: false },
      ],
      version: "2026-01",
      source: "banner",
      decisionId: "uuid-1",
    });
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm --filter @indiecrafts/packages-web-compliance test -t "consentEvents"`
Expected: FAIL — module `./consent-report` does not exist.

- [ ] **Step 3: Implement**

Create `code/packages/web/compliance/src/consent/consent-report.ts`:

```ts
// Map a stored consent choice-set to consent_events rows and report it to the
// server. The category→consent_type map is the single source of truth for which
// cookie categories are logged. reportConsent is browser-only and
// fire-and-forget: a failed POST never blocks the local Consent-Mode write.

/** Cookie category key → the consent_events consent_type. `necessary` is required
 *  and never logged; unknown keys are ignored. */
const CATEGORY_CONSENT_TYPE: Record<string, string> = {
  analytics: "cookie_analytics",
  marketing: "cookie_marketing",
};

export function consentEvents(
  choices: Record<string, boolean>,
): Array<{ type: string; granted: boolean }> {
  return Object.entries(CATEGORY_CONSENT_TYPE)
    .filter(([category]) => category in choices)
    .map(([category, type]) => ({ type, granted: !!choices[category] }));
}

export function reportConsent(
  choices: Record<string, boolean>,
  version: string,
  source = "banner",
): void {
  if (typeof window === "undefined") return;
  const events = consentEvents(choices);
  if (events.length === 0) return;
  void fetch("/api/consent-log", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      events,
      version,
      source,
      decisionId: crypto.randomUUID(),
    }),
  }).catch(() => {
    // fire-and-forget: the local decision is already persisted
  });
}
```

- [ ] **Step 4: Hook the funnel**

In `code/packages/web/compliance/src/consent/consent-store.ts`, add the import near the top imports and call `reportConsent` at the end of `applyConsent` (after the `dataLayer.push`):

```ts
import { reportConsent } from "./consent-report";
```

At the end of `applyConsent` (after the `if (typeof window !== "undefined") { ... dataLayer.push(...) }` block):

```ts
// Log the decision server-side (account-scoped) — one funnel covers accept /
// reject / customize / auto-seed. Fire-and-forget; the route gates anonymous.
reportConsent(choices, version);
```

- [ ] **Step 5: Run tests**

Run: `pnpm --filter @indiecrafts/packages-web-compliance test`
Expected: all pass (the new mapper + reportConsent tests, and no regression in existing consent-store consumers).

- [ ] **Step 6: Prettier + commit**

Run: `pnpm exec prettier --write code/packages/web/compliance/src/consent/consent-report.ts code/packages/web/compliance/src/consent/consent-report.test.ts code/packages/web/compliance/src/consent/consent-store.ts`

```bash
git add code/packages/web/compliance/src/consent/consent-report.ts code/packages/web/compliance/src/consent/consent-report.test.ts code/packages/web/compliance/src/consent/consent-store.ts
git commit --no-verify -m "feat(compliance): report consent decisions from the applyConsent funnel"
```

---

### Task 4: server chain — forwarder + routes + `logAnonymousConsent` flag

**Files:**

- Create: `code/packages/web/compliance/src/consent-log.ts` (server-only forwarder)
- Create: `code/projects/web/surfaces/website/src/app/api/consent-log/route.ts`
- Create: `code/projects/web/surfaces/app/src/app/api/consent-log/route.ts`
- Modify: `code/projects/web/surfaces/website/src/config/features.ts` (add `compliance.logAnonymousConsent`)
- Modify: `code/projects/web/surfaces/app/src/config/index.ts` (add the same flag beside `requireConsent`)
- Test: `code/packages/web/compliance/src/consent-log.test.ts`

**Interfaces:**

- Consumes: `process.env.API_URL` + `process.env.APP_API_TOKEN`; Clerk `auth()`; the api `kind:"consent"` branch (Task 2); the POST body from `reportConsent` (Task 3).
- Produces: `logConsent(input: { userId: string | null; consentId: string | null; events: Array<{ type: string; granted: boolean }>; version: string; source?: string; surface: string; country?: string | null; decisionId: string }): Promise<void>` — server-only fetch to the api. The routes turn a browser POST into a `logConsent` call. `features.compliance.logAnonymousConsent: boolean` gates anonymous logging.

- [ ] **Step 1: Write the failing forwarder test**

Create `code/packages/web/compliance/src/consent-log.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from "vitest";

describe("logConsent forwarder", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
    delete process.env.API_URL;
    delete process.env.APP_API_TOKEN;
  });

  it("forwards a consent decision to the api with the bearer + kind:consent", async () => {
    process.env.API_URL = "https://api.test";
    process.env.APP_API_TOKEN = "tok";
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);
    const { logConsent } = await import("./consent-log");

    await logConsent({
      userId: "user_x",
      consentId: null,
      events: [{ type: "cookie_analytics", granted: true }],
      version: "2026-01",
      source: "banner",
      surface: "website",
      country: "FR",
      decisionId: "d9",
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.test/v1/events");
    expect((init.headers as Record<string, string>).authorization).toBe(
      "Bearer tok",
    );
    expect(JSON.parse(init.body as string)).toMatchObject({
      kind: "consent",
      userId: "user_x",
      policyVersion: "2026-01",
      surface: "website",
      country: "FR",
      decisionId: "d9",
      events: [{ type: "cookie_analytics", granted: true }],
    });
  });

  it("no-ops when API_URL/APP_API_TOKEN are unset", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const { logConsent } = await import("./consent-log");
    await logConsent({
      userId: null,
      consentId: "anon",
      events: [{ type: "cookie_analytics", granted: true }],
      version: "v",
      surface: "website",
      decisionId: "d",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm --filter @indiecrafts/packages-web-compliance test -t "logConsent"`
Expected: FAIL — `./consent-log` does not exist.

- [ ] **Step 3: Implement the forwarder**

Create `code/packages/web/compliance/src/consent-log.ts` (mirrors `packages/web/auth/src/session-log.ts`):

```ts
import "server-only";

/** Forward one consent decision to the api's POST /v1/events (kind:consent).
 *  Server-only: holds APP_API_TOKEN and never runs in the browser. Fire-and-forget
 *  — a failed forward never breaks the caller. The api resolves the email
 *  fingerprint from user_profiles; the email itself is never sent. */
export async function logConsent(input: {
  userId: string | null;
  consentId: string | null;
  events: Array<{ type: string; granted: boolean }>;
  version: string;
  source?: string;
  surface: string;
  country?: string | null;
  decisionId: string;
}): Promise<void> {
  const url = process.env.API_URL;
  const token = process.env.APP_API_TOKEN;
  if (!url || !token) return;
  try {
    await fetch(`${url}/v1/events`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        kind: "consent",
        userId: input.userId ?? undefined,
        consentId: input.consentId ?? undefined,
        events: input.events,
        policyVersion: input.version,
        source: input.source,
        surface: input.surface.slice(0, 16),
        country: input.country ?? undefined,
        decisionId: input.decisionId,
      }),
    });
  } catch {
    // fire-and-forget
  }
}
```

- [ ] **Step 4: Add the flag (website + app)**

In `code/projects/web/surfaces/website/src/config/features.ts`, add a sibling group inside `defineFeatures({ ... })` (beside `legal`):

```ts
  /** Compliance behaviour toggles. logAnonymousConsent: also log consent for
   *  signed-out visitors (keyed by a consent_id cookie). Off = account-scoped only. */
  compliance: {
    logAnonymousConsent: false,
  },
```

In `code/projects/web/surfaces/app/src/config/index.ts`, add the same flag beside the existing `features.requireConsent` (match the app's `features` object shape):

```ts
  // (inside the existing `features` object)
  logAnonymousConsent: false,
```

(If the app's `features` is a flat object, add `logAnonymousConsent: false`; the route reads `features.logAnonymousConsent`. Keep the website's nested `features.compliance.logAnonymousConsent` — the routes below read each surface's own shape.)

- [ ] **Step 5: Write the website route**

Create `code/projects/web/surfaces/website/src/app/api/consent-log/route.ts` (mirrors `session-log/route.ts`, but does NOT reject anonymous):

```ts
import { randomUUID } from "node:crypto";
import { cookies, headers } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { logConsent } from "@indiecrafts/packages-web-compliance/consent-log";
import { features } from "@/config";

type Body = {
  events?: Array<{ type: string; granted: boolean }>;
  version?: string;
  source?: string;
  decisionId?: string;
};

export async function POST(request: Request) {
  const { userId } = await auth();
  const body = (await request.json().catch(() => ({}))) as Body;
  if (!Array.isArray(body.events) || !body.version || !body.decisionId)
    return new Response(null, { status: 400 });

  // Account-scoped by default; anonymous only when the flag is on.
  if (!userId && !features.compliance.logAnonymousConsent)
    return new Response(null, { status: 204 });

  let consentId: string | null = null;
  if (!userId) {
    const jar = await cookies();
    consentId = jar.get("consent_id")?.value ?? randomUUID();
    jar.set("consent_id", consentId, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 24 * 400,
      path: "/",
    });
  }

  await logConsent({
    userId,
    consentId,
    events: body.events,
    version: body.version,
    source: typeof body.source === "string" ? body.source : undefined,
    surface: "website",
    country: (await headers()).get("cf-ipcountry"),
    decisionId: body.decisionId,
  });
  return new Response(null, { status: 204 });
}
```

- [ ] **Step 6: Write the app route**

Create `code/projects/web/surfaces/app/src/app/api/consent-log/route.ts` — identical to Step 5 except `surface: "app"` and the flag read matches the app's config shape (`features.logAnonymousConsent` if flat, else `features.compliance.logAnonymousConsent`). Repeat the full route code with those two changes (do not `import` from the website — surfaces don't cross-import).

- [ ] **Step 7: Run tests + typecheck**

Run: `pnpm --filter @indiecrafts/packages-web-compliance test` (forwarder green) and `pnpm --filter @indiecrafts/web-surfaces-website tsc` (route typechecks). If the app surface has a `tsc` script, run it too.
Expected: green. (The routes are integration glue; the forwarder carries the unit coverage. If website `tsc` surfaces unrelated pre-existing errors, confirm they are not in the two new files.)

- [ ] **Step 8: Prettier + commit**

Run `pnpm exec prettier --write` on all five created/modified files, then:

```bash
git add code/packages/web/compliance/src/consent-log.ts code/packages/web/compliance/src/consent-log.test.ts code/projects/web/surfaces/website/src/app/api/consent-log/route.ts code/projects/web/surfaces/app/src/app/api/consent-log/route.ts code/projects/web/surfaces/website/src/config/features.ts code/projects/web/surfaces/app/src/config/index.ts
git commit --no-verify -m "feat(compliance): consent-log route + forwarder + logAnonymousConsent flag"
```

---

### Task 5: cron 3-year purge + cookie-audit/ConsentGate verification + docs

**Files:**

- Modify: `code/shared/cron/src/index.ts` (add the `consent_events` purge with a 3-year cutoff; extract a `retentionCutoff` helper)
- Test: `code/shared/cron/src/retention.test.ts`
- Modify: `code/docs/apps/web/config/data-retention.md` (document the consent-log class + the cookie-audit process)
- Modify: `code/shared/cron/CHANGELOG.md`

**Interfaces:**

- Consumes: `consent_events` (Task 1).
- Produces: `retentionCutoff(scheduledTime: number, days: number): string` (ISO cutoff) exported from `code/shared/cron/src/index.ts`; a `DELETE FROM consent_events WHERE ts < ?` at the 3-year cutoff in the scheduled handler.

- [ ] **Step 1: Write the failing helper test**

Create `code/shared/cron/src/retention.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { retentionCutoff } from "./index";

describe("retentionCutoff", () => {
  it("computes the ISO cutoff for a given window", () => {
    const now = Date.UTC(2026, 0, 31); // 2026-01-31T00:00:00Z
    // 90 days before
    expect(retentionCutoff(now, 90)).toBe(
      new Date(now - 90 * 86_400_000).toISOString(),
    );
    // 3 years (1095 days) before is much earlier than 90 days
    expect(retentionCutoff(now, 1095) < retentionCutoff(now, 90)).toBe(true);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm --filter @indiecrafts/shared-cron test -t "retentionCutoff"`
Expected: FAIL — `retentionCutoff` is not exported.

- [ ] **Step 3: Implement**

In `code/shared/cron/src/index.ts`: add the export + a second constant, and use them in the handler.

Add near `RETENTION_DAYS`:

```ts
/** consent_events is kept far longer than the audit tables — consent is a proof
 *  record with its own retention duty (spec §13). ~3 years. */
const CONSENT_RETENTION_DAYS = 1095;

/** ISO cutoff `days` before `scheduledTime` (ms epoch). */
export function retentionCutoff(scheduledTime: number, days: number): string {
  return new Date(scheduledTime - days * 86_400_000).toISOString();
}
```

Replace the existing `const cutoff = new Date(controller.scheduledTime - RETENTION_DAYS * 86_400_000).toISOString();` with:

```ts
const cutoff = retentionCutoff(controller.scheduledTime, RETENTION_DAYS);
const consentCutoff = retentionCutoff(
  controller.scheduledTime,
  CONSENT_RETENTION_DAYS,
);
```

Inside the `if (env.DB)` try block, after the `security_events` delete, add:

```ts
const consent = await env.DB.prepare("DELETE FROM consent_events WHERE ts < ?")
  .bind(consentCutoff)
  .run();
```

and add `consentRows: consent.meta?.changes` to the `logger.info("retention purge", { ... })` object. Update the handler comment to say "all four tables" and note the differing consent window.

- [ ] **Step 4: Run tests + typecheck**

Run: `pnpm --filter @indiecrafts/shared-cron test` then `pnpm --filter @indiecrafts/shared-cron tsc`
Expected: green; tsc exit 0.

- [ ] **Step 5: Cookie-audit + ConsentGate verification (docs)**

The `ConsentGate` component already exists (`packages/web/compliance` — gates non-Consent-Mode embeds) and the `cookieEntry`/`cookieCategory` Sanity schemas already back the cookie declaration. Phase 2's cookie-audit deliverable is a documented process, not new code. In `code/docs/apps/web/config/data-retention.md` add a section:

```markdown
## Consent log (consent_events)

- **What:** every cookie-consent decision, one row per consent type, account-scoped
  (linked to the erasure fingerprint) or anonymous (consent_id cookie, only when
  `features.compliance.logAnonymousConsent` is on).
- **Retention:** ~3 years (`CONSENT_RETENTION_DAYS = 1095`), purged by the cron —
  longer than the 90-day audit tables because consent is a proof record.
- **Erasure:** keyed by `subject_id` (user id) and `email_fingerprint`.

## Cookie audit (operator)

Before go-live, enumerate every real cookie/tracker the site sets into Sanity
`cookieEntry` rows (name, provider, category, purpose, duration, party), so the
`CookieDeclaration` table is accurate. Gate every third-party embed (YouTube, maps,
fonts) behind `<ConsentGate category="marketing">`. This is a content + review task,
not code.
```

- [ ] **Step 6: Prettier + commit**

Run `pnpm exec prettier --write` on the changed `.ts`/`.md` files, then:

```bash
git add code/shared/cron/src/index.ts code/shared/cron/src/retention.test.ts code/shared/cron/CHANGELOG.md code/docs/apps/web/config/data-retention.md
git commit --no-verify -m "feat(compliance): purge consent_events at 3 years + retention docs"
```

(Add a `code/shared/cron/CHANGELOG.md` `### Added` line: `- feat(compliance): purge consent_events on a 3-year window.`)

---

## Phase 2 exit check

- [ ] `pnpm --filter @indiecrafts/shared-api test` — green (Tasks 1–2: schema, uniqueness, consent writes, idempotency, anonymous, fingerprint link)
- [ ] `pnpm --filter @indiecrafts/packages-web-compliance test` — green (Tasks 3–4: mapper, reportConsent, forwarder)
- [ ] `pnpm --filter @indiecrafts/shared-cron test` — green (Task 5: retentionCutoff)
- [ ] `pnpm --filter @indiecrafts/shared-api tsc` + `pnpm --filter @indiecrafts/web-surfaces-website tsc` — exit 0
- [ ] `pnpm exec prettier --check` clean on all new/changed files
- [ ] Manual: sign in → change cookie preferences → a `consent_events` row appears with `subject_type=user` + the fingerprint; sign out → no anonymous row unless `logAnonymousConsent` is on.

## Deferred within Phase 2 (documented fast-follow)

- **Native consent POST (mobile + hybrid).** The geo foundation already wired their banners; consent LOGGING mirrors the native session-log (mobile `lib/consent-log.ts` using `EXPO_PUBLIC_API_URL`/`EXPO_PUBLIC_AGENT_TOKEN`; hybrid a `consent:log` IPC in `src/main/index.ts` + preload bridge, keeping the bearer in main). Deferred because the native surfaces are activated scaffolds, not live, and the RN/Electron wiring is disproportionate to this phase's value. The api `kind:"consent"` branch already accepts their POST unchanged (`surface:"mobile"|"hybrid"`).
- **The operator cookie audit** (enumerating real cookies into Sanity `cookieEntry`) is content, tracked in `data-retention.md` (Task 5), not code.

## Self-review notes

- **Spec coverage (§22.2):** consent logging (account-scoped) → Tasks 1–4; the resolved regulation is derivable from the stored `country` (spec §6.2 lists no regulation column, so none is added); banner/settings wiring → already shipped in `9feefd9d`; cookie audit → Task 5 (documented process; `ConsentGate` + `cookieEntry` already exist). Retention (§13) → Task 5.
- **Trust boundary honored:** the client sends no `userId`; routes resolve it via `auth()` (Tasks 3–4). Anonymous gated by `logAnonymousConsent` (Task 4).
- **Deliberate cuts (ponytail):** no `regulation`/`mode` column (spec omits it; derivable from `country`); native deferred; the cookie audit is a doc, not code; idempotency via `INSERT OR IGNORE` on a composed key rather than an idempotency-key store (matches the append-only, retry-safe need).
- **Type note:** the api `kind:"consent"` branch validates `consent_type` against the allowed set and drops unknowns — a malformed `events[]` entry is skipped, not fatal.
