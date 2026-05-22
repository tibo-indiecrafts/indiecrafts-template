"use client";

import { motion, useAnimate, type AnimationOptions } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface RandomLetterSwapProps {
  label: string;
  reverse?: boolean;
  transition?: AnimationOptions;
  staggerDuration?: number;
  className?: string;
  onClick?: () => void;
}

const DEFAULT_TRANSITION: AnimationOptions = {
  type: "spring",
  duration: 0.8,
};

function useShuffledIndices(length: number) {
  // Lazy initializer — runs once on mount. Math.random() is impure so
  // React Compiler refuses to memo it; useState's initializer is the
  // sanctioned place for one-shot random seeds. The shuffle stays stable
  // for the component's lifetime (label is effectively fixed per instance).
  const [indices] = React.useState(() =>
    Array.from({ length }, (_, i) => i).sort(() => Math.random() - 0.5),
  );
  return indices;
}

function mergeTransition(
  transition: AnimationOptions,
  i: number,
  staggerDuration: number,
): AnimationOptions {
  return { ...transition, delay: i * staggerDuration };
}

export function RandomLetterSwapForward({
  label,
  reverse = true,
  transition = DEFAULT_TRANSITION,
  staggerDuration = 0.02,
  className,
  onClick,
}: Readonly<RandomLetterSwapProps>) {
  const [scope, animate] = useAnimate();
  const blockedRef = React.useRef(false);
  const shuffledIndices = useShuffledIndices(label.length);

  const handleHoverStart = () => {
    if (blockedRef.current) return;
    blockedRef.current = true;
    for (let i = 0; i < label.length; i++) {
      const idx = shuffledIndices[i];
      const t = mergeTransition(transition, i, staggerDuration);
      animate(`.letter-${idx}`, { y: reverse ? "100%" : "-100%" }, t).then(() => {
        animate(`.letter-${idx}`, { y: 0 }, { duration: 0 });
      });
      animate(`.letter-secondary-${idx}`, { top: "0%" }, t)
        .then(() => {
          animate(
            `.letter-secondary-${idx}`,
            { top: reverse ? "-100%" : "100%" },
            { duration: 0 },
          );
        })
        .then(() => {
          if (i === label.length - 1) blockedRef.current = false;
        });
    }
  };

  return (
    <motion.span
      ref={scope}
      onHoverStart={handleHoverStart}
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        className,
      )}
    >
      <span className="sr-only">{label}</span>
      {label.split("").map((letter, i) => (
        <span key={i} aria-hidden="true" className="relative flex whitespace-pre">
          <motion.span className={`letter-${i} relative pb-2`} style={{ top: 0 }}>
            {letter}
          </motion.span>
          <motion.span
            className={`letter-secondary-${i} absolute`}
            style={{ top: reverse ? "-100%" : "100%" }}
          >
            {letter}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

export function RandomLetterSwapPingPong({
  label,
  reverse = true,
  transition = DEFAULT_TRANSITION,
  staggerDuration = 0.02,
  className,
  onClick,
}: Readonly<RandomLetterSwapProps>) {
  const [scope, animate] = useAnimate();
  const blockedRef = React.useRef(false);
  const shuffledIndices = useShuffledIndices(label.length);

  const handleHoverStart = () => {
    if (blockedRef.current) return;
    blockedRef.current = true;
    for (let i = 0; i < label.length; i++) {
      const idx = shuffledIndices[i];
      const t = mergeTransition(transition, i, staggerDuration);
      animate(`.letter-${idx}`, { y: reverse ? "100%" : "-100%" }, t);
      animate(`.letter-secondary-${idx}`, { top: "0%" }, t);
    }
  };

  const handleHoverEnd = () => {
    blockedRef.current = false;
    for (let i = 0; i < label.length; i++) {
      const idx = shuffledIndices[i];
      const t = mergeTransition(transition, i, staggerDuration);
      animate(`.letter-${idx}`, { y: 0 }, t);
      animate(`.letter-secondary-${idx}`, { top: reverse ? "-100%" : "100%" }, t);
    }
  };

  return (
    <motion.span
      ref={scope}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        className,
      )}
    >
      <span className="sr-only">{label}</span>
      {label.split("").map((letter, i) => (
        <span key={i} aria-hidden="true" className="relative flex whitespace-pre">
          <motion.span className={`letter-${i} relative pb-2`} style={{ top: 0 }}>
            {letter}
          </motion.span>
          <motion.span
            className={`letter-secondary-${i} absolute`}
            style={{ top: reverse ? "-100%" : "100%" }}
          >
            {letter}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
