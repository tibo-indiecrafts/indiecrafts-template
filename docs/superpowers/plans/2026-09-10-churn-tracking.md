# Churn Tracking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Capture why users leave via a delete-flow survey, retain departed contacts in a suppressed Resend "churned" topic under legitimate interest, and expose churn to the operator through a light admin page — without weakening GDPR erasure.

**Architecture:** A new `churn_events` D1 table (`main`, migration 0010) is written **only** by the self-service account-deletion path (`POST /v1/erasure/self`), which carries the survey reason. The Clerk `user.deleted` webhook (`handleClerkUserDeleted`) — the common tail of every deletion — branches its Resend action on whether a churn row exists: **suppress** the contact (retain in the churned topic, globally unsubscribed) when it does, **pure-delete** when it does not (the explicit-RTBF and admin carve-out). A bearer-gated `GET /v1/churn` aggregates the table for a new admin dashboard page.

**Tech Stack:** Cloudflare Workers · wrangler · D1 (SQLite) · TypeScript · React 19 · Next.js 16 · Tailwind v4 · Resend HTTP API · vitest (`cloudflare:test` pool). Node `.mjs` scripts.

**Spec:** `docs/superpowers/specs/2026-09-10-churn-tracking-design.md`

## DESIGN REFINEMENT (supersedes spec §3 "Write paths" and §2 webhook note)

Planning against the real code changed one mechanic from the spec. The spec had **two** writers (self-service + an `INSERT OR IGNORE` webhook row) reconciled by insert order. That is fragile and risks the carve-out. This plan uses the deterministic model instead:

- **`churn_events` has exactly one writer: the self-service path** (`handleErasureSelf`). `source` column is dropped (single writer, YAGNI).
- **The webhook writes no churn row.** It _reads_ churn_events to decide its Resend action: a row present → the departure was a self-service churn → `suppressResendContact`; no row → explicit RTBF or admin deletion → `deleteResendContact` (unchanged pure-delete). This preserves the erasure carve-out with zero dependence on event ordering.
- The self-service path _also_ calls `suppressResendContact` itself (it runs synchronously with the reason in hand); the webhook's later suppress is idempotent, so the double call is harmless.

Everything else in the spec stands.

## Global Constraints

- Never commit `.env*` (only `.env.example`); never expose a non-public token under `NEXT_PUBLIC_`/`EXPO_PUBLIC_`. Never paste secret values into chat or code.
- User-facing strings live in `messages/<locale>.json` — never inline. Both `en.json` and `fr.json` updated together.
- **Erasure carve-out is non-negotiable:** an explicit erasure request (`/v1/erasure/request` → confirm) always hard-deletes the Resend contact and retains no churn row.
- `churn_events` holds no email and no name; free text (`feedback`, `competitor`) is the only PII, matching the existing `data_requests` precedent.
- All Resend calls are best-effort and never block the D1 write or the erasure engine (wrap in try/catch + log). Unset `RESEND_API_KEY` / `RESEND_AUDIENCE_ID` / `RESEND_CHURNED_TOPIC_ID` degrades gracefully (no-op / suppress-only).
- Reuse: the `DataRequestForm` control pattern, the Resend fetch/injectable-`doFetch` seam, the D1 store-module pattern (`email-preferences-store.ts`), the admin dashboard page pattern (`csp/page.tsx`), the `.mjs` script + registry pattern.
- Commit hook (`lint-staged` + `tsc`) is the gate; run `pnpm --filter @indiecrafts/shared-api test` for api tasks. Do not hand-run `verify:quick`.

---

## File Structure

**New files**

- `code/shared/api/db/main/migrations/0010_churn_events.sql` — the table.
- `code/shared/api/src/consent/churn-store.ts` — churn persistence + aggregate read (sibling of `email-preferences-store.ts`).
- `code/shared/api/src/consent/churn-store.test.ts` — store tests (`cloudflare:test`).
- `code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/churn/page.tsx` — admin churn dashboard (mirrors `csp/page.tsx`).
- `code/shared/scripts/data/resend-topics-sync.mjs` — operator script: create the churned Resend topic, print its id.
- `code/shared/scripts/data/resend-topics-sync.test.mjs` — arg/env-guard self-check (no network).
- `code/docs/apps/web/config/churn.md` — the feature doc.

**Modified files**

- `code/shared/api/src/resend-audience.ts` — add `suppressResendContact`; extend `ResendAudienceEnv` with `RESEND_CHURNED_TOPIC_ID`.
- `code/shared/api/src/resend-audience.test.ts` — tests for `suppressResendContact`.
- `code/shared/api/src/erasure/self.ts` — parse survey fields; write churn row; suppress instead of pure-delete.
- `code/shared/api/src/erasure/self.test.ts` — churn-row + suppress assertions (extend existing).
- `code/shared/api/src/erasure/clerk-deleted.ts` — branch Resend on churn-row presence.
- `code/shared/api/src/erasure/clerk-deleted.test.ts` — carve-out + suppress branch (extend existing).
- `code/shared/api/src/index.ts` — `RESEND_CHURNED_TOPIC_ID` on `Env`; `GET /v1/churn` route.
- `code/packages/shared/compliance/src/shared/erasure-self.ts` — `rawErasureFetch`/`submitAccountErasure` carry survey fields.
- `code/packages/shared/compliance/src/web/DeleteAccountSection.tsx` — the survey UI.
- `code/projects/web/surfaces/website/src/user-interface/account/AccountControl.tsx` — pass survey copy through.
- `code/projects/web/surfaces/website/messages/{en,fr}.json` — `account.delete.survey.*`.
- `code/projects/web/surfaces/admin/messages/{en,fr}.json` — `admin.churn.*` (path confirmed in Task 6).
- `package.json` (root) — `"resend:topics:sync"` script.
- `.vscode/tasks.json` — mirror the new root script (`pnpm tasks:check`).
- `code/shared/api/.claude/CLAUDE.md` + `code/shared/api/CHANGELOG.md` — brief + changelog.

