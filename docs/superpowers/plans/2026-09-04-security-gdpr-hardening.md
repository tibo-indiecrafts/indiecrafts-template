# §07 Security / GDPR Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the six §07 audit findings — the biggest being that an out-of-band Clerk user delete only partially erases, and self-service erasure has no step-up reverification.

**Architecture:** Consolidate the erasure adapters into one factory and drive the Clerk `user.deleted` webhook through the full `runErasure` engine (clerk adapter excluded); add server-side `fva` (factor-verification-age) enforcement to `self.ts` + client `useReverification` on every web self-service surface; make the GDPR salt per-env (guidance only); and close two test gaps.

**Tech Stack:** Cloudflare Workers (workerd) · TypeScript · vitest (`@cloudflare/vitest-pool-workers`) · React 19 · Clerk (`@clerk/backend@3.16.7`, `@clerk/nextjs`, `@clerk/clerk-react`) · pnpm + Turborepo.

**Spec:** `docs/superpowers/specs/2026-09-04-security-gdpr-hardening-design.md`

## Global Constraints

- **Native (mobile/hybrid) is `tsc`-checked only** — no on-device host here; never claim a native screen was runtime-verified.
- **Bricks never import an app; deps point down.** The api worker owns the erasure engine wiring; the compliance brick's `DeleteAccountSection` stays app-agnostic (copy + `beforeConfirm` injected).
- **Fail-closed preflights stay** — `confirm.ts`/`self.ts` keep their 503 when Clerk/Sanity secrets are absent; the factory must not change that behavior for them.
- **The erasure engine never throws** — per-adapter failures land in `receipt.errors`. The webhook path is best-effort (log errors, return 200).
- **`REVERIFY_WINDOW_MIN = 10`** (minutes) — the step-up freshness window.
- **Test framework is vitest**; api/cron tests run in workerd via `SELF.fetch` (integration) or direct function calls with injected adapters (unit). Follow the existing files (`engine.test.ts`, `index.test.ts`, cron `index.test.ts`).
- **The commit hook** runs repo-wide prettier + website `tsc` (~2 min) — expect it per commit.
- **NEVER stage** `code/shared/api/wrangler.toml` or `code/shared/cron/wrangler.toml` (dev-ID files, uncommitted by design). Use scoped `git add`.
- **Changelogs at home altitude:** `code/shared/api/CHANGELOG.md` (worker) + `code/shared/cron/CHANGELOG.md` (retention tests) + the surface changelogs for the client wiring.

---

### Task 1: `buildErasureAdapters` factory (consolidate the duplicated adapters)

**Files:**

- Create: `code/shared/api/src/erasure/adapters.ts`
- Create: `code/shared/api/src/erasure/adapters.test.ts`
- Modify: `code/shared/api/src/erasure/confirm.ts` (drop local `defaultAdapters`, import the factory)
- Modify: `code/shared/api/src/erasure/self.ts` (same)

**Interfaces:**

- Produces: `buildErasureAdapters(env: Env, opts?: { includeClerk?: boolean }): ErasureAdapter[]` — always `d1-core`, `d1-audit`, `orders`; `clerk` iff `opts.includeClerk !== false && env.CLERK_SECRET_KEY`; `sanity` iff `env.SANITY_API_WRITE_TOKEN && env.SANITY_PROJECT_ID && env.SANITY_DATASET`.

- [ ] **Step 1: Write the failing test**

`code/shared/api/src/erasure/adapters.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { buildErasureAdapters } from "./adapters";
import type { Env } from "../index";

const full = {
  CORE_DB: {},
  DB: {},
  GDPR_FINGERPRINT_SALT: "s",
  CLERK_SECRET_KEY: "sk",
  SANITY_API_WRITE_TOKEN: "w",
  SANITY_PROJECT_ID: "p",
  SANITY_DATASET: "d",
} as unknown as Env;

const names = (env: Env, opts?: { includeClerk?: boolean }) =>
  buildErasureAdapters(env, opts)
    .map((a) => a.name)
    .sort();

describe("buildErasureAdapters", () => {
  it("includes all five when every secret is present", () => {
    expect(names(full)).toEqual([
      "clerk",
      "d1-audit",
      "d1-core",
      "orders",
      "sanity",
    ]);
  });
  it("excludes clerk when includeClerk is false (webhook path)", () => {
    expect(names(full, { includeClerk: false })).not.toContain("clerk");
  });
  it("omits sanity when its secrets are absent (no broken client)", () => {
    const noSanity = {
      ...full,
      SANITY_API_WRITE_TOKEN: undefined,
    } as unknown as Env;
    expect(names(noSanity)).not.toContain("sanity");
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm --filter @indiecrafts/shared-api test -- adapters.test.ts`
Expected: FAIL (cannot find `./adapters`).

