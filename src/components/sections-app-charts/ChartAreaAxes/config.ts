/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const chartAreaAxesKey = "chart-area-axes" as const;

/**
 * Translation namespace — `useTranslations(chartAreaAxesNamespace)` resolves keys from `en.json`.
 */
export const chartAreaAxesNamespace = "blocks.chart-area-axes" as const;

/**
 * Chart data rows. Replace per fork with real data.
 */
export const chartAreaAxesData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

/**
 * Series config — `dataKey` matches a property on each data row, `labelKey`
 * resolves under the namespace, `color` is the CSS var the chart paints with.
 */
export const chartAreaAxesSeries = [
  { dataKey: "desktop", labelKey: "desktopLabel", color: "var(--chart-1)" },
  { dataKey: "mobile", labelKey: "mobileLabel", color: "var(--chart-2)" },
] as const;
