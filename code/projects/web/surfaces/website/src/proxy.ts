/**
 * Next.js proxy (formerly "middleware" — renamed in Next 16).
 * Handles locale routing via next-intl, plus site-wide maintenance mode, and —
 * when Clerk is configured — attaches the auth session so `auth()` works app-wide.
 * Extend here for auth gates, geo redirects, etc.
 */

import createMiddleware from "next-intl/middleware";
import { clerkMiddleware } from "@clerk/nextjs/server";
import { type NextRequest } from "next/server";
import { features } from "@/config";
import { maintenanceRewrite } from "@indiecrafts/packages-shared-system-pages/proxy";
import { getMaintenanceMode } from "@/lib/maintenance";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

// Auth is opt-in: only wrap in Clerk when a publishable key is bound (matches
// AppClerkProvider + the repo's fail-open-until-configured pattern). Without it,
// `clerkMiddleware` would throw on every request and break "runs as-is".
const clerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

// The maintenance → locale pipeline. When Clerk is on it runs INSIDE
// `clerkMiddleware` (so the session is attached first); otherwise it runs directly.
async function pipeline(request: NextRequest) {
  // Maintenance mode: rewrite every matched request to `/maintenance` (503) when
  // EITHER the build-time hard override (`features.maintenance`) OR the live Sanity
  // toggle (`siteSettings.maintenanceMode`, cached per-isolate, fail-open) is on.
  // The `||` short-circuits, so the hard override skips the Sanity read. The matcher
  // already excludes `/studio` + metadata routes, so editors + crawlers stay reachable.
  const isDown = features.maintenance || (await getMaintenanceMode());
  const maintenance = maintenanceRewrite(request, isDown);
  if (maintenance) return maintenance;
  return intlMiddleware(request);
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
