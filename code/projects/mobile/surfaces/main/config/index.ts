/**
 * `@/config` — this mobile app's config home. Re-exports the PORTABLE config
 * core from `@indiecrafts/config/mobile` (i18n · format · types — React-free, no
 * web/DOM coupling). Add mobile-owned **instance** config here — screens, deep
 * links, native env — as the app grows.
 *
 * Rule: mobile app code imports from `@/config`; it never pulls the web slice
 * (`@indiecrafts/config` root barrel). See `code/docs/shared/architecture/multi-app.md`.
 */
export * from "@indiecrafts/config/mobile";
