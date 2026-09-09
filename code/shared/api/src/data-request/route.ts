// DSAR (data-subject request) intake — the GDPR Art. 15–21 request form's write + read
// paths, migrated off Sanity into D1. `handleDataRequestWrite` is called server-to-server
// by the website's `withGuard`-protected `/api/data-request` route (Turnstile, rate-limit,
// origin, and body-cap already enforced there — this route re-checks only what a bearer
// caller could still get wrong). `handleDataRequestList` backs the admin screen.
import { logger } from "@indiecrafts/packages-shared-logger";
import { type Env, corsHeaders, safeEqual } from "../index";

// The 7 GDPR request types — mirrors `DATA_REQUEST_TYPES` in
// code/packages/web/compliance/src/requests/request-types.ts (the source of truth).
// Hard-coded here, not imported: that package is `web`-scoped (not a dependency of this
// bare Worker) and pulls in Sanity/Next-coupled deps this Worker doesn't carry.
const DATA_REQUEST_TYPES = new Set([
  "access",
  "rectification",
  "erasure",
  "restriction",
  "portability",
  "objection",
  "withdraw-consent",
]);

// Higher than the audit-event BODY_MAX (4000) — mirrors the website's own
// `security.dataRequest.bodyMax` (8000), which must fit the 4000-char free-text message.
const BODY_MAX = 8000;

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

function bearerOf(request: Request): string {
  return (request.headers.get("authorization") ?? "").replace(
    /^Bearer\s+/i,
    "",
  );
}

export async function handleDataRequestWrite(
  request: Request,
  env: Env,
): Promise<Response> {
  const cors = corsHeaders(request.headers.get("origin"));
  if (request.method === "OPTIONS")
    return new Response(null, { status: 204, headers: cors });
  if (request.method !== "POST")
    return json({ error: "method_not_allowed" }, 405, cors);

  const bearer = bearerOf(request);
  if (!env.APP_API_TOKEN || !bearer || !safeEqual(bearer, env.APP_API_TOKEN))
    return json({ error: "unauthorized" }, 401, cors);
  if (!env.MAIN_DB) return json({ error: "unavailable" }, 503, cors);

  if (Number(request.headers.get("content-length") ?? 0) > BODY_MAX)
    return json({ error: "too_large" }, 413, cors);

  let body: Record<string, unknown>;
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).length > BODY_MAX)
      return json({ error: "too_large" }, 413, cors);
    body = text ? (JSON.parse(text) as Record<string, unknown>) : {};
  } catch {
    return json({ error: "invalid" }, 400, cors);
  }

  const requestType =
    typeof body.requestType === "string" ? body.requestType : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!DATA_REQUEST_TYPES.has(requestType) || !email)
    return json({ error: "invalid" }, 400, cors);

  const message =
    typeof body.message === "string" && body.message
      ? body.message.slice(0, 4000)
      : null;
  const source =
    typeof body.source === "string" && body.source
      ? body.source.slice(0, 300)
      : null;
  const locale =
    typeof body.language === "string" && body.language
      ? body.language.slice(0, 12)
      : null;
  const policyVersion =
    typeof body.policyVersion === "string" && body.policyVersion
      ? body.policyVersion.slice(0, 120)
      : null;
  const submittedAt =
    typeof body.submittedAt === "string" && body.submittedAt
      ? body.submittedAt
      : new Date().toISOString();

  try {
    await env.MAIN_DB.prepare(
      "INSERT INTO data_requests (request_type, email, message, status, submitted_at, source, locale, policy_version) VALUES (?, ?, ?, 'new', ?, ?, ?, ?)",
    )
      .bind(
        requestType,
        email,
        message,
        submittedAt,
        source,
        locale,
        policyVersion,
      )
      .run();
  } catch (error) {
    // Never log email/message — only the error's name.
    logger.error("data-request write failed", {
      name: (error as Error)?.name,
    });
    return json({ error: "server" }, 502, cors);
  }
  return json({ ok: true }, 201, cors);
}

export async function handleDataRequestList(
  request: Request,
  env: Env,
): Promise<Response> {
  const cors = corsHeaders(request.headers.get("origin"));
  if (request.method !== "GET")
    return json({ error: "method_not_allowed" }, 405, cors);

  const bearer = bearerOf(request);
  if (!env.APP_API_TOKEN || !bearer || !safeEqual(bearer, env.APP_API_TOKEN))
    return json({ error: "unauthorized" }, 401, cors);
  if (!env.MAIN_DB) return json({ error: "unavailable" }, 503, cors);

  const url = new URL(request.url);
  // Clamp BOTH ends: a negative limit would become SQLite `LIMIT -1` (unbounded scan).
  const limit = Math.max(
    1,
    Math.min(Number(url.searchParams.get("limit") ?? 50) || 50, 200),
  );

  try {
    const { results } = await env.MAIN_DB.prepare(
      "SELECT id, request_type, email, message, status, submitted_at, source, locale FROM data_requests ORDER BY submitted_at DESC LIMIT ?",
    )
      .bind(limit)
      .all();
    return json({ data: results }, 200, cors);
  } catch (error) {
    logger.error("data-requests read failed", {
      name: (error as Error)?.name,
    });
    return json({ error: "server" }, 502, cors);
  }
}
