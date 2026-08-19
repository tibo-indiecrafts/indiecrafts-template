/**
 * Config home for this hybrid (Electron) app. Re-exports the PORTABLE config
 * core from `@indiecrafts/config/hybrid` (i18n · format · types — React-free, no
 * web/DOM coupling), usable from the main process AND the renderer. Add
 * hybrid-owned **instance** config here — window, updater channel, native env —
 * as the app grows.
 */
export * from "@indiecrafts/config/hybrid";
