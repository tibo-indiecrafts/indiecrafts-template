/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const dashboardNavDocumentsKey = "dashboard-nav-documents" as const;

/**
 * Translation namespace — `useTranslations(dashboardNavDocumentsNamespace)` resolves keys from `en.json`.
 */
export const dashboardNavDocumentsNamespace = "blocks.dashboard-nav-documents" as const;
