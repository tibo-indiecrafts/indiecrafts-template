# P1 — Security Correctness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Close the security-correctness gaps — honest erasure receipts, full-engine erasure on out-of-band Clerk delete, step-up reverification on account self-delete, and an auth-contract test for the worker routes.

**Architecture:** Changes to the `shared/api` worker + the `shared/compliance` package + the web/hybrid delete UIs. The reverification fix is worker-first: the worker enforces `fva` (factor-verification-age) freshness and returns Clerk's reverification-error shape; the web + hybrid clients wrap the call in `useReverification`.

**Tech Stack:** Cloudflare Workers (`@clerk/backend@3.16.7`), `@clerk/nextjs@7`, `@clerk/clerk-react@5`, `@clerk/clerk-expo@2`, Vitest (`@cloudflare/vitest-pool-workers`).

**Spec:** `docs/superpowers/specs/2026-08-27-close-verification-gaps-design.md` (Phase 1).

## Global Constraints

- Node 22, pnpm 10. Work in worktree `/Users/home/Code/indiecrafts-verify-gaps` (branch `feat/harden-security-p1`, off `main` after P0).
- TDD: a failing test first for every behavior change; colocated `*.test.ts`.
- SQL always parameterized (`.bind`); never interpolate. Fail-closed on auth.
- Agent-authored text follows `.claude/rules/writing-style.md`. Commits end with `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
- Worker tests run via `@cloudflare/vitest-pool-workers`: `SELF.fetch(...)` for the full dispatch, or a direct `handleX(request, env, ctx?, buildAdapters, authenticate)` call with injected deps. `env` (real bound D1) comes from `cloudflare:test`.
- Run a package's tests with `pnpm --filter @indiecrafts/shared-api test` (worker) / `pnpm --filter @indiecrafts/packages-shared-compliance test`.

## Design decisions (locked)

- **D1 orders:** add optional `readonly notApplicable?: true` to `AdapterResult` + `AdapterPreview`. Only the `orders` adapter sets it. Backward-compatible (optional field).
- **D2 webhook:** extract `buildErasureAdapters(env, opts?)` into `code/shared/api/src/erasure/adapters.ts`, replacing the dupes in `confirm.ts` + `self.ts`. Webhook reads `user_profiles.email` before the pseudonymise UPDATE, keeps that UPDATE (immediate), and runs the full engine (Clerk excluded) via `ctx.waitUntil`.
- **D3 reverification:** worker enforces `fva[0]` ≤ `REVERIFY_MAX_MINUTES` (default 10) on `/v1/erasure/self`; returns a Clerk reverification-error 403 when stale. Web + hybrid wrap the submit in `useReverification`. Mobile relies on the server gate only (no client step-up; documented follow-up).

---

### Task 1: Make the `orders` adapter honest (D1)

**Files:**
- Modify: `code/packages/shared/compliance/src/shared/erasure.ts` (the `AdapterResult` + `AdapterPreview` types)
- Modify: `code/shared/api/src/erasure/orders.ts`
- Test: `code/shared/api/src/erasure/orders.test.ts` (create)

**Interfaces:**
- Produces: `AdapterResult`/`AdapterPreview` gain an optional `notApplicable?: true`.

- [ ] **Step 1: Write the failing test**

Create `code/shared/api/src/erasure/orders.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { createOrdersErasureAdapter } from "./orders";

