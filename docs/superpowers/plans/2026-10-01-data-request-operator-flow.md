# Data-request operator flow — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** An operator opens a GDPR data request in an admin side sheet, moves it new → in progress → done / rejected with a note, and closes it with an email to the requester (prefilled in the requester's language); the requester gets a receipt on submit.

**Architecture:** The api owns the record, its history (`data_request_events`) and both requester emails (receipt, closing), reusing `erasure/email.ts` (`resend`, `supportFooter`, Studio copy over GROQ). The admin reads `GET /v1/data-requests/:id` and writes `POST /v1/data-requests/:id/status` through an audited server action; the sheet opens from `?id=`. The prefilled reply is rendered server-side with next-intl in the **requester's** locale.

**Tech Stack:** Cloudflare Worker + D1 (vitest-pool-workers), Next 16 admin (next-intl, shadcn `Sheet`, sonner), Sanity `emailStrings` groups.

**Spec:** `docs/superpowers/specs/2026-10-01-data-request-operator-flow-design.md`

## Global Constraints

- Never log email, message, or note — error `name` / status only.
- `email`, `message`, `note` use `encField` / `decField` (`PII_ENCRYPTION_KEY`; unset → plaintext).
- An email failure never undoes a stored request or a status change (`notified: false`).
- Admin writes: server action → `adminId()` (re-checks `isAdmin`) → bearer `postApi` → `audit(...)`.
- Copy: admin + website `messages/{en,fr}.json`; email copy = Studio group, else the api's en/fr text.
- Statuses `new | in-progress | done | rejected`; closed = `done | rejected`; no reopen.
- Commit on a branch, fast-forward `main`, never push; never stage `.claude/settings.json`, root `package.json`, `.vscode/tasks.json`, the react-doctor hook, `swiftpm/`.

## Review Focus

1. Due date on a short month — submitted 31 Jan → due 28 Feb (not 3 Mar); pinned in Task 1 (`dueAt`).
2. Two admins act on the same request — the second gets `changed` (409), not a double email; pinned in Task 1 (`from` guard).
3. A French requester — receipt, closing email, and the prefilled reply are French even when the admin UI is English; pinned in Tasks 2 and 6.
4. Mailer unconfigured or Resend down — the status still changes, the response says `notified: false`, the sheet warns; pinned in Tasks 1 and 6.
5. A note with HTML (`<script>`) — escaped in the closing email; pinned in Task 2.

---

### Task 1: Api — history table, detail + status routes, due date, write returns id

**Files:**

- Create: `code/shared/api/db/main/migrations/0013_data_request_events.sql`
- Create: `code/shared/api/src/data-request/status.ts`
- Create: `code/shared/api/src/data-request/status.test.ts`
- Modify: `code/shared/api/src/data-request/route.ts` (export `json`, `bearerOf`, `encField`, `decField`; write → `{ ok, id }` + receipt hook; list → `due_at`)
- Modify: `code/shared/api/src/data-request/route.test.ts` (201 body now `{ ok: true, id }`)
- Modify: `code/shared/api/src/index.ts` (dispatch `/v1/data-requests/:id` and `/status`)

**Interfaces:**

- Produces: `dueAt(submittedAt: string): string`; `handleDataRequestDetail(request, env, id)`; `handleDataRequestStatus(request, env, id, deps?)`; detail body `{ data: { id, request_type, email, message, status, submitted_at, source, locale, policy_version, due_at, events: { id, status, note, actor, notified, at }[] } }`; status body in `{ status, from, note?, notify?, by }` → `200 { ok: true, status, notified }` | `400 invalid | note_required` | `404 not_found` | `409 not_allowed | changed`; write → `201 { ok: true, id }`.
- Consumes (Task 2): `sendDataRequestReceipt`, `sendDataRequestClosedEmail` — `Promise<boolean>`; Task 1 injects them through `deps` so it can land first with stubs.

- [ ] **Step 1: Migration**

```sql
-- History of operator actions on a DSAR (status changes + the closing note). One row per
-- action. `note` is operational PII (encrypted when PII_ENCRYPTION_KEY is set); rows go with
-- their request (ON DELETE CASCADE) — the 365-day data_requests purge removes both.
CREATE TABLE data_request_events (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id  INTEGER NOT NULL REFERENCES data_requests(id) ON DELETE CASCADE,
  status      TEXT NOT NULL,
  note        TEXT,
  actor       TEXT NOT NULL,
  notified    INTEGER NOT NULL DEFAULT 0,
  at          TEXT NOT NULL
);
CREATE INDEX idx_data_request_events_request ON data_request_events (request_id, at);
```

- [ ] **Step 2: Failing tests** — `status.test.ts` (direct handler calls; `env` from `cloudflare:test`):

```ts
import { env } from "cloudflare:test";
import { describe, expect, it, vi } from "vitest";
import type { Env } from "../index";
import {
  dueAt,
  handleDataRequestDetail,
  handleDataRequestStatus,
} from "./status";

const E = env as unknown as Env;
async function seed(status = "new", locale = "fr") {
  const r = await E.MAIN_DB!.prepare(
    "INSERT INTO data_requests (request_type, email, message, status, submitted_at, locale) VALUES ('access', 'jane@example.com', 'hi', ?, '2026-10-01T08:30:00.000Z', ?) RETURNING id",
  )
    .bind(status, locale)
    .first<{ id: number }>();
  return r!.id;
}
const post = (id: number, body: unknown, bearer = "test-token") =>
  new Request(`https://x/v1/data-requests/${id}/status`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${bearer}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
const get = (id: number) =>
  new Request(`https://x/v1/data-requests/${id}`, {
    headers: { authorization: "Bearer test-token" },
  });

describe("dueAt", () => {
  it("adds one calendar month", () => {
    expect(dueAt("2026-10-01T08:30:00.000Z")).toBe("2026-11-01T08:30:00.000Z");
  });
  it("clamps to the last day of a shorter month", () => {
    expect(dueAt("2026-01-31T10:00:00.000Z")).toBe("2026-02-28T10:00:00.000Z");
  });
});