---

## Task 1: `churn_events` table + churn store

**Files:**

- Create: `code/shared/api/db/main/migrations/0010_churn_events.sql`
- Create: `code/shared/api/src/consent/churn-store.ts`
- Test: `code/shared/api/src/consent/churn-store.test.ts`

**Interfaces:**

- Produces:
  - `CHURN_REASONS: readonly string[]` and `type ChurnReason` — the preset codes.
  - `type ChurnSurvey = { reason?: string | null; feedback?: string | null; competitor?: string | null }`
  - `writeChurnEvent(db: D1Database, userId: string, survey: ChurnSurvey, ts: string): Promise<void>`
  - `readChurnEvent(db: D1Database, userId: string): Promise<{ reason: string | null } | null>`
  - `type ChurnAggregate = { total: number; byDay: { date: string; count: number }[]; byReason: { reason: string; count: number }[]; recentFeedback: { deleted_at: string; reason: string | null; feedback: string | null; competitor: string | null }[] }`
  - `readChurnAggregate(db: D1Database): Promise<ChurnAggregate>`
  - `normalizeReason(value: unknown): string | null` — returns the value iff it is in `CHURN_REASONS`, else `null`.

- [ ] **Step 1: Write the migration** — `0010_churn_events.sql`, mirroring the 0009 header style (why + forward-only note + idempotency note):

```sql
-- Voluntary-churn survey capture. One row per self-service account deletion (the only
-- writer — the Clerk webhook reads this table but never writes it). Legitimate-interest
-- basis: understand why customers leave. No email, no name; feedback/competitor are
-- optional operator-read free text (the data_requests precedent). Forward-only (D1 has no
-- down-migrations). idx_churn_deleted_at supports the admin page's time-series aggregate.
CREATE TABLE churn_events (
  user_id     TEXT PRIMARY KEY,   -- opaque Clerk id, dedup key
  deleted_at  TEXT NOT NULL,      -- ISO 8601
  reason      TEXT,               -- preset code (CHURN_REASONS), else NULL
  feedback    TEXT,               -- optional free text
  competitor  TEXT                -- optional free text
);
CREATE INDEX idx_churn_deleted_at ON churn_events (deleted_at);
```

- [ ] **Step 2: Write the failing store test** — `churn-store.test.ts` (model: `email-preferences-store.test.ts`, real `env.MAIN_DB` via `cloudflare:test`):

```ts
import { env } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import {
  writeChurnEvent,
  readChurnEvent,
  readChurnAggregate,
  normalizeReason,
} from "./churn-store";

const db = () => env.MAIN_DB!;

describe("churn-store", () => {
  it("normalizeReason keeps preset codes, nulls the rest", () => {
    expect(normalizeReason("too_expensive")).toBe("too_expensive");
    expect(normalizeReason("nonsense")).toBeNull();
    expect(normalizeReason(undefined)).toBeNull();
  });

  it("writes then reads a churn row", async () => {
    await writeChurnEvent(
      db(),
      "user_a",
      { reason: "too_expensive", feedback: "too pricey", competitor: "Acme" },
      new Date().toISOString(),
    );
    expect(await readChurnEvent(db(), "user_a")).toEqual({
      reason: "too_expensive",
    });
    expect(await readChurnEvent(db(), "missing")).toBeNull();
  });

  it("aggregates totals, reasons, and recent feedback", async () => {
    await writeChurnEvent(
      db(),
      "user_b",
      { reason: "not_using" },
      "2026-09-01T00:00:00.000Z",
    );
    await writeChurnEvent(
      db(),
      "user_c",
      { reason: "not_using", feedback: "hi" },
      "2026-09-01T00:00:00.000Z",
    );
    const agg = await readChurnAggregate(db());
    expect(agg.total).toBeGreaterThanOrEqual(3);
    expect(
      agg.byReason.find((r) => r.reason === "not_using")?.count,
    ).toBeGreaterThanOrEqual(2);
    expect(agg.recentFeedback.some((f) => f.feedback === "hi")).toBe(true);
  });
});
```

- [ ] **Step 3: Run it, verify it fails** — `pnpm --filter @indiecrafts/shared-api test churn-store` → FAIL (module not found).

- [ ] **Step 4: Implement `churn-store.ts`:**

