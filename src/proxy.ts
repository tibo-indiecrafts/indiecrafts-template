/**
 * Next.js proxy (formerly "middleware" — renamed in Next 16).
 * Currently only handles locale routing via next-intl.
 * Extend here for auth, feature flags, geo redirects, etc.
 */

import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match all page paths EXCEPT:
    //   - api, _next, _vercel  (Next internals)
    //   - icon, apple-icon, opengraph-image, manifest, robots, sitemap
    //     (root-level metadata routes — locale-agnostic by Next convention)
    //   - paths with a dot   (static assets: .css, .js, .png, .svg, …)
    "/((?!api|_next|_vercel|icon|apple-icon|opengraph-image|manifest|robots|sitemap|.*\\..*).*)",
    // Special: locale-aware route handlers (file extensions excluded above).
    // Add per-locale endpoint paths here so next-intl rewrites them too.
    "/llms.txt",
    "/llms-full.txt",
    "/llms/:path*",
  ],
};
