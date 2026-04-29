/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const localeSwitcherKey = "locale-switcher" as const;

/**
 * Translation namespace — `useTranslations(localeSwitcherNamespace)` resolves keys from `en.json`.
 */
export const localeSwitcherNamespace = "blocks.locale-switcher" as const;
