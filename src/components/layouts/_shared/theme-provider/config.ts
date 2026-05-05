/**
 * Block key — kebab-case folder name.
 *
 * ThemeProvider has no user-facing strings (it's a context provider only).
 * The key/namespace are exported here only so the folder layout matches the
 * other blocks; there is intentionally no `en.json`.
 */
export const themeProviderKey = "theme-provider" as const;

/**
 * Translation namespace placeholder. ThemeProvider doesn't call
 * `useTranslations` — reserved in case a future label is added.
 */
export const themeProviderNamespace = "blocks.theme-provider" as const;
