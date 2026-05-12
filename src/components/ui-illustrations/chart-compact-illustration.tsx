"use client";
import { Area, AreaChart, XAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui-primitives/chart";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "orange",
  },
  mobile: {
    label: "Mobile",
    color: "violet",
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
 * Compact stacked area chart illustration — desktop vs mobile traffic
 * over six months, in orange + violet, sized for bento cells
 * (`h-28` with `-mb-4` overflow). Pure decoration; no translations.
 * Sourced from `@tailark-pro/bento-06` (upstream's bento-specific
 * chart variant; differs from our default `chart-illustration` which
 * uses emerald + indigo at `h-72` for hero use cases).
 */
export const ChartCompactIllustration = () => {
  return (
    <ChartContainer className="-mb-4 aspect-auto h-28" config={chartConfig}>
      <AreaChart accessibilityLayer data={chartData} margin={{ left: 0, right: 0 }}>
        <defs>
          <linearGradient id="fillDesktopCompact" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-desktop)" stopOpacity={0.8} />
            <stop offset="55%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="fillMobileCompact" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
            <stop offset="55%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <ChartTooltip
          active
          content={<ChartTooltipContent className="dark:bg-muted" />}
        />
        <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
        <Area
          strokeWidth={1}
          dataKey="mobile"
          type="natural"
          fill="url(#fillMobileCompact)"
          fillOpacity={0.1}
          stroke="var(--color-mobile)"
          stackId="a"
        />
        <Area
          strokeWidth={1}
          dataKey="desktop"
          type="natural"
          fill="url(#fillDesktopCompact)"
          fillOpacity={0.1}
          stroke="var(--color-desktop)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
};
