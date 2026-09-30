# API production-readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the shared api meet the five production-ready rules (QA card 20, `f20-7`), show its real health in the admin, and run `pnpm dev` locally.

**Architecture:** One outer `fetch` in `code/shared/api/src/index.ts` wraps the existing router (renamed `route`) with a request id, an idempotency layer, a top-level catch and a `finalize` step (`src/http.ts`). Outbound calls go through `fetchWithTimeout` / `withTimeout`. Callers into the api use a shared `apiFetch` (utils brick). `pnpm dev` runs the three Workers locally on one shared `.wrangler/state`.

**Tech Stack:** Cloudflare Workers (workerd) · D1 · vitest + `@cloudflare/vitest-pool-workers` · node:test · Next 16 (admin) · wrangler 4.

**Spec:** `docs/superpowers/specs/2026-09-30-api-production-readiness-design.md`

## Global Constraints

- Branch `feat/api-prod-readiness`; commit per task; fast-forward `main` at the end; **never push**.
- **Never stage the user's WIP:** `.claude/settings.json`, `.claude/hooks/react-doctor-changed.sh`, the iOS `swiftpm/` folder, and the `doctor`/`doctor:changed` lines in root `package.json` + `.vscode/tasks.json`. Root `package.json` / `.vscode/tasks.json` edits go through **index-only staging** (edit = apply the same change to the working tree AND to `git show :<file>` → `git hash-object -w` → `git update-index --cacheinfo`). **Read a file fully before opening it for write.**
- Every root script needs a `.vscode/tasks.json` task (`pnpm check:tasks`).
- Error bodies stay backwards compatible: `error` unchanged; `message` + `requestId` are additive.
- Timeouts: outbound from the api **5000 ms**; `apiFetch` (callers → api) **10000 ms**.
- Rate limit truth: `limit = 20`, `period = 60` (wrangler.toml `RATELIMIT`); `Retry-After: 60`, `RateLimit-Policy: 20;w=60`.
- Idempotency keys live 24 h; table `idempotency_keys` in `AUDIT_DB`, migration `0005_idempotency_keys.sql`.
- Writing style: `.claude/rules/writing-style.md` (active voice, ≤ 20-word sentences) for comments, docs, commits.

## Review Focus

1. `finalize` must not buffer or break a **streamed / non-JSON** response (the export download streams R2; `404 "Not found"` is text) — only JSON error bodies are rewritten; others just gain `X-Request-Id`. (Test in Task 1.)
2. `finalize` must **keep CORS + cache headers** the handler set (browser callers of public routes). (Test in Task 1.)
3. The idempotency layer reads the body — the handler must still get it (**clone**), and a key reused by a **different caller** must not replay someone else's result (scope includes a hash of the `authorization` header). (Tests in Task 5.)
4. `apiFetch` must **not retry a POST** unless the caller marks it idempotent (only events + export are) — a retried `cron run` / `erasure retry` would act twice. (Test in Task 6.)
5. A `schema_behind` 503 must only map D1 `no such table|column` errors; any other throw stays `500 internal` with a request id and a log line. (Test in Task 1.)

---

### Task 0: Everything committed and on main

- [ ] **Step 1:** `git status --short` → only the WIP files in Global Constraints are dirty; `git rev-parse main` = `git rev-parse feat/api-prod-readiness` (spec commit `6715fe50`).
- [ ] **Step 2:** If anything else is dirty, stop and report it. Otherwise continue on `feat/api-prod-readiness`.

### Task 1: `src/http.ts` — request id, finalize, top-level catch, 429 headers

**Files:** Create `code/shared/api/src/http.ts`, `code/shared/api/src/http.test.ts`. Modify `code/shared/api/src/index.ts` (rename the default `fetch` body to `async function route(request, env, ctx)`; new default `fetch` wraps it).

**Interfaces — Produces:**

- `requestIdOf(request: Request): string` — `cf-ray` header or `crypto.randomUUID()`.
- `finalize(res: Response, requestId: string): Promise<Response>`
- `errorFromThrow(error: unknown, requestId: string): Response` — `503 schema_behind` for `/no such (table|column)/i`, else `500 internal`; logs `{ requestId, name }`.
- `ERROR_MESSAGES: Record<string, string>`
- `fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit, ms = 5000): Promise<Response>` and `withTimeout<T>(p: Promise<T>, ms = 5000, label = "call"): Promise<T>` (Task 2 uses them).

- [ ] **Step 1: failing tests** (`http.test.ts`, plain vitest in the workers pool):

