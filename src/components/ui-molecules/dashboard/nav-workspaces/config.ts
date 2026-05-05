/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const dashboardNavWorkspacesKey = "dashboard-nav-workspaces" as const;

/**
 * Translation namespace — `useTranslations(dashboardNavWorkspacesNamespace)` resolves keys from `en.json`.
 */
export const dashboardNavWorkspacesNamespace = "blocks.dashboard-nav-workspaces" as const;
