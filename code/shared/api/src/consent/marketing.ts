// Marketing-email consent — the AUTHENTICATED self-service endpoint. A signed-in user
// reads and sets their own opt-in; the Clerk session JWT proves identity. The account
// settings toggle AND the one-time sign-in nudge both call this (GET to render, POST to
// record). Distinct from the bearer `/v1/events` cookie-consent path: keyed on the JWT
// `sub`, no bearer token exposed to the browser.
//
//   GET  /v1/consent/marketing-email → { marketing_email: boolean | null }
//   POST /v1/consent/marketing-email  { granted: boolean, surface?: string } → { ok: true }
//
// A POST writes the append-only proof (consent_events), updates the current-state column,
// and best-effort mirrors the Resend audience.
import { logger } from "@indiecrafts/packages-shared-logger";
import { type Env, clientIp } from "../index";
import { upsertResendContact } from "../resend-audience";

const BODY_MAX = 4000;

// This route is called client→api directly with an Authorization: Bearer <jwt> header, so
// unlike PUBLIC_CORS it must allow the `authorization` request header. `*` origin is safe:
// the request is never credentialed (the token is set explicitly, not via cookies).
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

/** Verify the Clerk session JWT → the caller's user id (`sub`). No email/exportUser call —
 *  this route keys on user_id and reads email from user_profiles when it needs it. Dynamic
 *  import keeps @clerk/backend out of the worker startup graph; injectable so tests never
 *  load the SDK or hit the network. */
export async function verifyUserId(
  request: Request,
  env: Env,
): Promise<string | null> {
  const token = (request.headers.get("authorization") ?? "").replace(
    /^Bearer\s+/i,
    "",
  );
  if (!token || !env.CLERK_SECRET_KEY) return null;
  try {
    const { verifyToken } = await import("@clerk/backend");
    const { data: claims, errors } = await verifyToken(token, {
      secretKey: env.CLERK_SECRET_KEY,
    });
    if (errors || !claims) return null;
    const sub = (claims as { sub?: unknown }).sub;
    return typeof sub === "string" ? sub : null;
  } catch {
    return null; // any verify failure → unauthenticated (fail closed)
  }
}

export async function handleMarketingConsent(
  request: Request,
  env: Env,
  ctx?: ExecutionContext,
  authenticate: (r: Request, e: Env) => Promise<string | null> = verifyUserId,
  sync: typeof upsertResendContact = upsertResendContact,
): Promise<Response> {
  if (request.method === "OPTIONS")
    return new Response(null, { status: 204, headers: CORS });
  if (request.method !== "GET" && request.method !== "POST")
    return json({ error: "method_not_allowed" }, 405);
  if (!env.MAIN_DB || !env.CLERK_SECRET_KEY)
    return json({ error: "unavailable" }, 503);

  if (env.AGENT_RATELIMIT) {
    const { success } = await env.AGENT_RATELIMIT.limit({
      key: clientIp(request),
    });
    if (!success) return json({ error: "rate_limited" }, 429);
  }

  const userId = await authenticate(request, env);
  if (!userId) return json({ error: "unauthorized" }, 401);

  if (request.method === "GET") {
    const row = await env.MAIN_DB.prepare(
      "SELECT marketing_email FROM user_profiles WHERE user_id = ?",
    )
      .bind(userId)
      .first<{ marketing_email: number | null }>();
    const v = row?.marketing_email;
    return json({ marketing_email: v == null ? null : v === 1 }, 200);
  }

  // POST — record a decision.
  if (Number(request.headers.get("content-length") ?? 0) > BODY_MAX)
    return json({ error: "too_large" }, 413);
  let body: { granted?: unknown; surface?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ error: "invalid" }, 400);
  }
  if (typeof body.granted !== "boolean") return json({ error: "invalid" }, 400);
  const granted = body.granted;
  const surface =
    (typeof body.surface === "string" ? body.surface : "").slice(0, 16) ||
    "account";
  const now = new Date().toISOString();
  const country = request.headers.get("cf-ipcountry") ?? null;

  const prof = await env.MAIN_DB.prepare(
    "SELECT email, email_fingerprint FROM user_profiles WHERE user_id = ?",
  )
    .bind(userId)
    .first<{ email: string | null; email_fingerprint: string | null }>();

  // Append-only proof (keyed by fingerprint, never raw email); then update the fast cache.
  await env.MAIN_DB.prepare(
    "INSERT OR IGNORE INTO consent_events (ts, subject_type, subject_id, email_fingerprint, consent_type, granted, policy_version, surface, source, country, ip_hash, idempotency_key) " +
      "VALUES (?, 'user', ?, ?, 'marketing_email', ?, '1', ?, 'account', ?, NULL, ?)",
  )
    .bind(
      now,
      userId,
      prof?.email_fingerprint ?? null,
      granted ? 1 : 0,
      surface,
      country,
      `account:${userId}:${now}:marketing_email`,
    )
    .run();
  await env.MAIN_DB.prepare(
    "UPDATE user_profiles SET marketing_email = ? WHERE user_id = ?",
  )
    .bind(granted ? 1 : 0, userId)
    .run();

  // Best-effort Resend mirror — never fails the write (the D1 rows are the source of truth).
  const email = prof?.email;
  if (email) {
    const run = (async () => {
      try {
        await sync(env, { email, granted });
      } catch (error) {
        logger.error("resend account sync failed", {
          name: (error as Error)?.name,
        });
      }
    })();
    if (ctx) ctx.waitUntil(run);
    else await run;
  }

  return json({ ok: true }, 200);
}
