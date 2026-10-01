/**
 * Next.js proxy — next-intl locale detection + redirection, and (when Clerk is
 * configured) the auth session so `auth()` works app-wide. Auth is opt-in: with no
 * publishable key the proxy is next-intl only, exactly as before.
 */

import createMiddleware from "next-intl/middleware";
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import {
  generateNonce,
  cspHeadersForMode,
  type CspMode,
} from "@indiecrafts/packages-shared-security";
import { getCurrentEnvironment } from "@indiecrafts/packages-shared-config";
import { site } from "@/config";
import { appCspHosts } from "@/lib/csp-hosts";

const intlMiddleware = createMiddleware(routing);
const clerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

// The sign-in page is the one public route (with or without a locale prefix).
const isSignIn = (request: NextRequest) =>
  /(^|\/)sign-in(\/|$)/.test(request.nextUrl.pathname);

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
  return new NextRequest(request, { headers });
}

/** Stamp the CSP (+ reporting) response headers for the configured `CSP_MODE`. */
function setCsp(response: NextResponse, nonce: string): NextResponse {
  const { enforced, reportOnly } = cspHeadersForMode(
    getCurrentEnvironment(),
    appCspHosts(site.websiteUrl, process.env.NEXT_PUBLIC_API_URL),
    REPORTING,
    nonce,
    CSP_MODE,
  );
  response.headers.set("Content-Security-Policy", enforced);
  response.headers.set(
    "Reporting-Endpoints",
    `csp-endpoint="${REPORTING.endpoint}"`,
  );
  if (reportOnly)
    response.headers.set("Content-Security-Policy-Report-Only", reportOnly);
  return response;
}

/** Run the intl pipeline against a nonce-carrying request, then stamp the CSP. */
function runIntl(request: NextRequest): NextResponse {
  const nonce = generateNonce();
  const response = intlMiddleware(withNonceRequest(request, nonce));
  return setCsp(response, nonce);
}

// When Clerk is configured, every route except sign-in requires a signed-in user; anything
// else redirects to sign-in. Coarse routing only — the real enforcement is the server-side
// (app) layout gate (middleware is bypassable, Next.js CVE-2025-29927). Unconfigured → the
// app runs as a public scaffold (next-intl only), auth opt-in on the key.
const gated = clerkMiddleware(async (auth, request) => {
  // Api routes are matched ONLY so Clerk attaches the session for `auth()` in the handler,
  // which authorizes the caller itself. Never redirect or locale-rewrite them.
  if (request.nextUrl.pathname.startsWith("/api")) return NextResponse.next();
  if (isSignIn(request)) return runIntl(request);
  const { userId } = await auth();
  if (!userId) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.search = "";
    // No nonce'd scripts on a redirect — still stamp the enforced CSP for consistency.
    return setCsp(NextResponse.redirect(url), generateNonce());
  }
  return runIntl(request);
});

const proxy = clerkConfigured
  ? gated
  : (request: NextRequest) => runIntl(request);

export default proxy;

export const config = {
  matcher: [
    // Every page path EXCEPT api, Next internals, root metadata routes, and any
    // path with a dot (static assets).
    "/((?!api|_next|_vercel|manifest|robots|sitemap|.*\\..*).*)",
    // Clerk-authenticated api routes: matched ONLY so `clerkMiddleware` attaches the session
    // for `auth()` (the proxy passes them straight through). Add any new api route that calls
    // `auth()` here.
    "/api/session-log",
  ],
};
