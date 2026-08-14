/**
 * Same-site origin check for POST route hardening — **pure** (no `server-only`),
 * so it's unit-testable and reusable. Rejects cross-site browser POSTs (the CSRF /
 * cross-origin-abuse vector for raw route handlers, which — unlike Server Actions —
 * have no built-in token). A non-browser caller (no `Origin`, e.g. curl/server)
 * passes: there is no CSRF vector for it.
 *
 * @param allowed `true` = same-origin/site only (default) · `string[]` = extra
 *   allowed origins (e.g. a trusted embed host) · `false` = disable the check.
 */
export function isSameSiteRequest(req: Request, allowed: boolean | string[] = true): boolean {
  if (allowed === false) return true;
  const site = req.headers.get("sec-fetch-site");
  if (site) return site === "same-origin" || site === "same-site" || site === "none";
  const origin = req.headers.get("origin");
  if (!origin) return true; // non-browser — no CSRF vector
  try {
    const o = new URL(origin);
    if (o.host === req.headers.get("host")) return true;
    return Array.isArray(allowed) && allowed.includes(o.origin);
  } catch {
    return false;
  }
}
