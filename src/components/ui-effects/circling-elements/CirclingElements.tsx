"use client";

import { motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface CirclingElementsProps {
  children: React.ReactNode;
  /** Orbit radius in pixels. @default 100 */
  radius?: number;
  /** Full orbit duration in seconds. @default 10 */
  duration?: number;
  /** CSS animation easing. @default "linear" */
  easing?: string;
  /** Orbit direction. @default "normal" */
  direction?: "normal" | "reverse";
  className?: string;
  /** Pause the orbit while hovering anywhere on the container. @default false */
  pauseOnHover?: boolean;
}

export function CirclingElements({
  children,
  radius = 100,
  duration = 10,
  easing = "linear",
  direction = "normal",
  className,
  pauseOnHover = false,
}: Readonly<CirclingElementsProps>) {
  const count = React.Children.count(children);
  return (
    <div className={cn("group/circling relative z-0", className)}>
      {React.Children.map(children, (child, index) => {
        const offset = (index * 360) / count;
        const style = {
          "--circling-offset": offset,
          "--circling-radius": radius,
          "--circling-direction": direction === "reverse" ? -1 : 1,
          animationName: "circling",
          animationDuration: `${duration}s`,
          animationTimingFunction: easing,
          animationIterationCount: "infinite",
        } as React.CSSProperties;
        return (
          <motion.div
            key={index}
            style={style}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 transform-gpu",
              pauseOnHover && "group-hover/circling:![animation-play-state:paused]",
            )}
          >
            {child}
          </motion.div>
        );
      })}
    </div>
  );
}
