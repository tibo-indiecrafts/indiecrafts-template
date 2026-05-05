/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const dashboardNavFavoritesKey = "dashboard-nav-favorites" as const;

/**
 * Translation namespace — `useTranslations(dashboardNavFavoritesNamespace)` resolves keys from `en.json`.
 */
export const dashboardNavFavoritesNamespace = "blocks.dashboard-nav-favorites" as const;
