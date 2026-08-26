/**
 * Next.js proxy (formerly "middleware" — renamed in Next 16).
 * Handles locale routing via next-intl, plus site-wide maintenance mode, and —
 * when Clerk is configured — attaches the auth session so `auth()` works app-wide.
 * Extend here for auth gates, geo redirects, etc.
 */

import createMiddleware from "next-intl/middleware";
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, type NextResponse } from "next/server";
import { features } from "@/config";
import { maintenanceRewrite } from "@indiecrafts/packages-shared-system-pages/proxy";
import { getMaintenanceMode } from "@/lib/maintenance";
import { routing } from "@/i18n/routing";
import {
  generateNonce,
  cspHeadersForMode,
  type CspMode,
} from "@indiecrafts/packages-shared-security";
import { getCurrentEnvironment } from "@indiecrafts/packages-shared-config";
import { websiteCspHosts } from "./lib/csp-hosts";

const intlMiddleware = createMiddleware(routing);

// Auth is opt-in: only wrap in Clerk when a publishable key is bound (matches
// AppClerkProvider + the repo's fail-open-until-configured pattern). Without it,
// `clerkMiddleware` would throw on every request and break "runs as-is".
const clerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

// Enforce by default (the strict nonce CSP is the enforced policy); set
// CSP_MODE=report-only to roll a surface back to observation-only.
const CSP_MODE: CspMode =
  process.env.CSP_MODE === "report-only" ? "report-only" : "enforce";
// Opt-in Trusted-Types Report-Only trial (enforce mode). Off unless CSP_TRUSTED_TYPES=report.
const REPORTING = {
  endpoint: "/api/csp-report",
  trustedTypesReportOnly: process.env.CSP_TRUSTED_TYPES === "report",
};

/** Clone the request with `x-nonce` set, so the RSC layout can read it via `headers()`. */
function withNonceRequest(request: NextRequest, nonce: string): NextRequest {
  const headers = new Headers(request.headers);
  headers.set("x-nonce", nonce);
  // The current path, so the RSC layout can build an absolute share URL for the
  // footer "share this page" without threading it through every page.
  headers.set("x-pathname", request.nextUrl.pathname);
  return new NextRequest(request, { headers });
}

/** Stamp the CSP (+ reporting) response headers for the configured `CSP_MODE`. */
function setCsp(response: NextResponse, nonce: string): NextResponse {
  const { enforced, reportOnly } = cspHeadersForMode(
    getCurrentEnvironment(),
    websiteCspHosts,
    REPORTING,
    nonce,
    CSP_MODE,
  );
  response.headers.set("Content-Security-Policy", enforced);
  response.headers.set("Reporting-Endpoints", `csp-endpoint="${REPORTING.endpoint}"`);
  if (reportOnly) response.headers.set("Content-Security-Policy-Report-Only", reportOnly);
  return response;
}

/**
 * Re-enable browser bfcache for HTML page navigations. Next sets `Cache-Control: no-store`
 * on dynamic pages, which disables bfcache entirely; swap it for `no-cache` (still
 * revalidates on every request) so back/forward restores instantly. Scoped to top-level
 * document requests via `Sec-Fetch-Dest` — RSC prefetches, `fetch()`s, and the feed/llms
 * route handlers (which must stay CDN-cacheable) send `empty`, so they keep Next's caching.
 */
function setBfcache(response: NextResponse, request: NextRequest): NextResponse {
  if (request.headers.get("sec-fetch-dest") === "document")
    response.headers.set(
      "Cache-Control",
      "private, no-cache, max-age=0, must-revalidate",
    );
  return response;
}

// The maintenance → locale pipeline. When Clerk is on it runs INSIDE
// `clerkMiddleware` (so the session is attached first); otherwise it runs directly.
// One nonce per request, stamped on EVERY return path (maintenance rewrite AND the
// intl response) so both carry the matching strict CSP; the intl call runs against
// the nonce-carrying request so the layout can read `x-nonce` via `headers()`.
async function pipeline(request: NextRequest): Promise<NextResponse> {
  const nonce = generateNonce();
  const nonced = withNonceRequest(request, nonce);
  // Maintenance mode: rewrite every matched request to `/maintenance` (503) when
  // EITHER the build-time hard override (`features.maintenance`) OR the live Sanity
  // toggle (`siteSettings.maintenanceMode`, cached per-isolate, fail-open) is on.
  // The `||` short-circuits, so the hard override skips the Sanity read. The matcher
  // already excludes `/studio` + metadata routes, so editors + crawlers stay reachable.
  const isDown = features.maintenance || (await getMaintenanceMode());
  const maintenance = maintenanceRewrite(nonced, isDown);
  if (maintenance) return setCsp(maintenance, nonce);
  return setBfcache(setCsp(intlMiddleware(nonced), nonce), request);
}

const proxy = clerkConfigured
  ? clerkMiddleware((_auth, request) => pipeline(request))
  : (request: NextRequest) => pipeline(request);

export default proxy;

export const config = {
  matcher: [
    // Match all page paths EXCEPT:
    //   - api, _next, _vercel  (Next internals)
    //   - manifest, robots, sitemap
    //     (root-level metadata routes — locale-agnostic by Next convention)
    //   - paths with a dot   (static assets: .css, .js, .png, .svg, …)
    "/((?!api|_next|_vercel|studio|maintenance|manifest|robots|sitemap|.*\\..*).*)",
    // Special: locale-aware route handlers (file extensions excluded above).
    // Add per-locale endpoint paths here so next-intl rewrites them too.
    "/llms.txt",
    "/llms-full.txt",
    "/llms/:path*",
    "/blog/rss.xml",
    "/blog/:slug/md",
  ],
};