describe("POST /v1/data-requests/:id/status", () => {
  it("401 without the bearer", async () => {
    const id = await seed();
    expect(
      (await handleDataRequestStatus(post(id, {}, "nope"), E, id)).status,
    ).toBe(401);
  });
  it("starts a new request and records an event", async () => {
    const id = await seed();
    const res = await handleDataRequestStatus(
      post(id, { status: "in-progress", from: "new", by: "user_a" }),
      E,
      id,
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      ok: true,
      status: "in-progress",
      notified: false,
    });
    const ev = await E.MAIN_DB!.prepare(
      "SELECT status, actor, notified FROM data_request_events WHERE request_id = ?",
    )
      .bind(id)
      .first();
    expect(ev).toEqual({ status: "in-progress", actor: "user_a", notified: 0 });
  });
  it("closes with an email: sends in the row's locale and marks the event notified", async () => {
    const id = await seed("in-progress", "fr");
    const sendClosed = vi.fn(async () => true);
    const res = await handleDataRequestStatus(
      post(id, {
        status: "done",
        from: "in-progress",
        note: "Fait.",
        notify: true,
        by: "user_a",
      }),
      E,
      id,
      { sendClosed },
    );
    expect(await res.json()).toEqual({
      ok: true,
      status: "done",
      notified: true,
    });
    expect(sendClosed).toHaveBeenCalledWith(E, {
      to: "jane@example.com",
      id,
      outcome: "done",
      note: "Fait.",
      locale: "fr",
    });
    const ev = await E.MAIN_DB!.prepare(
      "SELECT notified, note FROM data_request_events WHERE request_id = ?",
    )
      .bind(id)
      .first();
    expect(ev).toEqual({ notified: 1, note: "Fait." });
  });
  it("keeps the change when the email fails (notified: false)", async () => {
    const id = await seed();
    const sendClosed = vi.fn(async () => {
      throw new Error("resend 500");
    });
    const res = await handleDataRequestStatus(
      post(id, {
        status: "rejected",
        from: "new",
        note: "No.",
        notify: true,
        by: "u",
      }),
      E,
      id,
      { sendClosed },
    );
    expect(await res.json()).toEqual({
      ok: true,
      status: "rejected",
      notified: false,
    });
    expect(
      (
        await E.MAIN_DB!.prepare(
          "SELECT status FROM data_requests WHERE id = ?",
        )
          .bind(id)
          .first()
      )?.status,
    ).toBe("rejected");
  });
  it("note_required when emailing a closing without a note", async () => {
    const id = await seed();
    const res = await handleDataRequestStatus(
      post(id, {
        status: "done",
        from: "new",
        note: " ",
        notify: true,
        by: "u",
      }),
      E,
      id,
    );
    expect(res.status).toBe(400);
    expect((await res.json()) as object).toMatchObject({
      error: "note_required",
    });
  });
  it("not_allowed from a closed status (no reopen)", async () => {
    const id = await seed("done");
    const res = await handleDataRequestStatus(
      post(id, { status: "in-progress", from: "done", by: "u" }),
      E,
      id,
    );
    expect(res.status).toBe(409);
    expect((await res.json()) as object).toMatchObject({
      error: "not_allowed",
    });
  });
  it("changed when another admin moved it first (stale from)", async () => {
    const id = await seed("in-progress");
    const sendClosed = vi.fn(async () => true);
    const res = await handleDataRequestStatus(
      post(id, {
        status: "done",
        from: "new",
        note: "x",
        notify: true,
        by: "u",
      }),
      E,
      id,
      { sendClosed },
    );
    expect(res.status).toBe(409);
    expect((await res.json()) as object).toMatchObject({ error: "changed" });
    expect(sendClosed).not.toHaveBeenCalled();
  });
  it.each([
    [{ status: "nope", from: "new", by: "u" }],
    [{ status: "done", from: "new" }],
    [{ status: "done", from: "new", by: "u", note: "x".repeat(4001) }],
  ])("invalid body %#", async (body) => {
    const id = await seed();
    expect((await handleDataRequestStatus(post(id, body), E, id)).status).toBe(
      400,
    );
  });
  it("not_found for an unknown id", async () => {
    expect(
      (
        await handleDataRequestStatus(
          post(999999, { status: "done", from: "new", by: "u" }),
          E,
          999999,
        )
      ).status,
    ).toBe(404);
  });
});

describe("GET /v1/data-requests/:id", () => {
  it("returns the request, its due date and its history (newest first)", async () => {
    const id = await seed();
    await handleDataRequestStatus(
      post(id, { status: "in-progress", from: "new", by: "user_a" }),
      E,
      id,
    );
    const res = await handleDataRequestDetail(get(id), E, id);
    const { data } = (await res.json()) as {
      data: Record<string, unknown> & { events: unknown[] };
    };
    expect(data).toMatchObject({
      id,
      email: "jane@example.com",
      status: "in-progress",
      due_at: "2026-11-01T08:30:00.000Z",
    });
    expect(data.events).toEqual([
      expect.objectContaining({
        status: "in-progress",
        actor: "user_a",
        notified: false,
      }),
    ]);
  });
  it("404 for an unknown id", async () => {
    expect((await handleDataRequestDetail(get(999999), E, 999999)).status).toBe(
      404,
    );
  });
});
```

Also in `route.test.ts`: the 201 expectation becomes `expect(await res.json()).toEqual({ ok: true, id: expect.any(Number) })`; add a list test asserting each row has `due_at`.

- [ ] **Step 3: Run — expect FAIL** (`./status` missing)

Run: `cd code/shared/api && npx vitest run src/data-request`

- [ ] **Step 4: Implement `status.ts`**

```ts
/**
 * Read one data request with its history, and move it through its statuses.
 *
 * @see docs/reference/shared/api/src/data-request/status.md
 */
import { logger } from "@indiecrafts/packages-shared-logger";
import type { Env } from "../index";
import { corsHeaders, safeEqual } from "../index";
import { bearerOf, decField, encField, json } from "./route";
import { sendDataRequestClosedEmail } from "./email";

const STATUSES = new Set(["new", "in-progress", "done", "rejected"]);
const NEXT: Record<string, readonly string[]> = {
  new: ["in-progress", "done", "rejected"],
  "in-progress": ["done", "rejected"],
};
const CLOSING = new Set(["done", "rejected"]);
const NOTE_MAX = 4000;
const BODY_MAX = 8000;

/** GDPR Art. 12(3): one month from receipt. A day missing from the next month → its last day. */
export function dueAt(submittedAt: string): string {
  const d = new Date(submittedAt);
  const due = new Date(d);
  due.setUTCDate(1);
  due.setUTCMonth(d.getUTCMonth() + 1);
  const last = new Date(
    Date.UTC(due.getUTCFullYear(), due.getUTCMonth() + 1, 0),
  ).getUTCDate();
  due.setUTCDate(Math.min(d.getUTCDate(), last));
  return due.toISOString();
}

function authed(request: Request, env: Env): boolean {
  const bearer = bearerOf(request);
  return Boolean(
    env.APP_API_TOKEN && bearer && safeEqual(bearer, env.APP_API_TOKEN),
  );
}

type Row = { id: number; status: string; email: string; locale: string | null };

