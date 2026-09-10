# Compliance Layer — Phase 4a (Live Erasure Flow) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make token-confirmed erasure actually work end-to-end — a public request that emails a single-use token, a typed-email + TTL + attempt-limited confirm that runs the Phase 3 engine against **real** Clerk/Sanity/D1, and a status endpoint — all on the api worker.

**Architecture:** New `erasure_requests` D1 table + a `sha256Hex` token-hash helper. Real implementations of the Phase 3 `ClerkErasureClient` (via `import("@clerk/backend")` + `CLERK_SECRET_KEY`) and `SanityErasureClient` (raw-HTTP GROQ read + `/data/mutate` write + `SANITY_API_WRITE_TOKEN`). A worker email helper (inline Resend HTTP + `RESEND_API_KEY`; the `web/email` brick is `server-only`). Three routes on the api worker: `POST /v1/erasure/request` (anti-enumeration: look up the email, and only if found create the row + single-use token + email the token link; always respond generically), `GET|POST /v1/erasure/confirm` (GET renders a typed-email form, POST verifies token_hash + email fingerprint + TTL + attempts → dry-run preview → `runErasure` live → receipt + admin_audit + completion email), `GET /v1/erasure/status/:token`. Request + confirm are public (token-gated), Turnstile + rate-limit + attempt-limited. The token link points at the worker's own origin (derived from the request URL) — no web-surface UI.

**Tech Stack:** Cloudflare Workers + D1, TypeScript strict, Web Crypto, `@clerk/backend`, Resend HTTP, Sanity HTTP API, vitest `@cloudflare/vitest-pool-workers`.

**Spec:** `docs/superpowers/specs/2026-08-23-gdpr-compliance-layer-design.md` (§8.2 identity verification, §8.3 erasure flow, §10 API, §11 emails, §6.2 erasure_requests)

**Builds on:** Phase 3 erasure engine (`code/shared/api/src/erasure/` + `runErasure`), Phase 1 (`fingerprintEmail`, `user_profiles`). Branch tip: `731d6653`.

## Global Constraints

- **Anti-enumeration (spec §8.2):** `/v1/erasure/request` responds identically whether or not the email exists ("if that address is in our records, you'll get a link"). It emails a token ONLY when the subject is found (never an open relay to arbitrary addresses).
- **Token security:** the token is high-entropy (`crypto.randomUUID()`); store only its `sha256Hex` (never plaintext). Confirm requires the token AND a typed email whose `fingerprintEmail` matches the row's `email_fingerprint`, within `token_expires_at` (TTL), under an `attempts` cap. Compare hashes with the existing constant-time `safeEqual`.
- **POST-only mutation / prefetch-safe:** `GET /v1/erasure/confirm` only renders the form (read-only); the erasure runs only on `POST` (mirrors the blog moderation route — defeats link scanners). Single-use: on completion set `status = "completed"`, so a replay finds no actionable row.
- **The engine never throws:** `runErasure` collects per-adapter failures into `receipt.errors`. The confirm route MUST inspect `receipt.errors` and reflect partial failure in the response + stored `result` — never report success blindly.
- **Live erasure runs both passes:** a `dryRun:true` preview first (stored/loggable), then the `dryRun:false` live run. `ts` is injected (`new Date().toISOString()`); `fingerprint` is the row's `email_fingerprint`.
- **Worker-only:** the api is a bare Worker — no `server-only`/`next-sanity` imports (`writeClient`, `web/email` `sendEmail`, `withGuard`, `verifyTurnstile` are all `server-only`). Inline the Resend POST, the Sanity mutate POST, and the Turnstile siteverify POST (reading secrets off `env`, not `process.env`).
- **New `Env` secrets:** `CLERK_SECRET_KEY`, `SANITY_API_WRITE_TOKEN`, `RESEND_API_KEY`, `TURNSTILE_SECRET`, `EMAIL_FROM` (the token/completion sender). Add `@clerk/backend` to `code/shared/api/package.json` dependencies. Secrets are operator-set — no values committed; the build/tests never fire a real Clerk/Sanity/Resend call (mocked/injected).
- **Migrations forward-only** (`0004_*.sql`); the harness auto-applies. Commits `--no-verify`; `prettier --write` first; stage only each task's files (dirty tree: storybook WIP, `pnpm-lock.yaml`, `packages/CHANGELOG.md`). Skip `packages/CHANGELOG.md`.