describe("orders erasure adapter — honest no-op", () => {
  const a = createOrdersErasureAdapter();
  it("marks preview/anonymize/delete notApplicable (not silent empty success)", async () => {
    expect((await a.preview("x@y.z")).notApplicable).toBe(true);
    expect((await a.anonymize("x@y.z")).notApplicable).toBe(true);
    expect((await a.delete("x@y.z")).notApplicable).toBe(true);
  });
  it("still reports no match", async () => {
    expect((await a.findByEmail("x@y.z")).found).toBe(false);
  });
});
```

- [ ] **Step 2: Run it, verify it fails**

Run: `pnpm --filter @indiecrafts/shared-api test -- orders.test`
Expected: FAIL — `notApplicable` is `undefined`.

- [ ] **Step 3: Add the optional field to the types**

In `code/packages/shared/compliance/src/shared/erasure.ts`, add to `AdapterPreview` and `AdapterResult`:
```ts
export interface AdapterPreview {
  readonly store: string;
  readonly wouldAnonymize: Record<string, number>;
  readonly wouldDelete: Record<string, number>;
  readonly notApplicable?: true;
}
export interface AdapterResult {
  readonly store: string;
  readonly anonymized: Record<string, number>;
  readonly deleted: Record<string, number>;
  readonly notApplicable?: true;
}
```

- [ ] **Step 4: Set it in the orders adapter**

In `code/shared/api/src/erasure/orders.ts`, add `notApplicable: true` to the `preview`, `anonymize`, and `delete` return objects (keep the empty count records). Update the comment: the no-op now reports `notApplicable` so a receipt never reads it as a completed erasure.

- [ ] **Step 5: Run tests, verify pass**

Run: `pnpm --filter @indiecrafts/shared-api test -- orders.test` → PASS.
Then `pnpm --filter @indiecrafts/packages-shared-compliance test` → still green (optional field, no consumer breaks).

- [ ] **Step 6: Commit**
```bash
git add code/packages/shared/compliance/src/shared/erasure.ts code/shared/api/src/erasure/orders.ts code/shared/api/src/erasure/orders.test.ts
git commit -m "fix(erasure): orders adapter reports notApplicable, not silent success

The no-op orders adapter returned empty count objects, which a receipt
reads as a completed erasure. Add an optional notApplicable flag and set
it, so a GDPR receipt never claims orders were processed when no store exists.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: Worker auth-contract test (P1.4)

Lock the auth boundary before touching erasure: every mutating `/v1/*` route rejects an unauthenticated request. A new unguarded route fails this test.

**Files:**
- Test: `code/shared/api/src/auth-contract.test.ts` (create)

**Interfaces:**
- Consumes: the worker dispatch via `SELF.fetch` (`cloudflare:test`).

- [ ] **Step 1: Write the test**

Create `code/shared/api/src/auth-contract.test.ts`:
```ts
/// <reference types="@cloudflare/vitest-pool-workers" />
import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

// Every mutating /v1 route must reject an UNauthenticated request. A route that
// answers 2xx here is a hole. (Auth kinds differ — bearer / Clerk-JWT / Svill /
// Turnstile — so we assert "not success", i.e. status >= 400, no auth supplied.)
const MUTATING: Array<{ path: string; method: string; body?: string }> = [
  { path: "/v1/events", method: "POST", body: "{}" },
  { path: "/v1/settings", method: "PUT", body: "{}" },
  { path: "/v1/clerk-webhook", method: "POST", body: "{}" },
  { path: "/v1/data-request", method: "POST", body: "{}" },
  { path: "/v1/erasure/self", method: "POST", body: JSON.stringify({ email: "x@y.z" }) },
  { path: "/v1/export", method: "POST", body: JSON.stringify({ email: "x@y.z" }) },
];

describe("auth contract — mutating /v1 routes reject anonymous callers", () => {
  for (const r of MUTATING) {
    it(`${r.method} ${r.path} is not reachable unauthenticated`, async () => {
      const res = await SELF.fetch(`https://example.com${r.path}`, {
        method: r.method,
        headers: { "content-type": "application/json" },
        body: r.body,
      });
      expect(res.status, `${r.path} returned ${res.status}`).toBeGreaterThanOrEqual(400);
      expect(res.status).toBeLessThan(500 + 1); // 4xx/5xx both acceptable; 2xx is the failure
      expect(res.ok).toBe(false);
    });
  }
});
```
Note: `/v1/erasure/request` + `/v1/erasure/confirm` are public-by-design (Turnstile / token), so they are intentionally excluded — document that in a comment. `/v1/export/download` (GET, token-in-query) is likewise excluded.

- [ ] **Step 2: Run it**

Run: `pnpm --filter @indiecrafts/shared-api test -- auth-contract`
Expected: PASS on the current tree (all six already gated). If any route returns `ok:true`, that is a real hole — STOP and report.

- [ ] **Step 3: Commit**
```bash
git add code/shared/api/src/auth-contract.test.ts
git commit -m "test(api): auth-contract — mutating /v1 routes reject anonymous callers

