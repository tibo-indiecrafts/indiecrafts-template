/**
 * Replay-safe POSTs: an Idempotency-Key maps to the stored result for 24 h.
 *
 * @see docs/reference/shared/api/src/idempotency.md
 */
// Applies to POST /v1/events only (the append route) — the other mutations are idempotent by
// key already (ON CONFLICT / INSERT OR IGNORE). /v1/export is deliberately NOT wrapped: its
// answer holds a live single-use download link, which must never be stored. A key is reserved
// only for a caller holding the server bearer with a body inside the route's cap, so an
// unauthenticated request never writes here. The scope hashes the `authorization` header, so a
// key never replays another caller's answer. A 5xx, 429 or throw releases the key; a key left
// unfinished for 30 s (a first attempt cut off mid-flight) is taken over by the retry. A row
// holds a hash and the route's response (`{ ok }`), never the request body. The cron's
// audit_purge drops rows after 24 h.
import { safeEqual, type Env } from "./index";

const ROUTES = new Set(["/v1/events"]);
const KEY_RE = /^[\x21-\x7e]{1,255}$/;
const BODY_CAP = 4000; // mirrors BODY_MAX in index.ts (the events route's own cap)
const ABANDONED_MS = 30_000;

async function sha256(text: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text),
  );
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

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
  handler: (request: Request) => Promise<Response>,
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

  // Only an authorized caller with a body inside the cap may write a key — anyone else gets
  // the route's own 401 / 413, with nothing stored and nothing read here.
  const bearer = (request.headers.get("authorization") ?? "").replace(
    /^Bearer\s+/i,
    "",
  );
  const length = Number(request.headers.get("content-length"));
  if (
    !env.APP_API_TOKEN ||
    !bearer ||
    !safeEqual(bearer, env.APP_API_TOKEN) ||
    !Number.isFinite(length) ||
    length > BODY_CAP
  )
    return handler(request);
  if (!KEY_RE.test(key)) return reply("invalid_idempotency_key", 400);

  const db = env.AUDIT_DB;
  const scope = `${path}:${await sha256(request.headers.get("authorization") ?? "")}`;
  const hash = await sha256(await request.clone().text());
  const forget = () =>
    db
      .prepare("DELETE FROM idempotency_keys WHERE scope = ? AND key = ?")
      .bind(scope, key)
      .run();

  async function run(): Promise<Response> {
    let res: Response;
    try {
      res = await handler(request);
    } catch (error) {
      await forget();
      throw error;
    }
    if (res.status >= 500 || res.status === 429) {
      await forget();
      return res;
    }
    await db
      .prepare(
        "UPDATE idempotency_keys SET status = ?, body = ? WHERE scope = ? AND key = ?",
      )
      .bind(res.status, await res.clone().text(), scope, key)
      .run();
    return res;
  }

  const reserved = await db
    .prepare(
      "INSERT OR IGNORE INTO idempotency_keys (scope, key, request_hash, status, body, created_at) VALUES (?, ?, ?, NULL, NULL, ?)",
    )
    .bind(scope, key, hash, new Date().toISOString())
    .run();
  if (reserved.meta?.changes) return run();

  const row = await db
    .prepare(
      "SELECT request_hash, status, body, created_at FROM idempotency_keys WHERE scope = ? AND key = ?",
    )
    .bind(scope, key)
    .first<{
      request_hash: string;
      status: number | null;
      body: string | null;
      created_at: string;
    }>();
  if (row && row.request_hash !== hash)
    return reply("idempotency_key_reused", 422);
  if (!row) return reply("idempotency_in_progress", 409);
  if (row.status === null) {
    // Still running — unless abandoned (the first attempt's client timed out and the Worker was
    // cancelled before it could store or release). Take it over atomically.
    const stale = Date.parse(row.created_at) < Date.now() - ABANDONED_MS;
    const taken =
      stale &&
      (
        await db
          .prepare(
            "UPDATE idempotency_keys SET created_at = ? WHERE scope = ? AND key = ? AND status IS NULL AND created_at = ?",
          )
          .bind(new Date().toISOString(), scope, key, row.created_at)
          .run()
      ).meta?.changes;
    if (!taken) return reply("idempotency_in_progress", 409);
    return run();
  }
  return new Response(row.body, {
    status: row.status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
      "idempotent-replayed": "true",
    },
  });
}
