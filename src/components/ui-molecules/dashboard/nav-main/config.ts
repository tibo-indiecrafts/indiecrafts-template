/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const dashboardNavMainKey = "dashboard-nav-main" as const;

/**
 * Translation namespace — `useTranslations(dashboardNavMainNamespace)` resolves keys from `en.json`.
 */
export const dashboardNavMainNamespace = "blocks.dashboard-nav-main" as const;
