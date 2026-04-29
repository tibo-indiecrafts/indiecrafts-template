/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const navFavoritesKey = "nav-favorites" as const;

/**
 * Translation namespace — `useTranslations(navFavoritesNamespace)` resolves keys from `en.json`.
 */
export const navFavoritesNamespace = "blocks.nav-favorites" as const;
