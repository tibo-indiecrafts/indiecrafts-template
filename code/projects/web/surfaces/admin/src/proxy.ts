/**
 * Admin proxy — next-intl locale routing + the ADMIN GATE. When Clerk is
 * configured, every route except the sign-in page requires an `admin` session;
 * anything else redirects to sign-in. The gate FAILS CLOSED: no session, or a
 * non-admin claim, or an unverifiable token → redirect.
 *
 * This is coarse routing only. The real authorization is enforced SERVER-SIDE in
 * the (dashboard) layout + each action/handler (middleware is bypassable — Next.js
 * CVE-2025-29927). Unconfigured (no publishable key) → the scaffold runs UNGATED;
 * configure Clerk before shipping admin.
 */

import createMiddleware from "next-intl/middleware";
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@indiecrafts/packages-shared-auth";
import { routing } from "@/i18n/routing";
import {
  generateNonce,
  cspHeadersForMode,
  type CspMode,
} from "@indiecrafts/packages-shared-security";
import { getCurrentEnvironment } from "@indiecrafts/packages-shared-config";

const intlMiddleware = createMiddleware(routing);
const clerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

// The sign-in page is the one public route (with or without a locale prefix).
const isSignIn = (request: NextRequest) =>
  /(^|\/)sign-in(\/|$)/.test(request.nextUrl.pathname);

const CSP_MODE: CspMode =
  process.env.CSP_MODE === "enforce" ? "enforce" : "report-only";
const REPORTING = { endpoint: "/api/csp-report", reportOnly: { dropSources: ["https:"] } };

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
    {},
    REPORTING,
    nonce,
    CSP_MODE,
  );
  response.headers.set("Content-Security-Policy", enforced);
  response.headers.set("Reporting-Endpoints", `csp-endpoint="${REPORTING.endpoint}"`);
  if (reportOnly) response.headers.set("Content-Security-Policy-Report-Only", reportOnly);
  return response;
}

/** Run the intl pipeline against a nonce-carrying request, then stamp the CSP. */
function runIntl(request: NextRequest): NextResponse {
  const nonce = generateNonce();
  const response = intlMiddleware(withNonceRequest(request, nonce));
  return setCsp(response, nonce);
}

const gated = clerkMiddleware(async (auth, request) => {
  if (isSignIn(request)) return runIntl(request);
  const { userId, sessionClaims } = await auth();
  // Fail closed — anything but a verified admin claim goes to sign-in.
  if (!userId || !isAdmin(sessionClaims)) {
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
  ],
};