```ts
export const CHURN_REASONS = [
  "too_expensive",
  "not_using",
  "missing_feature",
  "found_alternative",
  "too_hard",
  "privacy",
  "other",
] as const;
export type ChurnReason = (typeof CHURN_REASONS)[number];

export type ChurnSurvey = {
  reason?: string | null;
  feedback?: string | null;
  competitor?: string | null;
};

/** A value iff it is a known preset reason code; anything else → null (never trust the client). */
export function normalizeReason(value: unknown): string | null {
  return typeof value === "string" &&
    (CHURN_REASONS as readonly string[]).includes(value)
    ? value
    : null;
}

const clip = (v: unknown, max: number): string | null => {
  const s = typeof v === "string" ? v.trim() : "";
  return s ? s.slice(0, max) : null;
};

/** One row per departed user. INSERT OR REPLACE — a re-submit overwrites, never duplicates. */
export async function writeChurnEvent(
  db: D1Database,
  userId: string,
  survey: ChurnSurvey,
  ts: string,
): Promise<void> {
  await db
    .prepare(
      "INSERT OR REPLACE INTO churn_events (user_id, deleted_at, reason, feedback, competitor) VALUES (?, ?, ?, ?, ?)",
    )
    .bind(
      userId,
      ts,
      normalizeReason(survey.reason),
      clip(survey.feedback, 4000),
      clip(survey.competitor, 200),
    )
    .run();
}

/** Existence + reason for the webhook's suppress-vs-delete branch. null → no churn row. */
export async function readChurnEvent(
  db: D1Database,
  userId: string,
): Promise<{ reason: string | null } | null> {
  const row = await db
    .prepare("SELECT reason FROM churn_events WHERE user_id = ?")
    .bind(userId)
    .first<{ reason: string | null }>();
  return row ? { reason: row.reason ?? null } : null;
}

export type ChurnAggregate = {
  total: number;
  byDay: { date: string; count: number }[];
  byReason: { reason: string; count: number }[];
  recentFeedback: {
    deleted_at: string;
    reason: string | null;
    feedback: string | null;
    competitor: string | null;
  }[];
};

/** Pure COUNT…GROUP BY — no per-row scan of the whole table into the worker. */
export async function readChurnAggregate(
  db: D1Database,
): Promise<ChurnAggregate> {
  const total =
    (
      await db
        .prepare("SELECT COUNT(*) c FROM churn_events")
        .first<{ c: number }>()
    )?.c ?? 0;
  const byDay = (
    await db
      .prepare(
        "SELECT substr(deleted_at,1,10) date, COUNT(*) count FROM churn_events GROUP BY date ORDER BY date DESC LIMIT 90",
      )
      .all<{ date: string; count: number }>()
  ).results;
  const byReason = (
    await db
      .prepare(
        "SELECT COALESCE(reason,'unknown') reason, COUNT(*) count FROM churn_events GROUP BY reason ORDER BY count DESC",
      )
      .all<{ reason: string; count: number }>()
  ).results;
  const recentFeedback = (
    await db
      .prepare(
        "SELECT deleted_at, reason, feedback, competitor FROM churn_events WHERE feedback IS NOT NULL OR competitor IS NOT NULL ORDER BY deleted_at DESC LIMIT 50",
      )
      .all<{
        deleted_at: string;
        reason: string | null;
        feedback: string | null;
        competitor: string | null;
      }>()
  ).results;
  return { total, byDay, byReason, recentFeedback };
}
```

- [ ] **Step 5: Run tests, verify pass** — `pnpm --filter @indiecrafts/shared-api test churn-store` → PASS.

- [ ] **Step 6: Commit** — `git add code/shared/api/db/main/migrations/0010_churn_events.sql code/shared/api/src/consent/churn-store.ts code/shared/api/src/consent/churn-store.test.ts && git commit` (message: `feat(api): churn_events table + churn store`).

---

## Task 2: `suppressResendContact`

**Files:**

- Modify: `code/shared/api/src/resend-audience.ts`
- Test: `code/shared/api/src/resend-audience.test.ts`

**Interfaces:**

- Consumes: nothing new.
- Produces: `suppressResendContact(env, { email, reason }, doFetch?)`; `ResendAudienceEnv` gains `RESEND_CHURNED_TOPIC_ID?: string`.

- [ ] **Step 1: Write the failing test** (append to `resend-audience.test.ts`, model the existing fake-fetch injection):

