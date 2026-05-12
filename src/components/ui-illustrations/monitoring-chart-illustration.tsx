"use client";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui-primitives/chart";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--color-indigo-400)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--color-emerald-400)",
  },
} satisfies ChartConfig;

const chartData = [
  { month: "January", desktop: 56, mobile: 224 },
  { month: "February", desktop: 56, mobile: 224 },
  { month: "March", desktop: 126, mobile: 252 },
  { month: "April", desktop: 205, mobile: 410 },
  { month: "May", desktop: 200, mobile: 126 },
  { month: "June", desktop: 400, mobile: 800 },
];

export const MonitoringChartIllustration = () => {
  return (
    <ChartContainer className="-mb-8 aspect-auto h-60" config={chartConfig}>
      <AreaChart accessibilityLayer data={chartData} margin={{ left: 0, right: 0 }}>
        <defs>
          <linearGradient id="fillDesktopMonitor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="15%" stopColor="var(--color-desktop)" stopOpacity={0.8} />
            <stop offset="55%" stopColor="var(--color-desktop)" stopOpacity={0.3} />
          </linearGradient>
          <linearGradient id="fillMobileMonitor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
            <stop offset="55%" stopColor="var(--color-mobile)" stopOpacity={0.3} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <ChartTooltip
          active
          cursor={false}
          content={<ChartTooltipContent className="dark:bg-muted" />}
        />
        <XAxis dataKey="month" tickLine={false} tickMargin={10} stroke="transparent" />
        <Area
          strokeWidth={1}
          dataKey="mobile"
          type="monotone"
          fill="url(#fillMobileMonitor)"
          fillOpacity={0.1}
          stroke="var(--color-mobile)"
          stackId="a"
        />
        <Area
          strokeWidth={1}
          dataKey="desktop"
          type="monotone"
          fill="url(#fillDesktopMonitor)"
          fillOpacity={0.1}
          stroke="var(--color-desktop)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
};