```ts
import { describe, expect, it } from "vitest";
import { env, SELF } from "cloudflare:test";
import { errorFromThrow, finalize, requestIdOf } from "./http";

const jsonRes = (
  body: unknown,
  status: number,
  headers: Record<string, string> = {},
) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });

describe("finalize", () => {
  it("adds message + requestId to a JSON error and keeps its headers", async () => {
    const out = await finalize(
      jsonRes({ error: "unauthorized" }, 401, {
        "access-control-allow-origin": "*",
        "cache-control": "no-store",
      }),
      "rid-1",
    );
    expect(await out.json()).toEqual({
      error: "unauthorized",
      message: expect.any(String),
      requestId: "rid-1",
    });
    expect(out.headers.get("x-request-id")).toBe("rid-1");
    expect(out.headers.get("access-control-allow-origin")).toBe("*");
    expect(out.headers.get("cache-control")).toBe("no-store");
  });
  it("keeps a handler's own message", async () => {
    const out = await finalize(
      jsonRes({ error: "x", message: "custom" }, 400),
      "r",
    );
    expect((await out.json()).message).toBe("custom");
  });
  it("gives rate_limited Retry-After + RateLimit-Policy; too_many_attempts gets neither", async () => {
    const rl = await finalize(jsonRes({ error: "rate_limited" }, 429), "r");
    expect(rl.headers.get("retry-after")).toBe("60");
    expect(rl.headers.get("ratelimit-policy")).toBe("20;w=60");
    const cap = await finalize(
      jsonRes({ error: "too_many_attempts" }, 429),
      "r",
    );
    expect(cap.headers.get("retry-after")).toBeNull();
  });
  it("leaves non-JSON and success bodies untouched, only adding X-Request-Id", async () => {
    const text = await finalize(
      new Response("Not found", { status: 404 }),
      "r",
    );
    expect(await text.text()).toBe("Not found");
    expect(text.headers.get("x-request-id")).toBe("r");
    const ok = await finalize(jsonRes({ ok: true }, 200), "r");
    expect(await ok.json()).toEqual({ ok: true });
  });
});

describe("errorFromThrow", () => {
  it("maps a missing table/column to 503 schema_behind", async () => {
    const res = errorFromThrow(
      new Error("D1_ERROR: no such table: cron_runs: SQLITE_ERROR"),
      "r",
    );
    expect(res.status).toBe(503);
    expect((await res.json()).error).toBe("schema_behind");
  });
  it("maps anything else to 500 internal", async () => {
    const res = errorFromThrow(new Error("boom"), "r");
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe("internal");
  });
});

describe("requestIdOf", () => {
  it("uses cf-ray, else a uuid", () => {
    expect(
      requestIdOf(
        new Request("https://x", { headers: { "cf-ray": "abc-CDG" } }),
      ),
    ).toBe("abc-CDG");
    expect(requestIdOf(new Request("https://x"))).toMatch(/^[0-9a-f-]{36}$/);
  });
});

describe("the api's outer fetch", () => {
  it("every response carries X-Request-Id and errors carry requestId", async () => {
    const res = await SELF.fetch("https://api.test/v1/events", {
      method: "POST",
    });
    expect(res.status).toBe(401);
    expect(res.headers.get("x-request-id")).toBeTruthy();
    expect(await res.json()).toMatchObject({
      error: "unauthorized",
      requestId: res.headers.get("x-request-id"),
    });
  });
  it("a missing table becomes 503 schema_behind, not a raw 500", async () => {
    await env.AUDIT_DB.exec("DROP TABLE cron_runs");
    const res = await SELF.fetch("https://api.test/v1/cron/status", {
      headers: { authorization: "Bearer test-token" },
    });
    expect(res.status).toBe(503);
    expect((await res.json()).error).toBe("schema_behind");
  });
});
```

- [ ] **Step 2:** `pnpm --filter @indiecrafts/shared-api exec vitest run src/http.test.ts` → FAIL (module missing).
- [ ] **Step 3: implement `src/http.ts`:**

