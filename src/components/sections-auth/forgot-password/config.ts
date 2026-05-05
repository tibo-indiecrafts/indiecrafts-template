/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const forgotPasswordKey = "forgot-password" as const;

/**
 * Translation namespace — `useTranslations(forgotPasswordNamespace)` resolves keys from `en.json`.
 */
export const forgotPasswordNamespace = "blocks.forgot-password" as const;