---

### Task 1: Migration `0004_erasure_requests` + `sha256Hex`

**Files:**

- Create: `code/shared/api/db/d1/migrations/0004_erasure_requests.sql`
- Modify: `code/packages/shared/security/src/crypto.ts` (add `sha256Hex`)
- Test: `code/shared/api/src/erasure/requests.test.ts` (schema) + `code/packages/shared/security/src/crypto.test.ts` (sha256Hex)
- Modify: `code/shared/api/CHANGELOG.md`

**Interfaces:**

- Produces: table `erasure_requests`; `export async function sha256Hex(input: string): Promise<string>` (unsalted SHA-256 hex — for hashing the high-entropy token; do NOT reuse `fingerprintEmail`, whose `.toLowerCase()` would let a case-variant token match). Consumed by Tasks 5–6.

- [ ] **Step 1: Write the migration**

Create `code/shared/api/db/d1/migrations/0004_erasure_requests.sql`:

```sql
-- Erasure request lifecycle + single-use confirmation token. Forward-only.
-- A request is anti-enumeration: a row exists only when the subject was found.
-- The token is stored as a SHA-256 hash (never plaintext); confirm verifies the
-- hash + a typed-email fingerprint + TTL + an attempt cap. `result` holds the
-- engine receipt JSON. Retained as a proof-of-erasure record (dropped at final purge).
CREATE TABLE erasure_requests (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  status            TEXT NOT NULL,               -- pending | email_sent | confirmed | completed | cancelled | expired
  token_hash        TEXT NOT NULL,               -- sha256Hex of the single-use token
  token_expires_at  TEXT NOT NULL,               -- ISO8601 TTL
  attempts          INTEGER NOT NULL DEFAULT 0,  -- confirm attempts (attempt-limit)
  user_id           TEXT,                        -- Clerk user id when known
  email_fingerprint TEXT NOT NULL,               -- the subject key (matches user_profiles / consent)
  requested_at      TEXT NOT NULL,
  confirmed_at      TEXT,
  completed_at      TEXT,
  due_at            TEXT NOT NULL,               -- GDPR 1-month SLA target
  result            TEXT                         -- erasure receipt JSON
);
CREATE INDEX idx_erasure_requests_token ON erasure_requests (token_hash);
CREATE INDEX idx_erasure_requests_fp    ON erasure_requests (email_fingerprint);
```

- [ ] **Step 2: Write the failing tests**

`code/shared/api/src/erasure/requests.test.ts` (schema — mirror the `consent-events` schema test): assert `PRAGMA table_info(erasure_requests)` has the columns above.

Add to `code/packages/shared/security/src/crypto.test.ts`:

```ts
import { sha256Hex } from "./crypto";
describe("sha256Hex", () => {
  it("is deterministic, hex, case-sensitive (no lowercasing)", async () => {
    const h = await sha256Hex("Abc-123");
    expect(h).toBe(await sha256Hex("Abc-123"));
    expect(h).not.toBe(await sha256Hex("abc-123")); // case-sensitive, unlike fingerprintEmail
    expect(h).toMatch(/^[0-9a-f]{64}$/);
  });
});
```

- [ ] **Step 3: Run RED, implement, run GREEN**

Add to `code/packages/shared/security/src/crypto.ts` (after `fingerprintEmail`, reuse the module-private `utf8`/`toHex`):

```ts
/**
 * SHA-256 hex of a value, unsalted and case-sensitive. For hashing a
 * high-entropy secret (e.g. a single-use token) whose value must match exactly —
 * unlike hashIpAddress/fingerprintEmail, which lowercase + salt for
 * pseudonymisation. Never store the plaintext token; store this.
 */
export async function sha256Hex(input: string): Promise<string> {
  if (!input) throw new Error("input is required for sha256Hex");
  return toHex(await crypto.subtle.digest("SHA-256", utf8.encode(input)));
}
```

Migration: `pnpm db:migrate audit dev`. Tests: `pnpm --filter @indiecrafts/packages-shared-security test` + `pnpm --filter @indiecrafts/shared-api test`.

- [ ] **Step 4: Prettier + commit**

