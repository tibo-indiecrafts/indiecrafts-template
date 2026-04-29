/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const navDocumentsKey = "nav-documents" as const;

/**
 * Translation namespace — `useTranslations(navDocumentsNamespace)` resolves keys from `en.json`.
 */
export const navDocumentsNamespace = "blocks.nav-documents" as const;
