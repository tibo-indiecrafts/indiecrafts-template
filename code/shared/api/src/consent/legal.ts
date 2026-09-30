/**
 * Handles the authenticated legal re-acceptance endpoint (GET reads, POST records).
 *
 * @see docs/reference/shared/api/src/consent/legal.md
 */
// Legal re-acceptance — the AUTHENTICATED self-service endpoint that makes the "policies
// updated" banner follow a SIGNED-IN user across every surface (website · app, incl. the Capacitor shell):
// accept on one, cleared on all. The Clerk session JWT proves identity; keyed on the JWT
// `sub`, no bearer token exposed to the client. Anonymous visitors keep their per-surface
// local deposit (cookie / localStorage) — there is no shared identity to sync them by.
//
//   GET  /v1/consent/legal → { legal_acked_version: string | null }
//   POST /v1/consent/legal  { version: string, surface?: string } → { ok: true }
//
// A POST writes the append-only proof (consent_events, one row per accepted version via
// INSERT OR IGNORE) and updates the current-state column (user_profiles.legal_acked_version).
import { type Env, clientIp } from "../index";
import { verifyUserId } from "./marketing";

const BODY_MAX = 4000;
const VERSION_MAX = 64;

// Called client→api with `Authorization: Bearer <jwt>`, so allow the `authorization` header.
// `*` origin is safe: the request is never credentialed (the token is set explicitly).
const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "authorization, content-type",
};

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...CORS },
  });
}

export async function handleLegalConsent(
  request: Request,
  env: Env,
  _ctx?: ExecutionContext,
  authenticate: (r: Request, e: Env) => Promise<string | null> = verifyUserId,
): Promise<Response> {
  if (request.method === "OPTIONS")
    return new Response(null, { status: 204, headers: CORS });
  if (request.method !== "GET" && request.method !== "POST")
    return json({ error: "method_not_allowed" }, 405);
  if (!env.MAIN_DB || !env.CLERK_SECRET_KEY)
    return json({ error: "unavailable" }, 503);

  if (env.RATELIMIT) {
    const { success } = await env.RATELIMIT.limit({
      key: clientIp(request),
    });
    if (!success) return json({ error: "rate_limited" }, 429);
  }

  const userId = await authenticate(request, env);
  if (!userId) return json({ error: "unauthorized" }, 401);

  if (request.method === "GET") {
    const row = await env.MAIN_DB.prepare(
      "SELECT legal_acked_version FROM user_profiles WHERE user_id = ?",
    )
      .bind(userId)
      .first<{ legal_acked_version: string | null }>();
    return json({ legal_acked_version: row?.legal_acked_version ?? null }, 200);
  }

  // POST — record the accepted version.
  if (Number(request.headers.get("content-length") ?? 0) > BODY_MAX)
    return json({ error: "too_large" }, 413);
  let body: { version?: unknown; surface?: unknown };
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).length > BODY_MAX)
      return json({ error: "too_large" }, 413);
    body = JSON.parse(text) as typeof body;
  } catch {
    return json({ error: "invalid" }, 400);
  }
  if (typeof body.version !== "string" || !body.version)
    return json({ error: "invalid" }, 400);
  const version = body.version.slice(0, VERSION_MAX);
  const surface =
    (typeof body.surface === "string" ? body.surface : "").slice(0, 16) ||
    "web";
  const now = new Date().toISOString();
  const country = request.headers.get("cf-ipcountry") ?? null;

  const prof = await env.MAIN_DB.prepare(
    "SELECT email_fingerprint FROM user_profiles WHERE user_id = ?",
  )
    .bind(userId)
    .first<{ email_fingerprint: string | null }>();

  // Append-only proof (one row per accepted version — idempotent on re-accept), then the cache.
  await env.MAIN_DB.prepare(
    "INSERT OR IGNORE INTO consent_events (ts, subject_type, subject_id, email_fingerprint, consent_type, granted, policy_version, surface, source, country, ip_hash, idempotency_key) " +
      "VALUES (?, 'user', ?, ?, 'legal_reaccept', 1, ?, ?, 'account', ?, NULL, ?)",
  )
    .bind(
      now,
      userId,
      prof?.email_fingerprint ?? null,
      version,
      surface,
      country,
      `legal:${userId}:${version}`,
    )
    .run();
  await env.MAIN_DB.prepare(
    "UPDATE user_profiles SET legal_acked_version = ? WHERE user_id = ?",
  )
    .bind(version, userId)
    .run();

  return json({ ok: true }, 200);
}
