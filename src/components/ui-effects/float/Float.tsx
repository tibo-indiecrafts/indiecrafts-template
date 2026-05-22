"use client";

import { motion, useAnimationFrame, useMotionValue } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface FloatProps {
  children: React.ReactNode;
  /** Time-scaling factor. Higher = faster bob. @default 0.5 */
  speed?: number;
  /** [x, y, z] amplitudes in pixels. @default [10, 30, 30] */
  amplitude?: [number, number, number];
  /** [x, y, z] rotation ranges in degrees. @default [15, 15, 7.5] */
  rotationRange?: [number, number, number];
  /** Phase offset so co-mounted instances don't pulse in lockstep. @default 0 */
  timeOffset?: number;
  className?: string;
}

export function Float({
  children,
  speed = 0.5,
  amplitude = [10, 30, 30],
  rotationRange = [15, 15, 7.5],
  timeOffset = 0,
  className,
}: Readonly<FloatProps>) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const z = useMotionValue(0);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const rotateZ = useMotionValue(0);

  const time = React.useRef(0);

  useAnimationFrame(() => {
    time.current += speed * 0.02;
    const t = time.current + timeOffset;
    x.set(Math.sin(t * 0.7) * amplitude[0]);
    y.set(Math.sin(t * 0.6) * amplitude[1]);
    z.set(Math.sin(t * 0.5) * amplitude[2]);
    rotateX.set(Math.sin(t * 0.5) * rotationRange[0]);
    rotateY.set(Math.sin(t * 0.4) * rotationRange[1]);
    rotateZ.set(Math.sin(t * 0.3) * rotationRange[2]);
  });

  return (
    <motion.div
      style={{
        x,
        y,
        z,
        rotateX,
        rotateY,
        rotateZ,
        transformStyle: "preserve-3d",
      }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}
