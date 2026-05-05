"use client";
import { Area, AreaChart } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui-primitives/chart";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--color-primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--color-indigo-300)",
  },
} satisfies ChartConfig;

const chartData = [
  { month: "May", desktop: 56, mobile: 224 },
  { month: "June", desktop: 56, mobile: 224 },
  { month: "January", desktop: 126, mobile: 252 },
  { month: "February", desktop: 205, mobile: 410 },
  { month: "March", desktop: 200, mobile: 126 },
  { month: "April", desktop: 400, mobile: 800 },
];

/**
 * Mini stacked area chart illustration — desktop vs mobile traffic
 * over six months, in primary + indigo-300, sized for small bento
 * cells (`h-28`, no overflow margin, no axis labels). Pure
 * decoration; no translations. Sourced from `@tailark-pro/bento-9`
 * and `bento-10` (upstream's smallest chart variant; differs from
 * `chart-medium-illustration` (h-36, with XAxis) and
 * `chart-compact-illustration` (h-28 with -mb-4, orange + violet,
 * with XAxis)).
 */
export const ChartMiniIllustration = () => {
  return (
    <ChartContainer className="aspect-auto h-28" config={chartConfig}>
      <AreaChart accessibilityLayer data={chartData} margin={{ left: 0, right: 0 }}>
        <defs>
          <linearGradient id="fillDesktopMini" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-desktop)" stopOpacity={0.8} />
            <stop offset="55%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="fillMobileMini" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
            <stop offset="55%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <ChartTooltip
          active
          content={<ChartTooltipContent className="dark:bg-muted" />}
        />
        <Area
          strokeWidth={1}
          dataKey="mobile"
          type="natural"
          fill="url(#fillMobileMini)"
          fillOpacity={0.1}
          stroke="var(--color-mobile)"
          stackId="a"
        />
        <Area
          strokeWidth={1}
          dataKey="desktop"
          type="natural"
          fill="url(#fillDesktopMini)"
          fillOpacity={0.1}
          stroke="var(--color-desktop)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
};
