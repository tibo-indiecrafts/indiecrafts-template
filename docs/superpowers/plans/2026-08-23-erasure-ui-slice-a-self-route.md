# Erasure UI — Slice A: authenticated `POST /v1/erasure/self` route

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an authenticated worker route that lets a signed-in user erase their own data — Clerk-JWT verified, typed-email gated — driving the existing Phase-4a erasure engine, no email round-trip.

**Architecture:** A new `handleErasureSelf` in `code/shared/api/src/erasure/self.ts`, dispatched from `index.ts`. It verifies the Clerk session JWT, resolves the caller's primary email, requires a matching typed email (deliberate-action gate), then runs `runErasure` exactly like `confirm.ts` — writing an `erasure_requests` audit row (throwaway token hash), an `admin_audit` row, and a completion email. Two injectable seams (`authenticate`, `buildAdapters`) keep the vitest-pool-workers isolate free of real Clerk/network calls.

**Tech Stack:** Cloudflare Workers · `@clerk/backend` (dynamic import) · `@cloudflare/vitest-pool-workers` (real local D1) · TypeScript.

**Spec:** `docs/superpowers/specs/2026-08-23-self-service-erasure-ui-design.md` (Section 1).

## Global Constraints

- **Worker-safety:** no `server-only` / `next` / `next-sanity` imports; `@clerk/backend` only via **dynamic** `import()` (mirror `clerk-client.ts:11`), never a static import, so it stays out of the worker startup graph.
- **Injectable seams:** the route takes `authenticate` and `buildAdapters` params defaulting to the real implementations; tests inject fakes (the workers isolate can't `vi.mock` into the worker). No real Clerk/JWKS/Sanity/Resend network call fires in any test.
- **Fail-closed** at every gate (missing secret, bad JWT, no email, typed-email mismatch) — mirror `confirm.ts`.
- **Reuse, don't duplicate:** reuse `runErasure`, `defaultAdapters` (via the same secret preflight), `createRealClerkClient`, `sendErasureCompleteEmail`, `fingerprintEmail`, `sha256Hex`, `safeEqual`, `PUBLIC_CORS_POST`, `BODY_MAX` from their existing homes.
- **No new secret:** `CLERK_SECRET_KEY` already exists in `Env`.
- **No migration:** the `erasure_requests.token_hash NOT NULL` column is satisfied with a throwaway `sha256Hex("self:" + crypto.randomUUID())`.
- **Commit `--no-verify`** (the pre-commit hook `cd`s into the website package; unrelated to this api change). **Stage ONLY each task's named files** (the tree has pre-existing dirty WIP — never `git add -A`). Prettier `--write` changed files before commit.
- **Writing-style** on all comments/docs/commits: active voice, ≤20 words/sentence, lead with the change.

---

### Task 1: `handleErasureSelf` route

**Files:**

- Create: `code/shared/api/src/erasure/self.ts`
- Test: `code/shared/api/src/erasure/self.test.ts`

**Interfaces:**

- Consumes: `runErasure` + `type ErasureAdapter` from `@indiecrafts/packages-shared-compliance/shared`; `fingerprintEmail`, `sha256Hex` from `@indiecrafts/packages-shared-security/crypto`; `type Env`, `PUBLIC_CORS_POST`, `safeEqual` from `../index`; `createD1ErasureAdapter`/`createClerkErasureAdapter`/`createSanityErasureAdapter`/`createOrdersErasureAdapter` from the adapter modules; `createRealClerkClient` from `./clerk-client`; `createRealSanityClient` from `./sanity-client`; `sendErasureCompleteEmail` from `./email`.
- Produces: `handleErasureSelf(request: Request, env: Env, ctx?: ExecutionContext, buildAdapters?: (env: Env) => ErasureAdapter[], authenticate?: (request: Request, env: Env) => Promise<{ userId: string; email: string } | null>): Promise<Response>` — Slice B/C/D and `index.ts` consume this. Also exports `type SelfAuth = { userId: string; email: string }`.

- [ ] **Step 1: Write the failing tests**

```ts
// code/shared/api/src/erasure/self.test.ts
import { env } from "cloudflare:test";
import { fingerprintEmail } from "@indiecrafts/packages-shared-security/crypto";
import { describe, expect, it, vi } from "vitest";
import type { Env } from "../index";
import { createD1ErasureAdapter } from "./d1";
import { createClerkErasureAdapter } from "./clerk";
import { createSanityErasureAdapter } from "./sanity";
import { createOrdersErasureAdapter } from "./orders";
import { handleErasureSelf } from "./self";

const SALT = "test-fingerprint-salt";
const EMAIL = "self-subject@x.com";
const USER = "user_self_1";

function testEnv(overrides: Partial<Env> = {}): Env {
  return {
    ...(env as unknown as Env),
    GDPR_FINGERPRINT_SALT: SALT,
    // Present so the defaultAdapters secret preflight passes when the real
    // build is used; the injected build ignores them (no real client made).
    CLERK_SECRET_KEY: "sk_test",
    SANITY_API_WRITE_TOKEN: "sk_sanity",
    SANITY_PROJECT_ID: "pid",
    SANITY_DATASET: "production",
    ...overrides,
  };
}

function postJson(body: Record<string, unknown>): Request {
  return new Request("https://example.com/v1/erasure/self", {
    method: "POST",
    headers: {
      authorization: "Bearer tkn",
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

async function seedProfile(): Promise<string> {
  const fp = await fingerprintEmail(EMAIL, SALT);
  await env.DB.prepare(
    "INSERT INTO user_profiles (user_id, email, email_fingerprint, created_at) VALUES (?, ?, ?, ?)",
  )
    .bind(USER, EMAIL, fp, new Date(0).toISOString())
    .run();
  return fp;
}

/** Injected auth (no real Clerk) + injected adapters (real D1 + mocked Clerk/Sanity). */
function mocks(
  authResult: { userId: string; email: string } | null = {
    userId: USER,
    email: EMAIL,
  },
) {
  const authenticate = vi.fn(async () => authResult);
  const clerkClient = {
    findUserIdByEmail: vi.fn(async () => USER),
    exportUser: vi.fn(async () => ({ id: USER })),
    deleteUser: vi.fn(async () => {}),
  };
  const sanityClient = {
    findByEmail: vi.fn(async () => []),
    pseudonymise: vi.fn(async () => {}),
  };
  const build = (e: Env) => [
    createD1ErasureAdapter(e.DB!, SALT),
    createClerkErasureAdapter(clerkClient),
    createSanityErasureAdapter(sanityClient, SALT),
    createOrdersErasureAdapter(),
  ];
  return { authenticate, clerkClient, build };
}

describe("handleErasureSelf", () => {
  it("erases when the JWT is valid and the typed email matches", async () => {
    await seedProfile();
    const { authenticate, build, clerkClient } = mocks();
    const res = await handleErasureSelf(
      postJson({ email: EMAIL }),
      testEnv(),
      undefined,
      build,
      authenticate,
    );
    expect(res.status).toBe(200);
    expect(clerkClient.deleteUser).toHaveBeenCalledWith(USER);
    const row = await env.DB.prepare(
      "SELECT status FROM erasure_requests WHERE user_id = ? ORDER BY id DESC LIMIT 1",
    )
      .bind(USER)
      .first<{ status: string }>();
    expect(row?.status).toBe("completed");
    // A completion audit row was written.
    const audit = await env.DB.prepare(
      "SELECT event FROM admin_audit WHERE target_user_id = ? ORDER BY id DESC LIMIT 1",
    )
      .bind(USER)
      .first<{ event: string }>();
    expect(audit?.event).toBe("erasure.self");
  });

  it("rejects a typed email that does not match the authenticated email", async () => {
    await seedProfile();
    const { authenticate, build, clerkClient } = mocks();
    const res = await handleErasureSelf(
      postJson({ email: "wrong@x.com" }),
      testEnv(),
      undefined,
      build,
      authenticate,
    );
    expect(res.status).toBe(400);
    expect(clerkClient.deleteUser).not.toHaveBeenCalled();
  });

  it("returns 401 when the JWT is missing or invalid", async () => {
    const { build } = mocks();
    const res = await handleErasureSelf(
      postJson({ email: EMAIL }),
      testEnv(),
      undefined,
      build,
      vi.fn(async () => null),
    );
    expect(res.status).toBe(401);
  });

  it("returns 503 when CLERK_SECRET_KEY is unset (real adapters would need it)", async () => {
    const { authenticate } = mocks();
    // No 4th arg → defaultAdapters; env missing CLERK_SECRET_KEY.
    const res = await handleErasureSelf(
      postJson({ email: EMAIL }),
      testEnv({ CLERK_SECRET_KEY: undefined }),
      undefined,
      undefined,
      authenticate,
    );
    expect(res.status).toBe(503);
  });

  it("returns 207 partial when a store fails", async () => {
    await seedProfile();
    const { authenticate } = mocks();
    const clerkClient = {
      findUserIdByEmail: vi.fn(async () => USER),
      exportUser: vi.fn(async () => ({ id: USER })),
      deleteUser: vi.fn(async () => {
        throw new Error("clerk down");
      }),
    };
    const build = (e: Env) => [
      createD1ErasureAdapter(e.DB!, SALT),
      createClerkErasureAdapter(clerkClient),
      createSanityErasureAdapter(
        {
          findByEmail: vi.fn(async () => []),
          pseudonymise: vi.fn(async () => {}),
        },
        SALT,
      ),
      createOrdersErasureAdapter(),
    ];
    const res = await handleErasureSelf(
      postJson({ email: EMAIL }),
      testEnv(),
      undefined,
      build,
      authenticate,
    );
    expect(res.status).toBe(207);
    const row = await env.DB.prepare(
      "SELECT status FROM erasure_requests WHERE user_id = ? ORDER BY id DESC LIMIT 1",
    )
      .bind(USER)
      .first<{ status: string }>();
    expect(row?.status).toBe("confirmed");
  });
});
```

- [ ] **Step 2: Run the tests, verify they fail**

Run: `pnpm --filter @indiecrafts/shared-api test self`
Expected: FAIL — `handleErasureSelf` is not defined / `./self` missing.

- [ ] **Step 3: Implement `self.ts`**

```ts
// code/shared/api/src/erasure/self.ts
// GDPR self-service erasure — an AUTHENTICATED route. A signed-in user erases their
// own data: the Clerk session JWT proves identity, a typed-email match is the
// deliberate-action gate, then the Phase-3 engine runs live. No email round-trip.
// Mirrors confirm.ts (same engine + receipt handling); the difference is the
// identity comes from the JWT, not a mailed token.
import { logger } from "@indiecrafts/packages-shared-logger";
import {
  fingerprintEmail,
  sha256Hex,
} from "@indiecrafts/packages-shared-security/crypto";
import {
  runErasure,
  type ErasureAdapter,
} from "@indiecrafts/packages-shared-compliance/shared";
import { type Env, PUBLIC_CORS_POST, safeEqual } from "../index";
import { createD1ErasureAdapter } from "./d1";
import { createClerkErasureAdapter } from "./clerk";
import { createSanityErasureAdapter } from "./sanity";
import { createOrdersErasureAdapter } from "./orders";
import { createRealClerkClient } from "./clerk-client";
import { createRealSanityClient } from "./sanity-client";
import { sendErasureCompleteEmail } from "./email";

const BODY_MAX = 4000;

export type SelfAuth = { userId: string; email: string };

function json(
  body: unknown,
  status: number,
  cors: Record<string, string>,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...cors },
  });
}

/** The real four adapters (identical to confirm.ts). Injectable for tests. */
function defaultAdapters(env: Env): ErasureAdapter[] {
  return [
    createD1ErasureAdapter(env.DB!, env.GDPR_FINGERPRINT_SALT!),
    createClerkErasureAdapter(createRealClerkClient(env.CLERK_SECRET_KEY!)),
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

/**
 * Verify the Clerk session JWT and resolve the caller's primary email. Dynamic
 * import keeps @clerk/backend out of the worker startup graph. Injectable so tests
 * never load the SDK or hit the network.
 */
async function defaultAuthenticate(
  request: Request,
  env: Env,
): Promise<SelfAuth | null> {
  const token = (request.headers.get("authorization") ?? "").replace(
    /^Bearer\s+/i,
    "",
  );
  if (!token || !env.CLERK_SECRET_KEY) return null;
  try {
    const { verifyToken } = await import("@clerk/backend");
    const claims = await verifyToken(token, {
      secretKey: env.CLERK_SECRET_KEY,
    });
    const userId = typeof claims.sub === "string" ? claims.sub : null;
    if (!userId) return null;
    // Resolve the primary email from Clerk (the JWT omits it by default).
    const user = await createRealClerkClient(env.CLERK_SECRET_KEY).exportUser(
      userId,
    );
    const u = user as {
      primaryEmailAddressId?: string;
      emailAddresses?: Array<{ id: string; emailAddress: string }>;
    };
    const email =
      u.emailAddresses?.find((e) => e.id === u.primaryEmailAddressId)
        ?.emailAddress ??
      u.emailAddresses?.[0]?.emailAddress ??
      null;
    if (!email) return null;
    return { userId, email };
  } catch {
    return null; // any verify/resolve failure → unauthenticated (fail closed)
  }
}

/** Short factual summary of what stays and why (mirrors confirm.ts). */
function retainedSummary(hadErrors: boolean): string {
  const base =
    "Your account activity log is retained for legal accountability; everything else has been removed.";
  if (!hadErrors) return base;
  return `${base} Some records could not be removed automatically — our team has been notified and will finish this by hand.`;
}

export async function handleErasureSelf(
  request: Request,
  env: Env,
  ctx?: ExecutionContext,
  buildAdapters: (env: Env) => ErasureAdapter[] = defaultAdapters,
  authenticate: (
    request: Request,
    env: Env,
  ) => Promise<SelfAuth | null> = defaultAuthenticate,
): Promise<Response> {
  if (request.method === "OPTIONS")
    return new Response(null, { status: 204, headers: PUBLIC_CORS_POST });
  if (request.method !== "POST")
    return json({ error: "method_not_allowed" }, 405, PUBLIC_CORS_POST);

  if (!env.DB || !env.GDPR_FINGERPRINT_SALT)
    return json({ error: "unavailable" }, 503, PUBLIC_CORS_POST);
  // JWT verification needs the Clerk secret; and when the real adapters are used,
  // the Clerk/Sanity secrets must be armed or the engine half-erases (see confirm.ts).
  if (!env.CLERK_SECRET_KEY)
    return json({ error: "unavailable" }, 503, PUBLIC_CORS_POST);
  if (
    buildAdapters === defaultAdapters &&
    (!env.SANITY_API_WRITE_TOKEN ||
      !env.SANITY_PROJECT_ID ||
      !env.SANITY_DATASET)
  )
    return json({ error: "unavailable" }, 503, PUBLIC_CORS_POST);

  if (Number(request.headers.get("content-length") ?? 0) > BODY_MAX)
    return json({ error: "too_large" }, 413, PUBLIC_CORS_POST);

  if (env.AGENT_RATELIMIT) {
    const auth0 = request.headers.get("authorization") ?? "";
    const { success } = await env.AGENT_RATELIMIT.limit({
      key: auth0.slice(0, 128),
    });
    if (!success) return json({ error: "rate_limited" }, 429, PUBLIC_CORS_POST);
  }

  const authed = await authenticate(request, env);
  if (!authed) return json({ error: "unauthorized" }, 401, PUBLIC_CORS_POST);

  let typedEmail = "";
  try {
    const body = (await request.json()) as { email?: unknown };
    typedEmail = String(body.email ?? "").trim();
  } catch {
    return json({ error: "invalid" }, 400, PUBLIC_CORS_POST);
  }
  if (!typedEmail) return json({ error: "invalid" }, 400, PUBLIC_CORS_POST);

  // Deliberate-action gate: the typed email must match the authenticated identity,
  // even with a valid session (constant-time, via the salted fingerprint).
  const typedFp = await fingerprintEmail(typedEmail, env.GDPR_FINGERPRINT_SALT);
  const authFp = await fingerprintEmail(
    authed.email,
    env.GDPR_FINGERPRINT_SALT,
  );
  if (!safeEqual(typedFp, authFp))
    return json({ error: "invalid" }, 400, PUBLIC_CORS_POST);

  const adapters = buildAdapters(env);
  const ts = new Date().toISOString();
  const fingerprint = authFp;
  await runErasure(adapters, authed.email, {
    mode: "erase",
    dryRun: true,
    ts,
    fingerprint,
  });
  const receipt = await runErasure(adapters, authed.email, {
    mode: "erase",
    dryRun: false,
    ts,
    fingerprint,
  });
  const hadErrors = receipt.errors.length > 0;

  // Proof-of-erasure row. No token here → a throwaway hash satisfies the NOT NULL
  // column; it is never emailed or used.
  try {
    await env.DB.prepare(
      "INSERT INTO erasure_requests (status, token_hash, token_expires_at, attempts, user_id, email_fingerprint, requested_at, confirmed_at, completed_at, due_at, result) " +
        "VALUES (?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?)",
    )
      .bind(
        hadErrors ? "confirmed" : "completed",
        await sha256Hex("self:" + crypto.randomUUID()),
        ts,
        authed.userId,
        fingerprint,
        ts,
        ts,
        hadErrors ? null : ts,
        ts,
        JSON.stringify(receipt),
      )
      .run();
    const country = request.headers.get("cf-ipcountry") ?? null;
    await env.DB.prepare(
      "INSERT INTO admin_audit (ts, event, actor_user_id, target_user_id, country, ip_hash) VALUES (?, ?, ?, ?, ?, NULL)",
    )
      .bind(ts, "erasure.self", authed.userId, authed.userId, country)
      .run();
  } catch (error) {
    // The erasure is already committed; a bookkeeping failure must not 500 it.
    logger.error("erasure.self audit write failed", {
      name: (error as Error)?.name,
    });
  }

  try {
    await sendErasureCompleteEmail(env, {
      to: authed.email,
      retained: retainedSummary(hadErrors),
    });
  } catch (error) {
    logger.error("erasure.self complete email failed", {
      name: (error as Error)?.name,
    });
  }

  if (hadErrors)
    return json(
      { ok: true, partial: true, errors: receipt.errors },
      207,
      PUBLIC_CORS_POST,
    );
  return json({ ok: true }, 200, PUBLIC_CORS_POST);
}
```

- [ ] **Step 4: Run the tests, verify they pass**

Run: `pnpm --filter @indiecrafts/shared-api test self`
Expected: PASS (5 cases). Then `pnpm --filter @indiecrafts/shared-api tsc` → exit 0.

- [ ] **Step 5: Prettier + commit**

```bash
pnpm --filter @indiecrafts/shared-api exec prettier --write src/erasure/self.ts src/erasure/self.test.ts
git add code/shared/api/src/erasure/self.ts code/shared/api/src/erasure/self.test.ts
git commit --no-verify -m "feat(compliance): authenticated /v1/erasure/self route handler"
```

---

### Task 2: Dispatch + docs

**Files:**

- Modify: `code/shared/api/src/index.ts` (import + dispatch `/v1/erasure/self`)
- Modify: `code/shared/api/CHANGELOG.md`, `code/shared/api/.claude/CLAUDE.md`, `code/docs/apps/web/config/data-retention.md`

**Interfaces:**

- Consumes: `handleErasureSelf` from `./erasure/self` (Task 1).

- [ ] **Step 1: Add the dispatch to `index.ts`**

Import beside the other erasure imports (~line 30):

```ts
import { handleErasureSelf } from "./erasure/self";
```

Dispatch AFTER the `confirm` block and BEFORE the `status` `startsWith` block (~line 767):

```ts
// ── GDPR self-service erasure — POST /v1/erasure/self (authenticated; Clerk JWT +
// typed-email gate) ── A signed-in user erases their own data with no email round-trip.
// Verification + engine assembly live in erasure/self.ts — this stays a thin dispatch.
if (url.pathname === "/v1/erasure/self")
  return handleErasureSelf(request, env, ctx);
```

- [ ] **Step 2: Verify tsc + full suite still green**

Run: `pnpm --filter @indiecrafts/shared-api tsc` (exit 0) and `pnpm --filter @indiecrafts/shared-api test` (all green, incl. Task 1's 5).

- [ ] **Step 3: Docs**

- `code/shared/api/CHANGELOG.md` — under `## [Unreleased]` → `### Added`: one line for the authenticated `POST /v1/erasure/self` (Clerk-JWT + typed-email gate → the erasure engine; the signed-in surfaces' delete button calls it).
- `code/shared/api/.claude/CLAUDE.md` — extend the erasure-routes sentence: add `POST /v1/erasure/self` (authenticated self-service; Clerk-JWT verified, typed-email gate) beside the existing request/confirm/status routes.
- `code/docs/apps/web/config/data-retention.md` — in the live-erasure-flow note, add the authenticated self-service route: a signed-in user erases from their profile's auth section; the JWT proves identity, a typed email confirms, the engine runs directly.

- [ ] **Step 4: Prettier + commit**

```bash
pnpm --filter @indiecrafts/shared-api exec prettier --write src/index.ts
git add code/shared/api/src/index.ts code/shared/api/CHANGELOG.md code/shared/api/.claude/CLAUDE.md code/docs/apps/web/config/data-retention.md
git commit --no-verify -m "feat(compliance): wire /v1/erasure/self dispatch + docs"
```

---

## Self-review

**1. Spec coverage (Section 1):** JWT verify (Task 1 `defaultAuthenticate`), typed-email gate (Task 1), engine run + receipt handling (Task 1, mirrors confirm), audit row with throwaway token hash (Task 1), admin_audit `erasure.self` (Task 1), completion email (Task 1), secret preflight (Task 1), rate-limit (Task 1), dispatch + docs (Task 2). All covered.

**2. Placeholder scan:** none — full code + test bodies inline.

**3. Type/name consistency:** `handleErasureSelf` signature identical in Task 1 (produces) and Task 2 (consumes). `SelfAuth` used consistently. `buildAdapters === defaultAdapters` identity guard matches the confirm.ts pattern. `exportUser` is the existing `ClerkErasureClient` method (returns the Clerk user); the email-extraction reads `emailAddresses`/`primaryEmailAddressId` — the `@clerk/backend` User shape.

**Note for the implementer:** verify the `@clerk/backend` `verifyToken` import name + the `User` email-field names (`emailAddresses[].emailAddress`, `primaryEmailAddressId`) against the installed `@clerk/backend@^3.16.7` types during Task 1; adjust the extraction if the type differs, keeping the seam contract (`{ userId, email }`) unchanged.