```ts
/**
 * The api's HTTP edge: request ids, the error envelope, 429 hints, the top-level catch, and
 * timeouts for outbound calls.
 *
 * @see docs/reference/shared/api/src/http.md
 */
import { logger } from "@indiecrafts/packages-shared-logger";

/** Developer-facing text per error code; a code not listed gets GENERIC. */
export const ERROR_MESSAGES: Record<string, string> = {
  unauthorized: "Missing or invalid credentials.",
  forbidden: "These credentials cannot do this.",
  invalid: "The request body or parameters are invalid.",
  not_found: "Nothing exists at this id.",
  method_not_allowed: "This route does not accept that method.",
  too_large: "The request body is too large.",
  rate_limited: "Too many requests — retry after the Retry-After delay.",
  too_many_attempts: "Too many attempts on this link — request a new one.",
  unavailable: "The api is missing configuration for this route.",
  schema_behind:
    "The database is missing migrations — run the db:migrate script for this env.",
  internal:
    "Unexpected error — retry once; report the requestId if it persists.",
  invalid_idempotency_key:
    "Idempotency-Key must be 1–255 printable characters.",
  idempotency_in_progress:
    "A request with this Idempotency-Key is still running — retry shortly.",
  idempotency_key_reused:
    "This Idempotency-Key was used with a different request.",
};
const GENERIC = "The request failed — see the error code.";
export const RATE_LIMIT = { limit: 20, period: 60 } as const; // mirrors wrangler.toml RATELIMIT

export function requestIdOf(request: Request): string {
  return request.headers.get("cf-ray") ?? crypto.randomUUID();
}

/** Every response gets X-Request-Id; a JSON error gains `message` + `requestId`; a
 *  `rate_limited` 429 gains Retry-After + RateLimit-Policy. Other bodies pass through untouched. */
export async function finalize(
  res: Response,
  requestId: string,
): Promise<Response> {
  const headers = new Headers(res.headers);
  headers.set("x-request-id", requestId);
  const isJsonError =
    res.status >= 400 &&
    (headers.get("content-type") ?? "").includes("application/json");
  if (!isJsonError)
    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers,
    });
  let body: Record<string, unknown>;
  try {
    body = (await res.clone().json()) as Record<string, unknown>;
  } catch {
    return new Response(res.body, { status: res.status, headers });
  }
  if (typeof body.error !== "string")
    return new Response(JSON.stringify(body), { status: res.status, headers });
  if (res.status === 429 && body.error === "rate_limited") {
    headers.set("retry-after", String(RATE_LIMIT.period));
    headers.set(
      "ratelimit-policy",
      `${RATE_LIMIT.limit};w=${RATE_LIMIT.period}`,
    );
  }
  const message =
    typeof body.message === "string"
      ? body.message
      : (ERROR_MESSAGES[body.error] ?? GENERIC);
  return new Response(JSON.stringify({ ...body, message, requestId }), {
    status: res.status,
    headers,
  });
}

/** The top-level catch: a missing table/column is a deploy that skipped migrations. */
export function errorFromThrow(error: unknown, requestId: string): Response {
  const text = String((error as Error)?.message ?? error);
  const schema = /no such (table|column)/i.test(text);
  logger.error(schema ? "schema behind" : "unhandled error", {
    requestId,
    name: (error as Error)?.name,
  });
  return new Response(
    JSON.stringify({ error: schema ? "schema_behind" : "internal" }),
    {
      status: schema ? 503 : 500,
      headers: {
        "content-type": "application/json",
        "cache-control": "no-store",
      },
    },
  );
}

/** fetch that aborts after `ms` — outbound calls never outlive their caller. */
export function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit = {},
  ms = 5000,
): Promise<Response> {
  return fetch(input, { ...init, signal: AbortSignal.timeout(ms) });
}

/** For SDK calls that take no AbortSignal (Clerk): reject after `ms`. */
export function withTimeout<T>(
  p: Promise<T>,
  ms = 5000,
  label = "call",
): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  return Promise.race([
    p.finally(() => clearTimeout(timer)),
    new Promise<never>((_, reject) => {
      timer = setTimeout(
        () =>
          reject(
            Object.assign(new Error(`${label} timed out`), {
              name: "TimeoutError",
            }),
          ),
        ms,
      );
    }),
  ]);
}
```

- [ ] **Step 4: wire `index.ts`:** rename the existing `async fetch(request, env, ctx)` body into a top-level `async function route(request: Request, env: Env, ctx: ExecutionContext): Promise<Response>`; the default export becomes:

```ts
export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const requestId = requestIdOf(request);
    let res: Response;
    try {
      res = await route(request, env, ctx);
    } catch (error) {
      res = errorFromThrow(error, requestId);
    }
    return finalize(res, requestId);
  },
  // …keep any other handlers (scheduled/queue) exactly as they are
};
```

- [ ] **Step 5:** run `src/http.test.ts` → PASS; run the whole api suite (`pnpm --filter @indiecrafts/shared-api exec vitest run`) → all pass (adjust only assertions that compared a **whole** error body with `toEqual` → `toMatchObject`, and ledger it).
- [ ] **Step 6: commit** `feat(api): request ids, an actionable error envelope, 429 retry hints and a top-level catch`.

### Task 2: Timeouts on every outbound call

