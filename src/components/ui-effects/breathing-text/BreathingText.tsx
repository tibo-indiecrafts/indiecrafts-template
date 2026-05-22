"use client";

import { motion, type Transition, type Variants } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

export type BreathingTextElement =
  | "article"
  | "div"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "li"
  | "p"
  | "section"
  | "span";

export type BreathingTextStaggerFrom = "first" | "last" | "center" | number;

export interface BreathingTextProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "children"
> {
  children: React.ReactNode;
  as?: BreathingTextElement;
  fromFontVariationSettings: string;
  toFontVariationSettings: string;
  transition?: Transition;
  staggerDuration?: number;
  staggerFrom?: BreathingTextStaggerFrom;
  repeatDelay?: number;
}

const DEFAULT_TRANSITION: Transition = {
  duration: 1.5,
  ease: "easeInOut",
};

export function BreathingText({
  children,
  as: Tag = "span",
  fromFontVariationSettings,
  toFontVariationSettings,
  transition = DEFAULT_TRANSITION,
  staggerDuration = 0.1,
  staggerFrom = "first",
  repeatDelay = 0.1,
  className,
  ...props
}: Readonly<BreathingTextProps>) {
  const letterVariants: Variants = {
    initial: { fontVariationSettings: fromFontVariationSettings },
    animate: (i: number) => ({
      fontVariationSettings: toFontVariationSettings,
      transition: {
        ...transition,
        repeat: Infinity,
        repeatType: "mirror",
        delay: i * staggerDuration,
        repeatDelay,
      },
    }),
  };

  const getCustomIndex = (index: number, total: number) => {
    if (typeof staggerFrom === "number") {
      return Math.abs(index - staggerFrom);
    }
    switch (staggerFrom) {
      case "first":
        return index;
      case "last":
        return total - 1 - index;
      case "center":
      default:
        return Math.abs(index - Math.floor(total / 2));
    }
  };

  const text = String(children);
  const letters = text.split("");

  return (
    <Tag
      className={cn(
        // after-pseudo reserves space at full weight so the layout doesn't
        // shift as the variation animates.
        "after:pointer-none relative after:invisible after:h-0 after:overflow-hidden after:font-black after:content-[attr(data-text)] after:select-none",
        className,
      )}
      data-text={text}
      {...props}
    >
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          className="inline-block whitespace-pre"
          aria-hidden="true"
          variants={letterVariants}
          initial="initial"
          animate="animate"
          custom={getCustomIndex(i, letters.length)}
        >
          {letter}
        </motion.span>
      ))}
      <span className="sr-only">{text}</span>
    </Tag>
  );
}
