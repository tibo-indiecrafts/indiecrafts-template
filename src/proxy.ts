/**
 * Next.js proxy (formerly "middleware" — renamed in Next 16).
 * Currently only handles locale routing via next-intl.
 * Extend here for auth, feature flags, geo redirects, etc.
 */

import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all paths except Next internals, API routes, and static assets.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
