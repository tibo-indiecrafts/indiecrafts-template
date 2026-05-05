"use client";

import type { ReactNode } from "react";
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui-primitives/chart";
import { cn } from "@/lib/utils";

export type CapacityRingProps = {
  /** Numeric value 0–100. Caller is responsible for clamping. */
  value: number;
  /** Bar fill color — CSS variable or hex. Defaults to `var(--primary)`. */
  fill?: string;
  /** Center overlay (typically the percentage as text). When omitted, no center text renders. */
  label?: ReactNode;
  /** Square pixel size. Defaults to 80. */
  size?: number;
  /** Optional accessibility label announced for the chart. */
  ariaLabel?: string;
  /** Wrapper class for caller-side layout tweaks. */
  className?: string;
};

const DEFAULT_CONFIG = {
  value: { label: "value" },
} satisfies ChartConfig;

/**
 * Radial-bar capacity gauge with an optional center label. Extracted
 * from sections-stats/stats-{07,08} where the same Recharts setup
 * (innerRadius="60%", outerRadius="100%", barSize=6, full-circle
 * sweep) was duplicated.
 *
 * For pie/donut variants at smaller sizes, see other ui-molecules
 * candidates — this one is specifically the 60–80px ring shape.
 */
export function CapacityRing({
  value,
  fill = "var(--primary)",
  label,
  size = 80,
  ariaLabel,
  className,
}: Readonly<CapacityRingProps>) {
  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ height: size, width: size }}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
    >
      <ChartContainer config={DEFAULT_CONFIG} className="aspect-square h-full w-full">
        <RadialBarChart
          data={[{ value }]}
          innerRadius="60%"
          outerRadius="100%"
          barSize={6}
          startAngle={90}
          endAngle={-270}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
            axisLine={false}
          />
          <RadialBar
            dataKey="value"
            background
            cornerRadius={10}
            fill={fill}
            angleAxisId={0}
          />
        </RadialBarChart>
      </ChartContainer>
      {label !== undefined ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="text-foreground text-base font-medium">{label}</span>
        </div>
      ) : null}
    </div>
  );
}
