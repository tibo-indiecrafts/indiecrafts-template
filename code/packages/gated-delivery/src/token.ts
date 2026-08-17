/**
 * Signed, expiring "gated delivery" token — HMAC-SHA256 over a JSON payload.
 *
 * Built on **Web Crypto** (`crypto.subtle`), a global on both Node 22 and the
 * Workers runtime — zero dependencies, no `node:` import, no `@types/node`.
 * Every function is async because Web Crypto is.
 *
 * The secret is ALWAYS injected by the caller — this brick holds no keys.
 * Typical secrets live in a server-only env var, never `NEXT_PUBLIC_*`.
 *
 * Token format: `<base64url(json payload)>.<base64url(hmac signature)>`.
 * The signature covers the encoded payload segment (JWT-style).
 */

const encoder = new TextEncoder();
const decoder = new TextDecoder();

/** Bytes → url-safe base64 (no `+` `/` `=`). */
function toBase64url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** url-safe base64 → bytes. Throws (like `atob`) on invalid input — callers catch. */
function fromBase64url(value: string): Uint8Array {
  const binary = atob(value.replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** Import the secret as an HMAC-SHA256 key. */
async function importHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}

/** HMAC-SHA256 the data string, returning the raw signature bytes. */
async function hmac(data: string, secret: string): Promise<Uint8Array> {
  const key = await importHmacKey(secret);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(data)));
}

/** Equal-length XOR accumulate — no early return, so timing does not leak the mismatch position. */
function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  // `?? 0` satisfies noUncheckedIndexedAccess; i is always in bounds (equal lengths),
  // so it never fires — and the loop still XORs every byte (no early return, constant time).
  for (let i = 0; i < a.length; i++) diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  return diff === 0;
}

// ponytail: signed + expiring, NOT single-use — the same token opens the link
// until `exp`. Add a consumed-token store (KV/DB) keyed by a token id for
// single-use only if abuse appears.
export async function signDownloadToken(payload: { assetId: string; exp: number }, secret: string): Promise<string> {
  const payloadB64 = toBase64url(encoder.encode(JSON.stringify(payload)));
  const sigB64 = toBase64url(await hmac(payloadB64, secret));
  return `${payloadB64}.${sigB64}`;
}

// ponytail: gates link *discovery*, not the asset object — a public CDN URL is
// still public once known. Serve private assets behind signed CDN/R2 URLs.
export async function verifyDownloadToken(
  token: string,
  secret: string,
  now?: number,
): Promise<{ assetId: string } | null> {
  try {
    const dot = token.indexOf(".");
    if (dot < 0) return null;
    const payloadB64 = token.slice(0, dot);
    const sigB64 = token.slice(dot + 1);
    if (!payloadB64 || !sigB64) return null;

    const expected = await hmac(payloadB64, secret);
    if (!timingSafeEqual(fromBase64url(sigB64), expected)) return null;

    const payload: unknown = JSON.parse(decoder.decode(fromBase64url(payloadB64)));
    if (!payload || typeof payload !== "object") return null;
    const { assetId, exp } = payload as Record<string, unknown>;
    if (typeof assetId !== "string" || typeof exp !== "number") return null;
    if (exp <= (now ?? Date.now())) return null;

    return { assetId };
  } catch {
    return null;
  }
}
