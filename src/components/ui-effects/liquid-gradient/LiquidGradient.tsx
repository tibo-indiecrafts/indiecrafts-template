"use client";

import { motion } from "motion/react";
import * as React from "react";

type ColorKey =
  | "color1"
  | "color2"
  | "color3"
  | "color4"
  | "color5"
  | "color6"
  | "color7"
  | "color8"
  | "color9"
  | "color10"
  | "color11"
  | "color12"
  | "color13"
  | "color14"
  | "color15"
  | "color16"
  | "color17";

export type LiquidColors = Record<ColorKey, string>;

const DEFAULT_COLORS: LiquidColors = {
  color1: "#0b0b1f",
  color2: "#1e1b4b",
  color3: "#312e81",
  color4: "#4338ca",
  color5: "#6366f1",
  color6: "#8b5cf6",
  color7: "#a855f7",
  color8: "#d946ef",
  color9: "#ec4899",
  color10: "#f472b6",
  color11: "#0b0b1f",
  color12: "#1e40af",
  color13: "#06b6d4",
  color14: "#22d3ee",
  color15: "#10b981",
  color16: "#34d399",
  color17: "#7c3aed",
};

const svgOrder = ["svg1", "svg2", "svg3", "svg4", "svg3", "svg2", "svg1"] as const;
type SvgKey = (typeof svgOrder)[number];

type Stop = { offset: number; stopColor: string };
type SvgState = { gradientTransform: string; stops: Stop[] };
type SvgStates = Record<SvgKey, SvgState>;

function createStopsArray(
  svgStates: SvgStates,
  order: readonly SvgKey[],
  maxStops: number,
): Stop[][] {
  const result: Stop[][] = [];
  for (let i = 0; i < maxStops; i++) {
    const stopConfigurations = order.map((key) => {
      const svg = svgStates[key];
      return svg.stops[i] || svg.stops[svg.stops.length - 1];
    });
    result.push(stopConfigurations);
  }
  return result;
}

interface GradientSvgProps {
  className?: string;
  isHovered: boolean;
  colors: LiquidColors;
  gradientId: string;
}