Add a `code/shared/api/CHANGELOG.md` line for the migration.

```bash
git add code/shared/api/db/d1/migrations/0004_erasure_requests.sql code/shared/api/src/erasure/requests.test.ts code/packages/shared/security/src/crypto.ts code/packages/shared/security/src/crypto.test.ts code/shared/api/CHANGELOG.md
git commit --no-verify -m "feat(compliance): erasure_requests table (migration 0004) + sha256Hex"
```

---

### Task 2: Real adapter clients (Clerk + Sanity)

**Files:**

- Create: `code/shared/api/src/erasure/clerk-client.ts` + `code/shared/api/src/erasure/sanity-client.ts`
- Test: `code/shared/api/src/erasure/clerk-client.test.ts` + `code/shared/api/src/erasure/sanity-client.test.ts`
- Modify: `code/shared/api/src/index.ts` (Env: add `CLERK_SECRET_KEY?`, `SANITY_API_WRITE_TOKEN?`)
- Modify: `code/shared/api/package.json` (add `@clerk/backend` dep) + `code/shared/api/wrangler.toml` (secret docs)

**Interfaces:**

- Produces: `createRealClerkClient(secretKey: string): ClerkErasureClient` and `createRealSanityClient(cfg: { projectId: string; dataset: string; apiVersion: string; writeToken: string; readToken?: string }): SanityErasureClient` — the real impls of the Phase 3 DI interfaces. Consumed by Task 6 (confirm route assembly).

- [ ] **Step 1: Real Clerk client — failing test**

`clerk-client.test.ts`: inject a fake `@clerk/backend`-shaped client (mock `users.getUserList`/`getUser`/`deleteUser`) — to keep it unit-testable, structure `createRealClerkClient` so the underlying `createClerkClient` is obtained via an injectable seam OR test the mapping with a stubbed `clerk.users`. Assert: `findUserIdByEmail` calls `getUserList({ emailAddress: [lowercased] })` → `data[0].id`; returns null on empty; `deleteUser`/`exportUser` delegate.

- [ ] **Step 2: Implement `clerk-client.ts`**

```ts
import type { ClerkErasureClient } from "./clerk";

// Real ClerkErasureClient over @clerk/backend. Dynamic import keeps @clerk/backend
// out of the module graph until erasure actually runs (mirrors the backfill), and
// keeps this file importable by tests without the SDK. CLERK_SECRET_KEY is required.
export function createRealClerkClient(secretKey: string): ClerkErasureClient {
  const clerk = async () => {
    const { createClerkClient } = await import("@clerk/backend");
    return createClerkClient({ secretKey });
  };
  return {
    async findUserIdByEmail(email) {
      const c = await clerk();
      const { data } = await c.users.getUserList({
        emailAddress: [email.toLowerCase().trim()],
      });
      return data[0]?.id ?? null;
    },
    async exportUser(userId) {
      return (await clerk()).users.getUser(userId);
    },
    async deleteUser(userId) {
      await (await clerk()).users.deleteUser(userId);
    },
  };
}
```

(Add `@clerk/backend` to `code/shared/api/package.json` dependencies at the version already in the lockfile — `@clerk/backend@3.16.7`; run `pnpm install`. If the lock update collides with the pre-existing dirty lock, stage only `package.json` and note the lock in the report.)

- [ ] **Step 3: Real Sanity client — failing test + implement `sanity-client.ts`**

`sanity-client.test.ts`: `vi.stubGlobal("fetch", ...)`; assert `findByEmail(type, email)` GETs the GROQ query URL and returns `result`; `pseudonymise(id, patch)` POSTs `/data/mutate/<dataset>` with `{ mutations: [{ patch: { id, set: patch } }] }` + `Authorization: Bearer <writeToken>`.

