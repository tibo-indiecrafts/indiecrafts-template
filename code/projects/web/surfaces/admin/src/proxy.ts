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
import { NextResponse, type NextRequest } from "next/server";
import { isAdmin } from "@indiecrafts/packages-shared-auth";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);
const clerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

// The sign-in page is the one public route (with or without a locale prefix).
const isSignIn = (request: NextRequest) =>
  /(^|\/)sign-in(\/|$)/.test(request.nextUrl.pathname);

const gated = clerkMiddleware(async (auth, request) => {
  if (isSignIn(request)) return intlMiddleware(request);
  const { userId, sessionClaims } = await auth();
  // Fail closed — anything but a verified admin claim goes to sign-in.
  if (!userId || !isAdmin(sessionClaims)) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return intlMiddleware(request);
});

const proxy = clerkConfigured
  ? gated
  : (request: NextRequest) => intlMiddleware(request);

export default proxy;

export const config = {
  matcher: [
    // Every page path EXCEPT api, Next internals, root metadata routes, and any
    // path with a dot (static assets).
    "/((?!api|_next|_vercel|manifest|robots|sitemap|.*\\..*).*)",
  ],
};
