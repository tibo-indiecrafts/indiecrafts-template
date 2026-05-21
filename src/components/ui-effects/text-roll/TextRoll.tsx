"use client";

import {
  motion,
  type Target,
  type TargetAndTransition,
  type Transition,
  type VariantLabels,
} from "motion/react";

export type TextRollProps = {
  children: string;
  duration?: number;
  getEnterDelay?: (index: number) => number;
  getExitDelay?: (index: number) => number;
  className?: string;
  transition?: Transition;
  variants?: {
    enter: {
      initial: Target | VariantLabels | boolean;
      animate: TargetAndTransition | VariantLabels;
    };
    exit: {
      initial: Target | VariantLabels | boolean;
      animate: TargetAndTransition | VariantLabels;
    };
  };
  onAnimationComplete?: () => void;
};

const DEFAULT_VARIANTS = {
  enter: {
    initial: { rotateX: 0 },
    animate: { rotateX: 90 },
  },
  exit: {
    initial: { rotateX: 90 },
    animate: { rotateX: 0 },
  },
} as const;

export function TextRoll({
  children,
  duration = 0.5,
  getEnterDelay = (i) => i * 0.1,
  getExitDelay = (i) => i * 0.1 + 0.2,
  className,
  transition = { ease: "easeIn" },
  variants,
  onAnimationComplete,
}: Readonly<TextRollProps>) {
  const letters = children.split("");

  return (
    <span className={className}>
      {letters.map((letter, i) => {
        const glyph = letter === " " ? " " : letter;
        return (
          <span
            key={i}
            aria-hidden="true"
            className="relative inline-block [width:auto] [perspective:10000px] [transform-style:preserve-3d]"
          >
            <motion.span
              className="absolute inline-block [transform-origin:50%_25%] [backface-visibility:hidden]"
              initial={variants?.enter?.initial ?? DEFAULT_VARIANTS.enter.initial}
              animate={variants?.enter?.animate ?? DEFAULT_VARIANTS.enter.animate}
              transition={{ ...transition, duration, delay: getEnterDelay(i) }}
            >
              {glyph}
            </motion.span>
            <motion.span
              className="absolute inline-block [transform-origin:50%_100%] [backface-visibility:hidden]"
              initial={variants?.exit?.initial ?? DEFAULT_VARIANTS.exit.initial}
              animate={variants?.exit?.animate ?? DEFAULT_VARIANTS.exit.animate}
              transition={{ ...transition, duration, delay: getExitDelay(i) }}
              onAnimationComplete={
                letters.length === i + 1 ? onAnimationComplete : undefined
              }
            >
              {glyph}
            </motion.span>
            <span className="invisible">{glyph}</span>
          </span>
        );
      })}
      <span className="sr-only">{children}</span>
    </span>
  );
}
