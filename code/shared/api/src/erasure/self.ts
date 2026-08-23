// GDPR self-service erasure — an AUTHENTICATED route. A signed-in user erases their
// own data: the Clerk session JWT proves identity, a typed-email match is the
// deliberate-action gate, then the Phase-3 engine runs live. No email round-trip.
// Mirrors confirm.ts (same engine + receipt handling); the difference is the
// identity comes from the JWT, not a mailed token.
import { logger } from "@indiecrafts/packages-shared-logger";
import {
  fingerprintEmail,
  sha256Hex,
} from "@indiecrafts/packages-shared-security/crypto";
import {
  runErasure,
  type ErasureAdapter,
} from "@indiecrafts/packages-shared-compliance/shared";
import { type Env, PUBLIC_CORS_POST, safeEqual } from "../index";
import { createD1ErasureAdapter } from "./d1";
import { createClerkErasureAdapter } from "./clerk";
import { createSanityErasureAdapter } from "./sanity";
import { createOrdersErasureAdapter } from "./orders";
import { createRealClerkClient } from "./clerk-client";
import { createRealSanityClient } from "./sanity-client";
import { sendErasureCompleteEmail } from "./email";

const BODY_MAX = 4000;

export type SelfAuth = { userId: string; email: string };

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

/** The real four adapters (identical to confirm.ts). Injectable for tests. */
function defaultAdapters(env: Env): ErasureAdapter[] {
  return [
    createD1ErasureAdapter(env.DB!, env.GDPR_FINGERPRINT_SALT!),
    createClerkErasureAdapter(createRealClerkClient(env.CLERK_SECRET_KEY!)),
    createSanityErasureAdapter(
      createRealSanityClient({
        projectId: env.SANITY_PROJECT_ID!,
        dataset: env.SANITY_DATASET!,
        apiVersion: env.SANITY_API_VERSION ?? "2025-01-01",
        writeToken: env.SANITY_API_WRITE_TOKEN!,
        readToken: env.SANITY_API_READ_TOKEN,
      }),
      env.GDPR_FINGERPRINT_SALT!,
    ),
    createOrdersErasureAdapter(),
  ];
}

/**
 * Verify the Clerk session JWT and resolve the caller's primary email. Dynamic
 * import keeps @clerk/backend out of the worker startup graph. Injectable so tests
 * never load the SDK or hit the network.
 *
 * `verifyToken` returns a `{ data, errors }` result rather than throwing on an
 * invalid token — confirmed against the installed @clerk/backend@3.16.7 types
 * (`data`/`errors` resolve to `unknown` there, so the `sub` claim is read via a cast
 * below, same as the Clerk `User` shape further down).
 */
async function defaultAuthenticate(
  request: Request,
  env: Env,
): Promise<SelfAuth | null> {
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
    // The installed @clerk/backend@3.16.7 types resolve `data`/`errors` to `unknown`
    // (not a typed JwtPayload) — cast to read the `sub` claim.
    const payload = claims as { sub?: unknown };
    const userId = typeof payload.sub === "string" ? payload.sub : null;
    if (!userId) return null;
    // Resolve the primary email from Clerk (the JWT omits it by default).
    const user = await createRealClerkClient(env.CLERK_SECRET_KEY).exportUser(
      userId,
    );
    const u = user as {
      primaryEmailAddressId?: string | null;
      emailAddresses?: Array<{ id: string; emailAddress: string }>;
    };
    const email =
      u.emailAddresses?.find((e) => e.id === u.primaryEmailAddressId)
        ?.emailAddress ??
      u.emailAddresses?.[0]?.emailAddress ??
      null;
    if (!email) return null;
    return { userId, email };
  } catch {
    return null; // any verify/resolve failure → unauthenticated (fail closed)
  }
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
  buildAdapters: (env: Env) => ErasureAdapter[] = defaultAdapters,
  authenticate: (
    request: Request,
    env: Env,
  ) => Promise<SelfAuth | null> = defaultAuthenticate,
): Promise<Response> {
  if (request.method === "OPTIONS")
    return new Response(null, { status: 204, headers: PUBLIC_CORS_POST });
  if (request.method !== "POST")
    return json({ error: "method_not_allowed" }, 405, PUBLIC_CORS_POST);

  if (!env.DB || !env.GDPR_FINGERPRINT_SALT)
    return json({ error: "unavailable" }, 503, PUBLIC_CORS_POST);
  // JWT verification needs the Clerk secret; and when the real adapters are used,
  // the Clerk/Sanity secrets must be armed or the engine half-erases (see confirm.ts).
  if (!env.CLERK_SECRET_KEY)
    return json({ error: "unavailable" }, 503, PUBLIC_CORS_POST);
  if (
    buildAdapters === defaultAdapters &&
    (!env.SANITY_API_WRITE_TOKEN ||
      !env.SANITY_PROJECT_ID ||
      !env.SANITY_DATASET)
  )
    return json({ error: "unavailable" }, 503, PUBLIC_CORS_POST);

  if (Number(request.headers.get("content-length") ?? 0) > BODY_MAX)
    return json({ error: "too_large" }, 413, PUBLIC_CORS_POST);

  if (env.AGENT_RATELIMIT) {
    const auth0 = request.headers.get("authorization") ?? "";
    const { success } = await env.AGENT_RATELIMIT.limit({
      key: auth0.slice(0, 128),
    });
    if (!success) return json({ error: "rate_limited" }, 429, PUBLIC_CORS_POST);
  }

  const authed = await authenticate(request, env);
  if (!authed) return json({ error: "unauthorized" }, 401, PUBLIC_CORS_POST);

  let typedEmail = "";
  try {
    const body = (await request.json()) as { email?: unknown };
    typedEmail = String(body.email ?? "").trim();
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
  await runErasure(adapters, authed.email, {
    mode: "erase",
    dryRun: true,
    ts,
    fingerprint,
  });
  const receipt = await runErasure(adapters, authed.email, {
    mode: "erase",
    dryRun: false,
    ts,
    fingerprint,
  });
  const hadErrors = receipt.errors.length > 0;

  // Proof-of-erasure row. No token here → a throwaway hash satisfies the NOT NULL
  // column; it is never emailed or used.
  try {
    await env.DB.prepare(
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
    await env.DB.prepare(
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

  try {
    await sendErasureCompleteEmail(env, {
      to: authed.email,
      retained: retainedSummary(hadErrors),
    });
  } catch (error) {
    logger.error("erasure.self complete email failed", {
      name: (error as Error)?.name,
    });
  }

  if (hadErrors)
    return json(
      { ok: true, partial: true, errors: receipt.errors },
      207,
      PUBLIC_CORS_POST,
    );
  return json({ ok: true }, 200, PUBLIC_CORS_POST);
}
