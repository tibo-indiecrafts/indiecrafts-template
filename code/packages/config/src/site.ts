/**
 * Site identity + per-deployment knobs. Almost all brand/SEO copy lives in Sanity
 * (`siteSettings` / `siteMeta`); the only values that must stay in code are the
 * ones that resolve **synchronously** at build (the origin, the namespace) or that
 * other bricks read as config data (logging).
 */

import type { LoggingConfig } from "./types";

/** Sentinel for an unconfigured site — drives `isSiteConfigured`. Module-internal. */
const PLACEHOLDER_SITE_URL = "https://example.com";

/**
 * The template's default project namespace. When this template is reused per
 * client, `pnpm project:rename <slug>` rewrites this constant (and the matching
 * `wrangler.toml` resource names) so each deployment gets a **unique** namespace.
 * `site.prefix` (below) reads `NEXT_PUBLIC_SITE_PREFIX` first, so a deployment can
 * also override it purely by env without editing code.
 */
export const DEFAULT_SITE_PREFIX = "indiecrafts";

export const site = {
  /**
   * Production origin (`NEXT_PUBLIC_SITE_URL`, else the placeholder). The one
   * build-time site value that must stay in code — it feeds `metadataBase`,
   * canonical, sitemap, and robots, which resolve synchronously.
   *
   * Everything else that used to live here — name, tagline, description, contact,
   * business/legal fields, extra JSON-LD — is edited in Sanity (`siteSettings` /
   * `siteMeta`) and read via `getSiteSettings` / `getSiteSeo`.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL || PLACEHOLDER_SITE_URL,
  /**
   * Per-deployment namespace (`NEXT_PUBLIC_SITE_PREFIX`, else `DEFAULT_SITE_PREFIX`).
   * Prefixes browser-owned keys — the consent record, the theme choice, the locale
   * cookie — so two instances never collide even on a shared origin or preview
   * domain. Must be **unique per client**; keep it in sync with the `wrangler.toml`
   * deploy resource names via `pnpm project:rename <slug>`.
   */
  prefix: process.env.NEXT_PUBLIC_SITE_PREFIX || DEFAULT_SITE_PREFIX,
} as const;

/** `true` once `site.url` has been pointed at a real origin. */
export const isSiteConfigured = site.url !== PLACEHOLDER_SITE_URL;

/**
 * next-intl's locale cookie name, namespaced by `site.prefix` so two instances on
 * a shared origin don't share the visitor's language choice. `i18n/routing.ts`
 * sets it via `localeCookie`; the standalone `/maintenance` route reads it directly.
 */
export const localeCookieName = `${site.prefix}_NEXT_LOCALE`;

/**
 * Logging config (read by `@indiecrafts/logger`). Per-environment minimum console
 * level — **`production` is `"silent"`** so live sites emit no console noise;
 * error/fatal still reach transports (e.g. Sentry) when one is wired. Override the
 * level live with `NEXT_PUBLIC_LOG_LEVEL` (e.g. to `"debug"` while chasing a prod
 * bug). `redactKeys` are scrubbed from every log's context.
 */
export const logging: LoggingConfig = {
  levels: {
    development: "debug",
    test: "silent",
    staging: "info",
    production: "silent",
  },
  redactKeys: [
    "password",
    "token",
    "apiKey",
    "authorization",
    "cookie",
    "secret",
    "sessionToken",
  ],
};