```ts
import { suppressResendContact } from "./resend-audience";

describe("suppressResendContact", () => {
  it("no-ops without key/audience", async () => {
    const f = vi.fn();
    await suppressResendContact(
      {},
      { email: "u@x.com" },
      f as unknown as typeof fetch,
    );
    expect(f).not.toHaveBeenCalled();
  });

  it("sets unsubscribed + churned topic + property on create", async () => {
    const f = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    await suppressResendContact(
      {
        RESEND_API_KEY: "k",
        RESEND_AUDIENCE_ID: "aud_1",
        RESEND_CHURNED_TOPIC_ID: "top_1",
      },
      { email: "u@x.com", reason: "too_expensive" },
      f as unknown as typeof fetch,
    );
    const body = JSON.parse((f.mock.calls[0][1] as RequestInit).body as string);
    expect(body.unsubscribed).toBe(true);
    expect(body.topics).toEqual([{ id: "top_1", subscription: "opt_in" }]);
    expect(body.properties.churn_reason).toBe("too_expensive");
    expect(body.email).toBe("u@x.com");
  });

  it("omits topics when no churned topic id is set", async () => {
    const f = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    await suppressResendContact(
      { RESEND_API_KEY: "k", RESEND_AUDIENCE_ID: "aud_1" },
      { email: "u@x.com" },
      f as unknown as typeof fetch,
    );
    const body = JSON.parse((f.mock.calls[0][1] as RequestInit).body as string);
    expect(body.unsubscribed).toBe(true);
    expect(body.topics).toBeUndefined();
  });

  it("falls back to PATCH by email on 409/422", async () => {
    const f = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 409 })
      .mockResolvedValueOnce({ ok: true, status: 200 });
    await suppressResendContact(
      {
        RESEND_API_KEY: "k",
        RESEND_AUDIENCE_ID: "aud_1",
        RESEND_CHURNED_TOPIC_ID: "top_1",
      },
      { email: "u@x.com", reason: "privacy" },
      f as unknown as typeof fetch,
    );
    expect(f).toHaveBeenCalledTimes(2);
    expect(f.mock.calls[1][0] as string).toContain("/contacts/u@x.com");
    expect((f.mock.calls[1][1] as RequestInit).method).toBe("PATCH");
  });
});
```

- [ ] **Step 2: Run it, verify it fails** — `pnpm --filter @indiecrafts/shared-api test resend-audience` → FAIL.

- [ ] **Step 3: Implement.** Extend the type and add the function (mirror `syncContactTopics`'s POST-then-PATCH-on-409/422 idiom):

```ts
export type ResendAudienceEnv = {
  RESEND_API_KEY?: string;
  RESEND_AUDIENCE_ID?: string;
  RESEND_CHURNED_TOPIC_ID?: string;
};

/** Suppress a departed contact instead of deleting: global unsubscribe (no send can fire),
 *  opt into the churned topic (cohort tag, only when its id is set), and stamp the churn
 *  reason as a contact property (preset code only — free text never leaves for Resend).
 *  Best-effort, same POST-then-PATCH idiom as the siblings. */
export async function suppressResendContact(
  env: ResendAudienceEnv,
  { email, reason }: { email: string; reason?: string | null },
  doFetch: typeof fetch = fetch,
): Promise<void> {
  if (!env.RESEND_API_KEY || !env.RESEND_AUDIENCE_ID || !email) return;
  const base = `${RESEND_API}/audiences/${env.RESEND_AUDIENCE_ID}/contacts`;
  const headers = {
    Authorization: `Bearer ${env.RESEND_API_KEY}`,
    "content-type": "application/json",
  };
  const payload: Record<string, unknown> = {
    unsubscribed: true,
    properties: {
      churned_at: new Date().toISOString(),
      churn_reason: reason ?? "",
    },
  };
  if (env.RESEND_CHURNED_TOPIC_ID)
    payload.topics = [
      { id: env.RESEND_CHURNED_TOPIC_ID, subscription: "opt_in" },
    ];

  const res = await doFetch(base, {
    method: "POST",
    headers,
    body: JSON.stringify({ email, ...payload }),
  });
  if (res.ok) return;
  if (res.status === 409 || res.status === 422) {
    const patch = await doFetch(`${base}/${email}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    });
    if (!patch.ok) throw new Error(`resend ${patch.status}`);
    return;
  }
  throw new Error(`resend ${res.status}`);
}
```

- [ ] **Step 4: Run tests, verify pass.**
- [ ] **Step 5: Commit** — `feat(api): suppressResendContact for churned-contact retention`.

---

## Task 3: Wire the self-service deletion (churn row + suppress)

**Files:**

- Modify: `code/shared/api/src/erasure/self.ts`
- Test: `code/shared/api/src/erasure/self.test.ts`

**Interfaces:**

- Consumes: `writeChurnEvent`, `normalizeReason` (Task 1); `suppressResendContact` (Task 2).
- Produces: `handleErasureSelf` now (a) reads `reason`/`feedback`/`competitor` from the body, (b) writes a churn row before the engine runs, (c) suppresses the Resend contact instead of pure-deleting. New injectable seam `suppress: typeof suppressResendContact = suppressResendContact` replaces the `del` seam.

Context (from recon): body parse at `self.ts:175-182` (reads only `email`); engine invocation at `194-213`; the existing Resend call uses the `del` param (`deleteResendContact`). The identity is `authed.userId` / `authed.email`.

- [ ] **Step 1: Extend the failing test** (`self.test.ts` — reuse its existing harness that injects `authenticate`, `buildAdapters`, and the Resend seam; assert against a real `env.MAIN_DB` + a fake suppress):

```ts
it("writes a churn row and suppresses (not deletes) on self-service deletion", async () => {
  const suppress = vi.fn().mockResolvedValue(undefined);
  const req = new Request("https://x/v1/erasure/self", {
    method: "POST",
    headers: { authorization: "Bearer t", "content-type": "application/json" },
    body: JSON.stringify({
      email: "user@x.com",
      reason: "too_expensive",
      feedback: "pricey",
      competitor: "Acme",
    }),
  });
  // authenticate stub returns the matching user/email so the typed-email gate passes
  const res = await handleErasureSelf(
    req,
    env,
    undefined,
    fakeBuildAdapters,
    fakeAuthReturning("user_x", "user@x.com"),
    suppress,
  );
  expect(res.status).toBe(200);
  expect(suppress).toHaveBeenCalledWith(
    env,
    expect.objectContaining({ email: "user@x.com", reason: "too_expensive" }),
    expect.anything(),
  );
  const row = await env
    .MAIN_DB!.prepare(
      "SELECT reason, feedback FROM churn_events WHERE user_id='user_x'",
    )
    .first();
  expect(row).toMatchObject({ reason: "too_expensive", feedback: "pricey" });
});

