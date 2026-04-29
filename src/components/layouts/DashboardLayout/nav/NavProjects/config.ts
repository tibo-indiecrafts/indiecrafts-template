/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const navProjectsKey = "nav-projects" as const;

/**
 * Translation namespace — `useTranslations(navProjectsNamespace)` resolves keys from `en.json`.
 */
export const navProjectsNamespace = "blocks.nav-projects" as const;
