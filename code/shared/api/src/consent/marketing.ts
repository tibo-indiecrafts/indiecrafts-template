/**
 * Handles the authenticated marketing-email consent endpoint (GET reads, POST records).
 *
 * @see docs/reference/shared/api/src/consent/marketing.md
 */
// Marketing-email consent — the AUTHENTICATED self-service endpoint. A signed-in user
// reads and sets their own opt-in; the Clerk session JWT proves identity. The account
// settings toggle AND the one-time sign-in nudge both call this (GET to render, POST to
// record). Distinct from the bearer `/v1/events` cookie-consent path: keyed on the JWT
// `sub`, no bearer token exposed to the browser.
//
//   GET  /v1/consent/marketing-email → { marketing_email: boolean | null }
//   POST /v1/consent/marketing-email  { granted: boolean, surface?: string } → { ok: true }
//
// A POST writes the append-only proof (consent_events), then sets the email-preference
// categories (yes → the sign-up ones, no → all), which recomputes the column and
// best-effort mirrors Resend Topics + the newsletter segment.
import { type Env, clientIp } from "../index";
import { verifyUserId } from "../auth/clerk-jwt";
import { readProfileLocale } from "../erasure/email";
import {
  applyMarketingDecision,
  type EmailPreferencesDeps,
} from "./email-preferences";

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

export async function handleMarketingConsent(
  request: Request,
  env: Env,
  ctx?: ExecutionContext,
  authenticate: (r: Request, e: Env) => Promise<string | null> = verifyUserId,
  deps: EmailPreferencesDeps = {},
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
    const text = await request.text();
    if (new TextEncoder().encode(text).length > BODY_MAX)
      return json({ error: "too_large" }, 413);
    body = JSON.parse(text) as typeof body;
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
    "SELECT email_fingerprint FROM user_profiles WHERE user_id = ?",
  )
    .bind(userId)
    .first<{ email_fingerprint: string | null }>();

  // Append-only proof (keyed by fingerprint, never raw email) of the decision itself.
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
  await applyMarketingDecision({
    env,
    db: env.MAIN_DB,
    ctx,
    userId,
    locale: await readProfileLocale(env.MAIN_DB, { userId }),
    granted,
    surface,
    country,
    deps,
  });

  return json({ ok: true }, 200);
}
