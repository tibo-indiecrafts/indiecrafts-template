/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const commandPaletteKey = "command-palette" as const;

/**
 * Translation namespace — `useTranslations(commandPaletteNamespace)` resolves keys from `en.json`.
 */
export const commandPaletteNamespace = "blocks.command-palette" as const;
