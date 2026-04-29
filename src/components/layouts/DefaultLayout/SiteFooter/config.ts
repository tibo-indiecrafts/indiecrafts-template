/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const siteFooterKey = "site-footer" as const;

/**
 * Translation namespace for component-local strings (rights line).
 *
 * Note: nav group/link labels still come from the GLOBAL `nav.*` namespace
 * because they are bound to `navigation.config.ts` via
 * `keyof typeof globalEn.nav` and shared with `SiteHeader`. Don't duplicate
 * them here.
 */
export const siteFooterNamespace = "blocks.site-footer" as const;
