/**
 * Next.js proxy — next-intl locale detection + redirection, and (when Clerk is
 * configured) the auth session so `auth()` works app-wide. Auth is opt-in: with no
 * publishable key the proxy is next-intl only, exactly as before.
 */

import createMiddleware from "next-intl/middleware";
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, type NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import {
  generateNonce,
  cspHeadersForMode,
  type CspMode,
} from "@indiecrafts/packages-shared-security";
import { getCurrentEnvironment } from "@indiecrafts/packages-shared-config";

const intlMiddleware = createMiddleware(routing);
const clerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

const CSP_MODE: CspMode =
  process.env.CSP_MODE === "enforce" ? "enforce" : "report-only";
const REPORTING = { endpoint: "/api/csp-report" };

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

const proxy = clerkConfigured
  ? clerkMiddleware((_auth, request) => runIntl(request))
  : (request: NextRequest) => runIntl(request);

export default proxy;

export const config = {
  matcher: [
    // Every page path EXCEPT api, Next internals, root metadata routes, and any
    // path with a dot (static assets).
    "/((?!api|_next|_vercel|manifest|robots|sitemap|.*\\..*).*)",
  ],
};