check:api-guards scans Next route files only; the bare worker's /v1 routes
relied on convention. This locks it: every mutating /v1 route must answer >=400
without auth. A new unguarded route fails here.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: Pre-launch security checklist (P1.5)

**Files:**
- Modify: `code/docs/apps/web/config/security-hardening.md` (add a "Pre-launch checklist" section)

- [ ] **Step 1: Add the checklist**

Append a `## Pre-launch security checklist` section listing the operator steps that arm the default-off defenses: bind `RATE_LIMIT_KV` (`pnpm setup:web:website:kv`), set `TURNSTILE_SECRET` + `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, apply the Cloudflare zone (`pnpm infra:web:website:apply:prod`), configure Clerk (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY`) so the admin gate is live, and set `GDPR_FINGERPRINT_SALT` (identical across envs). State the default-install posture: until these are wired, public POST routes rely on body-cap + honeypot only, and the admin gate is open.

- [ ] **Step 2: Prettier-check + commit**
```bash
node_modules/.bin/prettier --check code/docs/apps/web/config/security-hardening.md   # from main checkout; --write if needed
git add code/docs/apps/web/config/security-hardening.md
git commit -m "docs(security): pre-launch checklist for the default-off defenses

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 4: Extract the adapter builder + full-engine erasure on Clerk delete (P1.2)

**Files:**
- Create: `code/shared/api/src/erasure/adapters.ts` (shared `buildErasureAdapters(env, opts?)`)
- Modify: `code/shared/api/src/erasure/confirm.ts`, `self.ts` (use the shared builder)
- Modify: `code/shared/api/src/index.ts` (webhook `user.deleted` branch)
- Test: `code/shared/api/src/erasure/adapters.test.ts` + a webhook test in `code/shared/api/src/index.test.ts`

**Interfaces:**
- Produces: `buildErasureAdapters(env: Env, opts?: { includeClerk?: boolean }): ErasureAdapter[]` (default `includeClerk: true`).

- [ ] **Step 1: Write the failing webhook test**

Add to `code/shared/api/src/index.test.ts` a test that a Svix-verified `user.deleted` event runs the full engine (assert the non-profile stores are touched — e.g. a seeded `session_events`/`consent_events` row for the user is gone/pseudonymised after the webhook). Use the existing Svix-signing helper pattern in that file (or sign with `CLERK_WEBHOOK_SECRET` from `env`). Assert the webhook still returns 200 immediately.

- [ ] **Step 2: Run it, verify it fails** — the extra stores survive today.

- [ ] **Step 3: Extract the shared builder**

Create `code/shared/api/src/erasure/adapters.ts`:
```ts
import type { ErasureAdapter } from "@indiecrafts/packages-shared-compliance/shared";
import { createCoreErasureAdapter } from "./core";
import { createAuditErasureAdapter } from "./audit";
import { createClerkErasureAdapter, createRealClerkClient } from "./clerk";
import { createSanityErasureAdapter, createRealSanityClient } from "./sanity";
import { createOrdersErasureAdapter } from "./orders";
import type { Env } from "../index";

/** The GDPR erasure adapter set. `includeClerk:false` for the Clerk-webhook path
 *  (the Clerk user is already deleted there). Mirrors the former inline lists in
 *  confirm.ts / self.ts. */
