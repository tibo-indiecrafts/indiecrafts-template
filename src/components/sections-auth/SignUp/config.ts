/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const signupPageKey = "signup-page" as const;

/**
 * Translation namespace — `useTranslations(signupPageNamespace)` resolves keys from `en.json`.
 */
export const signupPageNamespace = "blocks.signup-page" as const;
