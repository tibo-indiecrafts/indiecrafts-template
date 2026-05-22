"use client";

import { motion, type Transition } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface VariableFontHoverByRandomLetterProps {
  label: string;
  fromFontVariationSettings?: string;
  toFontVariationSettings?: string;
  transition?: Transition;
  staggerDuration?: number;
  className?: string;
  onClick?: () => void;
}

const DEFAULT_TRANSITION: Transition = {
  type: "spring",
  duration: 0.7,
};

function shuffle(indices: number[]) {
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
}

export function VariableFontHoverByRandomLetter({
  label,
  fromFontVariationSettings = "'wght' 400, 'slnt' 0",
  toFontVariationSettings = "'wght' 900, 'slnt' -10",
  transition = DEFAULT_TRANSITION,
  staggerDuration = 0.03,
  className,
  onClick,
}: Readonly<VariableFontHoverByRandomLetterProps>) {
  // Lazy init keeps Math.random() out of the render path so React Compiler
  // accepts it. Shuffle is stable for the component's lifetime.
  const [shuffledIndices] = React.useState(() =>
    shuffle(Array.from({ length: label.length }, (_, i) => i)),
  );

  const letterVariants = {
    hover: (index: number) => ({
      fontVariationSettings: toFontVariationSettings,
      transition: { ...transition, delay: staggerDuration * index },
    }),
    initial: (index: number) => ({
      fontVariationSettings: fromFontVariationSettings,
      transition: { ...transition, delay: staggerDuration * index },
    }),
  };

  return (
    <motion.span
      className={cn(className)}
      onClick={onClick}
      whileHover="hover"
      initial="initial"
    >
      <span className="sr-only">{label}</span>
      {label.split("").map((letter, i) => (
        <motion.span
          key={i}
          className="inline-block whitespace-pre"
          aria-hidden="true"
          variants={letterVariants}
          custom={shuffledIndices[i]}
        >
          {letter}
        </motion.span>
      ))}
    </motion.span>
  );
}
