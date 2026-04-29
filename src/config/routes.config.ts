/**
 * Routes — thin shim re-exporting the PATHNAMES table aggregated from
 * per-page configs in `./pages/` + the hand-maintained route types.
 *
 * Edit slugs in `pages/<name>/page.config.ts`.
 * Edit the pathname type union in `routes.types.ts`.
 */

export { PATHNAMES } from "./pages";
export type { AppPathname, DynamicAppPathname, StaticAppPathname } from "./routes.types";
