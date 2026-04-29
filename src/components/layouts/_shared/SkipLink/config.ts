/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const skipLinkKey = "skip-link" as const;

/**
 * Translation namespace — `useTranslations(skipLinkNamespace)` resolves keys from `en.json`.
 */
export const skipLinkNamespace = "blocks.skip-link" as const;
