/**
 * Block key — kebab-case folder name. Matches the `LayoutName` registry key.
 *
 * FullBleedLayout is a thin wrapper — no user-facing strings, no `en.json`.
 * The key/namespace are exported so the folder layout matches the rest of
 * the blocks; reserved in case a future label is added.
 */
export const fullBleedLayoutKey = "full-bleed" as const;

export const fullBleedLayoutNamespace = "blocks.full-bleed-layout" as const;
