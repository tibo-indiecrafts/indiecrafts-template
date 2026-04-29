/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const navUserKey = "nav-user" as const;

/**
 * Translation namespace — `useTranslations(navUserNamespace)` resolves keys from `en.json`.
 */
export const navUserNamespace = "blocks.nav-user" as const;
