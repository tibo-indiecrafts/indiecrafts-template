/**
 * Declare the app's CSP host allowlist for the proxy.
 *
 * @see docs/reference/projects/web/app/src/lib/csp-hosts.md
 */
import type { CspHosts } from "@indiecrafts/packages-shared-security";

const originOf = (url: string | undefined): string[] => {
  try {
    return url ? [new URL(url).origin] : [];
  } catch {
    return [];
  }
};

/**
 * The app calls two other origins from the browser: the website (`/api/legal-version`,
 * the live legal version) and the api Worker (`/v1/consent/legal`, the signed-in sync).
 * The production `connect-src` allows only `'self'`, so both must be listed here.
 */
export function appCspHosts(
  websiteUrl: string,
  apiUrl: string | undefined,
): CspHosts {
  return { connectSrc: [...originOf(websiteUrl), ...originOf(apiUrl)] };
}
