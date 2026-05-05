/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 *
 * Holds FIXED labels of the notifications dropdown (open button, header,
 * empty-state, view-all link). Variable content (per-id notification
 * text/time) flows from the parent's namespace via the `namespace` prop.
 */
export const sidebarNavNotificationsKey = "sidebar-nav-notifications" as const;

/**
 * Translation namespace — `useTranslations(sidebarNavNotificationsNamespace)` resolves keys from `en.json`.
 */
export const sidebarNavNotificationsNamespace =
  "blocks.sidebar-nav-notifications" as const;
