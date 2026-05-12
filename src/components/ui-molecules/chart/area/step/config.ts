import { Activity, type LucideIcon } from "lucide-react";

export const chartAreaStepKey = "chart-area-step" as const;

export const chartAreaStepNamespace = "blocks.chart-area-step" as const;

export const chartAreaStepData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

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
