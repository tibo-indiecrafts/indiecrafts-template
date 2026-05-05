/** Block key — kebab-case folder slug. Used to look up translations under `blocks.<key>.*`. */
export const sidebar06Key = "sidebar-06" as const;

/** Translation namespace — `useScopedT(sidebar06Namespace)` resolves keys from `en.json`. */
export const sidebar06Namespace = "blocks.sidebar-06" as const;

/**
 * Demo avatar URL for the sidebar's footer user block. Asset path, not a
 * translation — replace with the real user's avatar when wiring real data.
 */
export const sidebar06UserAvatarSrc = "/avatar-01.png";

/** Sample export — entry component holds demo content inline. */
export const sidebar06Sample = {} as const;
