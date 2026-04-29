/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const themeToggleKey = "theme-toggle" as const;

/**
 * Translation namespace — `useTranslations(themeToggleNamespace)` resolves keys from `en.json`.
 */
export const themeToggleNamespace = "blocks.theme-toggle" as const;
