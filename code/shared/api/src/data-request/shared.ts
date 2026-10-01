/**
 * Shared helpers for the data-request routes and emails: the JSON reply, the bearer, the
 * at-rest PII field encryption, and the GDPR due date.
 *
 * @see docs/reference/shared/api/src/data-request/shared.md
 */
// A leaf module: route.ts, status.ts and email.ts import from here, never from each other.
import {
  encrypt,
  decrypt,
  type EncryptedData,
} from "@indiecrafts/packages-shared-security/crypto";

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

/** GDPR Art. 12(3): answer within one month of receipt. A day the next month lacks
 *  (31 Jan → February) becomes that month's last day. */
export function dueAt(submittedAt: string): string {
  const d = new Date(submittedAt);
  const due = new Date(d);
  due.setUTCDate(1);
  due.setUTCMonth(d.getUTCMonth() + 1);
  const last = new Date(
    Date.UTC(due.getUTCFullYear(), due.getUTCMonth() + 1, 0),
  ).getUTCDate();
  due.setUTCDate(Math.min(d.getUTCDate(), last));
  return due.toISOString();
}
