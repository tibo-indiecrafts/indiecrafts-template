/**
 * Replay-safe POSTs: an Idempotency-Key maps to the stored result for 24 h.
 *
 * @see docs/reference/shared/api/src/idempotency.md
 */
// Applies to the append routes only (/v1/events, /v1/export) — the other mutations are
// idempotent by key already (ON CONFLICT / INSERT OR IGNORE). The scope hashes the
// `authorization` header, so a key can never replay another caller's answer. A 5xx or 429 is
// not stored: the retry runs the handler again. The cron's audit_purge drops rows after 24 h.
import type { Env } from "./index";

const ROUTES = new Set(["/v1/events", "/v1/export"]);
const KEY_RE = /^[\x21-\x7e]{1,255}$/;

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
  if (!KEY_RE.test(key)) return reply("invalid_idempotency_key", 400);

  const db = env.AUDIT_DB;
  const scope = `${path}:${await sha256(request.headers.get("authorization") ?? "")}`;
  const hash = await sha256(await request.clone().text());
  const forget = () =>
    db
      .prepare("DELETE FROM idempotency_keys WHERE scope = ? AND key = ?")
      .bind(scope, key)
      .run();

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
        "cache-control": "no-store",
        "idempotent-replayed": "true",
      },
    });
  }

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
