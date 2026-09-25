/**
 * Erase a signed-in user's own data behind a Clerk JWT and typed-email gate.
 *
 * @see docs/reference/shared/api/src/erasure/self.md
 */
// GDPR self-service erasure — an AUTHENTICATED route. A signed-in user erases their
// own data: the Clerk session JWT proves identity, a typed-email match is the
// deliberate-action gate, then the Phase-3 engine runs live. No email round-trip.
// Mirrors confirm.ts (same engine + receipt handling); the difference is the
// identity comes from the JWT, not a mailed token.
import { logger } from "@indiecrafts/packages-shared-logger";
import { defaultLocale } from "@indiecrafts/packages-shared-config";
import {
  fingerprintEmail,
  sha256Hex,
} from "@indiecrafts/packages-shared-security/crypto";
import {
  runErasure,
  type ErasureAdapter,
} from "@indiecrafts/packages-shared-compliance/shared";
import { type Env, PUBLIC_CORS_POST, safeEqual, clientIp } from "../index";
import { buildErasureAdapters } from "./adapters";
import {
  authenticateClerkJwt,
  requireStepUp,
  type SelfAuth,
} from "../auth/sensitive-action";
import { readProfileLocale, sendErasureCompleteEmail } from "./email";
import { suppressResendContact } from "../resend-audience";
import {
  writeChurnEvent,
  normalizeReason,
  type ChurnSurvey,
} from "../consent/churn-store";
import { fetchEmailPreferences } from "../consent/email-preferences-sanity";

const BODY_MAX = 4000;
// Must match the `name` the clerk adapter registers itself under (erasure/clerk.ts).
export const CLERK_STORE = "clerk";

// Re-exported so existing importers (export/route.ts) keep resolving `SelfAuth` here.
export type { SelfAuth };

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

/** Short factual summary of what stays and why (mirrors confirm.ts). */
function retainedSummary(hadErrors: boolean): string {
  const base =
    "Your account activity log is retained for legal accountability; everything else has been removed.";
  if (!hadErrors) return base;
  return `${base} Some records could not be removed automatically — our team has been notified and will finish this by hand.`;
}

