/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const sidebarTriggerKey = "sidebar-trigger" as const;

/**
 * Translation namespace — `useTranslations(sidebarTriggerNamespace)` resolves keys from `en.json`.
 */
export const sidebarTriggerNamespace = "blocks.sidebar-trigger" as const;
