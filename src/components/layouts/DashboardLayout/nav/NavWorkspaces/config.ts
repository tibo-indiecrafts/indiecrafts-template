/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const navWorkspacesKey = "nav-workspaces" as const;

/**
 * Translation namespace — `useTranslations(navWorkspacesNamespace)` resolves keys from `en.json`.
 */
export const navWorkspacesNamespace = "blocks.nav-workspaces" as const;