it("rejects an unknown reason to null but still deletes the account", async () => {
  // body.reason = "garbage" → churn_events.reason IS NULL, deletion still 200
});
```

(Adapt the stub helper names to whatever `self.test.ts` already defines; the recon confirms `authenticate`, `buildAdapters`, and `del` are constructor-injected params.)

- [ ] **Step 2: Run it, verify it fails.**

- [ ] **Step 3: Implement.** In `handleErasureSelf`:
  1. Change the seam: replace the `del = deleteResendContact` parameter with `suppress: typeof suppressResendContact = suppressResendContact` (import from `../resend-audience`, drop the now-unused `deleteResendContact` import if nothing else uses it).
  2. Extend the body parse (self.ts:175-182) to also read the survey fields:

```ts
const body = (await request.json()) as {
  email?: unknown;
  reason?: unknown;
  feedback?: unknown;
  competitor?: unknown;
};
typedEmail = String(body.email ?? "").trim();
const survey = {
  reason: body.reason,
  feedback: body.feedback,
  competitor: body.competitor,
};
```

3. After the typed-email gate passes and `ts` is set, **before** `runErasure`, write the churn row (best-effort) and suppress:

```ts
try {
  await writeChurnEvent(env.MAIN_DB, authed.userId, survey, ts);
} catch (error) {
  logger.error("churn write failed", { name: (error as Error)?.name });
}
try {
  await suppress(env, {
    email: authed.email,
    reason: normalizeReason(survey.reason),
  });
} catch (error) {
  logger.error("churn suppress failed", { name: (error as Error)?.name });
}
```

(Replace the old `await del(env, { email: authed.email })` call site with the suppress block above.)

- [ ] **Step 4: Run tests, verify pass** (`pnpm --filter @indiecrafts/shared-api test self`).
- [ ] **Step 5: Commit** — `feat(api): self-service delete writes churn row + suppresses contact`.

---

## Task 4: Webhook branches Resend on churn-row presence (carve-out)

**Files:**

- Modify: `code/shared/api/src/erasure/clerk-deleted.ts`
- Test: `code/shared/api/src/erasure/clerk-deleted.test.ts`

**Interfaces:**

- Consumes: `readChurnEvent` (Task 1); `suppressResendContact` (Task 2); existing `deleteResendContact`.
- Produces: `handleClerkUserDeleted` gains an injectable `suppress = suppressResendContact` seam; its Resend step now branches.

- [ ] **Step 1: Extend the failing test** (`clerk-deleted.test.ts` already injects `del`; add a `suppress` seam):

```ts
it("suppresses (not deletes) when a churn row exists — self-service path", async () => {
  await env
    .MAIN_DB!.prepare(
      "INSERT OR REPLACE INTO churn_events (user_id, deleted_at, reason) VALUES ('u1', ?, 'privacy')",
    )
    .bind(new Date().toISOString())
    .run();
  await seedProfile("u1", "u1@x.com");
  const del = vi.fn();
  const suppress = vi.fn().mockResolvedValue(undefined);
  await handleClerkUserDeleted(
    env,
    "u1",
    new Date().toISOString(),
    fakeBuildAdapters,
    del,
    suppress,
  );
  expect(suppress).toHaveBeenCalledWith(
    env,
    expect.objectContaining({ email: "u1@x.com", reason: "privacy" }),
    expect.anything(),
  );
  expect(del).not.toHaveBeenCalled();
});