**Files:** Modify `code/shared/api/src/index.ts` (`fetchAnnouncementDocs`), `src/erasure/email.ts` (2 sends), `src/erasure/sanity-client.ts` (2), `src/erasure/request.ts` (1), `src/erasure/clerk-client.ts` (3 SDK calls), `src/erasure/admin.ts` (`getUser`), `src/auth/clerk-jwt.ts` (`verifyToken`); `code/packages/shared/security/src/turnstile.ts` (`AbortSignal.timeout(5000)`). Create `code/shared/scripts/lib/api-outbound.test.mjs` (guard) and add a timeout test to `code/shared/api/src/http.test.ts`.

**Interfaces — Consumes:** `fetchWithTimeout`, `withTimeout` from Task 1.

- [ ] **Step 1: failing tests.** In `http.test.ts`:

```ts
it("fetchWithTimeout aborts a call that never answers", async () => {
  const spy = vi
    .spyOn(globalThis, "fetch")
    .mockImplementation(
      (_i, init) =>
        new Promise((_, reject) =>
          init?.signal?.addEventListener("abort", () =>
            reject(init.signal!.reason),
          ),
        ),
    );
  await expect(
    fetchWithTimeout("https://slow.test", {}, 20),
  ).rejects.toMatchObject({ name: "TimeoutError" });
  spy.mockRestore();
});
it("withTimeout rejects a promise that never settles", async () => {
  await expect(withTimeout(new Promise(() => {}), 20, "clerk")).rejects.toThrow(
    "clerk timed out",
  );
});
```

Guard `code/shared/scripts/lib/api-outbound.test.mjs` (node:test): read every `code/shared/api/src/**/*.ts` except `*.test.ts` and `http.ts`; fail on `/(?<![\w.])fetch\(/` (a bare outbound fetch) and on `createClerkClient\(` / `verifyToken\(` lines not inside a `withTimeout(` call on the same statement.

- [ ] **Step 2:** run both → FAIL (guard lists the 6 fetch sites + Clerk calls).
- [ ] **Step 3:** replace each bare `fetch(` with `fetchWithTimeout(` (same args); wrap `clerk.users.getUserList(...)`, `getUser(...)`, `deleteUser(...)`, `verifyToken(...)` in `withTimeout(…, 5000, "clerk")`; in `turnstile.ts` add `signal: AbortSignal.timeout(5000)` to the verify fetch.
- [ ] **Step 4:** guard + `http.test.ts` + full api suite + `pnpm --filter @indiecrafts/packages-shared-security exec vitest run` → PASS.
- [ ] **Step 5: commit** `feat(api): a 5 s timeout on every outbound call`.

### Task 3: Health — both D1s, version, bindings; build stamps

**Files:** Modify `code/shared/api/src/index.ts` (`/health`), `Env` (`BUILD_VERSION?: string; BUILD_COMMIT?: string`); create `code/shared/api/src/health.test.ts`; modify `code/shared/scripts/lib/deploy-shared.mjs` (export `buildVarArgs`), `code/shared/scripts/deploy/worker.mjs` (pass them), test `code/shared/scripts/lib/deploy-shared.test.mjs` (create or extend).

**Interfaces — Produces:** authed `/health` body `{ ok: boolean, version: string, commit: string, db: { audit: DbStatus, main: DbStatus }, bindings: { kv, exportBucket, cron, rateLimit: "bound" | "unbound" } }` where `DbStatus = "ok" | "error" | "unbound"`. `buildVarArgs(version: string, commit: string): string[]`.

- [ ] **Step 1: failing tests** (`health.test.ts`):

```ts
import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";
describe("/health", () => {
  it("stays minimal without the bearer", async () => {
    expect(await (await SELF.fetch("https://api.test/health")).json()).toEqual({
      ok: true,
    });
  });
  it("reports both D1s, version and bindings with the bearer", async () => {
    const body = await (
      await SELF.fetch("https://api.test/health", {
        headers: { authorization: "Bearer test-token" },
      })
    ).json();
    expect(body).toMatchObject({
      ok: true,
      version: "dev",
      commit: "dev",
      db: { audit: "ok", main: "ok" },
      bindings: {
        kv: expect.stringMatching(/bound/),
        exportBucket: "bound",
        cron: expect.stringMatching(/bound/),
        rateLimit: expect.stringMatching(/bound/),
      },
    });
  });
});
```

`deploy-shared.test.mjs`: `assert.deepEqual(buildVarArgs("1.2.0","abc123"), ["--var","BUILD_VERSION:1.2.0","--var","BUILD_COMMIT:abc123"])`.

- [ ] **Step 2:** run → FAIL.
- [ ] **Step 3:** in `/health` (authed branch) return:

