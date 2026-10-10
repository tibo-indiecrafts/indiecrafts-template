/**
 * Decide how the Capacitor shell routes links and deep links.
 *
 * @see docs/reference/projects/web/app/src/lib/shell-links.md
 */

/** True when `href` leaves the app: an absolute http(s) URL on another origin. Relative,
 *  same-origin, hash, `mailto:`/`tel:` and malformed hrefs stay in the web view. */
export function isExternalUrl(href: string, appOrigin: string): boolean {
  let url: URL;
  try {
    url = new URL(href, appOrigin);
  } catch {
    return false;
  }
  return (
    (url.protocol === "https:" || url.protocol === "http:") && url.origin !== appOrigin
  );
}

/** The in-app path for a custom-scheme deep link: `<scheme>://account?tab=data` →
 *  `/account?tab=data`. Returns `/` for an empty or malformed link, and for any link
 *  whose path would resolve off the app origin (e.g. `/\evil.com`, which browsers read
 *  as `//evil.com`) — a deep link can only ever land inside the app. */
export function deepLinkPath(url: string): string {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return "/";
  }
  const path = `/${u.host}${u.pathname}`.replace(/\/{2,}/g, "/").replace(/(.)\/$/, "$1");
  const target = `${path}${u.search}`;
  const origin = "https://app.invalid";
  return new URL(target, origin).origin === origin ? target : "/";
}
