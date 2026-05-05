import { Activity, type LucideIcon } from "lucide-react";

/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const chartAreaStepKey = "chart-area-step" as const;

/**
 * Translation namespace — `useTranslations(chartAreaStepNamespace)` resolves keys from `en.json`.
 */
export const chartAreaStepNamespace = "blocks.chart-area-step" as const;

/**
 * Chart data rows. Replace per fork with real data.
 */
export const chartAreaStepData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

/**
 * Series config — `dataKey` matches a property on each data row, `labelKey`
 * resolves under the namespace, `color` is the CSS var the chart paints with,
 * and `icon` is a `lucide-react` component rendered alongside the legend entry.
 */
export const chartAreaStepSeries: ReadonlyArray<{
  dataKey: string;
  labelKey: string;
  color: string;
  icon?: LucideIcon;
}> = [
  {
    dataKey: "desktop",
    labelKey: "desktopLabel",
    color: "var(--chart-1)",
    icon: Activity,
  },
] as const;
