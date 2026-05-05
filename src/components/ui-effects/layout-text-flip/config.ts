/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const layoutTextFlipKey = "layout-text-flip" as const;

/**
 * Translation namespace — `useTranslations(layoutTextFlipNamespace)` resolves keys from `en.json`.
 */
export const layoutTextFlipNamespace = "blocks.layout-text-flip" as const;

/**
 * Non-translatable structural settings. `text` and `words` come from the
 * translation namespace (`text` and `words.0..N`); only the timing setting
 * lives in config.
 */
export const layoutTextFlipDefaults = {
  /** Milliseconds between word flips. */
  duration: 3000,
  /** Number of words rotated through (must match `words.*` keys in en.json). */
  wordsCount: 4,
} as const;
