/**
 * The one gate for handing a URL to the OS or allowing a navigation: only real web
 * URLs (`http:`/`https:`). Blocks `file:`, `javascript:`, `data:`, custom schemes, and
 * non-strings — so a compromised renderer can't get the main process to open a local
 * file or run a script URL. Pure (no Electron import) → unit-testable. Used by the
 * `open-external` IPC handler, `will-navigate`, and `setWindowOpenHandler`.
 */
export function isSafeExternalUrl(url: unknown): url is string {
  return typeof url === "string" && /^https?:\/\//i.test(url);
}

/** The validated params carried back on the OAuth deep link. */
export type OAuthCallback = {
  /** The single-use value the renderer generated before opening the browser; it
   *  re-validates this against its own copy (CSRF / hijack binding). */
  state: string;
  /** Clerk's transfer nonce, when present. */
  rotatingTokenNonce?: string;
};

const OAUTH_SCHEME = "indiecrafts:";
const OAUTH_HOST = "oauth-callback";
const MAX_URL = 4096;
const MAX_PARAM = 2048;
// URL-safe token chars only — a value with anything else is treated as poisoned.
const SAFE_VALUE = /^[\w.~-]+$/;

/**
 * Strict parser for the INBOUND OAuth deep link. Accepts ONLY
 * `indiecrafts://oauth-callback?state=…` and returns the allowlisted params; rejects
 * everything else — wrong scheme/host, missing/oversize/illegal params, non-strings.
 * So a forged `indiecrafts://…` from another local app can't drive the renderer. Pure
 * (no Electron import) → unit-testable. The `state` is validated AGAIN in the renderer
 * against the value it generated, so interception alone can't complete a sign-in.
 */
export function parseOAuthCallback(rawUrl: unknown): OAuthCallback | null {
  if (typeof rawUrl !== "string" || rawUrl.length === 0 || rawUrl.length > MAX_URL)
    return null;

  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }
  if (url.protocol !== OAUTH_SCHEME || url.hostname !== OAUTH_HOST) return null;
  // No path segment beyond the host — reject `indiecrafts://oauth-callback/anything`.
  if (url.pathname !== "" && url.pathname !== "/") return null;

  // `undefined` = absent, `null` = present-but-illegal (poison → reject the whole URL).
  const clean = (key: string): string | null | undefined => {
    const v = url.searchParams.get(key);
    if (v === null) return undefined;
    if (v.length === 0 || v.length > MAX_PARAM || !SAFE_VALUE.test(v)) return null;
    return v;
  };

  const state = clean("state");
  if (typeof state !== "string") return null; // required + must be valid

  const nonce = clean("rotating_token_nonce");
  if (nonce === null) return null;

  return { state, rotatingTokenNonce: nonce };
}
