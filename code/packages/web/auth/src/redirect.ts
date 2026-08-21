/**
 * Open-redirect guard + post-sign-in target resolution.
 *
 * A redirect target (a `redirect_url` query param, or any redirect we build
 * ourselves) must be a SAME-ORIGIN relative path — a single leading `/`, no scheme,
 * no protocol-relative `//host`, no backslash, no control chars. Anything else is
 * dropped to the app's `home`, so an attacker can't craft
 * `?redirect_url=https://evil.example` to bounce a signed-in user off-site. Clerk's
 * `<SignIn>` also validates `redirect_url` against the instance origin; this is our
 * own guard for redirects WE construct (e.g. the admin gate).
 */
export function isSafeRelativePath(value: unknown): value is string {
  if (typeof value !== "string" || value.length === 0) return false;
  if (!value.startsWith("/") || value.startsWith("//")) return false;
  if (value.includes("\\")) return false;
  // Reject control characters (0x00–0x1F and 0x7F) via char codes — no regex escape
  // that a file write could mangle.
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code < 0x20 || code === 0x7f) return false;
  }
  return true;
}

/**
 * The post-sign-in target. Precedence: an explicit `force` (when safe) wins; else a
 * safe `redirectUrl`; else the app's `home` fallback.
 */
export function resolveSignInRedirect(
  redirectUrl: string | null | undefined,
  home: string,
  force?: string | null,
): string {
  if (force && isSafeRelativePath(force)) return force;
  if (isSafeRelativePath(redirectUrl)) return redirectUrl;
  return home;
}