export async function handleDataRequestDetail(
  request: Request,
  env: Env,
  id: number,
): Promise<Response> {
  const cors = corsHeaders(request.headers.get("origin"));
  if (request.method !== "GET")
    return json({ error: "method_not_allowed" }, 405, cors);
  if (!authed(request, env)) return json({ error: "unauthorized" }, 401, cors);
  if (!env.MAIN_DB) return json({ error: "unavailable" }, 503, cors);
  const db = env.MAIN_DB;
  const key = env.PII_ENCRYPTION_KEY;
  const row = await db
    .prepare(
      "SELECT id, request_type, email, message, status, submitted_at, source, locale, policy_version FROM data_requests WHERE id = ?",
    )
    .bind(id)
    .first<
      Record<string, unknown> & {
        email: string | null;
        message: string | null;
        submitted_at: string;
      }
    >();
  if (!row) return json({ error: "not_found" }, 404, cors);
  const { results } = await db
    .prepare(
      "SELECT id, status, note, actor, notified, at FROM data_request_events WHERE request_id = ? ORDER BY at DESC, id DESC",
    )
    .bind(id)
    .all<{
      id: number;
      status: string;
      note: string | null;
      actor: string;
      notified: number;
      at: string;
    }>();
  const events = await Promise.all(
    results.map(async (e) => ({
      ...e,
      note: await decField(e.note, key),
      notified: e.notified === 1,
    })),
  );
  return json(
    {
      data: {
        ...row,
        email: await decField(row.email, key),
        message: await decField(row.message, key),
        due_at: dueAt(row.submitted_at),
        events,
      },
    },
    200,
    cors,
  );
}

type StatusDeps = { sendClosed: typeof sendDataRequestClosedEmail };

export async function handleDataRequestStatus(
  request: Request,
  env: Env,
  id: number,
  deps: StatusDeps = { sendClosed: sendDataRequestClosedEmail },
): Promise<Response> {
  const cors = corsHeaders(request.headers.get("origin"));
  if (request.method === "OPTIONS")
    return new Response(null, { status: 204, headers: cors });
  if (request.method !== "POST")
    return json({ error: "method_not_allowed" }, 405, cors);
  if (!authed(request, env)) return json({ error: "unauthorized" }, 401, cors);
  if (!env.MAIN_DB) return json({ error: "unavailable" }, 503, cors);

  let body: Record<string, unknown>;
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).length > BODY_MAX)
      return json({ error: "too_large" }, 413, cors);
    body = text ? (JSON.parse(text) as Record<string, unknown>) : {};
  } catch {
    return json({ error: "invalid" }, 400, cors);
  }
  const status = typeof body.status === "string" ? body.status : "";
  const from = typeof body.from === "string" ? body.from : "";
  const by = typeof body.by === "string" ? body.by.trim().slice(0, 64) : "";
  const note = typeof body.note === "string" ? body.note.trim() : "";
  const notify = body.notify === true;
  if (
    !Number.isInteger(id) ||
    id < 1 ||
    !STATUSES.has(status) ||
    !STATUSES.has(from) ||
    !by ||
    note.length > NOTE_MAX
  )
    return json({ error: "invalid" }, 400, cors);
  const closing = CLOSING.has(status);
  if (notify && closing && !note)
    return json({ error: "note_required" }, 400, cors);

  const db = env.MAIN_DB;
  const row = await db
    .prepare("SELECT id, status, email, locale FROM data_requests WHERE id = ?")
    .bind(id)
    .first<Row>();
  if (!row) return json({ error: "not_found" }, 404, cors);
  if (row.status !== from) return json({ error: "changed" }, 409, cors);
  if (!(NEXT[row.status] ?? []).includes(status))
    return json({ error: "not_allowed" }, 409, cors);

  // Guarded on the status the operator saw — a concurrent change makes this a no-op.
  const upd = await db
    .prepare("UPDATE data_requests SET status = ? WHERE id = ? AND status = ?")
    .bind(status, id, from)
    .run();
  if (!upd.meta.changes) return json({ error: "changed" }, 409, cors);
  const key = env.PII_ENCRYPTION_KEY;
  const ev = await db
    .prepare(
      "INSERT INTO data_request_events (request_id, status, note, actor, notified, at) VALUES (?, ?, ?, ?, 0, ?) RETURNING id",
    )
    .bind(
      id,
      status,
      await encField(note || null, key),
      by,
      new Date().toISOString(),
    )
    .first<{ id: number }>();

  let notified = false;
  if (notify && closing) {
    try {
      const to = (await decField(row.email, key)) ?? "";
      notified = await deps.sendClosed(env, {
        to,
        id,
        outcome: status as "done" | "rejected",
        note,
        locale: row.locale ?? "en",
      });
    } catch (error) {
      logger.error("data-request closing email failed", {
        name: (error as Error)?.name,
        message: (error as Error)?.message,
      });
    }
    if (notified && ev)
      await db
        .prepare("UPDATE data_request_events SET notified = 1 WHERE id = ?")
        .bind(ev.id)
        .run();
  }
  return json({ ok: true, status, notified }, 200, cors);
}
```

In `route.ts`: add `export` to `json`, `bearerOf`, `encField`, `decField`; the write becomes:

```ts
const inserted = await env.MAIN_DB.prepare(
  "INSERT INTO data_requests (request_type, email, message, status, submitted_at, source, locale, policy_version) VALUES (?, ?, ?, 'new', ?, ?, ?, ?) RETURNING id",
)
  .bind(
    requestType,
    emailStored,
    messageStored,
    submittedAt,
    source,
    locale,
    policyVersion,
  )
  .first<{ id: number }>();
id = inserted!.id;
```

(declare `let id = 0;` before the `try`), then after the try/catch:

```ts
// Best-effort receipt — a mail failure never fails a stored request.
try {
  await deps.sendReceipt(env, {
    to: email,
    id,
    requestType,
    locale: locale ?? "en",
    submittedAt,
  });
} catch (error) {
  logger.error("data-request receipt failed", {
    name: (error as Error)?.name,
    message: (error as Error)?.message,
  });
}
return json({ ok: true, id }, 201, cors);
```

with the signature `handleDataRequestWrite(request, env, deps: { sendReceipt: typeof sendDataRequestReceipt } = { sendReceipt: sendDataRequestReceipt })`. The list selects `submitted_at` already; map each row with `due_at: dueAt(r.submitted_at)` (import `dueAt` from `./status`).

In `index.ts`, after the `/v1/data-requests` line:

```ts
const dr = url.pathname.match(/^\/v1\/data-requests\/(\d+)(\/status)?$/);
if (dr)
  return dr[2]
    ? handleDataRequestStatus(request, env, Number(dr[1]))
    : handleDataRequestDetail(request, env, Number(dr[1]));
```

Until Task 2 lands, `email.ts` exports two stubs returning `false` so this compiles.

- [ ] **Step 5: Run — expect PASS**; then the whole api suite: `cd code/shared/api && npx vitest run` (all green).

- [ ] **Step 6: Commit** — `feat(api): data-request detail, status changes and history`

### Task 2: Api — receipt + closing emails (en/fr, Studio-editable)

**Files:**

- Modify: `code/shared/api/src/erasure/email.ts` (export `escapeHtml`; extract `fetchEmailStrings<T>(env, projection)` and make `fetchErasureEmailStrings` use it)
- Replace stubs: `code/shared/api/src/data-request/email.ts`
- Create: `code/shared/api/src/data-request/email.test.ts`

**Interfaces:**

- Produces: `sendDataRequestReceipt(env: MailEnv, { to, id, requestType, locale, submittedAt }, fetchStrings?) => Promise<boolean>`; `sendDataRequestClosedEmail(env, { to, id, outcome: "done" | "rejected", note, locale }, fetchStrings?) => Promise<boolean>` — `true` only when Resend accepted it; `false` when unconfigured or the Studio group says `enabled: false`; throws on a Resend error.

- [ ] **Step 1: Failing tests** (`email.test.ts`, fetch stubbed like `erasure/email.test.ts`):

```ts
import { afterEach, describe, expect, it, vi } from "vitest";
import { sendDataRequestClosedEmail, sendDataRequestReceipt } from "./email";

