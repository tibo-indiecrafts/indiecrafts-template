/**
 * Block key — kebab-case folder name. Matches the `LayoutName` registry key.
 */
export const sidebarLayoutKey = "sidebar" as const;

/**
 * Translation namespace — `useTranslations(sidebarLayoutNamespace)` resolves keys from `en.json`.
 */
export const sidebarLayoutNamespace = "blocks.sidebar-layout" as const;
