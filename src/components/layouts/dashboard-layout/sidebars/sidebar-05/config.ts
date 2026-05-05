/** Block key — kebab-case folder slug. Used to look up translations under `blocks.<key>.*`. */
export const sidebar05Key = "sidebar-05" as const;

/** Translation namespace — `useScopedT(sidebar05Namespace)` resolves keys from `en.json`. */
export const sidebar05Namespace = "blocks.sidebar-05" as const;

/**
 * Demo avatar URL for the sidebar's footer user block. Asset path, not a
 * translation — replace with the real user's avatar when wiring real data.
 */
export const sidebar05UserAvatarSrc = "/avatar-01.png";

/** Sample export — entry component holds demo content inline. */
export const sidebar05Sample = {} as const;