- [ ] **Step 3: Create the factory**

`code/shared/api/src/erasure/adapters.ts` — lift the body of `defaultAdapters` from `confirm.ts:83-104`, make `clerk`/`sanity` conditional:

```ts
import type { ErasureAdapter } from "@indiecrafts/packages-shared-compliance/shared";
import type { Env } from "../index";
import { createCoreErasureAdapter, createAuditErasureAdapter } from "./d1";
import { createClerkErasureAdapter } from "./clerk";
import { createSanityErasureAdapter } from "./sanity";
import { createOrdersErasureAdapter } from "./orders";
import { createRealClerkClient } from "./clerk-client";
import { createRealSanityClient } from "./sanity-client";

/**
 * The real erasure adapters assembled from `env` secrets. One home for the set used by
 * confirm.ts, self.ts, and the Clerk user.deleted webhook.
 * - `clerk` is included only when `includeClerk !== false` AND the secret is set — the
 *   webhook path (delete already done in Clerk) passes `{ includeClerk: false }`.
 * - `sanity` is included only when its secrets are all present, so we never construct a
 *   broken client (the webhook runs best-effort without a Sanity preflight).
 */
export function buildErasureAdapters(
  env: Env,
  opts: { includeClerk?: boolean } = {},
): ErasureAdapter[] {
  const list: ErasureAdapter[] = [
    createCoreErasureAdapter(env.CORE_DB!, env.GDPR_FINGERPRINT_SALT!),
    createAuditErasureAdapter(
      env.DB!,
      env.CORE_DB!,
      env.GDPR_FINGERPRINT_SALT!,
    ),
  ];
  if (opts.includeClerk !== false && env.CLERK_SECRET_KEY)
    list.push(
      createClerkErasureAdapter(createRealClerkClient(env.CLERK_SECRET_KEY)),
    );
  if (env.SANITY_API_WRITE_TOKEN && env.SANITY_PROJECT_ID && env.SANITY_DATASET)
    list.push(
      createSanityErasureAdapter(
        createRealSanityClient({
          projectId: env.SANITY_PROJECT_ID,
          dataset: env.SANITY_DATASET,
          apiVersion: env.SANITY_API_VERSION ?? "2025-01-01",
          writeToken: env.SANITY_API_WRITE_TOKEN,
          readToken: env.SANITY_API_READ_TOKEN,
        }),
        env.GDPR_FINGERPRINT_SALT!,
      ),
    );
  list.push(createOrdersErasureAdapter());
  return list;
}
```

- [ ] **Step 4: Repoint confirm.ts + self.ts**

In both, delete the local `defaultAdapters` function and its now-unused adapter imports (`createCoreErasureAdapter`, `createAuditErasureAdapter`, `createClerkErasureAdapter`, `createSanityErasureAdapter`, `createOrdersErasureAdapter`, `createRealClerkClient`, `createRealSanityClient`). Add `import { buildErasureAdapters } from "./adapters";` and change the `buildAdapters: (env: Env) => ErasureAdapter[] = defaultAdapters` default to `= buildErasureAdapters`. The two files' preflight 503s (they already require Clerk/Sanity secrets before running) keep their all-five behavior.

- [ ] **Step 5: Run tests**

Run: `pnpm --filter @indiecrafts/shared-api test`
Expected: PASS — the new `adapters.test.ts` (3) + the unchanged `engine.test.ts`, `confirm.test.ts`, `self.test.ts`, `export`/`data-request` tests (the factory produces the identical five for those callers).

- [ ] **Step 6: Commit**

