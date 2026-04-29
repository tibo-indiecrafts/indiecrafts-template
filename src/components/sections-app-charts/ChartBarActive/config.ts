/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const chartBarActiveKey = "chart-bar-active" as const;

/**
 * Translation namespace — `useTranslations(chartBarActiveNamespace)` resolves keys from `en.json`.
 */
export const chartBarActiveNamespace = "blocks.chart-bar-active" as const;

/**
 * Chart data rows. Each row carries its own `fill` reference (resolved via the
 * matching series entry below) — that's what makes this chart "per-row colored"
 * rather than per-series. Replace per fork with real data.
 */
export const chartBarActiveData = [
  { browser: "chrome", visitors: 187, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 275, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];

/**
 * Series config — first entry is the aggregate label used in the tooltip
 * header (no `color`). Following entries map a single browser / category to
 * its own color; rows in `chartBarActiveData` reference these via `fill`.
 */
export const chartBarActiveSeries = [
  { dataKey: "visitors", labelKey: "visitorsLabel" },
  { dataKey: "chrome", labelKey: "chromeLabel", color: "var(--chart-1)" },
  { dataKey: "safari", labelKey: "safariLabel", color: "var(--chart-2)" },
  { dataKey: "firefox", labelKey: "firefoxLabel", color: "var(--chart-3)" },
  { dataKey: "edge", labelKey: "edgeLabel", color: "var(--chart-4)" },
  { dataKey: "other", labelKey: "otherLabel", color: "var(--chart-5)" },
] as const;

/**
 * Index of the row that renders with the dashed-border active treatment.
 */
export const chartBarActiveIndex = 2 as const;
