/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 *
 * NavSecondary has no component-local strings: titles come from the items
 * passed by the caller. The key/namespace is exported here only so the
 * folder layout matches the rest of the nav blocks; there is intentionally
 * no `en.json`.
 */
export const navSecondaryKey = "nav-secondary" as const;

/**
 * Translation namespace placeholder. NavSecondary doesn't call
 * `useTranslations` — every visible string is a prop. Reserved in case a
 * future label is added.
 */
export const navSecondaryNamespace = "blocks.nav-secondary" as const;
