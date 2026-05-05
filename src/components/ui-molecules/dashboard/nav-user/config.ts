/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const dashboardNavUserKey = "dashboard-nav-user" as const;

/**
 * Translation namespace — `useTranslations(dashboardNavUserNamespace)` resolves keys from `en.json`.
 */
export const dashboardNavUserNamespace = "blocks.dashboard-nav-user" as const;
