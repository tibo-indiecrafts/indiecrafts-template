/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const signupFormKey = "signup-form" as const;

/**
 * Translation namespace — `useTranslations(signupFormNamespace)` resolves keys from `en.json`.
 */
export const signupFormNamespace = "blocks.signup-form" as const;