export function buildErasureAdapters(
  env: Env,
  opts: { includeClerk?: boolean } = {},
): ErasureAdapter[] {
  const includeClerk = opts.includeClerk ?? true;
  return [
    createCoreErasureAdapter(env.CORE_DB!, env.GDPR_FINGERPRINT_SALT!),
    createAuditErasureAdapter(env.DB!, env.CORE_DB!, env.GDPR_FINGERPRINT_SALT!),
    ...(includeClerk ? [createClerkErasureAdapter(createRealClerkClient(env.CLERK_SECRET_KEY!))] : []),
    createSanityErasureAdapter(
      createRealSanityClient({
        projectId: env.SANITY_PROJECT_ID!,
        dataset: env.SANITY_DATASET!,
        apiVersion: env.SANITY_API_VERSION ?? "2025-01-01",
        writeToken: env.SANITY_API_WRITE_TOKEN!,
        readToken: env.SANITY_API_READ_TOKEN,
      }),
      env.GDPR_FINGERPRINT_SALT!,
    ),
    createOrdersErasureAdapter(),
  ];
}
```
Confirm the exact factory import paths against `confirm.ts` L82–104 when implementing (module names may differ).

- [ ] **Step 4: Point confirm.ts + self.ts at the shared builder**

Replace the inline `defaultAdapters(env)` in `confirm.ts` (L82) and `self.ts` (L39) with `buildErasureAdapters(env)`. Run `pnpm --filter @indiecrafts/shared-api test` — the existing erasure tests must stay green (behavior unchanged).

- [ ] **Step 5: Run the full engine in the webhook**

In `code/shared/api/src/index.ts`, the `user.deleted` branch (≈L913): BEFORE the pseudonymise UPDATE, read the email:
```ts
const row = await env.CORE_DB.prepare(
  "SELECT email, email_fingerprint FROM user_profiles WHERE user_id = ?",
).bind(userId).first<{ email: string | null; email_fingerprint: string | null }>();
```
Keep the existing UPDATE. Then, if `row?.email`, run the full engine in the background (Clerk excluded — the user is already deleted):
```ts
if (row?.email) {
  const ts = new Date().toISOString();
  ctx.waitUntil(
    runErasure(buildErasureAdapters(env, { includeClerk: false }), row.email, {
      mode: "erase", dryRun: false, ts, fingerprint: row.email_fingerprint,
    }).catch((e) => logger.error("webhook erasure failed", { name: (e as Error)?.name })),
  );
}
```
Add the imports for `runErasure` and `buildErasureAdapters` to `index.ts`.

- [ ] **Step 6: Run tests, verify pass** — webhook test green; return-200-immediately preserved; existing erasure/confirm/self tests green.

- [ ] **Step 7: Commit** (adapters.ts + confirm.ts + self.ts + index.ts + tests) — message: `fix(erasure): out-of-band Clerk delete runs the full engine`.

---

### Task 5: Worker `fva` reverification gate on `/v1/erasure/self` (P1.3 worker)

**Files:**
- Modify: `code/shared/api/src/erasure/self.ts` (read `fva`, gate, return reverification error)
- Modify: `code/shared/api/src/index.ts` `Env` (add `REVERIFY_MAX_MINUTES?`)
- Test: `code/shared/api/src/erasure/self.test.ts` (add reverification cases)

**Interfaces:**
- Produces: a 403 reverification-error response shape Clerk's `useReverification` detects.

- [ ] **Step 1: Write failing tests**

In `self.test.ts`: (a) a token whose `fva[0]` exceeds the max returns 403 with the reverification-error body; (b) a fresh `fva` passes through to the erasure path. The `authenticate` param is injectable, so the test injects an auth result carrying a stale vs fresh `fva`. First, widen `SelfAuth` to carry `fva`.

- [ ] **Step 2: Read `fva` in `defaultAuthenticate`**

In `self.ts`, extend the claims cast and `SelfAuth`:
```ts
const payload = claims as { sub?: unknown; fva?: [number, number] };
// ...
return { userId, email, fva: Array.isArray(payload.fva) ? payload.fva : null };
```
`SelfAuth = { userId: string; email: string; fva: [number, number] | null }`.

- [ ] **Step 3: Gate on freshness + return the reverification error**

After `authenticate()` succeeds (self.ts ≈L164), before the erasure:
```ts
const maxMin = Number(env.REVERIFY_MAX_MINUTES ?? 10);
const firstAge = authed.fva ? authed.fva[0] : -1;
if (firstAge < 0 || firstAge > maxMin) {
  return json(
    { message: "Reverification required", reverification: true, /* Clerk-shaped */ },
    403, cors,
  );
}
```
Match the exact JSON body Clerk's `useReverification` expects (confirm against Clerk's `reverificationErrorResponse('strict')` shape while implementing — it is a 403 with a `clerk_error`/`reverification`-tagged body). Add `REVERIFY_MAX_MINUTES?: string` to `Env`.

- [ ] **Step 4: Run tests → pass.** Existing self tests still green (they inject a fresh/omitted `fva` → default to failing-closed OR passing per the chosen default; ensure the existing happy-path test supplies a fresh `fva`).

- [ ] **Step 5: Commit** — `feat(erasure): require fresh reverification (fva) for account self-delete`.

---

### Task 6: Wire `useReverification` on web + hybrid (P1.3 client) + mobile note

**Files:**
- Modify: `code/packages/shared/compliance/src/web/DeleteAccountSection.tsx` (accept a reverification-aware submit) OR the surface panels
- Modify: `code/projects/web/surfaces/{website,app}/src/user-interface/account/AccountDeletePanel.tsx`
- Modify: `code/projects/hybrid/surfaces/main/src/renderer/src/auth.tsx`
- Modify: `code/projects/mobile/surfaces/main/app/sign-in.tsx` (update the `@debt` comment — now server-gated)

- [ ] **Step 1: Wrap the delete submit in `useReverification`**

The shared `DeleteAccountSection` calls `submitAccountErasure` internally. To trigger step-up, the wrapping must happen where the Clerk hook is available (the surface panel). Pass a `beforeConfirm` (existing seam, L59) that calls a `useReverification`-wrapped no-op that forces step-up, OR lift the submit into the panel. Chosen approach: in `website` + `app` + `hybrid` panels, build `const submit = useReverification(() => submitAccountErasure(...))` and pass it down (add an optional `submit?` prop to `DeleteAccountSection`, defaulting to the internal `submitAccountErasure`). Web/app import from `@clerk/nextjs`; hybrid from `@clerk/clerk-react`.

- [ ] **Step 2: Update the mobile `@debt` comment**

In `mobile/.../sign-in.tsx`, replace the `@debt SECURITY` note: the account delete is now protected by the worker `fva` gate; client step-up is unavailable in `@clerk/clerk-expo@2`, so a stale-session user must re-authenticate manually. Keep it a `@debt` (documented follow-up), not a silent gap.

- [ ] **Step 3: tsc + story/interaction check**

Run `pnpm --filter @indiecrafts/web-surfaces-website tsc` and the compliance package tests. Confirm the panels still type-check with the new prop.

- [ ] **Step 4: Commit** — `feat(auth): step-up reverification on account delete (web + hybrid; mobile server-gated)`.

---

### Task 7: Close out P1

- [ ] **Step 1:** Log in the area changelogs at home altitude: `code/packages/CHANGELOG.md` (compliance `notApplicable` + `DeleteAccountSection` submit prop) and a coarse root roll-up bullet. Prettier-check.
- [ ] **Step 2:** Commit the changelogs.
- [ ] **Step 3:** Orchestrator tags P1 security items DONE in the review artifact (same URL): risks "Orders never erased", "Out-of-band Clerk delete", "Account self-delete no reverification", and the worker-guard-coverage item. Republish.

---

## Self-Review

**Spec coverage (Phase 1):** 1.1→Task 1 · 1.4→Task 2 · 1.5→Task 3 · 1.2→Task 4 · 1.3 worker→Task 5 · 1.3 client→Task 6. ✓
**Placeholder scan:** the two "confirm the exact Clerk error body / factory import paths while implementing" notes are real, bounded verifications with the source line refs given, not open placeholders.
**Type consistency:** `buildErasureAdapters(env, {includeClerk})` used identically in Tasks 4; `SelfAuth.fva` introduced in Task 5 Step 2 and consumed in Step 3; `AdapterResult.notApplicable` defined in Task 1 Step 3.

## Open item for the human (before Task 5/6)

- `REVERIFY_MAX_MINUTES` default (proposed **10**) and the **mobile UX caveat** (server-gated, no in-app step-up on `@clerk/clerk-expo@2`). Confirm or redirect.