```ts
import type { SanityErasureClient } from "./sanity";

// Real SanityErasureClient over the Sanity HTTP API (the bare Worker can't use
// next-sanity/writeClient — server-only). Read via /data/query (GROQ), write via
// /data/mutate. Read token optional; write token required for pseudonymise.
export function createRealSanityClient(cfg: {
  projectId: string;
  dataset: string;
  apiVersion: string;
  writeToken: string;
  readToken?: string;
}): SanityErasureClient {
  const host = `${cfg.projectId}.api.sanity.io`;
  const base = `https://${host}/v${cfg.apiVersion}/data`;
  return {
    async findByEmail(type, email) {
      const groq = `*[_type == $type && email == $email]{ _id }`;
      const url =
        `${base}/query/${cfg.dataset}?query=${encodeURIComponent(groq)}` +
        `&$type=${encodeURIComponent(JSON.stringify(type))}` +
        `&$email=${encodeURIComponent(JSON.stringify(email.toLowerCase().trim()))}`;
      const res = await fetch(url, {
        headers: cfg.readToken
          ? { authorization: `Bearer ${cfg.readToken}` }
          : {},
      });
      if (!res.ok) throw new Error(`sanity query ${res.status}`);
      const body = (await res.json()) as { result?: Array<{ _id: string }> };
      return body.result ?? [];
    },
    async pseudonymise(id, patch) {
      const res = await fetch(`${base}/mutate/${cfg.dataset}`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${cfg.writeToken}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ mutations: [{ patch: { id, set: patch } }] }),
      });
      if (!res.ok) throw new Error(`sanity mutate ${res.status}`);
    },
  };
}
```

- [ ] **Step 4: Env + verify + commit**

Add `CLERK_SECRET_KEY?: string;` and `SANITY_API_WRITE_TOKEN?: string;` to `Env` (with `wrangler secret put …` doc-comments) + update the wrangler.toml secret list. Run api `test` + `tsc`. Prettier. Commit staging the client files + tests + index.ts + package.json + wrangler.toml (+ pnpm-lock.yaml only if cleanly isolated to @clerk/backend).

---

### Task 3: Worker email helper (Resend HTTP)

**Files:**

- Create: `code/shared/api/src/erasure/email.ts`
- Test: `code/shared/api/src/erasure/email.test.ts`
- Modify: `code/shared/api/src/index.ts` (Env: `RESEND_API_KEY?`, `EMAIL_FROM?`)

**Interfaces:**

- Produces: `sendErasureTokenEmail(env, { to, confirmUrl }): Promise<void>` and `sendErasureCompleteEmail(env, { to, retained: string }): Promise<void>` — inline Resend POST; no-op when `RESEND_API_KEY`/`EMAIL_FROM` unset (fire-and-forget, never throws into the route's success path). HTML hand-built + `escapeHtml`-guarded on any interpolated value.

- [ ] **Step 1: Failing test** — `vi.stubGlobal("fetch")`; set `RESEND_API_KEY`/`EMAIL_FROM`; assert the token email POSTs `https://api.resend.com/emails` with `Authorization: Bearer <key>`, `from: EMAIL_FROM`, `to`, a subject, and an HTML body containing the confirmUrl (escaped). Assert no-op when the key is unset.

