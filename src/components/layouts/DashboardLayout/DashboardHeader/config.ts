/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const dashboardHeaderKey = "dashboard-header" as const;

/**
 * Translation namespace — `useTranslations(dashboardHeaderNamespace)` resolves keys from `en.json`.
 */
export const dashboardHeaderNamespace = "blocks.dashboard-header" as const;