function GradientSvg({
  className,
  isHovered,
  colors,
  gradientId,
}: Readonly<GradientSvgProps>) {
  const svgStates: SvgStates = {
    svg1: {
      gradientTransform: "translate(287.5 280) rotate(-29.0546) scale(689.807 1000)",
      stops: [
        { offset: 0, stopColor: colors.color1 },
        { offset: 0.188423, stopColor: colors.color2 },
        { offset: 0.260417, stopColor: colors.color3 },
        { offset: 0.328792, stopColor: colors.color4 },
        { offset: 0.328892, stopColor: colors.color5 },
        { offset: 0.328992, stopColor: colors.color1 },
        { offset: 0.442708, stopColor: colors.color6 },
        { offset: 0.537556, stopColor: colors.color7 },
        { offset: 0.631738, stopColor: colors.color1 },
        { offset: 0.725645, stopColor: colors.color8 },
        { offset: 0.817779, stopColor: colors.color9 },
        { offset: 0.84375, stopColor: colors.color10 },
        { offset: 0.90569, stopColor: colors.color1 },
        { offset: 1, stopColor: colors.color11 },
      ],
    },
    svg2: {
      gradientTransform: "translate(126.5 418.5) rotate(-64.756) scale(533.444 773.324)",
      stops: [
        { offset: 0, stopColor: colors.color1 },
        { offset: 0.104167, stopColor: colors.color12 },
        { offset: 0.182292, stopColor: colors.color13 },
        { offset: 0.28125, stopColor: colors.color1 },
        { offset: 0.328792, stopColor: colors.color4 },
        { offset: 0.328892, stopColor: colors.color5 },
        { offset: 0.453125, stopColor: colors.color6 },
        { offset: 0.515625, stopColor: colors.color7 },
        { offset: 0.631738, stopColor: colors.color1 },
        { offset: 0.692708, stopColor: colors.color8 },
        { offset: 0.75, stopColor: colors.color14 },
        { offset: 0.817708, stopColor: colors.color9 },
        { offset: 0.869792, stopColor: colors.color10 },
        { offset: 1, stopColor: colors.color1 },
      ],
    },
    svg3: {
      gradientTransform: "translate(264.5 339.5) rotate(-42.3022) scale(946.451 1372.05)",
      stops: [
        { offset: 0, stopColor: colors.color1 },
        { offset: 0.188423, stopColor: colors.color2 },
        { offset: 0.307292, stopColor: colors.color1 },
        { offset: 0.328792, stopColor: colors.color4 },
        { offset: 0.328892, stopColor: colors.color5 },
        { offset: 0.442708, stopColor: colors.color15 },
        { offset: 0.537556, stopColor: colors.color16 },
        { offset: 0.631738, stopColor: colors.color1 },
        { offset: 0.725645, stopColor: colors.color17 },
        { offset: 0.817779, stopColor: colors.color9 },
        { offset: 0.84375, stopColor: colors.color10 },
        { offset: 0.90569, stopColor: colors.color1 },
        { offset: 1, stopColor: colors.color11 },
      ],
    },
    svg4: {
      gradientTransform: "translate(860.5 420) rotate(-153.984) scale(957.528 1388.11)",
      stops: [
        { offset: 0.109375, stopColor: colors.color11 },
        { offset: 0.171875, stopColor: colors.color2 },
        { offset: 0.260417, stopColor: colors.color13 },
        { offset: 0.328792, stopColor: colors.color4 },
        { offset: 0.328892, stopColor: colors.color5 },
        { offset: 0.328992, stopColor: colors.color1 },
        { offset: 0.442708, stopColor: colors.color6 },
        { offset: 0.515625, stopColor: colors.color7 },
        { offset: 0.631738, stopColor: colors.color1 },
        { offset: 0.692708, stopColor: colors.color8 },
        { offset: 0.817708, stopColor: colors.color9 },
        { offset: 0.869792, stopColor: colors.color10 },
        { offset: 1, stopColor: colors.color11 },
      ],
    },
  };

  const maxStops = Math.max(...Object.values(svgStates).map((svg) => svg.stops.length));
  const stopsAnimationArray = createStopsArray(svgStates, svgOrder, maxStops);
  const gradientTransform = svgOrder.map((key) => svgStates[key].gradientTransform);

  const variants = {
    hovered: {
      gradientTransform,
      transition: {
        duration: 50,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear" as const,
      },
    },
    notHovered: {
      gradientTransform,
      transition: {
        duration: 10,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear" as const,
      },
    },
  };

  return (
    <svg
      className={className}
      width="1030"
      height="280"
      viewBox="0 0 1030 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="1030" height="280" rx="140" fill={`url(#${gradientId})`} />
      <defs>
        <motion.radialGradient
          id={gradientId}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          animate={isHovered ? variants.hovered : variants.notHovered}
        >
          {stopsAnimationArray.map((stopConfigs, index) => (
            <motion.stop
              key={index}
              initial={{
                offset: stopConfigs[0].offset,
                stopColor: stopConfigs[0].stopColor,
              }}
              animate={{
                offset: stopConfigs.map((c) => c.offset),
                stopColor: stopConfigs.map((c) => c.stopColor),
              }}
              transition={{
                duration: 0,
                ease: "linear",
                repeat: Number.POSITIVE_INFINITY,
              }}
            />
          ))}
        </motion.radialGradient>
      </defs>
    </svg>
  );
}

export interface LiquidGradientProps {
  isHovered?: boolean;
  colors?: LiquidColors;
}

export function LiquidGradient({
  isHovered = false,
  colors = DEFAULT_COLORS,
}: Readonly<LiquidGradientProps>) {
  const reactId = React.useId();
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 left-1/2 h-[207px] w-[756px] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
    >
      <GradientSvg
        className="h-full w-full"
        isHovered={isHovered}
        colors={colors}
        gradientId={`liquid-${reactId}`}
      />
    </div>
  );
}