const ON = { RESEND_API_KEY: "k", EMAIL_FROM: "no-reply@x.com" };
const none = async () => null;
afterEach(() => vi.unstubAllGlobals());
function okFetch() {
  const f = vi.fn(
    async (_u: string, _i?: RequestInit) =>
      ({ ok: true, status: 200 }) as Response,
  );
  vi.stubGlobal("fetch", f);
  return f;
}
const sent = (f: ReturnType<typeof okFetch>) =>
  JSON.parse(f.mock.calls[0]![1]!.body as string) as {
    to: string;
    subject: string;
    html: string;
    text: string;
  };
const base = {
  to: "jane@example.com",
  id: 12,
  requestType: "access",
  submittedAt: "2026-10-01T08:30:00.000Z",
};

describe("sendDataRequestReceipt", () => {
  it("sends the English receipt with the right, the reference and the due date", async () => {
    const f = okFetch();
    expect(
      await sendDataRequestReceipt(ON, { ...base, locale: "en" }, none),
    ).toBe(true);
    const b = sent(f);
    expect(b.subject).toBe("We received your request (#12)");
    expect(b.text).toContain("access request (reference #12)");
    expect(b.text).toContain("1 November 2026");
  });
  it("sends French to a French requester", async () => {
    const f = okFetch();
    await sendDataRequestReceipt(ON, { ...base, locale: "fr" }, none);
    const b = sent(f);
    expect(b.subject).toBe("Nous avons bien reçu votre demande (n° 12)");
    expect(b.text).toContain("demande d'accès");
    expect(b.text).toContain("1 novembre 2026");
  });
  it("uses the Studio copy with placeholders when set", async () => {
    const f = okFetch();
    await sendDataRequestReceipt(ON, { ...base, locale: "en" }, async () => ({
      dataRequestReceipt: { subject: { en: "Ref {{id}} — {{right}}" } },
    }));
    expect(sent(f).subject).toBe("Ref 12 — access");
  });
  it("returns false (no send) when unconfigured or disabled in Studio", async () => {
    const f = okFetch();
    expect(
      await sendDataRequestReceipt({}, { ...base, locale: "en" }, none),
    ).toBe(false);
    expect(
      await sendDataRequestReceipt(ON, { ...base, locale: "en" }, async () => ({
        dataRequestReceipt: { enabled: false },
      })),
    ).toBe(false);
    expect(f).not.toHaveBeenCalled();
  });
});

describe("sendDataRequestClosedEmail", () => {
  it("sends the outcome and the escaped note, line breaks kept", async () => {
    const f = okFetch();
    await sendDataRequestClosedEmail(
      ON,
      {
        to: "j@x.com",
        id: 12,
        outcome: "rejected",
        note: "No.\n<script>x</script>",
        locale: "en",
      },
      none,
    );
    const b = sent(f);
    expect(b.subject).toBe("Your request #12 was declined");
    expect(b.html).toContain("No.<br>&lt;script&gt;");
    expect(b.html).not.toContain("<script>x");
  });
  it("is French for a French requester", async () => {
    const f = okFetch();
    await sendDataRequestClosedEmail(
      ON,
      { to: "j@x.com", id: 12, outcome: "done", note: "Fait.", locale: "fr" },
      none,
    );
    expect(sent(f).subject).toBe("Votre demande n° 12 est traitée");
  });
  it("throws on a Resend error (the caller reports notified: false)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: false, status: 500 }) as Response),
    );
    await expect(
      sendDataRequestClosedEmail(
        ON,
        { to: "j@x.com", id: 1, outcome: "done", note: "x", locale: "en" },
        none,
      ),
    ).rejects.toThrow("resend 500");
  });
});
```

- [ ] **Step 2: Run — expect FAIL** (stubs return false)

- [ ] **Step 3: Implement** — in `erasure/email.ts`: `export function escapeHtml`, and

```ts
/** Raw GROQ-over-HTTP for one `emailStrings` projection. Never throws — null on any failure. */
export async function fetchEmailStrings<T>(
  env: MailEnv,
  projection: string,
): Promise<T | null> {
  if (!env.SANITY_PROJECT_ID || !env.SANITY_DATASET) return null;
  try {
    const version = env.SANITY_API_VERSION || "2025-01-01";
    const token = env.SANITY_API_READ_TOKEN;
    const host = token
      ? `${env.SANITY_PROJECT_ID}.api.sanity.io`
      : `${env.SANITY_PROJECT_ID}.apicdn.sanity.io`;
    const query = `*[_type=="emailStrings"][0]${projection}`;
    const endpoint = `https://${host}/v${version}/data/query/${env.SANITY_DATASET}?query=${encodeURIComponent(query)}`;
    const res = await fetchWithTimeout(
      endpoint,
      token ? { headers: { authorization: `Bearer ${token}` } } : undefined,
    );
    if (!res.ok) return null;
    return ((await res.json()) as { result?: T }).result ?? null;
  } catch {
    return null;
  }
}
```

`fetchErasureEmailStrings` becomes `fetchEmailStrings<ErasureEmailStrings>(env, "{ erasureToken{enabled,subject,heading,intro,buttonLabel,outro}, erasureComplete{enabled,subject,heading,intro,outro}, supportEmail, bccAll }")`.

`data-request/email.ts`:

```ts
/**
 * Send the data-request receipt and closing emails, in the requester's language.
 *
 * @see docs/reference/shared/api/src/data-request/email.md
 */
import { pickLocale } from "@indiecrafts/packages-shared-config";
import {
  escapeHtml,
  fetchEmailStrings,
  resend,
  supportFooter,
  type MailEnv,
} from "../erasure/email";
import { dueAt } from "./status";

type L = "en" | "fr";
type LocaleValue =
  Record<string, string | undefined> | string | null | undefined;
type Group = {
  enabled?: boolean;
  subject?: LocaleValue;
  heading?: LocaleValue;
  intro?: LocaleValue;
  outro?: LocaleValue;
};
type Strings = {
  dataRequestReceipt?: Group;
  dataRequestClosed?: Group;
  supportEmail?: string;
  bccAll?: string;
};

const lang = (locale: string | null | undefined): L =>
  locale?.startsWith("fr") ? "fr" : "en";
const pick = (v: LocaleValue, l: L) => pickLocale(v, l) || undefined;
const fill = (s: string, vars: Record<string, string>) =>
  s.replace(/\{\{(\w+)\}\}/g, (m, k: string) => vars[k] ?? m);
const para = (s: string) => `<p>${escapeHtml(s).replaceAll("\n", "<br>")}</p>`;

