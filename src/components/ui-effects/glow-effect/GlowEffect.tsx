"use client";

import { motion, type Transition } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

export type GlowEffectMode =
  | "rotate"
  | "pulse"
  | "breathe"
  | "colorShift"
  | "flowHorizontal"
  | "static";

export type GlowEffectBlur =
  | number
  | "softest"
  | "soft"
  | "medium"
  | "strong"
  | "stronger"
  | "strongest"
  | "none";

export type GlowEffectProps = {
  className?: string;
  style?: React.CSSProperties;
  colors?: string[];
  mode?: GlowEffectMode;
  blur?: GlowEffectBlur;
  transition?: Transition;
  scale?: number;
  duration?: number;
};

const DEFAULT_COLORS = ["#FF5733", "#33FF57", "#3357FF", "#F1C40F"];

const BLUR_PRESETS: Record<Exclude<GlowEffectBlur, number>, string> = {
  softest: "blur-xs",
  soft: "blur-sm",
  medium: "blur-md",
  strong: "blur-lg",
  stronger: "blur-xl",
  strongest: "blur-2xl",
  none: "blur-none",
};

function getBlurClass(blur: GlowEffectBlur) {
  return typeof blur === "number" ? `blur-[${blur}px]` : BLUR_PRESETS[blur];
}

export function GlowEffect({
  className,
  style,
  colors = DEFAULT_COLORS,
  mode = "rotate",
  blur = "medium",
  transition,
  scale = 1,
  duration = 5,
}: Readonly<GlowEffectProps>) {
  const baseTransition: Transition = {
    repeat: Infinity,
    duration,
    ease: "linear",
  };

  const animations = {
    rotate: {
      background: [
        `conic-gradient(from 0deg at 50% 50%, ${colors.join(", ")})`,
        `conic-gradient(from 360deg at 50% 50%, ${colors.join(", ")})`,
      ],
      transition: transition ?? baseTransition,
    },
    pulse: {
      background: colors.map(
        (color) => `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 100%)`,
      ),
      scale: [1 * scale, 1.1 * scale, 1 * scale],
      opacity: [0.5, 0.8, 0.5],
      transition: transition ?? { ...baseTransition, repeatType: "mirror" as const },
    },
    breathe: {
      background: colors.map(
        (color) => `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 100%)`,
      ),
      scale: [1 * scale, 1.05 * scale, 1 * scale],
      transition: transition ?? { ...baseTransition, repeatType: "mirror" as const },
    },
    colorShift: {
      background: colors.map((color, index) => {
        const nextColor = colors[(index + 1) % colors.length];
        return `conic-gradient(from 0deg at 50% 50%, ${color} 0%, ${nextColor} 50%, ${color} 100%)`;
      }),
      transition: transition ?? { ...baseTransition, repeatType: "mirror" as const },
    },
    flowHorizontal: {
      background: colors.map((color, index) => {
        const nextColor = colors[(index + 1) % colors.length];
        return `linear-gradient(to right, ${color}, ${nextColor})`;
      }),
      transition: transition ?? { ...baseTransition, repeatType: "mirror" as const },
    },
    static: {
      background: `linear-gradient(to right, ${colors.join(", ")})`,
    },
  } satisfies Record<GlowEffectMode, unknown>;

  return (
    <motion.div
      style={
        {
          ...style,
          "--scale": scale,
          willChange: "transform",
          backfaceVisibility: "hidden",
        } as React.CSSProperties
      }
      animate={animations[mode]}
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full scale-[var(--scale)] transform-gpu",
        getBlurClass(blur),
        className,
      )}
    />
  );
}
