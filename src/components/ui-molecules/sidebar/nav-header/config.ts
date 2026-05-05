/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 *
 * Holds FIXED labels of the search command palette (trigger label,
 * placeholder, empty-state, group headings). Variable content
 * (per-id navigation entries) flows from the parent's namespace.
 */
export const sidebarNavHeaderKey = "sidebar-nav-header" as const;

/**
 * Translation namespace — `useTranslations(sidebarNavHeaderNamespace)` resolves keys from `en.json`.
 */
export const sidebarNavHeaderNamespace = "blocks.sidebar-nav-header" as const;
