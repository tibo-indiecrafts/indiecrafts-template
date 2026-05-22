"use client";

import { motion, stagger, useAnimate, type AnimationOptions } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

export type VariableFontStaggerFrom = "first" | "last" | "center" | number;

export interface VariableFontHoverByLetterProps {
  label: string;
  fromFontVariationSettings?: string;
  toFontVariationSettings?: string;
  transition?: AnimationOptions;
  staggerDuration?: number;
  staggerFrom?: VariableFontStaggerFrom;
  className?: string;
  onClick?: () => void;
}

const DEFAULT_TRANSITION: AnimationOptions = {
  type: "spring",
  duration: 0.7,
};

export function VariableFontHoverByLetter({
  label,
  fromFontVariationSettings = "'wght' 400, 'slnt' 0",
  toFontVariationSettings = "'wght' 900, 'slnt' -10",
  transition = DEFAULT_TRANSITION,
  staggerDuration = 0.03,
  staggerFrom = "first",
  className,
  onClick,
}: Readonly<VariableFontHoverByLetterProps>) {
  const [scope, animate] = useAnimate();
  const hoveredRef = React.useRef(false);

  const handleHoverStart = () => {
    if (hoveredRef.current) return;
    hoveredRef.current = true;
    animate(
      ".letter",
      { fontVariationSettings: toFontVariationSettings },
      { ...transition, delay: stagger(staggerDuration, { from: staggerFrom }) },
    );
  };

  const handleHoverEnd = () => {
    hoveredRef.current = false;
    animate(
      ".letter",
      { fontVariationSettings: fromFontVariationSettings },
      { ...transition, delay: stagger(staggerDuration, { from: staggerFrom }) },
    );
  };

  return (
    <motion.span
      ref={scope}
      className={cn(className)}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      onClick={onClick}
    >
      <span className="sr-only">{label}</span>
      {label.split("").map((letter, i) => (
        <motion.span
          key={i}
          className="letter inline-block whitespace-pre"
          aria-hidden="true"
        >
          {letter}
        </motion.span>
      ))}
    </motion.span>
  );
}
