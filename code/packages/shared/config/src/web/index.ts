/**
 * `@indiecrafts/packages-shared-config/web` — the WEB-only config primitives.
 *
 * Next-flavored: site origin/prefix read `NEXT_PUBLIC_*` env, `env` builds the
 * CSP, `pages` uses the `next` `Robots` type, `seo` is crawl mechanics. Import
 * these only from the web surfaces. Portable primitives live in `../shared`.
 */

// ── Values + functions ───────────────────────────────────────
export {
  DEFAULT_SITE_PREFIX,
  site,
  isSiteConfigured,
  localeCookieName,
  logging,
} from "./site";
export { seoDefaults } from "./seo";
export { isPageVisible } from "./pages";
export {
  getCurrentEnvironment,
  getCSPConnectSources,
  getClerkCspHosts,
  type ClerkCspHosts,
} from "./env";
export { rateLimits, RATE_WINDOW_SEC } from "./security";
export { defineFeatures } from "./features";

// ── Public types ─────────────────────────────────────────────
export type {
  PageConfig,
  PageSeo,
  RouteSlug,
  CanonicalOverride,
  OgImageUrl,
} from "./pages";
export type { RateLimitTier } from "./security";
export type { FeatureValue, FeatureMap } from "./features";
