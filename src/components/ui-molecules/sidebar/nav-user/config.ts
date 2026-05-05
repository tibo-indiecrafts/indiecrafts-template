/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 *
 * Holds FIXED labels of the user dropdown (avatar fallback, menu items).
 * The user object (name/email/avatar) is passed by the caller as data.
 */
export const sidebarNavUserKey = "sidebar-nav-user" as const;

/**
 * Translation namespace — `useTranslations(sidebarNavUserNamespace)` resolves keys from `en.json`.
 */
export const sidebarNavUserNamespace = "blocks.sidebar-nav-user" as const;
