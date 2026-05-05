/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 *
 * Holds FIXED labels of the molecule (group headings) — variable content
 * (favorites/teams/topics labels) is read from the parent's namespace via
 * the imported `sidebar01Namespace`.
 */
export const sidebarNavCollapseKey = "sidebar-nav-collapse" as const;

/**
 * Translation namespace — `useTranslations(sidebarNavCollapseNamespace)` resolves keys from `en.json`.
 */
export const sidebarNavCollapseNamespace = "blocks.sidebar-nav-collapse" as const;
