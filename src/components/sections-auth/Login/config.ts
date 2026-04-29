/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const loginPageKey = "login-page" as const;

/**
 * Translation namespace — `useTranslations(loginPageNamespace)` resolves keys from `en.json`.
 */
export const loginPageNamespace = "blocks.login-page" as const;