const RIGHTS: Record<L, Record<string, string>> = {
  en: {
    access: "access",
    rectification: "rectification",
    erasure: "erasure",
    restriction: "restriction",
    portability: "portability",
    objection: "objection",
    "withdraw-consent": "consent withdrawal",
  },
  fr: {
    access: "d'accès",
    rectification: "de rectification",
    erasure: "d'effacement",
    restriction: "de limitation du traitement",
    portability: "de portabilité",
    objection: "d'opposition",
    "withdraw-consent": "de retrait du consentement",
  },
};
const RECEIPT: Record<
  L,
  Required<Record<"subject" | "heading" | "intro" | "outro", string>>
> = {
  en: {
    subject: "We received your request (#{{id}})",
    heading: "We received your request.",
    intro:
      "Your {{right}} request (reference #{{id}}) has reached us. We will answer by {{due}} at the latest.",
    outro: "If you did not send this request, you can ignore this email.",
  },
  fr: {
    subject: "Nous avons bien reçu votre demande (n° {{id}})",
    heading: "Nous avons bien reçu votre demande.",
    intro:
      "Votre demande {{right}} (référence n° {{id}}) nous est parvenue. Nous vous répondrons au plus tard le {{due}}.",
    outro:
      "Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.",
  },
};
const OUTCOME: Record<L, Record<"done" | "rejected", string>> = {
  en: { done: "is complete", rejected: "was declined" },
  fr: { done: "est traitée", rejected: "a été refusée" },
};
const CLOSED: Record<L, Record<"subject" | "heading" | "outro", string>> = {
  en: {
    subject: "Your request #{{id}} {{outcome}}",
    heading: "Your request #{{id}} {{outcome}}.",
    outro: "Reference #{{id}}.",
  },
  fr: {
    subject: "Votre demande n° {{id}} {{outcome}}",
    heading: "Votre demande n° {{id}} {{outcome}}.",
    outro: "Référence n° {{id}}.",
  },
};

const fetchDataRequestStrings = (env: MailEnv) =>
  fetchEmailStrings<Strings>(
    env,
    "{ dataRequestReceipt{enabled,subject,heading,intro,outro}, dataRequestClosed{enabled,subject,heading,intro,outro}, supportEmail, bccAll }",
  );

const formatDue = (iso: string, l: L) =>
  new Intl.DateTimeFormat(l === "fr" ? "fr-FR" : "en-GB", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(iso));

export async function sendDataRequestReceipt(
  env: MailEnv,
  {
    to,
    id,
    requestType,
    locale,
    submittedAt,
  }: {
    to: string;
    id: number;
    requestType: string;
    locale: string;
    submittedAt: string;
  },
  fetchStrings: (
    env: MailEnv,
  ) => Promise<Strings | null> = fetchDataRequestStrings,
): Promise<boolean> {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) return false;
  const copy = await fetchStrings(env).catch(() => null);
  const g = copy?.dataRequestReceipt;
  if (g?.enabled === false) return false;
  const l = lang(locale);
  const d = RECEIPT[l];
  const vars = {
    id: String(id),
    right: RIGHTS[l][requestType] ?? requestType,
    due: formatDue(dueAt(submittedAt), l),
  };
  const [subject, heading, intro, outro] = (
    ["subject", "heading", "intro", "outro"] as const
  ).map((k) => fill(pick(g?.[k], l) || d[k], vars));
  const foot = supportFooter(copy?.supportEmail);
  await resend(env, {
    to,
    subject: subject!,
    html: `${para(heading!)}${para(intro!)}${para(outro!)}${foot.html}`,
    text: `${heading}\n\n${intro}\n\n${outro}${foot.text}`,
    bcc: copy?.bccAll,
  });
  return true;
}

export async function sendDataRequestClosedEmail(
  env: MailEnv,
  {
    to,
    id,
    outcome,
    note,
    locale,
  }: {
    to: string;
    id: number;
    outcome: "done" | "rejected";
    note: string;
    locale: string;
  },
  fetchStrings: (
    env: MailEnv,
  ) => Promise<Strings | null> = fetchDataRequestStrings,
): Promise<boolean> {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) return false;
  const copy = await fetchStrings(env).catch(() => null);
  const g = copy?.dataRequestClosed;
  if (g?.enabled === false) return false;
  const l = lang(locale);
  const vars = { id: String(id), outcome: OUTCOME[l][outcome] };
  const subject = fill(pick(g?.subject, l) || CLOSED[l].subject, vars);
  const heading = fill(pick(g?.heading, l) || CLOSED[l].heading, vars);
  const intro = pick(g?.intro, l);
  const outro = fill(pick(g?.outro, l) || CLOSED[l].outro, vars);
  const foot = supportFooter(copy?.supportEmail);
  await resend(env, {
    to,
    subject,
    html: `${para(heading)}${intro ? para(fill(intro, vars)) : ""}${para(note)}${para(outro)}${foot.html}`,
    text: `${heading}\n\n${intro ? `${fill(intro, vars)}\n\n` : ""}${note}\n\n${outro}${foot.text}`,
    bcc: copy?.bccAll,
  });
  return true;
}
```

- [ ] **Step 4: Run — expect PASS**; whole api suite green.
- [ ] **Step 5: Commit** — `feat(api): data-request receipt and closing emails (en/fr)`

### Task 3: Cron — a purged request takes its history with it

**Files:** Modify `code/shared/cron/src/index.test.ts` (extend the data_requests purge test).

- [ ] **Step 1: Test** — in the existing "purges a data_requests row past the 365-day retention" test, insert an event for the old row before `runTick()`:

```ts
const old = await env.MAIN_DB.prepare(
  "SELECT id FROM data_requests WHERE email = 'old-dsar@example.com'",
).first<{ id: number }>();
await env.MAIN_DB.prepare(
  "INSERT INTO data_request_events (request_id, status, actor, at) VALUES (?, 'done', 'u', ?)",
)
  .bind(old!.id, oldDataRequestAt)
  .run();
