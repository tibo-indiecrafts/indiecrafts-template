/**
 * `@indiecrafts/config` — the single import surface for site technical config.
 * Almost entirely DATA an operator edits; split into per-concern modules and
 * re-exported here so everyone imports one name: `import { … } from "@indiecrafts/config"`.
 *
 * Modules: `./site` (origin · prefix · logging) · `./theme` (tokens · fonts) ·
 * `./i18n` (locales + routing helpers) · `./format` (Intl defaults) · `./features`
 * (flags) · `./seo` (crawl mechanics · maker credit) · `./pages` (route map + types) ·
 * `./env` (environment + CSP) · `./types` (shared types).
 *
 * NOT here — edited in Sanity: brand + SEO copy (`siteSettings` / `siteMeta`),
 * navigation (`navigation` singleton), analytics id (`siteSettings.analytics`),
 * llms resources (`siteMeta.llms`). Only `site.url` / `site.prefix` read env.
 */

// ── Values + functions ───────────────────────────────────────
export {
  DEFAULT_SITE_PREFIX,
  site,
  isSiteConfigured,
  localeCookieName,
  logging,
} from "./site";
export { theme, fonts, themeConfig } from "./theme";
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
export { features } from "./features";
export { seoDefaults } from "./seo";
export { pages, isPageVisible } from "./pages";
export { getCurrentEnvironment, getCSPConnectSources } from "./env";

// ── Public types ─────────────────────────────────────────────
export type {
  Locale,
  ThemeName,
  ThemeMode,
  FontKey,
  Environment,
  LogLevel,
} from "./types";
export type { PageConfig, StaticAppPathname } from "./pages";