- [ ] **Step 2: Implement** — a private `resend(env, { to, subject, html, text })` (the ~15-line POST from `packages/web/email/src/resend.ts:20-46`, reading `env.RESEND_API_KEY`/`env.EMAIL_FROM`, no `server-only`), plus the two typed senders that build the HTML/text. Reuse an inline `escapeHtml` (copy the blog moderation route's helper) for the confirmUrl + retained-summary. Guard: `if (!env.RESEND_API_KEY || !env.EMAIL_FROM) return;`.

- [ ] **Step 3: Env + verify + commit** — add `RESEND_API_KEY?`, `EMAIL_FROM?` to `Env`. api `test` + `tsc`, prettier, commit.

---

### Task 4: `POST /v1/erasure/request` (+ request form + Turnstile)

**Files:**

- Modify: `code/shared/api/src/index.ts` (the route + the Env `TURNSTILE_SECRET?`, a `verifyTurnstile` inline helper, and a `PUBLIC_CORS_POST`)
- Create: `code/shared/api/src/erasure/request.ts` (the handler + the request-form HTML) — keep index.ts a thin dispatcher that calls it
- Test: `code/shared/api/src/erasure/request.test.ts`

**Interfaces:**

- Consumes: `sha256Hex`, `fingerprintEmail`, `env.DB`, `env.GDPR_FINGERPRINT_SALT`, the D1 subject lookup (user_profiles by fingerprint/email; optionally Sanity), `sendErasureTokenEmail`, an inline Turnstile verify.
- Produces: `handleErasureRequest(request, env): Promise<Response>`. `GET` → the request form HTML; `POST` (Turnstile + rate-limit) → look up the email; if found: insert an `erasure_requests` row (`status:"email_sent"`, `token_hash`, `token_expires_at` = +24h, `due_at` = +30d, `email_fingerprint`, `user_id?`, `requested_at`), email the token link `${new URL(request.url).origin}/v1/erasure/confirm?token=<plaintext>`; ALWAYS respond 200 with the generic "check your email" message (anti-enumeration).

- [ ] **Step 1: Failing tests** — POST a known-seeded email (seed a `user_profiles` row) → an `erasure_requests` row is created with a hashed token (not plaintext), TTL + due_at set, and the token email fired (mock `sendErasureTokenEmail`/fetch); POST an unknown email → NO row, NO email, but the SAME generic 200 (anti-enumeration); Turnstile failure → rejected. Token is stored hashed (assert `token_hash` != any plaintext, matches `sha256Hex(token)`).

- [ ] **Step 2: Implement** the handler + a minimal self-contained request-form HTML (email input + the Turnstile widget placeholder + POST to self), the inline `verifyTurnstile(env, token, ip)` (siteverify POST, passes when `TURNSTILE_SECRET` unset — mirror `turnstile.ts:14-39`), and wire `if (url.pathname === "/v1/erasure/request")` in index.ts. Rate-limit via `env.AGENT_RATELIMIT`.

- [ ] **Step 3: Env + verify + commit** — `TURNSTILE_SECRET?` in Env; api `test` + `tsc`, prettier, commit.

---

### Task 5: `GET|POST /v1/erasure/confirm` (the engine run)

**Files:**

- Create: `code/shared/api/src/erasure/confirm.ts` (handler + confirm-form HTML + engine assembly)
- Modify: `code/shared/api/src/index.ts` (dispatch `/v1/erasure/confirm`)
- Test: `code/shared/api/src/erasure/confirm.test.ts`

**Interfaces:**

- Consumes: `sha256Hex`, `fingerprintEmail`, `runErasure`, `createD1ErasureAdapter`, `createRealClerkClient`+`createClerkErasureAdapter`, `createRealSanityClient`+`createSanityErasureAdapter`, `createOrdersErasureAdapter`, `sendErasureCompleteEmail`, `env.DB` + all the new secrets.
- Produces: `handleErasureConfirm(request, env): Promise<Response>`. `GET ?token=…` → the typed-email confirm form (read-only, prefetch-safe). `POST {token, email}` → find the row by `sha256Hex(token)`; reject if missing / `status !== "email_sent"` / expired (`token_expires_at`) / `attempts >= 5` (increment attempts on each try) / `fingerprintEmail(email) !== row.email_fingerprint`; on success: `runErasure(adapters, email, {mode:"erase", dryRun:true, ts, fingerprint})` (preview) then `dryRun:false` (live); inspect `receipt.errors`; store the receipt JSON in `result`, set `status:"completed"` (or keep `email_sent` + record the error if `receipt.errors` non-empty), `confirmed_at`/`completed_at`; write an `admin_audit` row (`event:"erasure.completed"`, actor/target = the subject `user_id`); fire `sendErasureCompleteEmail`. Single-use: a second POST finds `status:"completed"` → rejected.

- [ ] **Step 1: Failing tests** (workers pool, real D1 + injected mock Clerk/Sanity clients — pass the adapters in, or stub `createRealClerkClient`/`createRealSanityClient` via a seam): seed an `erasure_requests` row + a matching `user_profiles`; POST the right token + email → the D1 profile is pseudonymised (`anonymized=1`), the row → `completed` with a `result` receipt, an `admin_audit` row written; wrong email → rejected + `attempts` incremented + no erasure; expired token → rejected; 6th attempt → rejected; replay after completion → rejected. Assert `receipt.errors` handling (simulate a Clerk client throwing → the response/`result` reflects partial failure, not blind success).

- [ ] **Step 2: Implement** — the handler assembles the four adapters (real D1; real Clerk/Sanity via the Task-2 factories reading `env` secrets; orders no-op), runs the two passes, persists, audits, emails. Provide a testing seam so the confirm handler accepts injected adapter factories (default to the real ones) — so the test injects mocks without real SDK/HTTP. GET renders the confirm form; POST does the work. Wire `if (url.pathname === "/v1/erasure/confirm")`.

- [ ] **Step 3: Verify + commit** — api `test` + `tsc`, prettier, commit.

---

### Task 6: `GET /v1/erasure/status/:token` + CHANGELOG + docs

**Files:**

- Modify: `code/shared/api/src/index.ts` (dispatch `url.pathname.startsWith("/v1/erasure/status/")`)
- Create: `code/shared/api/src/erasure/status.ts` + `code/shared/api/src/erasure/status.test.ts`
- Modify: `code/shared/api/CHANGELOG.md` + `code/shared/api/.claude/CLAUDE.md` (the erasure routes) + `code/docs/apps/web/config/data-retention.md` (the live erasure flow)

**Interfaces:**

- Produces: `handleErasureStatus(request, env, token): Promise<Response>` — `GET`; looks up `erasure_requests` by `sha256Hex(token)`; returns `{ status, requested_at, due_at, completed_at }` (NO PII, no receipt body) or 404. Public, `PUBLIC_CORS`.

- [ ] **Step 1: Failing test** — seed a row; `GET /v1/erasure/status/<token>` returns its status (no email/fingerprint/result leaked); unknown token → 404.
- [ ] **Step 2: Implement** — parse the token via `url.pathname.slice("/v1/erasure/status/".length)`; look up by `sha256Hex(token)`; project only the safe fields.
- [ ] **Step 3: Docs + commit** — add the `/v1/erasure/*` routes to the api brief (edit) + a "Live erasure flow" note to `data-retention.md`; api CHANGELOG line. api `test` + `tsc`, prettier, commit.

---

## Phase 4a exit check

- [ ] api `test` green (migration, sha256Hex, both real clients, email, request anti-enumeration + token-hash, confirm engine-run + typed-email/TTL/attempt/replay guards + `receipt.errors` handling, status no-PII) + `tsc` exit 0
- [ ] `pnpm --filter @indiecrafts/packages-shared-security test` green (sha256Hex)
- [ ] `prettier --check` clean on all Phase-4a files
- [ ] No real Clerk/Sanity/Resend call fired in tests (mocked/injected); no secret values committed

## Deferred to later Phase 4 slices (documented)

- Export API (`POST /v1/export` + identity-verified `runExport` + secure expiring download link).
- Branded/i18n website request + confirm forms (this slice ships minimal worker-served HTML); wire `features.compliance` gating.
- Sanity→D1 DSAR migration (`data_requests` table; move `submitDataRequest` off Sanity) + deprecate the Sanity `dataRequest` schema.
- SLA clock: the cron flags approaching/breached `due_at` + owner reminders.
- The full Sanity-editable email catalog (this slice hand-builds the two erasure emails in the worker).

## Self-review notes

- **Spec §22.4 (this slice):** erasure request+confirm+status API → Tasks 4–6; real adapter wiring → Task 2; token/TTL/attempt/typed-email + engine run + receipt → Tasks 1,5; token & completion emails → Tasks 3,5. Export/confirm-page/Sanity→D1/SLA → later slices (listed).
- **Deliberate cuts (ponytail):** worker-served minimal HTML forms (no web-surface task); inline Resend/Sanity-mutate/Turnstile (the bricks are server-only); dynamic `import("@clerk/backend")`; anti-enumeration + hashed token + typed-email + TTL + attempt-limit are the security spine (spec §8.2/§8.3), not optional.
- **Security:** the api worker gains Clerk-delete + Sanity-write + email power via new secrets (operator-armed; unset in build/tests). The confirm route is the only path to live deletion and is quadruple-gated (token_hash + typed-email fingerprint + TTL + attempts) and single-use.
- **`receipt.errors`:** the engine never throws — every erasure path inspects `receipt.errors` and never reports success when a store failed.
- **Type/name consistency:** `createRealClerkClient`/`createRealSanityClient` return the exact Phase-3 `ClerkErasureClient`/`SanityErasureClient`; the confirm route assembles them with `createClerkErasureAdapter`/`createSanityErasureAdapter` + `createD1ErasureAdapter` + `createOrdersErasureAdapter` and calls `runErasure`.
