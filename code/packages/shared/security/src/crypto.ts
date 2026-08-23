/**
 * Symmetric encryption + one-way hashing — AES-256-GCM and salted SHA-256.
 *
 * Built on **Web Crypto** (`crypto.subtle`), a global on both Node 22 and the
 * Workers runtime — zero dependencies, no `node:` import, no `@types/node`
 * (the rest of this brick is edge-typed too). Every function is async because
 * Web Crypto is.
 *
 * The secret/salt is ALWAYS injected by the caller — this brick holds no keys.
 * Typical secrets live in a server-only env var, never `NEXT_PUBLIC_*`.
 *
 * Uses:
 *  - `encrypt` / `decrypt` — reversible at-rest protection for PII with an
 *    integrity tag, so tampering is detected on decrypt.
 *  - `hashIpAddress` / `verifyIpHash` — store an IP privately (rate-limit keys,
 *    audit logs) without keeping the raw address (GDPR).
 */

export interface EncryptedData {
  /** AES-GCM ciphertext with the appended 16-byte auth tag (hex). */
  ciphertext: string;
  /** 12-byte GCM initialization vector (hex). */
  iv: string;
  /** Payload version — bump to migrate the format / rotate keys. */
  version: 1;
}

const utf8 = new TextEncoder();

function toHex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex: string) {
  return Uint8Array.from(hex.match(/.{1,2}/g) ?? [], (h) =>
    Number.parseInt(h, 16),
  );
}

/** Derive a 256-bit AES-GCM key from the secret (SHA-256 gives a fixed length). */
async function deriveKey(secret: string): Promise<CryptoKey> {
  const digest = await crypto.subtle.digest("SHA-256", utf8.encode(secret));
  return crypto.subtle.importKey("raw", digest, "AES-GCM", false, [
    "encrypt",
    "decrypt",
  ]);
}

/** Encrypt a string. Returns the ciphertext (tag appended) plus the iv needed to decrypt. */
export async function encrypt(
  plaintext: string,
  secret: string,
): Promise<EncryptedData> {
  if (!plaintext || !secret)
    throw new Error("plaintext and secret are required for encryption");

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(secret);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    utf8.encode(plaintext),
  );

  return { ciphertext: toHex(ciphertext), iv: toHex(iv.buffer), version: 1 };
}

/** Decrypt what `encrypt` produced. Rejects if the auth tag fails (tampered / wrong key). */
export async function decrypt(
  data: EncryptedData,
  secret: string,
): Promise<string> {
  if (!data || !secret)
    throw new Error("encrypted data and secret are required for decryption");
  if (data.version !== 1)
    throw new Error(`unsupported encryption version: ${String(data.version)}`);

  const key = await deriveKey(secret);
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromHex(data.iv) },
    key,
    fromHex(data.ciphertext),
  );
  return new TextDecoder().decode(plaintext);
}

/** Encrypt any JSON-serialisable object. */
export async function encryptObject<T>(
  value: T,
  secret: string,
): Promise<EncryptedData> {
  return encrypt(JSON.stringify(value), secret);
}

/** Decrypt back to the original object shape (caller asserts `T`). */
export async function decryptObject<T>(
  data: EncryptedData,
  secret: string,
): Promise<T> {
  return JSON.parse(await decrypt(data, secret)) as T;
}

/**
 * Salted, deterministic, one-way hash of an IP (or any string). Same input +
 * salt → same hash, so it still keys a rate-limiter, but the raw value is not
 * recoverable and the salt blocks rainbow tables.
 */
export async function hashIpAddress(ip: string, salt: string): Promise<string> {
  if (!ip || !salt) throw new Error("ip and salt are required for hashing");
  const digest = await crypto.subtle.digest(
    "SHA-256",
    utf8.encode(salt + ip.toLowerCase().trim()),
  );
  return toHex(digest);
}

/** Constant-time compare of two equal-length hex strings. */
function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Check that a plaintext IP matches a stored hash (constant-time). */
export async function verifyIpHash(
  ip: string,
  hash: string,
  salt: string,
): Promise<boolean> {
  return timingSafeEqualHex(await hashIpAddress(ip, salt), hash);
}

/**
 * Salted, deterministic, one-way fingerprint of an email — the pseudonymisation
 * key. Same email + salt → same fingerprint, so a record can be matched for
 * erasure/retention without storing plaintext, but the address is not
 * recoverable. With the salt RETAINED this is pseudonymised data (still personal
 * data under GDPR); true anonymisation is dropping the fingerprint at final purge.
 */
export async function fingerprintEmail(
  email: string,
  salt: string,
): Promise<string> {
  if (!email || !salt)
    throw new Error("email and salt are required for fingerprinting");
  const digest = await crypto.subtle.digest(
    "SHA-256",
    utf8.encode(salt + email.toLowerCase().trim()),
  );
  return toHex(digest);
}

/** Type guard — does `data` have the `EncryptedData` shape? */
export function isEncryptedData(data: unknown): data is EncryptedData {
  if (!data || typeof data !== "object") return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.ciphertext === "string" &&
    typeof obj.iv === "string" &&
    obj.version === 1
  );
}
