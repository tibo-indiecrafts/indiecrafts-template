"use client";

import { motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const DEFAULT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+";

export type ScrambleRevealDirection = "start" | "end" | "center";

export interface ScrambleHoverProps extends Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  | "children"
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
> {
  text: string;
  scrambleSpeed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: ScrambleRevealDirection;
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  scrambledClassName?: string;
}

function pickNextIndex(
  direction: ScrambleRevealDirection,
  textLength: number,
  revealed: ReadonlySet<number>,
): number {
  switch (direction) {
    case "end":
      return textLength - 1 - revealed.size;
    case "center": {
      const middle = Math.floor(textLength / 2);
      const offset = Math.floor(revealed.size / 2);
      const candidate = revealed.size % 2 === 0 ? middle + offset : middle - offset - 1;
      if (candidate >= 0 && candidate < textLength && !revealed.has(candidate)) {
        return candidate;
      }
      for (let i = 0; i < textLength; i++) {
        if (!revealed.has(i)) return i;
      }
      return 0;
    }
    case "start":
    default:
      return revealed.size;
  }
}

function buildScrambled(
  text: string,
  revealed: ReadonlySet<number>,
  useOriginalCharsOnly: boolean,
  characters: string,
): string {
  if (useOriginalCharsOnly) {
    const positions = text.split("").map((char, i) => ({
      char,
      isSpace: char === " ",
      index: i,
      isRevealed: revealed.has(i),
    }));
    const pool = positions.filter((p) => !p.isSpace && !p.isRevealed).map((p) => p.char);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    let cursor = 0;
    return positions
      .map((p) => {
        if (p.isSpace) return " ";
        if (p.isRevealed) return text[p.index];
        return pool[cursor++] ?? p.char;
      })
      .join("");
  }
  const charsArray = characters.split("");
  return text
    .split("")
    .map((char, i) => {
      if (char === " ") return " ";
      if (revealed.has(i)) return text[i];
      return charsArray[Math.floor(Math.random() * charsArray.length)];
    })
    .join("");
}

export function ScrambleHover({
  text,
  scrambleSpeed = 50,
  maxIterations = 10,
  useOriginalCharsOnly = false,
  characters = DEFAULT_CHARS,
  className,
  scrambledClassName,
  sequential = false,
  revealDirection = "start",
  ...props
}: Readonly<ScrambleHoverProps>) {
  // null when idle; the current scrambled string when active. Using a
  // single state to mark "scrambling" + carry the rendered text avoids
  // setState-in-effect and keeps the visual-state machine tight.
  const [scrambleResult, setScrambleResult] = React.useState<string | null>(null);
  const [revealedIndices, setRevealedIndices] = React.useState<Set<number>>(
    () => new Set(),
  );

  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  React.useEffect(
    () => () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    },
    [],
  );

  const stopInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleHoverStart = () => {
    stopInterval();
    let iteration = 0;
    let workingRevealed = new Set<number>();
    setRevealedIndices(workingRevealed);
    setScrambleResult(
      buildScrambled(text, workingRevealed, useOriginalCharsOnly, characters),
    );

    intervalRef.current = setInterval(() => {
      if (sequential) {
        if (workingRevealed.size < text.length) {
          const nextIndex = pickNextIndex(revealDirection, text.length, workingRevealed);
          workingRevealed = new Set(workingRevealed);
          workingRevealed.add(nextIndex);
          setRevealedIndices(workingRevealed);
          setScrambleResult(
            buildScrambled(text, workingRevealed, useOriginalCharsOnly, characters),
          );
        } else {
          stopInterval();
          setScrambleResult(null);
        }
      } else {
        setScrambleResult(
          buildScrambled(text, workingRevealed, useOriginalCharsOnly, characters),
        );
        iteration += 1;
        if (iteration >= maxIterations) {
          stopInterval();
          setScrambleResult(null);
        }
      }
    }, scrambleSpeed);
  };

  const handleHoverEnd = () => {
    stopInterval();
    setScrambleResult(null);
    setRevealedIndices(new Set());
  };

  const isScrambling = scrambleResult !== null;
  const displayText = scrambleResult ?? text;

  return (
    <motion.span
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      className={cn("inline-block whitespace-pre-wrap", className)}
      {...props}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {displayText.split("").map((char, index) => (
          <span
            key={index}
            className={cn(
              !isScrambling || revealedIndices.has(index)
                ? className
                : scrambledClassName,
            )}
          >
            {char}
          </span>
        ))}
      </span>
    </motion.span>
  );
}
