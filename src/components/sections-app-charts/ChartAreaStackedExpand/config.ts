/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const chartAreaStackedExpandKey = "chart-area-stacked-expand" as const;

/**
 * Translation namespace — `useTranslations(chartAreaStackedExpandNamespace)` resolves keys from `en.json`.
 */
export const chartAreaStackedExpandNamespace =
  "blocks.chart-area-stacked-expand" as const;

/**
 * Chart data rows. Replace per fork with real data.
 */
export const chartAreaStackedExpandData = [
  { month: "January", desktop: 186, mobile: 80, other: 45 },
  { month: "February", desktop: 305, mobile: 200, other: 100 },
  { month: "March", desktop: 237, mobile: 120, other: 150 },
  { month: "April", desktop: 73, mobile: 190, other: 50 },
  { month: "May", desktop: 209, mobile: 130, other: 100 },
  { month: "June", desktop: 214, mobile: 140, other: 160 },
];

/**
 * Series config — `dataKey` matches a property on each data row, `labelKey`
 * resolves under the namespace, `color` is the CSS var the chart paints with.
 */
export const chartAreaStackedExpandSeries = [
  { dataKey: "desktop", labelKey: "desktopLabel", color: "var(--chart-1)" },
  { dataKey: "mobile", labelKey: "mobileLabel", color: "var(--chart-2)" },
  { dataKey: "other", labelKey: "otherLabel", color: "var(--chart-3)" },
] as const;
