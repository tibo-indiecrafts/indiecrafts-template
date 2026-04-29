/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const navMainKey = "nav-main" as const;

/**
 * Translation namespace — `useTranslations(navMainNamespace)` resolves keys from `en.json`.
 */
export const navMainNamespace = "blocks.nav-main" as const;