it("pure-deletes when no churn row exists — RTBF/admin carve-out", async () => {
  await seedProfile("u2", "u2@x.com");
  const del = vi.fn().mockResolvedValue(undefined);
  const suppress = vi.fn();
  await handleClerkUserDeleted(
    env,
    "u2",
    new Date().toISOString(),
    fakeBuildAdapters,
    del,
    suppress,
  );
  expect(del).toHaveBeenCalledWith(
    env,
    expect.objectContaining({ email: "u2@x.com" }),
  );
  expect(suppress).not.toHaveBeenCalled();
});
```

- [ ] **Step 2: Run it, verify it fails.**

- [ ] **Step 3: Implement.** Add the seam to the signature (after `del`): `suppress: typeof suppressResendContact = suppressResendContact` (import it). Replace the current Resend block (`clerk-deleted.ts:37-45`) with the branch:

```ts
if (profile?.email) {
  const churn = await readChurnEvent(env.MAIN_DB, userId).catch(() => null);
  try {
    if (churn)
      await suppress(env, { email: profile.email, reason: churn.reason });
    else await del(env, { email: profile.email });
  } catch (error) {
    logger.error("clerk-deleted resend op failed", {
      name: (error as Error)?.name,
    });
  }
}
```

- [ ] **Step 4: Run tests, verify pass.**
- [ ] **Step 5: Commit** — `feat(api): webhook suppresses churned contacts, pure-deletes RTBF`.

---

## Task 5: `GET /v1/churn` aggregate endpoint

**Files:**

- Modify: `code/shared/api/src/index.ts`
- Test: `code/shared/api/src/index.test.ts` (or the existing routing test file — locate the `/v1/security` test and mirror it)

**Interfaces:**

- Consumes: `readChurnAggregate` (Task 1).
- Produces: `Env.RESEND_CHURNED_TOPIC_ID?: string`; a bearer-gated `GET /v1/churn` returning `ChurnAggregate`.

- [ ] **Step 1: Add `RESEND_CHURNED_TOPIC_ID?: string;` to the `Env` interface** (index.ts, near the other `RESEND_*` lines ~114-122).

- [ ] **Step 2: Write the failing test** (mirror the `/v1/security` bearer test):

```ts
it("GET /v1/churn is bearer-gated and returns the aggregate", async () => {
  const unauth = await worker.fetch(new Request("https://x/v1/churn"), {
    ...env,
    APP_API_TOKEN: "s",
  });
  expect(unauth.status).toBe(401);
  const ok = await worker.fetch(
    new Request("https://x/v1/churn", {
      headers: { authorization: "Bearer s" },
    }),
    { ...env, APP_API_TOKEN: "s" },
  );
  expect(ok.status).toBe(200);
  const body = await ok.json();
  expect(body).toHaveProperty("total");
  expect(body).toHaveProperty("byReason");
});
```

- [ ] **Step 3: Run it, verify it fails.**

- [ ] **Step 4: Implement the route** (place beside `/v1/csp-reports`, same guard shape; note churn is on `MAIN_DB`):

```ts
if (url.pathname === "/v1/churn") {
  if (request.method !== "GET")
    return json({ error: "method_not_allowed" }, 405, cors);
  const bearer = (request.headers.get("authorization") ?? "").replace(
    /^Bearer\s+/i,
    "",
  );
  if (!env.APP_API_TOKEN || !bearer || !safeEqual(bearer, env.APP_API_TOKEN))
    return json({ error: "unauthorized" }, 401, cors);
  if (!env.MAIN_DB) return json({ error: "unavailable" }, 503, cors);
  return json(await readChurnAggregate(env.MAIN_DB), 200, cors);
}
```

- [ ] **Step 5: Run tests, verify pass.**
- [ ] **Step 6: Commit** — `feat(api): GET /v1/churn aggregate + RESEND_CHURNED_TOPIC_ID env`.

---

## Task 6: Admin churn dashboard page

**Files:**

- Create: `code/projects/web/surfaces/admin/src/app/[locale]/(dashboard)/churn/page.tsx`
- Modify: `code/projects/web/surfaces/admin/messages/{en,fr}.json` (add `admin.churn`)
- Modify: the dashboard nav list, if one exists (locate the `(dashboard)` layout/nav; add a churn link mirroring the CSP/security entries)

**Interfaces:**

- Consumes: `GET /v1/churn` (Task 5).

- [ ] **Step 1: Confirm the messages path + nav.** Open `csp/page.tsx` and its `(dashboard)` layout. Note the message namespace helper (`getTranslations("admin.csp")`) and whether a nav array lists dashboard pages.

- [ ] **Step 2: Create `churn/page.tsx`** — a server component mirroring `csp/page.tsx` 1:1:

```tsx
import { getTranslations } from "next-intl/server";
import { Card } from "@indiecrafts/packages-web-ui/web/card";
import { PageHeader } from "@/user-interface/layout/PageHeader";

type ChurnAggregate = {
  total: number;
  byDay: { date: string; count: number }[];
  byReason: { reason: string; count: number }[];
  recentFeedback: {
    deleted_at: string;
    reason: string | null;
    feedback: string | null;
    competitor: string | null;
  }[];
};

