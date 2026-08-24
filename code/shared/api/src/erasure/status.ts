// GDPR erasure status — a public, read-only, no-PII poll of a request's lifecycle
// state by the plaintext token from the subject's email. Never returns the
// fingerprint, user id, token hash, or the engine receipt.
import { logger } from "@indiecrafts/packages-shared-logger";
import { sha256Hex } from "@indiecrafts/packages-shared-security/crypto";
import { type Env, PUBLIC_CORS } from "../index";

interface ErasureStatusRow {
  status: string;
  requested_at: string;
  due_at: string;
  completed_at: string | null;
}

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

export async function handleErasureStatus(
  request: Request,
  env: Env,
  token: string,
): Promise<Response> {
  if (request.method === "OPTIONS")
    return new Response(null, { status: 204, headers: PUBLIC_CORS });

  if (request.method !== "GET")
    return json({ error: "method_not_allowed" }, 405, PUBLIC_CORS);

  if (!env.DB) return json({ error: "unavailable" }, 503, PUBLIC_CORS);

  // sha256Hex throws on an empty input — guard before hashing.
  if (!token) return json({ error: "not_found" }, 404, PUBLIC_CORS);

  try {
    const row = await env.DB.prepare(
      "SELECT status, requested_at, due_at, completed_at FROM erasure_requests WHERE token_hash = ?",
    )
      .bind(await sha256Hex(token))
      .first<ErasureStatusRow>();
    if (!row) return json({ error: "not_found" }, 404, PUBLIC_CORS);

    return json(
      {
        status: row.status,
        requested_at: row.requested_at,
        due_at: row.due_at,
        completed_at: row.completed_at,
      },
      200,
      PUBLIC_CORS,
    );
  } catch (error) {
    logger.error("erasure status lookup failed", {
      name: (error as Error)?.name,
    });
    return json({ error: "server" }, 502, PUBLIC_CORS);
  }
}
