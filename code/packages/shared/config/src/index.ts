/**
 * `@indiecrafts/packages-shared-config` — the single import surface for site technical config.
 * Almost entirely DATA an operator edits.
 *
 * Two scopes, split by portability:
 * - `./shared` — PLATFORM-AGNOSTIC core (i18n · format · types). Pure TS, no
 *   web coupling — import from web, mobile (Expo/RN), or hybrid (Electron).
 * - `./web` — WEB-only primitives (site origin/prefix · env/CSP · seo · the
 *   generic page-config contract `pages`). Next-flavored.
 *
 * This root barrel = `shared` + `web` (the web surface), so the web apps keep
 * one import (`@indiecrafts/packages-shared-config`). Mobile/hybrid import `@indiecrafts/packages-shared-config/mobile`
 * (or `/shared`) to avoid pulling the web slice.
 *
 * NOT here — **app-owned instance config** lives in each surface at
 * `<surface>/src/config` so a second app ships its own, read via `@/config`
 * (which re-exports these primitives): design (`theme` · `fonts`), feature flags
 * (`features`), and the route map (`pages` + `StaticAppPathname`). NOT here —
 * edited in Sanity: brand + SEO copy (`siteSettings` / `siteMeta`), navigation,
 * analytics id, llms resources. Only `site.url` / `site.prefix` read env.
 */
export * from "./shared";
export * from "./web";
