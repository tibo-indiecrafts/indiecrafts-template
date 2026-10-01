/**
 * Handle the GDPR data-subject-request form's write and read paths.
 *
 * @see docs/reference/shared/api/src/data-request/route.md
 */
// DSAR (data-subject request) intake — the GDPR Art. 15–21 request form's write + read
// paths, migrated off Sanity into D1. `handleDataRequestWrite` is called server-to-server
// by the website's `withGuard`-protected `/api/data-request` route (Turnstile, rate-limit,
// origin, and body-cap already enforced there — this route re-checks only what a bearer
// caller could still get wrong). `handleDataRequestList` backs the admin screen.
import { logger } from "@indiecrafts/packages-shared-logger";
import {
  encrypt,
  decrypt,
  type EncryptedData,
} from "@indiecrafts/packages-shared-security/crypto";
import { type Env, corsHeaders, safeEqual } from "../index";
import { sendDataRequestReceipt } from "./email";
import { dueAt } from "./status";

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

export function json(
  body: unknown,
  status: number,
  cors: Record<string, string>,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...cors },
  });
}

export function bearerOf(request: Request): string {
  return (request.headers.get("authorization") ?? "").replace(
    /^Bearer\s+/i,
    "",
  );
}

// At-rest encryption for the operational plaintext PII in `data_requests` (email + free-text
// message). Cloudflare D1 already encrypts at rest; this adds field-level AES-256-GCM so a
// leaked DB dump or a read-access breach sees ciphertext, not the data subject's email/message.
// Opt-in via `PII_ENCRYPTION_KEY`: unset → plaintext (unchanged); the read path decrypts either,
// so existing plaintext rows keep working and a key can be introduced without a migration.

/** Shape-check the JSON we store for an encrypted field. */
function isEncrypted(v: unknown): v is EncryptedData {
  return (
    typeof v === "object" &&
    v !== null &&
    typeof (v as EncryptedData).ciphertext === "string" &&
    typeof (v as EncryptedData).iv === "string" &&
    (v as EncryptedData).version === 1
  );
}

/** Encrypt a field for storage when a key is set; else store as-is (backward compatible). */
export async function encField(
  value: string | null,
  key: string | undefined,
): Promise<string | null> {
  if (!key || !value) return value;
  return JSON.stringify(await encrypt(value, key));
}

/** Decrypt a stored field: encrypted-JSON → plaintext (needs the key); legacy plaintext
 *  (or a value we can't decrypt) → returned as-is, never throwing. */
export async function decField(
  value: string | null,
  key: string | undefined,
): Promise<string | null> {
  if (value == null) return value;
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    return value; // legacy plaintext (not JSON)
  }
  if (!isEncrypted(parsed) || !key) return value;
  try {
    return await decrypt(parsed, key);
  } catch {
    return value; // wrong key / tampered — surface the raw value rather than crash the list
  }
}

export async function handleDataRequestWrite(
  request: Request,
  env: Env,
  deps: { sendReceipt: typeof sendDataRequestReceipt } = {
    sendReceipt: sendDataRequestReceipt,
  },
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

  // Encrypt the replyable PII at rest when a key is configured (else plaintext, unchanged).
  const emailStored = await encField(email, env.PII_ENCRYPTION_KEY);
  const messageStored = await encField(message, env.PII_ENCRYPTION_KEY);

  let id = 0;
  try {
    const inserted = await env.MAIN_DB.prepare(
      "INSERT INTO data_requests (request_type, email, message, status, submitted_at, source, locale, policy_version) VALUES (?, ?, ?, 'new', ?, ?, ?, ?) RETURNING id",
    )
      .bind(
        requestType,
        emailStored,
        messageStored,
        submittedAt,
        source,
        locale,
        policyVersion,
      )
      .first<{ id: number }>();
    id = inserted?.id ?? 0;
  } catch (error) {
    // Never log email/message — only the error's name.
    logger.error("data-request write failed", {
      name: (error as Error)?.name,
    });
    return json({ error: "server" }, 502, cors);
  }
  // Best-effort receipt to the requester — a mail failure never fails a stored request.
  try {
    await deps.sendReceipt(env, {
      to: email,
      id,
      requestType,
      locale: locale ?? "en",
      submittedAt,
    });
  } catch (error) {
    // `message` is "resend <status>" — no PII.
    logger.error("data-request receipt failed", {
      name: (error as Error)?.name,
      message: (error as Error)?.message,
    });
  }
  return json({ ok: true, id }, 201, cors);
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
    // Decrypt the at-rest PII for the operator view — handles encrypted + legacy plaintext rows.
    const key = env.PII_ENCRYPTION_KEY;
    const data = await Promise.all(
      results.map(async (r) => ({
        ...r,
        due_at: dueAt((r as { submitted_at: string }).submitted_at),
        email: await decField((r as { email: string | null }).email, key),
        message: await decField((r as { message: string | null }).message, key),
      })),
    );
    return json({ data }, 200, cors);
  } catch (error) {
    logger.error("data-requests read failed", {
      name: (error as Error)?.name,
    });
    return json({ error: "server" }, 502, cors);
  }
}
