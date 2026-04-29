/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const sidebarOptInFormKey = "sidebar-opt-in-form" as const;

/**
 * Translation namespace — `useTranslations(sidebarOptInFormNamespace)` resolves keys from `en.json`.
 */
export const sidebarOptInFormNamespace = "blocks.sidebar-opt-in-form" as const;
