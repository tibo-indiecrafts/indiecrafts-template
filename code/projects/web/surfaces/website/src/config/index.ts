/**
 * `@/config` — **this app's** config home. One import surface for everything the
 * app reads as config: the shared platform primitives (i18n · format · env · CSP ·
 * logging · site env · page-config contract) re-exported from `@indiecrafts/packages-shared-config`,
 * plus this app's own **instance** config that lives here, not in the shared package
 * (so a second app ships its own): design (`theme` · `fonts`), feature flags
 * (`features`), and the route map (`pages`).
 *
 * Rule: **app code imports from `@/config`**; packages + modules import the shared
 * primitives from `@indiecrafts/packages-shared-config` directly (they can't reach into an app).
 * See `code/docs/shared/architecture/multi-app.md`.
 */

// Shared platform primitives (i18n, format, env, site env, logging, types,
// and the generic PageConfig/isPageVisible contract).
export * from "@indiecrafts/packages-shared-config";

// App-owned instance config.
export { surface } from "./surface";
export { theme, themeConfig } from "./theme";
export { fonts } from "./fonts";
export { features } from "./features";
export { security } from "./security";
export { consent } from "./consent";
export { pages } from "./pages";
export type { StaticAppPathname, AppRoute } from "./pages";
