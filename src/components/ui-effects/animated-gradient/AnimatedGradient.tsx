"use client";

import * as React from "react";

import { useDimensions } from "@/components/_hooks/use-dimensions";
import { cn } from "@/lib/utils";

export type AnimatedGradientBlur = "light" | "medium" | "heavy";

export interface AnimatedGradientProps {
  colors: string[];
  speed?: number;
  blur?: AnimatedGradientBlur;
  className?: string;
}

const BLUR_CLASS: Record<AnimatedGradientBlur, string> = {
  light: "blur-2xl",
  medium: "blur-3xl",
  heavy: "blur-[80px]",
};

// Random ±1 seed; useState lazy-init keeps the impurity out of the render path.
function useDriftSeeds(count: number) {
  return React.useState(() =>
    Array.from({ length: count }, () => ({
      cx: Math.random() * 100,
      cy: Math.random() * 100,
      tx1: Math.random() - 0.5,
      ty1: Math.random() - 0.5,
      tx2: Math.random() - 0.5,
      ty2: Math.random() - 0.5,
      tx3: Math.random() - 0.5,
      ty3: Math.random() - 0.5,
      tx4: Math.random() - 0.5,
      ty4: Math.random() - 0.5,
    })),
  )[0];
}

export function AnimatedGradient({
  colors,
  speed = 5,
  blur = "light",
  className,
}: Readonly<AnimatedGradientProps>) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const dimensions = useDimensions(containerRef);
  const seeds = useDriftSeeds(colors.length);

  const radius = Math.max(dimensions.width, dimensions.height) * 0.5;

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0 overflow-hidden", BLUR_CLASS[blur], className)}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
        focusable="false"
      >
        {colors.map((color, i) => {
          const seed = seeds[i];
          const style = {
            "--tx-1": seed.tx1,
            "--ty-1": seed.ty1,
            "--tx-2": seed.tx2,
            "--ty-2": seed.ty2,
            "--tx-3": seed.tx3,
            "--ty-3": seed.ty3,
            "--tx-4": seed.tx4,
            "--ty-4": seed.ty4,
            "--animated-gradient-duration": `${speed}s`,
            "--animated-gradient-delay": `${i * 0.5}s`,
          } as React.CSSProperties;
          return (
            <circle
              key={i}
              className="animated-gradient-circle"
              cx={`${seed.cx}%`}
              cy={`${seed.cy}%`}
              r={radius || 200}
              fill={color}
              style={style}
            />
          );
        })}
      </svg>
    </div>
  );
}
