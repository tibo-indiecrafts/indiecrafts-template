/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const heroVideoDialogKey = "hero-video-dialog" as const;

/**
 * Translation namespace — `useTranslations(heroVideoDialogNamespace)` resolves keys from `en.json`.
 */
export const heroVideoDialogNamespace = "blocks.hero-video-dialog" as const;
