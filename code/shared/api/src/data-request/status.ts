/**
 * Read one data request with its history, and move it through its statuses.
 *
 * @see docs/reference/shared/api/src/data-request/status.md
 */
// The operator side of a DSAR: the admin side sheet reads `GET /v1/data-requests/:id`
// and acts through `POST /v1/data-requests/:id/status`. Both are bearer-gated
// (APP_API_TOKEN, the admin's server action). A closing move can email the operator's
// note to the requester; a mail failure keeps the change (`notified: false`).
import { logger } from "@indiecrafts/packages-shared-logger";
import { type Env, corsHeaders, safeEqual } from "../index";
import { bearerOf, decField, dueAt, encField, json } from "./shared";
import { sendDataRequestClosedEmail } from "./email";

const STATUSES = new Set(["new", "in-progress", "done", "rejected"]);
// Allowed moves. A closed request (`done` / `rejected`) has none — no reopen.
const NEXT: Record<string, readonly string[]> = {
  new: ["in-progress", "done", "rejected"],
  "in-progress": ["done", "rejected"],
};
const CLOSING = new Set(["done", "rejected"]);
const NOTE_MAX = 4000;
const BODY_MAX = 8000;

function authed(request: Request, env: Env): boolean {
  const bearer = bearerOf(request);
  return Boolean(
    env.APP_API_TOKEN && bearer && safeEqual(bearer, env.APP_API_TOKEN),
  );
}

type EventRow = {
  id: number;
  status: string;
  note: string | null;
  actor: string;
  notified: number;
  at: string;
};

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
    .all<EventRow>();
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
    .first<{
      id: number;
      status: string;
      email: string | null;
      locale: string | null;
    }>();
  if (!row) return json({ error: "not_found" }, 404, cors);
  if (row.status !== from) return json({ error: "changed" }, 409, cors);
  if (!(NEXT[row.status] ?? []).includes(status))
    return json({ error: "not_allowed" }, 409, cors);

  // Encrypt first, then move + record in ONE transaction (a D1 batch): the history row is
  // written only when the guarded UPDATE changed the row (`changes()`), so a concurrent
  // change or a failure never leaves a status without its actor.
  const key = env.PII_ENCRYPTION_KEY;
  const noteStored = await encField(note || null, key);
  const [moved, recorded] = await db.batch([
    db
      .prepare(
        "UPDATE data_requests SET status = ? WHERE id = ? AND status = ?",
      )
      .bind(status, id, from),
    db
      .prepare(
        "INSERT INTO data_request_events (request_id, status, note, actor, notified, at) SELECT ?, ?, ?, ?, 0, ? WHERE changes() > 0 RETURNING id",
      )
      .bind(id, status, noteStored, by, new Date().toISOString()),
  ]);
  if (!moved?.meta.changes) return json({ error: "changed" }, 409, cors);
  const eventId = (recorded?.results[0] as { id: number } | undefined)?.id;

  let notified = false;
  if (notify && closing) {
    try {
      notified = await deps.sendClosed(env, {
        to: (await decField(row.email, key)) ?? "",
        id,
        outcome: status as "done" | "rejected",
        note,
        locale: row.locale ?? "en",
      });
    } catch (error) {
      // `message` is "resend <status>" — no PII.
      logger.error("data-request closing email failed", {
        name: (error as Error)?.name,
        message: (error as Error)?.message,
      });
    }
    if (notified && eventId)
      await db
        .prepare("UPDATE data_request_events SET notified = 1 WHERE id = ?")
        .bind(eventId)
        .run();
  }
  return json({ ok: true, status, notified }, 200, cors);
}
