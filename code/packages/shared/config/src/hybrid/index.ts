/**
 * `@indiecrafts/config/hybrid` — hybrid (Electron) config entry.
 *
 * Reserved: re-exports the shared portable core for now. Add hybrid-specific
 * primitives (window/app config, native env, updater channel…) HERE as the app
 * grows — import sites won't change.
 */
export * from "../shared";
