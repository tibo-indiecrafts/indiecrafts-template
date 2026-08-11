/**
 * Next.js proxy (formerly "middleware" — renamed in Next 16).
 * Handles locale routing via next-intl, plus site-wide maintenance mode.
 * Extend here for auth, geo redirects, etc.
 */

import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { features } from "@/config";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  // Maintenance mode: rewrite every matched request to the `/maintenance`
  // page with a 503 (temporary). The matcher already excludes `/studio` and
  // the metadata routes, so editors + crawlers' sitemap/robots stay reachable.
  // The rewrite is invisible to the URL bar and never loops back on itself.
  if (features.maintenance && !request.nextUrl.pathname.startsWith("/maintenance")) {
    return NextResponse.rewrite(new URL("/maintenance", request.url), {
      status: 503,
      headers: { "Retry-After": "3600" },
    });
  }
  return intlMiddleware(request);
}

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
