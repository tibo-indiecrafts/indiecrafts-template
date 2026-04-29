/**
 * Block key — kebab-case folder name. Matches the `LayoutName` registry key.
 *
 * DefaultLayout is a passthrough — no user-facing strings, no `en.json`.
 * The key/namespace are exported so the folder layout matches the rest of
 * the blocks; reserved in case a future label is added.
 */
export const defaultLayoutKey = "default" as const;

export const defaultLayoutNamespace = "blocks.default-layout" as const;