async function fetchChurn(): Promise<ChurnAggregate | null> {
  const url = process.env.API_URL;
  const token = process.env.APP_API_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(`${url}/v1/churn`, {
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as ChurnAggregate;
  } catch {
    return null;
  }
}

export default async function ChurnPage() {
  const t = await getTranslations("admin.churn");
  const data = await fetchChurn();
  // render: headline t("total") + data.total; a byReason table; a byDay mini bar list; a recentFeedback list.
  // Empty/unavailable → data === null → render t("unavailable"). Mirror csp/page.tsx's Card/Table usage.
  return (
    <>
      <PageHeader title={t("title")} />
      {/* ...Card + Table blocks over data.byReason / data.byDay / data.recentFeedback... */}
    </>
  );
}
```

(Fill the render body with the same `Card`/`Table` primitives `csp/page.tsx` uses — a reason table, a per-day list, and a feedback stream. No new UI primitives.)

- [ ] **Step 3: Add `admin.churn` copy** to admin `en.json` + `fr.json`: `title`, `total`, `reason`, `count`, `feedback`, `competitor`, `date`, `unavailable`, and a label per `CHURN_REASONS` code + `unknown`.

- [ ] **Step 4: Add the nav link** (if a nav array exists) pointing at `/churn`.

- [ ] **Step 5: Verify** — `pnpm --filter @indiecrafts/web-surfaces-admin tsc`. Manual: page renders with an empty aggregate.
- [ ] **Step 6: Commit** — `feat(admin): churn dashboard page`.

---

## Task 7: Web delete-flow churn survey

**Files:**

- Modify: `code/packages/shared/compliance/src/shared/erasure-self.ts`
- Modify: `code/packages/shared/compliance/src/web/DeleteAccountSection.tsx`
- Modify: `code/projects/web/surfaces/website/src/user-interface/account/AccountControl.tsx`
- Modify: `code/projects/web/surfaces/website/messages/{en,fr}.json`
- Test: `code/packages/shared/compliance/src/shared/erasure-self.test.ts` (or add one) for the payload shape

**Interfaces:**

- Consumes: the survey codes conceptually match `CHURN_REASONS` (Task 1) — keep the option list identical.
- Produces: `submitAccountErasure`/`rawErasureFetch` accept `{ reason?; feedback?; competitor? }` and send them in the POST body.

- [ ] **Step 1: Failing test — payload carries survey fields.** In `erasure-self.test.ts`, assert `rawErasureFetch` posts `reason/feedback/competitor` when given:

```ts
it("includes survey fields in the erasure-self body", async () => {
  const f = vi.fn().mockResolvedValue({ status: 200, ok: true });
  await rawErasureFetch(
    {
      apiUrl: "https://api",
      getToken: async () => "t",
      email: "u@x.com",
      reason: "too_hard",
      feedback: "confusing",
    },
    f as unknown as typeof fetch,
  );
  const body = JSON.parse((f.mock.calls[0][1] as RequestInit).body as string);
  expect(body).toMatchObject({
    email: "u@x.com",
    reason: "too_hard",
    feedback: "confusing",
  });
});
```

(If `rawErasureFetch` currently takes no injected fetch, add a `doFetch = fetch` last param — matching the api-side seam convention — so the test needs no network.)

- [ ] **Step 2: Run it, verify it fails.**

- [ ] **Step 3: Implement `erasure-self.ts`.** Extend the input type with `reason?: string; feedback?: string; competitor?: string;` and widen the body:

```ts
body: JSON.stringify({
  email: input.email,
  ...(input.reason ? { reason: input.reason } : {}),
  ...(input.feedback ? { feedback: input.feedback } : {}),
  ...(input.competitor ? { competitor: input.competitor } : {}),
}),
```

- [ ] **Step 4: Add the survey UI to `DeleteAccountSection.tsx`.** Before the existing confirm control, add a RadioGroup (reasons), a Textarea (feedback), and an Input (competitor), all optional, driven by copy props (mirror `DataRequestForm`'s RadioGroup + Textarea usage). Pass the three values into `submitAccountErasure(...)`. Reason option `value`s must equal the `CHURN_REASONS` codes.

- [ ] **Step 5: Thread copy through `AccountControl.tsx`.** Extend `buildDeleteAccountCopy(tDelete)` (or the copy object it builds) to include a `survey` group read from `account.delete.survey.*`, and pass it into the section.

- [ ] **Step 6: Add website copy** — `account.delete.survey` in `en.json` + `fr.json`: `legend`, `reasonLabel`, a label per reason code, `feedbackLabel`, `feedbackPlaceholder`, `competitorLabel`, `competitorPlaceholder`. Warm editorial tone (product copy, not agent voice).

- [ ] **Step 7: Verify** — `pnpm --filter @indiecrafts/web-surfaces-website tsc` + the compliance brick test. Manual: the delete flow shows the survey; submitting still deletes.
- [ ] **Step 8: Commit** — `feat(web): churn exit-survey on account deletion`.

---

## Task 8: Mobile — confirm the delete → web-account handoff

**Files:**

- Read/verify: `code/projects/mobile/surfaces/main/app/account.tsx`

**Interfaces:** none (verification task; spec non-goal = no native churn form).

- [ ] **Step 1: Verify** the mobile account screen routes account deletion to the web account (same `WebBrowser.openBrowserAsync(accountUrl)` handoff shipped for email preferences), so the churn survey is reached via the web flow. If deletion is currently handled natively, change it to the web-account redirect. If it already redirects, no code change — record the finding in the ledger.
- [ ] **Step 2: Commit only if changed** — `chore(mobile): route account deletion to web account for churn survey`.

---

## Task 9: `resend-topics-sync` operator script

**Files:**

- Create: `code/shared/scripts/data/resend-topics-sync.mjs`
- Create: `code/shared/scripts/data/resend-topics-sync.test.mjs`
- Modify: `package.json` (root) — `"resend:topics:sync"`
- Modify: `.vscode/tasks.json` — mirror the script (`pnpm tasks:check`)

**Interfaces:** operator-run; reads `RESEND_API_KEY` from env; prints the created/existing churned topic id.

- [ ] **Step 1: Failing self-check test** (`resend-topics-sync.test.mjs`, `node --test`, no network — test the pure arg/env guard, exported as a function):

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveTopicConfig } from "./resend-topics-sync.mjs";

test("errors without an API key", () => {
  assert.throws(() => resolveTopicConfig({}), /RESEND_API_KEY/);
});
test("defaults the churned topic name", () => {
  const cfg = resolveTopicConfig({ RESEND_API_KEY: "k" });
  assert.equal(cfg.name, "Win-back (former members)");
  assert.equal(cfg.default_subscription, "opt_out");
});
```

- [ ] **Step 2: Run it, verify it fails.**

- [ ] **Step 3: Implement the script.** Shebang + header (mirror `backup.mjs`). Export `resolveTopicConfig(env)` (throws without `RESEND_API_KEY`; returns `{ name, default_subscription: "opt_out", description }`). `main()` calls the Resend topics create endpoint via `fetch` (confirm the exact path against Resend's topics API — create a topic, `Authorization: Bearer`), prints the resulting topic id and the exact `RESEND_CHURNED_TOPIC_ID=<id>` line the operator sets. On an "already exists" response, fetch + print the existing id. Guard `main()` behind `if (import.meta.url === \`file://${process.argv[1]}\`)` so importing for the test does not run it.

- [ ] **Step 4: Add the root script** — `"resend:topics:sync": "node code/shared/scripts/data/resend-topics-sync.mjs"`.

- [ ] **Step 5: Mirror in `.vscode/tasks.json`** — one entry `{ "label": "resend:topics:sync", ... "command": "pnpm resend:topics:sync" ... }`. Run `pnpm tasks:check` → green.

- [ ] **Step 6: Run the self-check** (`node --test code/shared/scripts/data/resend-topics-sync.test.mjs`) → PASS. **Do not run the live script** (needs a real key; operator step).
- [ ] **Step 7: Commit** — `feat(scripts): resend-topics-sync for the churned topic`.

---

## Task 10: Docs + changelog

**Files:**

- Create: `code/docs/apps/web/config/churn.md` + add its sidebar line in `code/docs/.vitepress/config.mts`
- Modify: `code/shared/api/.claude/CLAUDE.md` (brief: churn_events table, `/v1/churn`, suppress-vs-delete, `RESEND_CHURNED_TOPIC_ID`)
- Modify: `code/shared/api/CHANGELOG.md`

- [ ] **Step 1: Write `churn.md`** — the model (legitimate interest, single-writer, carve-out), the table, the endpoint, the Resend suppression, the operator setup (create topic → set env → migrate 0010), following the shape of `email-preferences.md`.
- [ ] **Step 2: Update the api brief** — add churn to the `MAIN_DB` table list and a short paragraph mirroring the email-preferences one, noting the RTBF carve-out.
- [ ] **Step 3: Add a CHANGELOG entry** (api home altitude).
- [ ] **Step 4: Verify** `pnpm docs:build` is not newly broken by `churn.md` (the pre-existing `auth.md` failure is out of scope).
- [ ] **Step 5: Commit** — `docs: churn tracking feature docs + changelog`.

---

## Post-implementation (controller, not a task subagent)

- **QA runbook ledger card** — add a "Churn on account deletion" card to the QA runbook artifact (Artifact tool, not a repo file): delete a test account with a survey reason → verify the Resend contact is globally unsubscribed + in the churned topic (off all marketing) → verify a `churn_events` row (reason/feedback, no email/name) → verify the admin churn page shows the deletion + reason. Also mark the RTBF carve-out check: an erasure-request deletion leaves no churn row and the contact is gone.
- **Operator go-live** (credential-gated, user-run): `pnpm resend:topics:sync` (or create the topic in the dashboard) → set `RESEND_CHURNED_TOPIC_ID` → `pnpm db:migrate:main:<env>` for 0010 → confirm a valid `RESEND_API_KEY`/`RESEND_AUDIENCE_ID`.

---

## Self-Review

- **Spec coverage:** survey form (Task 7) ✓ · suppression + churned topic (Task 2, 3, 4) ✓ · churn_events store (Task 1) ✓ · admin page (Task 5, 6) ✓ · erasure carve-out (Task 4) ✓ · mobile redirect (Task 8) ✓ · topic script (Task 9) ✓ · tests (each task) ✓ · QA ledger card (post-impl) ✓ · docs (Task 10) ✓. The spec's two-writer §3 is intentionally superseded (see DESIGN REFINEMENT).
- **Placeholder scan:** no TBD/TODO; every code step has real code. The two render-body fill-ins (admin page Task 6 Step 2, DeleteAccountSection UI Task 7 Step 4) name the exact primitives + data fields to use — bounded, not open.
- **Type consistency:** `ChurnSurvey`/`ChurnAggregate`/`normalizeReason`/`readChurnEvent`/`writeChurnEvent`/`readChurnAggregate`/`suppressResendContact` names and signatures match across Tasks 1–7. `RESEND_CHURNED_TOPIC_ID` is on both `ResendAudienceEnv` (Task 2) and `Env` (Task 5). Reason codes are one list (`CHURN_REASONS`) reused by the form.
