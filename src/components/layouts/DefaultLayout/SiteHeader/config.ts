/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const siteHeaderKey = "site-header" as const;

/**
 * Translation namespace for component-local strings (aria-labels, button hints).
 *
 * Note: nav link labels still come from the GLOBAL `nav.*` namespace because
 * they are shared with `SiteFooter` and bound to `navigation.config.ts` via
 * `keyof typeof globalEn.nav`. Don't duplicate them here.
 */
export const siteHeaderNamespace = "blocks.site-header" as const;