```

and after it: `expect(await env.MAIN_DB.prepare("SELECT id FROM data_request_events WHERE request_id = ?").bind(old!.id).first()).toBeNull();`

- [ ] **Step 2: Run** `cd code/shared/cron && npx vitest run`. If the event survives (FKs off), add after the `data_requests` delete in `mainPurge`: `data_request_events: await run("DELETE FROM data_request_events WHERE request_id NOT IN (SELECT id FROM data_requests) AND at < ?", c.dataRequest)` and re-run. Expected: PASS.
- [ ] **Step 3: Commit** — `test(cron): a purged data request takes its history`

### Task 4: Studio — the two editable email groups

**Files:** Modify `code/packages/web/compliance/src/sanity/email.ts`.

- [ ] **Step 1:** Append to `emailGroups`:

```ts
  confirmationGroup({
    name: "dataRequestReceipt",
    addressFields: false,
    title: "RGPD — accusé de réception (au demandeur)",
    description:
      "E-mail envoyé par le worker API au demandeur dès sa demande enregistrée, dans sa langue. Modèles : {{id}} (référence), {{right}} (le droit), {{due}} (date limite de réponse). Champs vides = texte intégré (anglais / français).",
    enabledHint: "Décoché = aucun accusé de réception envoyé.",
    subjectHint: "Vide = « Nous avons bien reçu votre demande (n° {{id}}) ».",
    introHint: "Vide = rappel du droit, de la référence et de la date limite.",
    outroHint: "Vide = « Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail. »",
  }),
  confirmationGroup({
    name: "dataRequestClosed",
    addressFields: false,
    title: "RGPD — demande clôturée (au demandeur)",
    description:
      "E-mail envoyé quand l'équipe marque une demande traitée ou refusée depuis l'admin. Le corps est la note de l'opérateur. Modèles : {{id}}, {{outcome}} (« est traitée » / « a été refusée »). Champs vides = texte intégré.",
    enabledHint: "Décoché = aucun e-mail de clôture, même si l'opérateur coche « envoyer ».",
    subjectHint: "Vide = « Votre demande n° {{id}} {{outcome}} ».",
    introHint: "Texte optionnel avant la note de l'opérateur.",
    outroHint: "Vide = « Référence n° {{id}}. »",
  }),
