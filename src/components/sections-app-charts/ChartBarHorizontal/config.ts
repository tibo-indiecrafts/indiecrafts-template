/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const chartBarHorizontalKey = "chart-bar-horizontal" as const;

/**
 * Translation namespace — `useTranslations(chartBarHorizontalNamespace)` resolves keys from `en.json`.
 */
export const chartBarHorizontalNamespace = "blocks.chart-bar-horizontal" as const;

/**
 * Chart data rows. Replace per fork with real data.
 */
export const chartBarHorizontalData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

/**
 * Series config — `dataKey` matches a property on each data row, `labelKey`
 * resolves under the namespace, `color` is the CSS var the chart paints with.
 */
export const chartBarHorizontalSeries = [
  { dataKey: "desktop", labelKey: "desktopLabel", color: "var(--chart-1)" },
] as const;
