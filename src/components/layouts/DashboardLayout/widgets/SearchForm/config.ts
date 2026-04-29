/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const searchFormKey = "search-form" as const;

/**
 * Translation namespace — `useTranslations(searchFormNamespace)` resolves keys from `en.json`.
 */
export const searchFormNamespace = "blocks.search-form" as const;