export async function handleErasureSelf(
  request: Request,
  env: Env,
  ctx?: ExecutionContext,
  buildAdapters: (env: Env) => ErasureAdapter[] = buildErasureAdapters,
  authenticate: (
    request: Request,
    env: Env,
  ) => Promise<SelfAuth | null> = authenticateClerkJwt,
  suppress: typeof suppressResendContact = suppressResendContact,
  fetchPrefs: typeof fetchEmailPreferences = fetchEmailPreferences,
  send: typeof sendErasureCompleteEmail = sendErasureCompleteEmail,
): Promise<Response> {
  if (request.method === "OPTIONS")
    return new Response(null, { status: 204, headers: PUBLIC_CORS_POST });
  if (request.method !== "POST")
    return json({ error: "method_not_allowed" }, 405, PUBLIC_CORS_POST);

  if (!env.AUDIT_DB || !env.MAIN_DB || !env.GDPR_FINGERPRINT_SALT)
    return json({ error: "unavailable" }, 503, PUBLIC_CORS_POST);
  // JWT verification needs the Clerk secret; and when the real adapters are used,
  // the Clerk/Sanity secrets must be armed or the engine half-erases (see confirm.ts).
  if (!env.CLERK_SECRET_KEY)
    return json({ error: "unavailable" }, 503, PUBLIC_CORS_POST);
  if (
    buildAdapters === buildErasureAdapters &&
    (!env.SANITY_API_WRITE_TOKEN ||
      !env.SANITY_PROJECT_ID ||
      !env.SANITY_DATASET)
  )
    return json({ error: "unavailable" }, 503, PUBLIC_CORS_POST);

  if (Number(request.headers.get("content-length") ?? 0) > BODY_MAX)
    return json({ error: "too_large" }, 413, PUBLIC_CORS_POST);

  if (env.AGENT_RATELIMIT) {
    // Key on the caller IP, not the bearer token: a Clerk JWT's leading bytes are
    // identical across users (shared alg/kid/iss), so keying on the token would put
    // every user in one bucket. Matches the /v1/events + request routes.
    const { success } = await env.AGENT_RATELIMIT.limit({
      key: clientIp(request),
    });
    if (!success) return json({ error: "rate_limited" }, 429, PUBLIC_CORS_POST);
  }

  const authed = await authenticate(request, env);
  if (!authed) return json({ error: "unauthorized" }, 401, PUBLIC_CORS_POST);

  // Step-up gate: a session whose first factor was verified too long ago (or fva is
  // absent/not-applicable) must reverify before the engine runs — a raw API call cannot
  // bypass step-up. useReverification on the client reacts to this exact response shape.
  const stepUp = requireStepUp(authed, PUBLIC_CORS_POST);
  if (stepUp) return stepUp;

  let typedEmail = "";
  let survey: { reason?: unknown; feedback?: unknown; competitor?: unknown } =
    {};
  try {
    // content-length above is a fast-path only — a missing or lying header
    // must not skip this bound, so the actual read body is checked too.
    const bodyText = await request.text();
    if (bodyText.length > BODY_MAX)
      return json({ error: "invalid" }, 400, PUBLIC_CORS_POST);
    const body = JSON.parse(bodyText) as {
      email?: unknown;
      reason?: unknown;
      feedback?: unknown;
      competitor?: unknown;
    };
    typedEmail = String(body.email ?? "").trim();
    survey = {
      reason: body.reason,
      feedback: body.feedback,
      competitor: body.competitor,
    };
  } catch {
    return json({ error: "invalid" }, 400, PUBLIC_CORS_POST);
  }
  if (!typedEmail) return json({ error: "invalid" }, 400, PUBLIC_CORS_POST);

  // Deliberate-action gate: the typed email must match the authenticated identity,
  // even with a valid session (constant-time, via the salted fingerprint).
  const typedFp = await fingerprintEmail(typedEmail, env.GDPR_FINGERPRINT_SALT);
  const authFp = await fingerprintEmail(
    authed.email,
    env.GDPR_FINGERPRINT_SALT,
  );
  if (!safeEqual(typedFp, authFp))
    return json({ error: "invalid" }, 400, PUBLIC_CORS_POST);

  const adapters = buildAdapters(env);
  const ts = new Date().toISOString();
  const fingerprint = authFp;
  // Recipient locale for the completion email — read BEFORE the erasure clears the profile.
  const locale = await readProfileLocale(env.MAIN_DB, {
    userId: authed.userId,
    fingerprint,
  });

  // churn capture (self-service is the only writer of churn_events)
  if (env.MAIN_DB) {
    try {
      await writeChurnEvent(
        env.MAIN_DB,
        authed.userId,
        survey as ChurnSurvey,
        ts,
      );
    } catch (error) {
      logger.error("churn write failed", { name: (error as Error)?.name });
    }
  }
  // suppress the departing Resend contact (retain in churned topic, off all marketing)
  try {
    const { churnedTopicId, optOutTopicIds } = await fetchPrefs(
      env,
      defaultLocale,
    );
    await suppress(env, {
      email: authed.email,
      reason: normalizeReason(survey.reason),
      churnedTopicId,
      optOutTopicIds,
    });
  } catch (error) {
    logger.error("churn suppress failed", { name: (error as Error)?.name });
  }

  await runErasure(adapters, authed.email, {
    mode: "erase",
    dryRun: true,
    ts,
    fingerprint,
  });
  let receipt = await runErasure(adapters, authed.email, {
    mode: "erase",
    dryRun: false,
    ts,
    fingerprint,
  });

  // Clerk is the one global session kill-switch (every surface's auth is Clerk).
  // A failed Clerk delete must never let the caller believe it is safe to sign
  // out locally — retry it once inline (reusing the same adapter, not a second
  // Clerk client) before deciding this is a real failure.
  let clerkStillFailing = false;
  if (receipt.errors.some((e) => e.store === CLERK_STORE)) {
    const clerkAdapter = adapters.find((a) => a.name === CLERK_STORE);
    try {
      if (!clerkAdapter) throw new Error("clerk adapter not configured");
      const retried = await clerkAdapter.delete(authed.email);
      receipt = {
        ...receipt,
        errors: receipt.errors.filter((e) => e.store !== CLERK_STORE),
        stores: [...receipt.stores, retried],
      };
    } catch (error) {
      clerkStillFailing = true;
      logger.error("erasure.self clerk retry failed", {
        name: (error as Error)?.name,
      });
    }
  }
  const hadErrors = receipt.errors.length > 0;

  // Proof-of-erasure row. No token here → a throwaway hash satisfies the NOT NULL
  // column; it is never emailed or used.
  try {
    await env.MAIN_DB.prepare(
      "INSERT INTO erasure_requests (status, token_hash, token_expires_at, attempts, user_id, email_fingerprint, requested_at, confirmed_at, completed_at, due_at, result) " +
        "VALUES (?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?)",
    )
      .bind(
        hadErrors ? "confirmed" : "completed",
        await sha256Hex("self:" + crypto.randomUUID()),
        ts,
        authed.userId,
        fingerprint,
        ts,
        ts,
        hadErrors ? null : ts,
        ts,
        JSON.stringify(receipt),
      )
      .run();
    const country = request.headers.get("cf-ipcountry") ?? null;
    await env.AUDIT_DB.prepare(
      "INSERT INTO admin_audit (ts, event, actor_user_id, target_user_id, country, ip_hash) VALUES (?, ?, ?, ?, ?, NULL)",
    )
      .bind(ts, "erasure.self", authed.userId, authed.userId, country)
      .run();
  } catch (error) {
    // The erasure is already committed; a bookkeeping failure must not 500 it.
    logger.error("erasure.self audit write failed", {
      name: (error as Error)?.name,
    });
  }

  // Only when the account was actually deleted — never tell the subject "erasure
  // complete" while the Clerk user (and their live sessions) still exist.
  if (!clerkStillFailing) {
    try {
      await send(env, {
        to: authed.email,
        retained: retainedSummary(hadErrors),
        locale,
      });
    } catch (error) {
      logger.error("erasure.self complete email failed", {
        name: (error as Error)?.name,
      });
    }
  }

  // Distinct from `partial`: the Clerk user still exists, so the session is NOT
  // dead everywhere. The client must not treat this as done/partial and must not
  // sign out locally — a non-200/207 status already falls through to "error" in
  // `mapErasureResponse` (shared by the default and step-up submit paths), so no
  // client change is required to honour this.
  if (clerkStillFailing)
    return json(
      { ok: false, clerk_failed: true, errors: receipt.errors },
      502,
      PUBLIC_CORS_POST,
    );
  if (hadErrors)
    return json(
      { ok: true, partial: true, errors: receipt.errors },
      207,
      PUBLIC_CORS_POST,
    );
  return json({ ok: true }, 200, PUBLIC_CORS_POST);
}
