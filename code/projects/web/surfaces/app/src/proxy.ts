/**
 * Next.js proxy — next-intl locale detection + redirection, and (when Clerk is
 * configured) the auth session so `auth()` works app-wide. Auth is opt-in: with no
 * publishable key the proxy is next-intl only, exactly as before.
 */

import createMiddleware from "next-intl/middleware";
import { clerkMiddleware } from "@clerk/nextjs/server";
import { type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);
const clerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

const proxy = clerkConfigured
  ? clerkMiddleware((_auth, request) => intlMiddleware(request))
  : (request: NextRequest) => intlMiddleware(request);

export default proxy;

export const config = {
  matcher: [
    // Every page path EXCEPT api, Next internals, root metadata routes, and any
    // path with a dot (static assets).
    "/((?!api|_next|_vercel|manifest|robots|sitemap|.*\\..*).*)",
  ],
};
