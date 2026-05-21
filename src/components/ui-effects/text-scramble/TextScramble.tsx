"use client";

import { motion, type MotionProps } from "motion/react";
import * as React from "react";

const motionElements = {
  article: motion.article,
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
  h6: motion.h6,
  li: motion.li,
  p: motion.p,
  section: motion.section,
  span: motion.span,
} as const;

export type TextScrambleElement = keyof typeof motionElements;

export type TextScrambleProps = {
  children: string;
  duration?: number;
  speed?: number;
  characterSet?: string;
  as?: TextScrambleElement;
  className?: string;
  trigger?: boolean;
  onScrambleComplete?: () => void;
} & Omit<MotionProps, "children">;

const DEFAULT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function TextScramble({
  children,
  duration = 0.8,
  speed = 0.04,
  characterSet = DEFAULT_CHARS,
  className,
  as = "p",
  trigger = true,
  onScrambleComplete,
  ...props
}: Readonly<TextScrambleProps>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- motion element union resolves to a generic forwardRef that TS can't construct without an explicit `any` here
  const MotionComponent = motionElements[as] as React.ComponentType<any>;
  const [scrambledText, setScrambledText] = React.useState<string | null>(null);
  const isAnimatingRef = React.useRef(false);
  const onCompleteRef = React.useRef(onScrambleComplete);

  React.useEffect(() => {
    onCompleteRef.current = onScrambleComplete;
  }, [onScrambleComplete]);

  React.useEffect(() => {
    if (!trigger || isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const text = children;
    const steps = duration / speed;
    let step = 0;

    const interval = setInterval(() => {
      const progress = step / steps;
      let scrambled = "";

      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") {
          scrambled += " ";
          continue;
        }
        if (progress * text.length > i) {
          scrambled += text[i];
        } else {
          scrambled += characterSet[Math.floor(Math.random() * characterSet.length)];
        }
      }

      setScrambledText(scrambled);
      step++;

      if (step > steps) {
        clearInterval(interval);
        setScrambledText(null);
        isAnimatingRef.current = false;
        onCompleteRef.current?.();
      }
    }, speed * 1000);

    return () => {
      clearInterval(interval);
      isAnimatingRef.current = false;
    };
  }, [trigger, children, duration, speed, characterSet]);

  return (
    <MotionComponent className={className} {...props}>
      {scrambledText ?? children}
    </MotionComponent>
  );
}
