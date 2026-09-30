/**
 * Admin actions on a stuck erasure request: retry it, or close it by hand with a note.
 *
 * @see docs/reference/shared/api/src/erasure/admin.md
 */
// Both routes are bearer-gated in index.ts (the admin server action re-checks the admin
// role and writes the admin audit event). A request is stuck when a store failed —
// always when the Clerk delete failed after its inline retry — so it stays `confirmed`
// and neither the subject (single-use link) nor the cron can finish it.
import { logger } from "@indiecrafts/packages-shared-logger";
import { fingerprintEmail } from "@indiecrafts/packages-shared-security/crypto";
import { type Env, safeEqual } from "../index";
import { OPEN } from "../monitoring";
import { buildErasureAdapters } from "./adapters";
import {
  defaultExecuteDeps,
  executeErasure,
  type ExecuteDeps,
} from "./execute";

/** The stored Clerk user now: deleted (`gone`), present with a primary email, or unknown
 *  because Clerk did not answer (`error` — never read as `gone`). */
export type ClerkLookup =
  { kind: "gone" } | { kind: "email"; email: string } | { kind: "error" };

export type RetryDeps = ExecuteDeps & {
  lookupEmail: (env: Env, userId: string) => Promise<ClerkLookup>;
};

async function clerkPrimaryEmail(
  env: Env,
  userId: string,
): Promise<ClerkLookup> {
  if (!env.CLERK_SECRET_KEY) return { kind: "error" };
  try {
    const { createClerkClient } = await import("@clerk/backend");
    const user = await createClerkClient({
      secretKey: env.CLERK_SECRET_KEY,
    }).users.getUser(userId);
    const email = user.primaryEmailAddress?.emailAddress;
    return email ? { kind: "email", email } : { kind: "error" };
  } catch (error) {
    if ((error as { status?: number })?.status === 404) return { kind: "gone" };
    // Rate limit, outage, bad key — logged by name only (no personal data).
    logger.warn("erasure retry: clerk lookup failed", {
      name: (error as Error)?.name,
    });
    return { kind: "error" };
  }
}

export const defaultRetryDeps: RetryDeps = {
  ...defaultExecuteDeps,
  lookupEmail: clerkPrimaryEmail,
};

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });

async function readBody(request: Request): Promise<Record<string, unknown>> {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

/** `POST /v1/erasure-requests/:id/retry` — re-run a `confirmed` (stuck) request. The email
 *  comes from Clerk (by the stored user id) or, once that user is gone, the operator; either
 *  way it must match the stored fingerprint, and it is never stored or logged. */
export async function handleErasureRetry(
  request: Request,
  env: Env,
  id: number,
  deps: RetryDeps = defaultRetryDeps,
): Promise<Response> {
  if (!env.MAIN_DB || !env.AUDIT_DB || !env.GDPR_FINGERPRINT_SALT)
    return json({ error: "unavailable" }, 503);
  // Same partial-config guard as the public confirm: never half-erase with real adapters
  // whose secrets are missing.
  if (
    deps.buildAdapters === buildErasureAdapters &&
    (!env.CLERK_SECRET_KEY ||
      !env.SANITY_API_WRITE_TOKEN ||
      !env.SANITY_PROJECT_ID ||
      !env.SANITY_DATASET)
  )
    return json({ error: "unavailable" }, 503);

  const row = await env.MAIN_DB.prepare(
    "SELECT id, status, user_id, email_fingerprint FROM erasure_requests WHERE id = ?",
  )
    .bind(id)
    .first<{
      id: number;
      status: string;
      user_id: string | null;
      email_fingerprint: string;
    }>();
  if (!row) return json({ error: "not_found" }, 404);
  if (row.status !== "confirmed") return json({ error: "not_retryable" }, 409);

  const matches = async (email: string) =>
    safeEqual(
      await fingerprintEmail(email, env.GDPR_FINGERPRINT_SALT!),
      row.email_fingerprint,
    );

  const typed = String((await readBody(request)).email ?? "").trim();
  if (typed && !(await matches(typed)))
    return json({ error: "email_mismatch" }, 400);
  let email: string | null = null;
  if (row.user_id) {
    // The Clerk adapter deletes by email, so a user who still exists under another email
    // would be missed — a false "completed". Only a gone user lets a typed email through.
    const found = await deps.lookupEmail(env, row.user_id);
    if (found.kind === "error")
      return json({ error: "clerk_unavailable" }, 503);
    if (found.kind === "email") {
      if (!(await matches(found.email)))
        return json({ error: "clerk_email_changed" }, 409);
      email = found.email;
    }
  }
  email ??= typed || null;
  if (!email) return json({ error: "email_required" }, 422);

  const result = await executeErasure(env, row, email, deps, null);
  if (result.clerkFailed)
    return json({ ok: false, clerk_failed: true, errors: result.errors }, 502);
  if (result.errors.length)
    return json({ ok: true, partial: true, errors: result.errors }, 207);
  return json({ ok: true }, 200);
}

/** `POST /v1/erasure-requests/:id/close` — close an open request handled outside the system.
 *  Keeps the prior receipt and adds `manualClose: {note, by, at}`. */
export async function handleErasureClose(
  request: Request,
  env: Env,
  id: number,
): Promise<Response> {
  if (!env.MAIN_DB) return json({ error: "unavailable" }, 503);
  const body = await readBody(request);
  const note = String(body.note ?? "").trim();
  const by = String(body.by ?? "").trim();
  if (note.length < 5 || note.length > 500)
    return json({ error: "note_required" }, 400);
  if (!by) return json({ error: "invalid" }, 400);

  const at = new Date().toISOString();
  const closed = await env.MAIN_DB.prepare(
    `UPDATE erasure_requests SET status = 'closed_manual', completed_at = ?1,
       result = json_set(COALESCE(result, '{}'), '$.manualClose', json(?2))
     WHERE id = ?3 AND ${OPEN}`,
  )
    .bind(at, JSON.stringify({ note, by, at }), id)
    .run();
  if (closed.meta?.changes) return json({ ok: true }, 200);

  const exists = await env.MAIN_DB.prepare(
    "SELECT 1 AS x FROM erasure_requests WHERE id = ?",
  )
    .bind(id)
    .first();
  return exists
    ? json({ error: "not_open" }, 409)
    : json({ error: "not_found" }, 404);
}
