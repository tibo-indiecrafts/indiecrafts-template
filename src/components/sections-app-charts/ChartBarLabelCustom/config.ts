/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const chartBarLabelCustomKey = "chart-bar-label-custom" as const;

/**
 * Translation namespace — `useTranslations(chartBarLabelCustomNamespace)` resolves keys from `en.json`.
 */
export const chartBarLabelCustomNamespace = "blocks.chart-bar-label-custom" as const;

/**
 * Chart data rows. Replace per fork with real data.
 */
export const chartBarLabelCustomData = [
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
 *
 * The trailing `label` entry is a label-only (no `dataKey`) color slot used by
 * the inline `<LabelList>` to recolor text on top of the bars.
 */
export const chartBarLabelCustomSeries = [
  { dataKey: "desktop", labelKey: "desktopLabel", color: "var(--chart-2)" },
  { dataKey: "mobile", labelKey: "mobileLabel", color: "var(--chart-2)" },
] as const;

/**
 * Standalone color slot — referenced from the bar's inside `<LabelList>` via
 * `fill-(--color-label)`. Not a series, just a token surfaced in `chartConfig`.
 */
export const chartBarLabelCustomLabelColor = "var(--background)" as const;
