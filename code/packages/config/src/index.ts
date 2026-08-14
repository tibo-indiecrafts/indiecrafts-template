/**
 * `@indiecrafts/config` — the single import surface for site technical config.
 * Almost entirely DATA an operator edits; split into per-concern modules and
 * re-exported here so everyone imports one name: `import { … } from "@indiecrafts/config"`.
 *
 * Modules: `./site` (origin · prefix · logging) · `./i18n` (locales + routing
 * helpers) · `./format` (Intl defaults) · `./seo` (crawl mechanics · maker credit)
 * · `./pages` (the generic **page-config contract** — `PageConfig` + `isPageVisible`,
 * not any app's routes) · `./env` (environment + CSP) · `./types` (shared types).
 *
 * NOT here — **app-owned instance config** lives in the app at `apps/web/src/config`
 * so a second app ships its own, read via `@/config` (which re-exports these
 * primitives): design (`theme` · `fonts`), feature flags (`features`), and the
 * route map (`pages` + `StaticAppPathname`). NOT here — edited in Sanity: brand +
 * SEO copy (`siteSettings` / `siteMeta`), navigation (`navigation` singleton),
 * analytics id (`siteSettings.analytics`), llms resources (`siteMeta.llms`). Only
 * `site.url` / `site.prefix` read env.
 */

// ── Values + functions ───────────────────────────────────────
export {
  DEFAULT_SITE_PREFIX,
  site,
  isSiteConfigured,
  localeCookieName,
  logging,
} from "./site";
export {
  i18n,
  locales,
  defaultLocale,
  localeCodes,
  localeMap,
  localePrefix,
  localizedPathname,
  localeDir,
  isLocale,
} from "./i18n";
export { formatDefaults, localeFormat } from "./format";
export { seoDefaults } from "./seo";
export { isPageVisible } from "./pages";
export { getCurrentEnvironment, getCSPConnectSources } from "./env";

// ── Public types ─────────────────────────────────────────────
export type {
  Locale,
  ThemeName,
  ThemeMode,
  FontKey,
  FontRoles,
  Environment,
  LogLevel,
} from "./types";
export type {
  PageConfig,
  PageSeo,
  RouteSlug,
  CanonicalOverride,
  OgImageUrl,
} from "./pages";