```

- [ ] **Step 2: Verify** — `cd code/packages/web/compliance && npx vitest run` and `pnpm tsc:fast` green; the website Studio schema still builds (`tsc`).
- [ ] **Step 3: Commit** — `feat(compliance): Studio copy for the data-request receipt and closing emails`

### Task 5: Website — alert links the exact request; the form promises the receipt

**Files:**

- Modify: `code/packages/web/compliance/src/requests/submit.ts` + `submit.test.ts`
- Modify: `code/projects/web/surfaces/website/messages/en.json`, `fr.json` (`legal.dataRequest.success`)

- [ ] **Step 1: Test** — in "links the alert to the admin data-requests screen from ADMIN_URL", the api mock answers `new Response(JSON.stringify({ ok: true, id: 12 }), { status: 201 })` and the expectation becomes `href="https://admin.example.com/data-requests?id=12"`.
- [ ] **Step 2: Run — FAIL.**
- [ ] **Step 3: Implement** — `adminReviewUrl(id?: number)` returns `${base}/data-requests${id ? `?id=${id}` : ""}`; after `res.ok`, `const { id } = (await res.json().catch(() => ({}))) as { id?: number };` and pass `id` through `notifyOwner(requestType, email, input.message, input.source, id)` to `reviewUrl: adminReviewUrl(id)`. Success copy: en "Thanks — we've received your request. A confirmation is on its way to your inbox, and we will reply within one month." · fr "Merci — nous avons bien reçu votre demande. Une confirmation arrive dans votre boîte mail, et nous vous répondrons sous un mois."
- [ ] **Step 4: Run — PASS** (`cd code/packages/web/compliance && npx vitest run`).
- [ ] **Step 5: Commit** — `feat(data-request): the alert opens the request; the form mentions the receipt`

### Task 6: Admin — Due column, side sheet, actions, prefilled replies

**Files:**

- Modify: `code/projects/web/surfaces/admin/src/lib/monitoring.ts` (+ test) — `due_at` on rows; `DataRequestDetail`; `fetchDataRequest(id)`
- Modify: `src/app/[locale]/(dashboard)/monitoring-actions.ts` (+ test) — `setDataRequestStatus`
- Modify: `src/lib/audit.ts` — event `"admin.data_request_status"`
- Modify: `src/app/[locale]/(dashboard)/data-requests-table.tsx` (+ test) — Due column (Overdue badge), the right is a link to `?id=`
- Create: `src/app/[locale]/(dashboard)/data-request-sheet.tsx` (+ `data-request-sheet.test.tsx`)
- Modify: `src/app/[locale]/(dashboard)/data-requests/page.tsx` — `searchParams.id` → detail + prefill
- Modify: `messages/en.json`, `messages/fr.json`

**Interfaces:**

- Consumes: Task 1 detail + status routes.
- Produces: `fetchDataRequest(id: number): Promise<DataRequestDetail | null>`; `setDataRequestStatus(id: number, from: string, status: string, note: string, notify: boolean): Promise<{ ok: true; notified: boolean } | { ok: false; error: "forbidden" | "invalid" | "unreachable" | "failed" | "note_required" | "not_allowed" | "changed" | "not_found" }>`; `<DataRequestSheet request={DataRequestDetail} prefill={{ done: string; rejected: string }} />`.

- [ ] **Step 1: Failing tests**

`monitoring.test.ts`:

```ts
describe("fetchDataRequest", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });
  it("returns the detail, or null when it cannot load", async () => {
    vi.stubEnv("API_URL", "http://api.test");
    vi.stubEnv("APP_API_TOKEN", "t");
    const data = { id: 7, status: "new", events: [] };
    const f = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ data }), { status: 200 }),
      );
    vi.stubGlobal("fetch", f);
    expect(await fetchDataRequest(7)).toEqual(data);
    expect(f).toHaveBeenCalledWith(
      "http://api.test/v1/data-requests/7",
      expect.anything(),
    );
    f.mockResolvedValue(new Response("", { status: 404 }));
    expect(await fetchDataRequest(7)).toBeNull();
  });
});
```

`monitoring-actions.test.ts`: add `["setDataRequestStatus", () => setDataRequestStatus(7, "new", "done", "x", true)]` to the non-admin table, and:

```ts
describe("setDataRequestStatus", () => {
  it("POSTs the change with the actor and audits", async () => {
    authMock.mockResolvedValue(admin);
    fetchMock.mockResolvedValue(
      reply(200, { ok: true, status: "done", notified: true }),
    );
    expect(
      await setDataRequestStatus(7, "in-progress", "done", " Done. ", true),
    ).toEqual({ ok: true, notified: true });
    expect(fetchMock).toHaveBeenCalledWith(
      "http://api.test/v1/data-requests/7/status",
      expect.objectContaining({
        body: JSON.stringify({
          status: "done",
          from: "in-progress",
          note: "Done.",
          notify: true,
          by: "user_admin1",
        }),
      }),
    );
    expect(auditMock).toHaveBeenCalledWith("admin.data_request_status", {
      actor: "user_admin1",
      target: "data-request:7",
    });
  });
  it("note_required before any call when emailing without a note", async () => {
    authMock.mockResolvedValue(admin);
    expect(await setDataRequestStatus(7, "new", "done", "  ", true)).toEqual({
      ok: false,
      error: "note_required",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it.each([
    [409, "changed"],
    [409, "not_allowed"],
    [404, "not_found"],
  ] as const)("maps %i %s", async (status, error) => {
    authMock.mockResolvedValue(admin);
    fetchMock.mockResolvedValue(reply(status, { error }));
    expect(await setDataRequestStatus(7, "new", "done", "x", false)).toEqual({
      ok: false,
      error,
    });
  });
});
```

`data-request-sheet.test.tsx`:

```tsx
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import messages from "../../../../messages/en.json";
import { DataRequestSheet } from "./data-request-sheet";
import type { DataRequestDetail } from "@/lib/monitoring";

const { setDataRequestStatus, toast } = vi.hoisted(() => ({
  setDataRequestStatus: vi.fn(),
  toast: { success: vi.fn(), warning: vi.fn(), error: vi.fn() },
}));
vi.mock("./monitoring-actions", () => ({ setDataRequestStatus }));
vi.mock("@/i18n/routing", () => ({
  useRouter: () => ({ refresh: vi.fn(), replace: vi.fn() }),
}));
vi.mock("sonner", () => ({ toast }));

const req = (status: string): DataRequestDetail => ({
  id: 7,
  request_type: "access",
  email: "jane@example.com",
  message: "Send me my data.",
  status,
  submitted_at: "2026-10-01T08:30:00.000Z",
  due_at: "2026-11-01T08:30:00.000Z",
  source: "/fr/exercer-mes-droits",
  locale: "fr",
  policy_version: "2026-01-01",
  events: [
    {
      id: 1,
      status: "in-progress",
      note: null,
      actor: "user_a",
      notified: false,
      at: "2026-10-02T09:00:00.000Z",
    },
  ],
});
const prefill = {
  done: "Bonjour, demande traitée.",
  rejected: "Bonjour, motif :",
};
const renderSheet = (status = "new") =>
  render(
    <NextIntlClientProvider locale="en" messages={messages} timeZone="UTC">
      <DataRequestSheet request={req(status)} prefill={prefill} />
    </NextIntlClientProvider>,
  );

describe("DataRequestSheet", () => {
  it("shows the request: email link, full message, due date, history", () => {
    renderSheet();
    expect(
      screen
        .getByRole("link", { name: "jane@example.com" })
        .getAttribute("href"),
    ).toBe("mailto:jane@example.com");
    expect(screen.getByText("Send me my data.")).toBeTruthy();
    expect(screen.getByText(/Nov 1, 2026/)).toBeTruthy();
    expect(screen.getByText(/user_a/)).toBeTruthy();
  });
  it("offers only the moves the status allows", () => {
    renderSheet("in-progress");
    expect(screen.queryByRole("button", { name: "Start" })).toBeNull();
    expect(screen.getByRole("button", { name: "Mark done" })).toBeTruthy();
    renderSheet("done");
    expect(screen.getByText("This request is closed.")).toBeTruthy();
  });
  it("prefills the reply in the requester's language and sends it", async () => {
    const user = userEvent.setup();
    setDataRequestStatus.mockResolvedValue({ ok: true, notified: true });
    renderSheet("new");
    await user.click(screen.getByRole("button", { name: "Mark done" }));
    const note = screen.getByLabelText(
      "Reply to the requester",
    ) as HTMLTextAreaElement;
    expect(note.value).toBe("Bonjour, demande traitée.");
    expect(
      (
        screen.getByLabelText("Email the requester") as HTMLInputElement
      ).getAttribute("data-state"),
    ).toBe("checked");
    await user.click(screen.getByRole("button", { name: "Confirm: done" }));
    expect(setDataRequestStatus).toHaveBeenCalledWith(
      7,
      "new",
      "done",
      "Bonjour, demande traitée.",
      true,
    );
    expect(toast.success).toHaveBeenCalled();
  });
  it("blocks sending an empty reply, and warns when the email was not sent", async () => {
    const user = userEvent.setup();
    setDataRequestStatus.mockResolvedValue({ ok: true, notified: false });
    renderSheet("new");
    await user.click(screen.getByRole("button", { name: "Reject" }));
    const note = screen.getByLabelText("Reply to the requester");
    await user.clear(note);
    expect(
      (
        screen.getByRole("button", {
          name: "Confirm: rejected",
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
    await user.type(note, "Not our data.");
    await user.click(screen.getByRole("button", { name: "Confirm: rejected" }));
    expect(toast.warning).toHaveBeenCalled();
  });
});
```

`data-requests-table.test.tsx`: add `due_at` to the row; a test that an open row past due shows "Overdue" and a `done` row does not; and the right label is a link with `href` ending `?id=7`.

- [ ] **Step 2: Run — FAIL** (`cd code/projects/web/surfaces/admin && npx vitest run`).

- [ ] **Step 3: Implement**

`monitoring.ts`:

```ts
export type DataRequestRow = { /* existing fields */ due_at: string };
export type DataRequestEvent = {
  id: number;
  status: string;
  note: string | null;
  actor: string;
  notified: boolean;
  at: string;
};
export type DataRequestDetail = DataRequestRow & {
  policy_version: string | null;
  events: DataRequestEvent[];
};
export async function fetchDataRequest(
  id: number,
): Promise<DataRequestDetail | null> {
  if (!Number.isInteger(id) || id < 1) return null;
  return (
    (await getApi<{ data?: DataRequestDetail }>(`/v1/data-requests/${id}`))
      ?.data ?? null
  );
}
/** Open (`new` / `in-progress`) and past its due date. */
export const isOverdue = (
  r: Pick<DataRequestRow, "status" | "due_at">,
  now = Date.now(),
) =>
  (r.status === "new" || r.status === "in-progress") &&
  Date.parse(r.due_at) < now;
```

`monitoring-actions.ts`:

```ts
export type DataRequestStatusResult =
  | { ok: true; notified: boolean }
  | Fail<"note_required" | "not_allowed" | "changed" | "not_found">;

/** Move a data request; closing with `notify` emails the note to the requester (api-side). */
export async function setDataRequestStatus(
  id: number,
  from: string,
  status: string,
  note: string,
  notify: boolean,
): Promise<DataRequestStatusResult> {
  const actor = await adminId();
  if (!actor) return { ok: false, error: "forbidden" };
  if (!validId(id)) return { ok: false, error: "invalid" };
  const text = note.trim();
  if (notify && !text) return { ok: false, error: "note_required" };
  if (text.length > 4000) return { ok: false, error: "invalid" };
  const res = await postApi(`/v1/data-requests/${id}/status`, {
    status,
    from,
    note: text,
    notify,
    by: actor,
  });
  await audit("admin.data_request_status", {
    actor,
    target: `data-request:${id}`,
  });
  if (!res) return { ok: false, error: "unreachable" };
  if (res.status === 200)
    return { ok: true, notified: res.data.notified === true };
  const known = [
    "note_required",
    "not_allowed",
    "changed",
    "not_found",
    "invalid",
  ] as const;
  return {
    ok: false,
    error: known.find((k) => k === res.data.error) ?? "failed",
  };
}
```

`data-request-sheet.tsx` (client): controlled `Sheet open` → on close `router.replace("/data-requests")`; header `#id` + right + status badge; a `<dl>` of facts (email `mailto:`, language, source, submitted and due with `useFormatter().dateTime(..., { dateStyle: "medium", timeStyle: "short" })`, an "Overdue" badge when `isOverdue`, policy version); the message `whitespace-pre-wrap`; history list (status word, note, actor, time, "email sent" when `notified`); actions by status (`new`: Start, Mark done, Reject · `in-progress`: Mark done, Reject · closed: "This request is closed."). Start calls `setDataRequestStatus(id, status, "in-progress", "", false)` directly. Mark done / Reject open an inline form: `Textarea` (`aria`-labelled "Reply to the requester", prefilled with `prefill.done` / `prefill.rejected`, `maxLength={4000}`), a `Checkbox` "Email the requester" (default checked), Cancel, and "Confirm: done|rejected" disabled while pending or when emailing with an empty note. Results: ok + notified → `toast.success(t("saved"))`; ok + not notified while emailing → `toast.warning(t("savedNoEmail"))`; error → `toast.error(t(`errors.${error}`))`; then `router.refresh()`. Use `useTranslations("admin.dataRequests")`; split into `DataRequestSheet` + `DataRequestActions` in the same file if it nears 200 lines.

`data-requests-table.tsx`: add a "Due" column (`format.dateTime(due_at, { dateStyle: "medium" })` + `<Badge variant="destructive">{t("overdue")}</Badge>` when `isOverdue`); render the right as `<Link href={{ pathname: "/data-requests", query: { id: row.id } }}>` (from `@/i18n/routing`).

`page.tsx`:

```tsx
export default async function DataRequestsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ id?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.dataRequests");
  const [rows, { id }] = await Promise.all([fetchDataRequests(), searchParams]);
  const detail = id ? await fetchDataRequest(Number(id)) : null;
  // The prefilled reply speaks the REQUESTER's language, whatever the admin's UI locale.
  let prefill = { done: "", rejected: "" };
  if (detail) {
    const rl = detail.locale?.startsWith("fr") ? "fr" : "en";
    const r = await getTranslations({
      locale: rl,
      namespace: "admin.dataRequests",
    });
    const right = r.has(`types.${detail.request_type}`)
      ? r(`types.${detail.request_type}`)
      : detail.request_type;
    prefill = {
      done: r("replies.done", { id: detail.id, right }),
      rejected: r("replies.rejected", { id: detail.id, right }),
    };
  }
  return (
    /* existing layout */ <>
      {/* … */}
      {detail ? <DataRequestSheet request={detail} prefill={prefill} /> : null}
    </>
  );
}
```

Messages (`admin.dataRequests`, en / fr):

```json
"due": "Due" / "Échéance",
"overdue": "Overdue" / "En retard",
"open": "Open request #{id}" / "Ouvrir la demande n° {id}",
"sheet": { "facts": "Request" / "Demande", "language": "Language" / "Langue", "source": "Source" / "Source", "submitted": "Submitted" / "Reçue", "policy": "Policy version" / "Version de la politique", "message": "Message" / "Message", "history": "History" / "Historique", "noHistory": "No action yet." / "Aucune action pour l'instant.", "emailSent": "email sent" / "e-mail envoyé", "by": "by {actor}" / "par {actor}", "closed": "This request is closed." / "Cette demande est clôturée." },
"actions": { "start": "Start" / "Démarrer", "done": "Mark done" / "Marquer traitée", "reject": "Reject" / "Refuser", "reply": "Reply to the requester" / "Réponse au demandeur", "notify": "Email the requester" / "Envoyer l'e-mail au demandeur", "cancel": "Cancel" / "Annuler", "confirm": "Confirm: {status}" / "Confirmer : {status}", "saved": "Saved." / "Enregistré.", "savedNoEmail": "Saved — the email was not sent." / "Enregistré — l'e-mail n'a pas été envoyé.", "errors": { "forbidden": "…", "invalid": "…", "unreachable": "…", "failed": "…", "note_required": "Write the reply first." / "Rédigez d'abord la réponse.", "not_allowed": "This change is not allowed." / "Ce changement n'est pas autorisé.", "changed": "Someone changed this request — reload." / "Quelqu'un a modifié cette demande — rechargez.", "not_found": "Request not found." / "Demande introuvable." } },
"statuses": { …existing…, "rejected": "Rejected" / "Refusée" },
"replies": {
  "done": "Hello,\n\nWe have handled your request \"{right}\" (reference #{id}). The requested action is complete.\n\nIf you have a question, reply to the support address below.\n\nKind regards" /
          "Bonjour,\n\nNous avons traité votre demande « {right} » (référence n° {id}). L'action demandée est effectuée.\n\nPour toute question, écrivez à l'adresse d'assistance ci-dessous.\n\nCordialement",
  "rejected": "Hello,\n\nWe cannot act on your request \"{right}\" (reference #{id}).\n\nReason: \n\nYou can lodge a complaint with your data protection authority.\n\nKind regards" /
              "Bonjour,\n\nNous ne pouvons pas donner suite à votre demande « {right} » (référence n° {id}).\n\nMotif : \n\nVous pouvez introduire une réclamation auprès de la CNIL.\n\nCordialement"
}
```

(The `"confirm"` `{status}` takes the `statuses.*` word; the tests use the English "Confirm: done" — pass the raw `done` / `rejected` key to keep the accessible name stable, or adjust the test strings to the rendered word. Pick one and keep test + messages aligned.)

`audit.ts`: add `| "admin.data_request_status"` to the event union.

- [ ] **Step 4: Run — PASS**: `cd code/projects/web/surfaces/admin && npx vitest run && npx tsc --noEmit -p .`
- [ ] **Step 5: Commit** — `feat(admin): data-request side sheet with actions and prefilled replies`

### Task 7: Docs, changelogs, verification

- [ ] Reference pages (doc-coverage): `code/docs/reference/shared/api/src/data-request/status.md`, `…/email.md`, `code/docs/reference/projects/web/admin/src/app/locale/(dashboard)/data-request-sheet.md` (frontmatter `title` / `description` / `status`, Purpose / Exports / Usage / Source like the siblings).
- [ ] Update: `code/docs/shared/api/index.md` (routes table: detail + status), `code/docs/packages/web/compliance.md` (DSAR: receipt, sheet, actions, closing email, Studio groups), `code/docs/projects/web/website/config/data-retention.md` (`data_request_events`, cascade with the 365-day purge), `code/docs/projects/web/admin/index.md` (`/data-requests` row).
- [ ] CHANGELOGs: api (routes, history, emails), admin (sheet, actions, Due), packages (Studio groups, alert link), website (success copy).
- [ ] Gates: `pnpm tsc:fast`, api + cron + admin + compliance suites, `pnpm test:scripts`, `pnpm check:doc-coverage`, `pnpm check:claude-md`, `pnpm check:tags`, `pnpm --filter @indiecrafts/web-surfaces-website doctor:changed`, `pnpm docs:build`.
- [ ] Local migration: `pnpm db:migrate:local`; live run (servers only now): submit on the website → receipt in the inbox (`delivered@resend.dev` for a dry run) → admin `/data-requests?id=<n>` → Start → Mark done with email (French request → French reply) → closing email → history shows both events. Stop servers.
- [ ] Final review by a fresh reviewer (most capable model) over `main..HEAD`; fix Critical/Important test-first; ledger minors.
- [ ] Runbook card 25: update the note; tick what was verified.
