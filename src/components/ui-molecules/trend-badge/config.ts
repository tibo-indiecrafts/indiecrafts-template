/** Block key — kebab-case folder slug. Used to look up translations under `blocks.<key>.*`. */
export const trendBadgeKey = "trend-badge" as const;

/** Translation namespace — `useScopedT(trendBadgeNamespace)` resolves keys from `en.json`. */
export const trendBadgeNamespace = "blocks.trend-badge" as const;
