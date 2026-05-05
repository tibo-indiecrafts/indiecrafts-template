/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const sidebarNavFooterKey = "sidebar-nav-footer" as const;

/**
 * Translation namespace — `useTranslations(sidebarNavFooterNamespace)` resolves keys from `en.json`.
 */
export const sidebarNavFooterNamespace = "blocks.sidebar-nav-footer" as const;
