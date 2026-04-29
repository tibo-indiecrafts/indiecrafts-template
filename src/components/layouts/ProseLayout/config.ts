/**
 * Block key — kebab-case folder name. Matches the `LayoutName` registry key.
 *
 * ProseLayout has no user-facing strings of its own — typography styling is
 * applied via Tailwind's `prose` plugin and the children supply the copy.
 * The key/namespace are exported so the folder layout matches the rest of
 * the blocks; reserved in case a future label is added.
 */
export const proseLayoutKey = "prose" as const;

export const proseLayoutNamespace = "blocks.prose-layout" as const;
