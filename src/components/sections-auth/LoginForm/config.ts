/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const loginFormKey = "login-form" as const;

/**
 * Translation namespace — `useTranslations(loginFormNamespace)` resolves keys from `en.json`.
 */
export const loginFormNamespace = "blocks.login-form" as const;