```ts
const bound = (b: unknown) => (b ? "bound" : "unbound");
const db = {
  audit: await dbStatus(env.AUDIT_DB),
  main: await dbStatus(env.MAIN_DB),
};
return Response.json({
  ok: db.audit !== "error" && db.main !== "error",
  version: env.BUILD_VERSION || "dev",
  commit: env.BUILD_COMMIT || "dev",
  db,
  bindings: {
    kv: bound(env.SECURITY_COUNTERS),
    exportBucket: bound(env.EXPORT_BUCKET),
    cron: bound(env.CRON),
    rateLimit: bound(env.RATELIMIT),
  },
});
```

`deploy-shared.mjs`: `export const buildVarArgs = (version, commit) => ["--var", \`BUILD_VERSION:${version}\`, "--var", \`BUILD_COMMIT:${commit}\`];` `worker.mjs`: read `package.json`version from cwd and`git rev-parse --short HEAD`(fallback`"unknown"`), append `...buildVarArgs(version, commit)`to the real`wrangler deploy` call (not the dry run).

- [ ] **Step 4:** tests → PASS; `pnpm test:scripts` → PASS.
- [ ] **Step 5: commit** `feat(api): /health reports both D1s, the build and the bindings`.

### Task 4: Admin System shows the api's health

**Files:** Modify `code/projects/web/surfaces/admin/src/lib/monitoring.ts` (add `apiHealthView`), `…/(dashboard)/system/page.tsx`, `messages/en.json` + `fr.json` (`admin.system.bindings`, `admin.system.dbAudit`, `admin.system.dbMain`, `admin.system.bound`, `admin.system.unbound`); test `code/projects/web/surfaces/admin/src/lib/monitoring.test.ts` (extend or create).

**Interfaces — Consumes:** the Task 3 `/health` body. **Produces:** `apiHealthView(body?: Record<string, unknown>): { version: string; commit: string; dbs: { key: "audit" | "main"; status: string }[]; bindings: { key: string; bound: boolean }[] }` (`"—"` / empty lists when the body is missing).

- [ ] **Step 1: failing test:**

```ts
import { apiHealthView } from "./monitoring";
it("maps the api health body for the System page", () => {
  const v = apiHealthView({
    ok: true,
    version: "1.4.0",
    commit: "abc123",
    db: { audit: "ok", main: "error" },
    bindings: {
      kv: "bound",
      exportBucket: "unbound",
      cron: "bound",
      rateLimit: "bound",
    },
  });
  expect(v.version).toBe("1.4.0");
  expect(v.dbs).toEqual([
    { key: "audit", status: "ok" },
    { key: "main", status: "error" },
  ]);
  expect(v.bindings).toContainEqual({ key: "exportBucket", bound: false });
});
it("is empty without a body (api down or unauthenticated)", () => {
  expect(apiHealthView(undefined)).toEqual({
    version: "—",
    commit: "—",
    dbs: [],
    bindings: [],
  });
});
```

- [ ] **Step 2:** run admin vitest → FAIL.
- [ ] **Step 3:** implement `apiHealthView`; System page: the workers table gains Version + Commit cells for the api row (from `apiHealthView`); the Databases card lists `audit (D1)` + `main (D1)` from `dbs` (Sanity row unchanged); a Bindings line under Workers lists each binding with a `Badge` (`bound` → outline, `unbound` → secondary). All copy in `messages/en.json` + `fr.json`.
- [ ] **Step 4:** admin vitest + `pnpm --filter @indiecrafts/web-surfaces-admin exec tsc --noEmit` → PASS.
- [ ] **Step 5: commit** `feat(admin): System shows the api version, both D1s and its bindings`.

### Task 5: Idempotency-Key on events + export (+ cron purge)

**Files:** Create `code/shared/api/db/audit/migrations/0005_idempotency_keys.sql`, `code/shared/api/src/idempotency.ts`, `code/shared/api/src/idempotency.test.ts`; modify `code/shared/api/src/index.ts` (outer fetch wraps `route` with `withIdempotency`); modify `code/shared/cron/src/index.ts` (`audit_purge` deletes rows older than 24 h) + `code/shared/cron/src/index.test.ts`.

**Interfaces — Produces:** `withIdempotency(request: Request, env: Env, handler: (req: Request) => Promise<Response>): Promise<Response>` — applies to `POST /v1/events` and `POST /v1/export` only; passes everything else straight to `handler`.

- [ ] **Step 1: migration**

```sql
-- Idempotency-Key results for retried POSTs (events, export). 24 h — the cron purges older rows.
CREATE TABLE idempotency_keys (
  scope        TEXT NOT NULL,   -- route + sha256(authorization) — a key never crosses callers
  key          TEXT NOT NULL,
  request_hash TEXT NOT NULL,   -- sha256(body) — the same key with another body is refused
  status       INTEGER,         -- NULL while the first request runs
  body         TEXT,
  created_at   TEXT NOT NULL,
  PRIMARY KEY (scope, key)
);
CREATE INDEX idempotency_keys_created ON idempotency_keys (created_at);
```

