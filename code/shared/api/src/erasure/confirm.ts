/**
 * Confirm and run a GDPR erasure request from a mailed token.
 *
 * @see docs/reference/shared/api/src/erasure/confirm.md
 */
// GDPR erasure confirmation — GET renders the confirm form (read-only, no mutation);
// POST verifies the token + typed email + TTL + attempt cap, then runs the Phase-3
// erasure engine LIVE against real Clerk/Sanity/D1. Single-use: only a row in status
// "email_sent" can be confirmed. The engine never throws — a per-adapter failure lands
// in `receipt.errors`, which this route turns into a distinguishable partial-failure
// response instead of a blind "ok".
import { logger } from "@indiecrafts/packages-shared-logger";
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
import { readProfileLocale, sendErasureCompleteEmail } from "./email";
import { CLERK_STORE } from "./self";

const BODY_MAX = 4000;
const MAX_ATTEMPTS = 5;

interface ErasureRequestRow {
  id: number;
  status: string;
  token_expires_at: string;
  attempts: number;
  user_id: string | null;
  email_fingerprint: string;
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

/** Escape untrusted text before interpolating it into the confirm form's HTML. */
function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// Minimal, self-contained confirm form — a typed-email input + the hidden token,
// POSTing back to this same route. GET never mutates (defeats link/prefetch scanners,
// mirrors the blog moderation route).
function confirmFormHtml(token: string): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Confirm data erasure</title>
  </head>
  <body>
    <h1>Confirm data erasure</h1>
    <p>Type your account email to confirm permanent erasure of your data.</p>
    <form method="post" action="/v1/erasure/confirm">
      <input type="hidden" name="token" value="${escapeHtml(token)}" />
      <label for="email">Email</label>
      <input id="email" name="email" type="email" required />
      <button type="submit">Confirm erasure</button>
    </form>
  </body>
</html>`;
}

/** Reads `{ token, email }` from a JSON or form-encoded POST body. */
async function parseBody(
  request: Request,
): Promise<{ token: string; email: string } | null> {
  try {
    if (
      (request.headers.get("content-type") ?? "").includes("application/json")
    ) {
      const body = (await request.json()) as {
        token?: unknown;
        email?: unknown;
      };
      return {
        token: String(body.token ?? ""),
        email: String(body.email ?? "").trim(),
      };
    }
    const form = await request.formData();
    return {
      token: String(form.get("token") ?? ""),
      email: String(form.get("email") ?? "").trim(),
    };
  } catch {
    return null;
  }
}

/** A short, factual summary of what stays and why — sent in the completion email. */
function retainedSummary(hadErrors: boolean): string {
  const base =
    "Your account activity log is retained for legal accountability; everything else has been removed.";
  if (!hadErrors) return base;
  return `${base} Some records could not be removed automatically — our team has been notified and will finish this by hand.`;
}

export async function handleErasureConfirm(
  request: Request,
  env: Env,
  ctx?: ExecutionContext,
  // Injectable for tests (mocked Clerk/Sanity, real D1) — production never passes this.
  buildAdapters: (env: Env) => ErasureAdapter[] = buildErasureAdapters,
  // The completion-email sender, injectable so a test can assert it is NOT sent when the
  // Clerk delete failed (the account is still live).
  send: typeof sendErasureCompleteEmail = sendErasureCompleteEmail,
): Promise<Response> {
  if (request.method === "OPTIONS")
    return new Response(null, { status: 204, headers: PUBLIC_CORS_POST });

  if (request.method === "GET") {
    const token = new URL(request.url).searchParams.get("token") ?? "";
    return new Response(confirmFormHtml(token), {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        ...PUBLIC_CORS_POST,
      },
    });
  }

  if (request.method !== "POST")
    return json({ error: "method_not_allowed" }, 405, PUBLIC_CORS_POST);

  if (!env.AUDIT_DB || !env.MAIN_DB || !env.GDPR_FINGERPRINT_SALT)
    return json({ error: "unavailable" }, 503, PUBLIC_CORS_POST);

  // Production uses the real adapters, which need the Clerk + Sanity secrets. If a
  // deploy armed DB + salt but not these, refuse with 503 so the request row stays
  // `email_sent` (retryable) instead of half-erasing D1 while Clerk/Sanity fail.
  if (
    buildAdapters === buildErasureAdapters &&
    (!env.CLERK_SECRET_KEY ||
      !env.SANITY_API_WRITE_TOKEN ||
      !env.SANITY_PROJECT_ID ||
      !env.SANITY_DATASET)
  )
    return json({ error: "unavailable" }, 503, PUBLIC_CORS_POST);

  if (Number(request.headers.get("content-length") ?? 0) > BODY_MAX)
    return json({ error: "too_large" }, 413, PUBLIC_CORS_POST);

  // Rate-limit by caller IP (consistent with erasure/self + request). Bounds brute force
  // on the confirm token beyond the per-token attempt cap.
  if (env.RATELIMIT) {
    const { success } = await env.RATELIMIT.limit({
      key: clientIp(request),
    });
    if (!success) return json({ error: "rate_limited" }, 429, PUBLIC_CORS_POST);
  }

  const parsed = await parseBody(request);
  if (!parsed || !parsed.token || !parsed.email)
    return json({ error: "invalid" }, 400, PUBLIC_CORS_POST);
  const { token, email } = parsed;

  const row = await env.MAIN_DB.prepare(
    "SELECT * FROM erasure_requests WHERE token_hash = ?",
  )
    .bind(await sha256Hex(token))
    .first<ErasureRequestRow>();
  if (!row) return json({ error: "invalid" }, 400, PUBLIC_CORS_POST);

  // Single-use: a completed/cancelled/expired row can't be reused.
  if (row.status !== "email_sent")
    return json({ error: "invalid" }, 400, PUBLIC_CORS_POST);

  if (new Date().toISOString() > row.token_expires_at) {
    await env.MAIN_DB.prepare(
      "UPDATE erasure_requests SET status = 'expired' WHERE id = ?",
    )
      .bind(row.id)
      .run();
    return json({ error: "invalid" }, 400, PUBLIC_CORS_POST);
  }

  if (row.attempts >= MAX_ATTEMPTS)
    return json({ error: "too_many_attempts" }, 429, PUBLIC_CORS_POST);

  // Every attempt that reaches the email check is counted, win or lose — bounds
  // brute-forcing the typed email against the stored fingerprint.
  await env.MAIN_DB.prepare(
    "UPDATE erasure_requests SET attempts = attempts + 1 WHERE id = ?",
  )
    .bind(row.id)
    .run();

  const fp = await fingerprintEmail(email, env.GDPR_FINGERPRINT_SALT);
  if (!safeEqual(fp, row.email_fingerprint))
    return json({ error: "invalid" }, 400, PUBLIC_CORS_POST);

  const adapters = buildAdapters(env);
  const ts = new Date().toISOString();
  // Read the recipient's locale for the completion email BEFORE the erasure runs — the
  // profile row is gone once it does.
  const locale = await readProfileLocale(env.MAIN_DB, {
    userId: row.user_id,
    fingerprint: row.email_fingerprint,
  });
  // A dry-run preview first (mutates nothing), then the live pass that actually erases.
  await runErasure(adapters, email, {
    mode: "erase",
    dryRun: true,
    ts,
    fingerprint: row.email_fingerprint,
  });
  let receipt = await runErasure(adapters, email, {
    mode: "erase",
    dryRun: false,
    ts,
    fingerprint: row.email_fingerprint,
  });

  // Clerk is the one global session/credential kill-switch (every surface's auth is
  // Clerk). A failed Clerk delete must never be reported as a completed erasure — the
  // account is still live and the retained fingerprint is re-linkable. Retry it once
  // inline (same adapter, not a second client), then fail closed. Mirrors self.ts.
  let clerkStillFailing = false;
  if (receipt.errors.some((e) => e.store === CLERK_STORE)) {
    const clerkAdapter = adapters.find((a) => a.name === CLERK_STORE);
    try {
      if (!clerkAdapter) throw new Error("clerk adapter not configured");
      const retried = await clerkAdapter.delete(email);
      receipt = {
        ...receipt,
        errors: receipt.errors.filter((e) => e.store !== CLERK_STORE),
        stores: [...receipt.stores, retried],
      };
    } catch (error) {
      clerkStillFailing = true;
      logger.error("erasure.confirm clerk retry failed", {
        name: (error as Error)?.name,
      });
    }
  }

  const hadErrors = receipt.errors.length > 0;
  await env.MAIN_DB.prepare(
    "UPDATE erasure_requests SET status = ?, confirmed_at = ?, completed_at = ?, result = ? WHERE id = ?",
  )
    .bind(
      hadErrors ? "confirmed" : "completed",
      ts,
      hadErrors ? null : ts,
      JSON.stringify(receipt),
      row.id,
    )
    .run();

  // Audit + completion email only when the account was ACTUALLY deleted. If Clerk still
  // fails, the subject must not get an "erasure complete" email while still logged in, and
  // the trail must not claim completion — the `confirmed` row above flags it for manual
  // backfill (same contract as erasure/self).
  if (!clerkStillFailing) {
    // The erasure row above is already committed — a failure writing the audit trail
    // must never turn a completed erasure into a 500 on a single-use, non-retryable row.
    try {
      const country = request.headers.get("cf-ipcountry") ?? null;
      const subjectId = row.user_id ?? row.email_fingerprint;
      await env.AUDIT_DB.prepare(
        "INSERT INTO admin_audit (ts, event, actor_user_id, target_user_id, country, ip_hash) VALUES (?, ?, ?, ?, ?, NULL)",
      )
        .bind(ts, "erasure.completed", subjectId, subjectId, country)
        .run();
    } catch (error) {
      logger.error("erasure audit insert failed", {
        name: (error as Error)?.name,
      });
    }

    // Best-effort: a failed completion email must never undo the erasure already committed.
    try {
      await send(env, {
        to: email,
        retained: retainedSummary(hadErrors),
        locale,
      });
    } catch (error) {
      logger.error("erasure complete email failed", {
        name: (error as Error)?.name,
      });
    }
  }

  // Distinct from `partial`: the Clerk user still exists, so the session is NOT dead
  // everywhere. The caller must not treat this as done — a non-200/207 status maps to
  // "error" client-side, same as erasure/self.
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
