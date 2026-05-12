"use client";

import type { ReactNode } from "react";
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui-primitives/chart";
import { cn } from "@/lib/utils";

export type CapacityRingProps = {
  value: number;

  fill?: string;

  label?: ReactNode;

  size?: number;

  ariaLabel?: string;

  className?: string;
};

const DEFAULT_CONFIG = {
  value: { label: "value" },
} satisfies ChartConfig;

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
