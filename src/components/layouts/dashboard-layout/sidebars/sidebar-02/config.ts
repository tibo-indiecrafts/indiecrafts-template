/** Block key — kebab-case folder slug. Used to look up translations under `blocks.<key>.*`. */
export const sidebar02Key = "sidebar-02" as const;

/** Translation namespace — `useScopedT(sidebar02Namespace)` resolves keys from `en.json`. */
export const sidebar02Namespace = "blocks.sidebar-02" as const;

/**
 * Demo avatar data for the notification trail in the sidebar header. Avatar
 * URLs are config-only (assets, not translations); fallback initials are
 * locale-agnostic so they live here too.
 */
export const sidebar02Notifications = [
  { id: "1", avatar: "/avatars/01.png", fallback: "OM" },
  { id: "2", avatar: "/avatars/02.png", fallback: "JL" },
  { id: "3", avatar: "/avatars/03.png", fallback: "HH" },
];

/** Sample export — entry component holds demo content inline. */
export const sidebar02Sample = {} as const;