```bash
git add code/shared/api/src/erasure/adapters.ts code/shared/api/src/erasure/adapters.test.ts \
  code/shared/api/src/erasure/confirm.ts code/shared/api/src/erasure/self.ts
git commit -m "refactor(api): one buildErasureAdapters factory (clerk/sanity conditional)"
```

---

### Task 2: Clerk `user.deleted` webhook → the full erasure engine (Fix 1)

**Files:**

- Create: `code/shared/api/src/erasure/clerk-deleted.ts` (the extracted handler)
- Create: `code/shared/api/src/erasure/clerk-deleted.test.ts`
- Modify: `code/shared/api/src/index.ts` (the `user.deleted` branch, ~923-933, calls the handler)

**Interfaces:**

- Consumes: `buildErasureAdapters` (Task 1), `runErasure`, `fingerprintEmail`.
- Produces: `handleClerkUserDeleted(env: Env, userId: string, ts: string, buildAdapters?: (env: Env) => ErasureAdapter[]): Promise<void>` — runs the engine (clerk excluded), pseudonymizes `user_profiles` via the engine, writes the `admin_audit erasure.clerk_deleted` row; falls back to the partial `UPDATE` when there is no profile/fingerprint.

- [ ] **Step 1: Write the failing test** (mirrors `engine.test.ts`'s injected-adapters + seeded-profile pattern)

`code/shared/api/src/erasure/clerk-deleted.test.ts`:

```ts
import { env } from "cloudflare:test";
import { describe, expect, it, vi } from "vitest";
import { fingerprintEmail } from "@indiecrafts/packages-shared-security/crypto";
import { createCoreErasureAdapter, createAuditErasureAdapter } from "./d1";
import { createSanityErasureAdapter } from "./sanity";
import { createOrdersErasureAdapter } from "./orders";
import { handleClerkUserDeleted } from "./clerk-deleted";

const SALT = "wh-salt";
const EMAIL = "gone@x.com";
const USER = "user_gone";

// Adapters WITHOUT clerk (the webhook path) — d1 real, sanity mocked.
function webhookAdapters() {
  const sanity = createSanityErasureAdapter(
    { findByEmail: vi.fn(async () => []), pseudonymise: vi.fn(async () => {}) },
    SALT,
  );
  return [
    createCoreErasureAdapter(env.CORE_DB, SALT),
    createAuditErasureAdapter(env.DB, env.CORE_DB, SALT),
    sanity,
    createOrdersErasureAdapter(),
  ];
}

describe("handleClerkUserDeleted", () => {
  it("runs the full engine minus clerk and pseudonymizes the profile + audits it", async () => {
    (
      env as unknown as { GDPR_FINGERPRINT_SALT: string }
    ).GDPR_FINGERPRINT_SALT = SALT;
    const fp = await fingerprintEmail(EMAIL, SALT);
    await env.CORE_DB.prepare(
      "INSERT INTO user_profiles (user_id, email, email_fingerprint, created_at) VALUES (?, ?, ?, ?)",
    )
      .bind(USER, EMAIL, fp, new Date(0).toISOString())
      .run();

    await handleClerkUserDeleted(
      env as never,
      USER,
      "2026-01-01T00:00:00.000Z",
      () => webhookAdapters(),
    );

    const prof = await env.CORE_DB.prepare(
      "SELECT anonymized FROM user_profiles WHERE user_id = ?",
    )
      .bind(USER)
      .first<{ anonymized: number }>();
    expect(prof?.anonymized).toBe(1); // engine's d1-core pseudonymized it

    const audit = await env.DB.prepare(
      "SELECT event FROM admin_audit WHERE event = 'erasure.clerk_deleted' AND target_user_id = ?",
    )
      .bind(USER)
      .first<{ event: string }>();
    expect(audit?.event).toBe("erasure.clerk_deleted");
  });

  it("falls back to a partial pseudonymize when there is no profile row", async () => {
    await handleClerkUserDeleted(
      env as never,
      "user_no_profile",
      "2026-01-01T00:00:00.000Z",
      () => webhookAdapters(),
    );
    // No throw; nothing to key the engine on. (Assert it did not create an audit row.)
    const audit = await env.DB.prepare(
      "SELECT event FROM admin_audit WHERE target_user_id = 'user_no_profile'",
    ).first();
    expect(audit).toBeNull();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm --filter @indiecrafts/shared-api test -- clerk-deleted.test.ts`
Expected: FAIL (cannot find `./clerk-deleted`).

- [ ] **Step 3: Write `clerk-deleted.ts`**

```ts
import { logger } from "@indiecrafts/packages-shared-logger";
import {
  runErasure,
  type ErasureAdapter,
} from "@indiecrafts/packages-shared-compliance/shared";
import type { Env } from "../index";
import { buildErasureAdapters } from "./adapters";

/**
 * Out-of-band Clerk deletion → the full erasure engine (clerk adapter excluded — the user
 * is already gone in Clerk). Reads the stored email + fingerprint BEFORE the engine
 * pseudonymizes the profile (Clerk's user.deleted payload carries no email). Best-effort:
 * the engine never throws; per-adapter failures land in receipt.errors (logged). No
 * completion email — the subject is deleted. `buildAdapters` is injectable for tests.
 */
export async function handleClerkUserDeleted(
  env: Env,
  userId: string,
  ts: string,
  buildAdapters: (env: Env) => ErasureAdapter[] = (e) =>
    buildErasureAdapters(e, { includeClerk: false }),
): Promise<void> {
  if (!env.CORE_DB || !env.DB || !env.GDPR_FINGERPRINT_SALT) return;

  const profile = await env.CORE_DB.prepare(
    "SELECT email, email_fingerprint FROM user_profiles WHERE user_id = ?",
  )
    .bind(userId)
    .first<{ email: string | null; email_fingerprint: string | null }>();

  // No profile / no fingerprint → nothing to key the engine on. Fall back to the partial
  // pseudonymize (the prior behavior) so a delete for an unsynced user still marks the row.
  if (!profile?.email_fingerprint) {
    await env.CORE_DB.prepare(
      "UPDATE user_profiles SET email = ?, full_name = ?, deleted_at = ?, anonymized = 1 WHERE user_id = ?",
    )
      .bind(`deleted_${userId}@anonymized.local`, "Deleted User", ts, userId)
      .run();
    return;
  }

  const adapters = buildAdapters(env);
  const email = profile.email ?? `deleted_${userId}@anonymized.local`;
  const fingerprint = profile.email_fingerprint;
  await runErasure(adapters, email, {
    mode: "erase",
    dryRun: true,
    ts,
    fingerprint,
  });
  const receipt = await runErasure(adapters, email, {
    mode: "erase",
    dryRun: false,
    ts,
    fingerprint,
  });
  if (receipt.errors.length)
    logger.error("clerk-deleted erasure partial", {
      count: receipt.errors.length,
    });

  // Proof-of-erasure + audit (mirrors self.ts). No email — the subject is gone.
  try {
    await env.DB.prepare(
      "INSERT INTO admin_audit (ts, event, actor_user_id, target_user_id, country, ip_hash) VALUES (?, ?, ?, ?, NULL, NULL)",
    )
      .bind(ts, "erasure.clerk_deleted", userId, userId)
      .run();
  } catch (error) {
    logger.error("clerk-deleted audit write failed", {
      name: (error as Error)?.name,
    });
  }
}
```

- [ ] **Step 4: Wire the webhook branch**

In `index.ts`, in the `user.deleted` branch (currently the partial `UPDATE user_profiles` at ~923-933), replace the `UPDATE` with a call: `await handleClerkUserDeleted(env, userId, now);` (import `handleClerkUserDeleted` from `./erasure/clerk-deleted`). Leave the `user.created`/`user.updated` upsert branch (the `else`) unchanged. Keep the surrounding try/catch (a failure still returns 502 so Clerk retries).

- [ ] **Step 5: Run tests**

Run: `pnpm --filter @indiecrafts/shared-api test`
Expected: PASS (clerk-deleted.test.ts + the unchanged suite).

- [ ] **Step 6: Commit**

```bash
git add code/shared/api/src/erasure/clerk-deleted.ts code/shared/api/src/erasure/clerk-deleted.test.ts code/shared/api/src/index.ts
git commit -m "feat(api): Clerk user.deleted runs the full erasure engine (clerk adapter excluded)"
```

---

### Task 3: Verify the Clerk `fva` + `useReverification` contract (Fix 2a — investigation)

**Files:** none changed. Deliverable is a documented contract used by Tasks 4 + 5.

- [ ] **Step 1: Read the installed Clerk types + docs**

Investigate, in `node_modules`:

- `@clerk/backend@3.16.7` — how the verified session token exposes the **`fva`** claim (name/shape; Clerk emits `[firstFactorAgeMinutes, secondFactorAgeMinutes]`, `-1` = N/A). Confirm the claim key on the object `verifyToken` returns. Is there a `reverificationError()` helper (or a documented response shape) the server returns to signal step-up?
- `@clerk/nextjs` and `@clerk/clerk-react` — the **`useReverification`** hook: what it wraps, and exactly which error/response from the wrapped call triggers its modal (the app panel's `@debt` comment says a `session_reverification_required` error). Confirm the error shape it recognizes.

- [ ] **Step 2: Write the contract to the report**

Document, precisely: (a) the `fva` claim key + type as seen by `verifyToken`; (b) the exact server response that `useReverification` recognizes as reverification-required (helper name / status + body); (c) the client call shape — does `useReverification` wrap the erasure fetch itself, or a pre-flight? Record whether the design (server emits the recognized signal on stale `fva`; client wraps the erasure submit) is confirmed, or note the adjusted approach.

- [ ] **Step 3: Ruling if the contract is materially more involved**

If the mechanism cannot be a claim-read + a hook-wrap (e.g. it needs a Clerk-hosted reverification route, or the worker can't produce the recognized signal), STOP and report — per the spec, Fix 2 then becomes its own follow-up and Tasks 7-10 (the other fixes) proceed. Otherwise, record the confirmed contract and continue to Task 4.

---

### Task 4: Server-side `fva` enforcement in `self.ts` (Fix 2b)

**Files:**

- Modify: `code/shared/api/src/erasure/self.ts` (`defaultAuthenticate` + the handler)
- Modify: `code/shared/api/src/erasure/self.test.ts` (add the step-up cases)

**Interfaces:**

- Consumes: Task 3's contract (the `fva` claim key + the reverification-required response shape).
- Produces: `self.ts` returns the reverification-required response when the first-factor age is absent or `> REVERIFY_WINDOW_MIN` (10), before the engine runs. `SelfAuth` gains `fvaMinutes: number | null`.

- [ ] **Step 1: Write the failing test**

Add to `self.test.ts` (using the injectable `authenticate` seam already in `handleErasureSelf`):

```ts
it("returns reverification-required when the first-factor age is stale", async () => {
  const staleAuth = async () => ({
    userId: "u1",
    email: "a@x.com",
    fvaMinutes: 45,
  });
  const res = await handleErasureSelf(
    reqWithEmail("a@x.com"),
    env as never,
    undefined,
    () => [/* no-op adapters */],
    staleAuth,
  );
  expect(res.status).toBe(403); // or the exact status from Task 3's contract
  // assert the body matches the reverification-required shape from Task 3
});

it("proceeds when the first-factor age is fresh", async () => {
  const freshAuth = async () => ({
    userId: "u1",
    email: "a@x.com",
    fvaMinutes: 2,
  });
  // ...assert it runs the engine (200/207), not a 403
});
```

(Use the existing `self.test.ts` helpers for the request + adapters; the exact status/body come from Task 3.)

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm --filter @indiecrafts/shared-api test -- self.test.ts`
Expected: FAIL (no fva enforcement yet).

- [ ] **Step 3: Implement**

- `SelfAuth` → `{ userId: string; email: string; fvaMinutes: number | null }`.
- In `defaultAuthenticate`, read the `fva` claim (per Task 3) from the verified `claims`; set `fvaMinutes = fva?.[0] ?? null` (or the Task-3 key).
- In `handleErasureSelf`, after `authenticate` succeeds and BEFORE running the engine, add: `const REVERIFY_WINDOW_MIN = 10;` and if `authed.fvaMinutes === null || authed.fvaMinutes < 0 || authed.fvaMinutes > REVERIFY_WINDOW_MIN` → return the reverification-required response (the exact shape from Task 3 — e.g. `reverificationError()` serialized, or a 403 with the recognized body).

- [ ] **Step 4: Run tests**

Run: `pnpm --filter @indiecrafts/shared-api test -- self.test.ts`
Expected: PASS (stale → reverification response; fresh → proceeds).

- [ ] **Step 5: Commit**

```bash
git add code/shared/api/src/erasure/self.ts code/shared/api/src/erasure/self.test.ts
git commit -m "feat(api): self-service erasure enforces Clerk fva step-up (10-min window)"
```

---

### Task 5: Client `useReverification` on website + app + hybrid (Fix 2c)

**Files:**

- Modify: `code/projects/web/surfaces/website/src/user-interface/account/AccountDeletePanel.tsx`
- Modify: `code/projects/web/surfaces/app/src/user-interface/account/AccountDeletePanel.tsx`
- Modify: `code/projects/hybrid/surfaces/main/src/renderer/src/auth.tsx`

**Interfaces:**

- Consumes: Task 3's contract; Task 4's server response; `DeleteAccountSection`'s `beforeConfirm?: () => Promise<boolean>` / injectable submit seam.

- [ ] **Step 1: Wire reverification per Task 3's confirmed shape**

For each panel (website + app use `@clerk/nextjs`; hybrid uses `@clerk/clerk-react` — both export `useReverification`): wrap the erasure submit so a `session_reverification_required` response from `POST /v1/erasure/self` triggers Clerk's modal + retry, per Task 3. If Task 3 confirmed `useReverification` must wrap the erasure fetch, thread the wrapped submit into `DeleteAccountSection` (via `beforeConfirm` that triggers reverification, or an injected submit — whichever Task 3 established). Replace each file's `@debt SECURITY` comment (website + app `AccountDeletePanel.tsx`, and any in hybrid `auth.tsx`) with a one-line note that step-up is now wired.

- [ ] **Step 2: Typecheck the three surfaces**

Run: `pnpm --filter @indiecrafts/web-surfaces-website --filter @indiecrafts/web-surfaces-app --filter @indiecrafts/hybrid-surfaces-main tsc`
Expected: PASS. (Native/renderer is tsc-only; the reverification UX is validated on-device by the developer.)

- [ ] **Step 3: Commit**

```bash
git add code/projects/web/surfaces/website/src/user-interface/account/AccountDeletePanel.tsx \
  code/projects/web/surfaces/app/src/user-interface/account/AccountDeletePanel.tsx \
  code/projects/hybrid/surfaces/main/src/renderer/src/auth.tsx
git commit -m "feat(website,app,hybrid): step-up reverification on self-service delete"
```

---

### Task 6: Mobile `@debt` note + orders wording (Fix 2d + Fix 6)

**Files:**

- Modify: `code/projects/mobile/surfaces/main/app/account.tsx` (the delete `@debt` comment)
- Modify: `code/shared/api/src/erasure/orders.ts` (one-line clarifying comment)

- [ ] **Step 1: Update the mobile comment**

Replace mobile's delete `@debt SECURITY` comment with: step-up is now **server-enforced** (`self.ts` requires a fresh Clerk `fva`); `@clerk/clerk-expo` has no `useReverification`, so a stale-`fva` mobile user's remedy is to sign out and sign back in (which refreshes `fva`) before deleting — a documented limitation, not an unguarded path.

- [ ] **Step 2: Clarify the orders comment**

In `orders.ts`, adjust the header comment so it reads plainly as a registered **no-op stub** (no orders store exists yet; there is no `notApplicable` result type — every method returns empty `anonymized`/`deleted`). No behavior change.

- [ ] **Step 3: Typecheck + commit**

Run: `pnpm --filter @indiecrafts/mobile-surfaces-main tsc` — PASS.

```bash
git add code/projects/mobile/surfaces/main/app/account.tsx code/shared/api/src/erasure/orders.ts
git commit -m "docs(mobile,api): mobile step-up limitation + orders no-op-stub wording"
```

---

### Task 7: Distinct GDPR salt per environment (Fix 3 — guidance)

**Files:**

- Modify: `code/shared/scripts/infra/gdpr-salt.mjs` (the header "Rule" + usage note)
- Modify: `code/shared/api/wrangler.toml` (the `GDPR_FINGERPRINT_SALT` comment)
- Modify: `code/shared/api/.claude/CLAUDE.md` (the "identical across envs" clause)
- Modify: any `code/docs` page repeating the shared-salt rule (grep `identical across` under `code/docs`)

- [ ] **Step 1: Rewrite the rule**

In `gdpr-salt.mjs:11`, change "Rule: ONE salt per purpose, IDENTICAL across all envs, never committed." to: "Rule: a DISTINCT, independently-generated salt per environment; STABLE within an env (rotating it breaks every email-keyed erasure/consent lookup — never rotate a live one); never committed. Generate + set a separate value for dev, staging, and prod." Update the usage comment so `gdpr:salt:set:<env>` is documented as setting a per-env value.

- [ ] **Step 2: Update wrangler.toml + brief + docs**

In `code/shared/api/wrangler.toml`, change the `GDPR_FINGERPRINT_SALT` comment ("identical across envs") to the per-env rule. In `code/shared/api/.claude/CLAUDE.md`, change "email fingerprint salt, identical across envs — see wrangler.toml" to "email fingerprint salt, DISTINCT per env (stable within an env) — see wrangler.toml". Fix any matching `code/docs` line.

- [ ] **Step 3: Confirm no code enforces the old rule + commit**

Run: `grep -rn "identical across" code/shared code/docs` → only historical changelog lines remain (leave those).

```bash
git add code/shared/scripts/infra/gdpr-salt.mjs code/shared/api/wrangler.toml code/shared/api/.claude/CLAUDE.md code/docs
git commit -m "docs(gdpr): distinct GDPR salt per env (stable within env), not shared"
```

(Do NOT stage `code/shared/api/wrangler.toml` if it shows the dev-ID modification — stage only the comment change; if the file already has uncommitted dev-IDs, edit the comment and `git add -p` just that hunk.)

---

### Task 8: `/v1` auth-contract test (Fix 4)

**Files:**

- Modify: `code/shared/api/src/index.test.ts` (add a table-driven describe block)

- [ ] **Step 1: Write the test** (generalizes the existing `401s /v1/security` cases)

Add to `index.test.ts`:

```ts
describe("/v1 auth contract — bearer-gated mutating routes reject anon", () => {
  it.each([
    ["POST", "/v1/events"],
    ["PUT", "/v1/settings"],
    ["POST", "/v1/data-request"],
    ["POST", "/v1/export"],
    ["GET", "/v1/sessions"],
    ["GET", "/v1/security"],
    ["GET", "/v1/csp-reports"],
  ])("%s %s → 401 without a bearer", async (method, path) => {
    const res = await SELF.fetch(`https://api.test${path}`, {
      method,
      ...(method === "POST" || method === "PUT"
        ? { headers: { "content-type": "application/json" }, body: "{}" }
        : {}),
    });
    // Bearer-gated routes 401 anon. A route that binding-preflights (e.g. 503) is
    // acceptable ONLY if documented; /v1/events must 401 (it has no such preflight).
    expect([401, 503]).toContain(res.status);
    if (path === "/v1/events") expect(res.status).toBe(401);
  });
});
```

NOTE: the deliberately-public routes (`POST /v1/erasure/request`, `/confirm`, `GET /v1/erasure/status/:token`) are intentionally excluded — they are Turnstile/token-gated, not bearer-gated.

- [ ] **Step 2: Run it**

Run: `pnpm --filter @indiecrafts/shared-api test -- index.test.ts`
Expected: PASS. If `POST /v1/events` does NOT 401 anon, that is a real bug — STOP and report (the audit's whole point).

- [ ] **Step 3: Commit**

```bash
git add code/shared/api/src/index.test.ts
git commit -m "test(api): /v1 auth-contract — every bearer-gated mutating route rejects anon"
```

---

### Task 9: Retention purge integration tests for the 4 uncovered tables (Fix 5)

**Files:**

- Modify: `code/shared/cron/src/index.test.ts`

- [ ] **Step 1: Add a purge test per table** (mirror the existing `csp_reports`/`data_requests` pattern: seed one row past the cutoff + one fresh, run the tick, assert old purged + fresh survives)

Add a describe block covering `admin_audit`, `session_events`, `security_events` (all on `env.DB`, 90-day cutoff on `ts`) and `consent_events` (on `env.CORE_DB`, 1095-day cutoff on `ts`). Use `NOW = Date.UTC(2026, 0, 15)`, `old = NOW - 200*86_400_000` (past 90d and 1095d... use `NOW - 100d` for the 90d tables and `NOW - 1200d` for consent), `fresh = NOW - 1d`, and the `runTick` helper already in the file. For each table, seed via its real columns — read the migration under `code/shared/api/db/{audit,core}/migrations/` for the exact column list if an INSERT errors (known shapes: `admin_audit(ts,event,actor_user_id,target_user_id,country,ip_hash)`, `security_events(ts,event_type,severity,surface,user_id,country,ip_hash,description)`, `consent_events(ts,subject_type,subject_id,email_fingerprint,consent_type,granted,policy_version,surface,source,country,ip_hash,idempotency_key)`; confirm `session_events` from its migration). Assert the old row is gone and the fresh row survives (query by a unique seeded value).

- [ ] **Step 2: Run it**

Run: `pnpm --filter @indiecrafts/shared-cron test`
Expected: PASS (4 new purge tests + the existing suite). If a table's purge does NOT respect the cutoff, STOP and report (a real retention bug).

- [ ] **Step 3: Commit**

```bash
git add code/shared/cron/src/index.test.ts
git commit -m "test(cron): retention purge integration tests for the 4 uncovered tables"
```

---

### Task 10: Verify + changelogs + ledger

**Files:**

- Modify: `code/shared/api/CHANGELOG.md`, `code/shared/cron/CHANGELOG.md`, + the website/app/hybrid/mobile changelogs (their step-up wiring)
- Modify: the Test Ledger §07 (the artifact) — statuses + the orders wording

- [ ] **Step 1: Full gates**

Run: `pnpm tsc` (all) · `pnpm test` (api + cron + compliance + surfaces) · `pnpm check:api-guards && pnpm check:typed-routing && pnpm check:tasks`.
Expected: all green.

- [ ] **Step 2: Changelogs**

- `code/shared/api/CHANGELOG.md`: the webhook→full-engine fix, the `buildErasureAdapters` consolidation, the self-service `fva` step-up, the `/v1` auth-contract test, the per-env-salt guidance.
- `code/shared/cron/CHANGELOG.md`: the 4 retention purge tests.
- website/app/hybrid changelogs: the client step-up wiring; mobile: the documented limitation.

- [ ] **Step 3: Update the ledger §07**

Reflect: Guard adoption → Partial closed (the `/v1` auth-contract test now covers `/v1/events`); GDPR erasure → the out-of-band-delete gap + `fva` step-up now closed (website/app/hybrid; mobile documented); Consent/retention → the 4 purge tests added, the salt now per-env; orders wording corrected.

- [ ] **Step 4: Commit**

```bash
git add code/shared/api/CHANGELOG.md code/shared/cron/CHANGELOG.md code/projects/**/CHANGELOG.md
git commit -m "docs: changelogs + ledger for the §07 security/GDPR hardening"
```

---

## Self-Review notes (author)

- **Spec coverage:** Fix 1 (Tasks 1-2) · Fix 2 (Tasks 3 verify → 4 server → 5 client → 6 mobile note) · Fix 3 (Task 7) · Fix 4 (Task 8) · Fix 5 (Task 9) · Fix 6 (Task 6) · verify/docs (Task 10). All spec sections covered.
- **The one genuine unknown (Clerk `fva`/`useReverification`) is isolated in Task 3**, whose documented contract pins the exact bits in Tasks 4-5. Task 3's ruling step splits Fix 2 out if the mechanism can't be a claim-read + hook-wrap.
- **Type consistency:** `buildErasureAdapters(env, { includeClerk? })` and `handleClerkUserDeleted(env, userId, ts, buildAdapters?)` and `SelfAuth.fvaMinutes` are defined once (Tasks 1, 2, 4) and consumed consistently.
- **Native validation limit:** Tasks 5, 6 end at `tsc` — mobile/hybrid have no host here; the reverification UX is the developer's on-device check.
