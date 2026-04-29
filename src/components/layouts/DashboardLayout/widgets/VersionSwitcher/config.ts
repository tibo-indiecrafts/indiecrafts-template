/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const versionSwitcherKey = "version-switcher" as const;

/**
 * Translation namespace — `useTranslations(versionSwitcherNamespace)` resolves keys from `en.json`.
 */
export const versionSwitcherNamespace = "blocks.version-switcher" as const;
