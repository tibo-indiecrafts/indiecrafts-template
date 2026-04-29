/**
 * Block key — kebab-case folder name. Matches the `LayoutName` registry key.
 *
 * DashboardLayout composes `AppSidebar` + `DashboardHeader`; all visible
 * strings live under those blocks' own namespaces. The key/namespace are
 * exported so the folder layout matches the rest of the blocks; reserved
 * in case a future label is added.
 */
export const dashboardLayoutKey = "dashboard" as const;

export const dashboardLayoutNamespace = "blocks.dashboard-layout" as const;
