import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";

export const chartAreaIconsKey = "chart-area-icons" as const;

export const chartAreaIconsNamespace = "blocks.chart-area-icons" as const;

export const chartAreaIconsData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

export const chartAreaIconsSeries: ReadonlyArray<{
  dataKey: string;
  labelKey: string;
  color: string;
  icon: LucideIcon;
}> = [
  {
    dataKey: "desktop",
    labelKey: "desktopLabel",
    color: "var(--chart-1)",
    icon: TrendingDown,
  },
  {
    dataKey: "mobile",
    labelKey: "mobileLabel",
    color: "var(--chart-2)",
    icon: TrendingUp,
  },
] as const;