- [ ] **Step 2: failing tests** (`idempotency.test.ts`, via `SELF.fetch` on `/v1/events` with the bearer and a valid admin event body `{kind:"admin",event:"qa.idem",actorUserId:"a",targetUserId:"b"}`):
  - same key twice → second answer = first (status 201, same body) + `idempotent-replayed: true`, and `SELECT COUNT(*) FROM admin_audit WHERE event='qa.idem'` = 1;
  - same key, different body → `422 idempotency_key_reused`;
  - same key, a different bearer/authorization → treated as a new key (no replay) — use a second request whose `authorization` differs and assert it is **not** replayed (401 for a wrong bearer is the handler's answer, not a replay);
  - key of 300 chars → `400 invalid_idempotency_key`;
  - reserved row with NULL status (insert it directly) → `409 idempotency_in_progress`;
  - a 5xx from the handler is not stored: call `withIdempotency` directly with a handler returning 500, then a handler returning 201 with the same key → the second runs (201);
  - no header → handler runs every time (two rows).
- [ ] **Step 3:** run → FAIL.
- [ ] **Step 4: implement `src/idempotency.ts`:**

```ts
/**
 * Replay-safe POSTs: an Idempotency-Key maps to the stored result for 24 h.
 *
 * @see docs/reference/shared/api/src/idempotency.md
 */
import type { Env } from "./index";

const ROUTES = new Set(["/v1/events", "/v1/export"]);
const KEY_RE = /^[\x21-\x7e]{1,255}$/;
const hex = async (s: string) =>
  [
    ...new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)),
    ),
  ]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
const reply = (error: string, status: number) =>
  new Response(JSON.stringify({ error }), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });

export async function withIdempotency(
  request: Request,
  env: Env,
  handler: (req: Request) => Promise<Response>,
): Promise<Response> {
  const key = request.headers.get("idempotency-key");
  const path = new URL(request.url).pathname;
  if (
    key === null ||
    request.method !== "POST" ||
    !ROUTES.has(path) ||
    !env.AUDIT_DB
  )
    return handler(request);
  if (!KEY_RE.test(key)) return reply("invalid_idempotency_key", 400);
  const db = env.AUDIT_DB;
  const body = await request.clone().text();
  const scope = `${path}:${await hex(request.headers.get("authorization") ?? "")}`;
  const hash = await hex(body);
  const reserved = await db
    .prepare(
      "INSERT OR IGNORE INTO idempotency_keys (scope, key, request_hash, status, body, created_at) VALUES (?, ?, ?, NULL, NULL, ?)",
    )
    .bind(scope, key, hash, new Date().toISOString())
    .run();
  if (!reserved.meta?.changes) {
    const row = await db
      .prepare(
        "SELECT request_hash, status, body FROM idempotency_keys WHERE scope = ? AND key = ?",
      )
      .bind(scope, key)
      .first<{
        request_hash: string;
        status: number | null;
        body: string | null;
      }>();
    if (row && row.request_hash !== hash)
      return reply("idempotency_key_reused", 422);
    if (!row || row.status === null)
      return reply("idempotency_in_progress", 409);
    return new Response(row.body, {
      status: row.status,
      headers: {
        "content-type": "application/json",
        "idempotent-replayed": "true",
        "cache-control": "no-store",
      },
    });
  }
  let res: Response;
  try {
    res = await handler(request);
  } catch (error) {
    await db
      .prepare("DELETE FROM idempotency_keys WHERE scope = ? AND key = ?")
      .bind(scope, key)
      .run();
    throw error;
  }
  if (res.status >= 500 || res.status === 429) {
    await db
      .prepare("DELETE FROM idempotency_keys WHERE scope = ? AND key = ?")
      .bind(scope, key)
      .run();
    return res;
  }
  const text = await res.clone().text();
  await db
    .prepare(
      "UPDATE idempotency_keys SET status = ?, body = ? WHERE scope = ? AND key = ?",
    )
    .bind(res.status, text, scope, key)
    .run();
  return res;
}
```

Outer fetch: `res = await withIdempotency(request, env, (req) => route(req, env, ctx));`. Cron `audit_purge`: add `idempotency_keys: await del("DELETE FROM idempotency_keys WHERE created_at < ?", new Date(now - 86_400_000).toISOString())` (use the pass's own `now`) + a cron test (old row deleted, fresh row kept).

- [ ] **Step 5:** api + cron suites → PASS.
- [ ] **Step 6: commit** `feat(api): Idempotency-Key replays retried events and exports (24 h, purged by the cron)`.

### Task 6: `apiFetch` — timeout + safe retry for callers

**Files:** Create `code/packages/shared/utils/src/api-fetch.ts`, `…/api-fetch.test.ts`; modify `code/packages/shared/utils/package.json` (`"./api-fetch": "./src/api-fetch.ts"`). Move callers: `code/projects/web/surfaces/admin/src/lib/audit.ts`, `src/lib/monitoring.ts` (`getApi`), `(dashboard)/monitoring-actions.ts` (`postApi`), `(dashboard)/actions.ts` (its api fetch); `code/packages/web/auth/src/session-log.ts`, `code/packages/web/compliance/src/consent-log.ts`, `code/packages/web/security-reports/src/forward.ts`, `code/packages/shared/compliance/src/shared/export-self.ts`. Add `"@indiecrafts/packages-shared-utils": "workspace:*"` to `web/auth`, `web/compliance`, `web/security-reports` package.json; `pnpm install`.

**Interfaces — Produces:** `apiFetch(url: string, init?: RequestInit & { timeoutMs?: number; idempotent?: boolean }): Promise<Response>` — 10 s timeout; retries **once** on network error / `TimeoutError` / 5xx / 429 (wait `Retry-After` s when ≤ 5, else 300–800 ms jitter) — a POST only when `idempotent: true`, which also sets `Idempotency-Key: crypto.randomUUID()` (same key on the retry); never retries other 4xx.

- [ ] **Step 1: failing tests** (`api-fetch.test.ts`, vitest, `vi.stubGlobal("fetch", …)`, fake timers where needed):
  - GET retried once after a 503, returns the second answer (fetch called 2×);
  - GET not retried on 400 (1×);
  - POST without `idempotent` → not retried on 503 (1×) and no `Idempotency-Key`;
  - POST with `idempotent: true` → retried on 503 with the **same** `Idempotency-Key` both times;
  - a fetch that never resolves → rejects with a `TimeoutError` after `timeoutMs` (use `timeoutMs: 20`);
  - 429 with `Retry-After: 1` → waits ~1 s then retries (fake timers).
- [ ] **Step 2:** run → FAIL.
- [ ] **Step 3: implement** (`api-fetch.ts`):

```ts
/**
 * fetch for calls into the api: a timeout, and one safe retry (backoff + jitter).
 *
 * @see docs/reference/packages/shared/utils/src/api-fetch.md
 */
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const retryable = (s: number) => s >= 500 || s === 429;

export async function apiFetch(
  url: string,
  {
    timeoutMs = 10_000,
    idempotent = false,
    ...init
  }: RequestInit & { timeoutMs?: number; idempotent?: boolean } = {},
): Promise<Response> {
  const post = (init.method ?? "GET").toUpperCase() !== "GET";
  const headers = new Headers(init.headers);
  if (post && idempotent && !headers.has("idempotency-key"))
    headers.set("idempotency-key", crypto.randomUUID());
  const canRetry = !post || idempotent;
  const attempt = () =>
    fetch(url, { ...init, headers, signal: AbortSignal.timeout(timeoutMs) });
  try {
    const res = await attempt();
    if (!canRetry || !retryable(res.status)) return res;
    const after = Number(res.headers.get("retry-after"));
    await sleep(
      after > 0 && after <= 5 ? after * 1000 : 300 + Math.random() * 500,
    );
  } catch (error) {
    if (!canRetry) throw error;
    await sleep(300 + Math.random() * 500);
  }
  return attempt();
}
```

- [ ] **Step 4:** move each caller: replace its `fetch(url, init)` to the api with `apiFetch(url, init)`; the event senders + `export-self` pass `idempotent: true`; keep each caller's existing error handling. Run each package's tests (`pnpm --filter <pkg> exec vitest run`) and fix only mocks that counted calls on a 5xx (ledger each).
- [ ] **Step 5:** utils + admin + the 4 bricks tests → PASS; `pnpm tsc` → PASS.
- [ ] **Step 6: commit** `feat(utils): apiFetch — timeout + one safe retry for calls into the api`.

### Task 7: Local `pnpm dev` + `db:migrate:local`

**Files:** Modify `code/shared/{api,cron,workers}/package.json` (`dev` → local with `--persist-to ../../../.wrangler/state`; add `dev:remote` = the old command); create `code/shared/scripts/data/migrate-local.mjs` + `migrate-local.test.mjs`; root `package.json` (`db:migrate:local`, `dev:remote`) + `.vscode/tasks.json` (2 tasks) — **index-only staging**; modify `code/shared/scripts/dev/setup.mjs` (run `db:migrate:local` after secrets).

**Interfaces — Produces:** `migrateLocalArgs(db: string): string[]` → `["d1","migrations","apply",db,"--local","--env","dev","--persist-to",<abs repo>/.wrangler/state]`.

- [ ] **Step 1: failing test** (`migrate-local.test.mjs`): `migrateLocalArgs("indiecrafts-dev-db-audit")` ends with `--persist-to <repo>/.wrangler/state`, and the module's `DATABASES` = the api-owned D1s from `lib/databases.mjs` (`byKind("d1").filter(d => d.owner === "api")`) for `dev`.
- [ ] **Step 2:** FAIL. **Step 3:** implement: for each api D1 run `wrangler` (from `code/shared/api`, via `pnpm --filter @indiecrafts/shared-api exec wrangler …migrateLocalArgs(name)`, env `CI=1` to skip the prompt); print what was applied. Package scripts:
  - api `dev`: `wrangler dev --env dev --port 8787 --inspector-port 9229 --persist-to ../../../.wrangler/state`; `dev:remote`: `wrangler dev --env dev --remote --port 8787 --inspector-port 9229`
  - cron `dev`: `… --port 8789 --inspector-port 9231 --test-scheduled --persist-to ../../../.wrangler/state`; `dev:remote`: old command
  - workers `dev`: `… --port 8790 --inspector-port 9232 --persist-to ../../../.wrangler/state`; `dev:remote`: old command
  - root `db:migrate:local`: `node code/shared/scripts/data/migrate-local.mjs`; root `dev:remote`: `turbo run dev:remote --filter=@indiecrafts/shared-api --filter=@indiecrafts/shared-cron --filter=@indiecrafts/shared-workers`; `turbo.json` gains a persistent, uncached `dev:remote` task (mirror `dev`).
- [ ] **Step 4:** `pnpm db:migrate:local` → applies audit (0001–0005) + main migrations; `pnpm dev` (background) → `curl localhost:8787/health` 200, authed `db.audit/main = ok`; `curl -H bearer localhost:8787/v1/cron/status` 200; `curl localhost:8789/cdn-cgi/handler/scheduled` → a new `cron_runs` row visible through the api (shared state); stop all dev processes (and their `workerd` children).
- [ ] **Step 5:** `pnpm test:scripts` + `pnpm check:tasks` → PASS. **Commit** `feat(dev): pnpm dev runs the api, cron and workers locally; dev:remote keeps the real dev bindings`.

### Task 8: Docs, briefs, changelogs

**Files:** `code/docs/shared/api/index.md` (rate limits + numbers, the error envelope + codes table from `ERROR_MESSAGES`, `X-Request-Id`, Idempotency-Key, `/health` authed body, link to versioning); create `code/docs/shared/api/versioning.md` (+ `code/docs/.vitepress/config.mts` sidebar under the api group); `code/docs/projects/web/admin/index.md` (System page); `code/docs/shared/workers/index.md` + `code/docs/shared/cron/index.md` (local dev default, `dev:remote`, `db:migrate:local`); root `CLAUDE.md` (the `pnpm dev` lines: local; `dev:remote`); `code/shared/{api,cron}/.claude/CLAUDE.md` (map lines for `http.ts`, `idempotency.ts`, dev); reference pages `code/docs/reference/shared/api/src/{http,idempotency}.md`, `code/docs/reference/packages/shared/utils/src/api-fetch.md`, `code/docs/packages/shared/utils.md` (export list); changelogs: `code/shared/api/CHANGELOG.md`, `code/shared/cron/CHANGELOG.md`, `code/projects/web/surfaces/admin/CHANGELOG.md`, `code/packages/CHANGELOG.md` (+ docs copies synced by the build), root `CHANGELOG.md` (dev workflow).

- [ ] **Step 1:** write the docs above (versioning page per spec §6: additive vs breaking list, `/v2` + ≥ 90 days, `Deprecation`/`Sunset`/`Link` headers, changelog entry).
- [ ] **Step 2:** `pnpm check:doc-coverage` + `pnpm check:claude-md` + `pnpm docs:build` → PASS. **Commit** `docs: api production contract, versioning policy, local dev`.

### Task 9: Verify, review, finish

- [ ] **Step 1:** `pnpm verify` (incl. `check:infra`) + `pnpm docs:build` + admin/utils/bricks vitest → all green.
- [ ] **Step 2:** local end-to-end (from `pnpm dev`): `/health` (both forms); a 401 body has `message` + `requestId` + `X-Request-Id`; `POST /v1/events` twice with one `Idempotency-Key` → one audit row + `idempotent-replayed`; stop every process after.
- [ ] **Step 3:** final whole-branch review (opus, `superpowers:requesting-code-review`); re-grade; one TDD fix pass for Critical/Important; ledger minors.
- [ ] **Step 4:** fast-forward `main`; QA runbook card 20 — tick `f20-7` + the extras with a dated note; list only the manual checks.
