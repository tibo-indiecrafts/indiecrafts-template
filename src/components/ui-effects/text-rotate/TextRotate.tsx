"use client";

import {
  AnimatePresence,
  motion,
  type AnimatePresenceProps,
  type MotionProps,
  type Transition,
} from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

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

export type TextRotateElement = keyof typeof motionElements;

export type TextRotateStaggerFrom = "first" | "last" | "center" | "random" | number;

export type TextRotateSplitBy = "words" | "characters" | "lines" | (string & {});

export interface TextRotateProps {
  texts: string[];
  as?: TextRotateElement;
  rotationInterval?: number;
  initial?: MotionProps["initial"] | MotionProps["initial"][];
  animate?: MotionProps["animate"] | MotionProps["animate"][];
  exit?: MotionProps["exit"] | MotionProps["exit"][];
  animatePresenceMode?: AnimatePresenceProps["mode"];
  animatePresenceInitial?: boolean;
  staggerDuration?: number;
  staggerFrom?: TextRotateStaggerFrom;
  transition?: Transition;
  loop?: boolean;
  auto?: boolean;
  splitBy?: TextRotateSplitBy;
  onNext?: (index: number) => void;
  mainClassName?: string;
  splitLevelClassName?: string;
  elementLevelClassName?: string;
}

export interface TextRotateRef {
  next: () => void;
  previous: () => void;
  jumpTo: (index: number) => void;
  reset: () => void;
}

interface WordObject {
  characters: string[];
  needsSpace: boolean;
}

function splitIntoCharacters(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), ({ segment }) => segment);
  }
  return Array.from(text);
}

export const TextRotate = React.forwardRef<TextRotateRef, TextRotateProps>(
  function TextRotate(
    {
      texts,
      as = "p",
      transition = { type: "spring", damping: 25, stiffness: 300 },
      initial = { y: "100%", opacity: 0 },
      animate = { y: 0, opacity: 1 },
      exit = { y: "-120%", opacity: 0 },
      animatePresenceMode = "wait",
      animatePresenceInitial = false,
      rotationInterval = 2000,
      staggerDuration = 0,
      staggerFrom = "first",
      loop = true,
      auto = true,
      splitBy = "characters",
      onNext,
      mainClassName,
      splitLevelClassName,
      elementLevelClassName,
    },
    ref,
  ) {
    const [currentTextIndex, setCurrentTextIndex] = React.useState(0);
    // Seed the random staggerFrom once per instance so React Compiler
    // doesn't reject the impure Math.random() inside getStaggerDelay.
    const [randomStaggerSeed] = React.useState(() => Math.random());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- motion element union resolves to a generic forwardRef that TS can't construct without `any`
    const MotionComponent = motionElements[as] as React.ComponentType<any>;

    const elements = React.useMemo(() => {
      const currentText = texts[currentTextIndex];
      if (splitBy === "characters") {
        const words = currentText.split(" ");
        return words.map((word, i) => ({
          characters: splitIntoCharacters(word),
          needsSpace: i !== words.length - 1,
        }));
      }
      return splitBy === "words"
        ? currentText.split(" ")
        : splitBy === "lines"
          ? currentText.split("\n")
          : currentText.split(splitBy);
    }, [texts, currentTextIndex, splitBy]);

    const getStaggerDelay = React.useCallback(
      (index: number, totalChars: number) => {
        if (staggerFrom === "first") return index * staggerDuration;
        if (staggerFrom === "last") return (totalChars - 1 - index) * staggerDuration;
        if (staggerFrom === "center") {
          const center = Math.floor(totalChars / 2);
          return Math.abs(center - index) * staggerDuration;
        }
        if (staggerFrom === "random") {
          const randomIndex = Math.floor(randomStaggerSeed * totalChars);
          return Math.abs(randomIndex - index) * staggerDuration;
        }
        return Math.abs(staggerFrom - index) * staggerDuration;
      },
      [staggerFrom, staggerDuration, randomStaggerSeed],
    );

    const handleIndexChange = React.useCallback(
      (newIndex: number) => {
        setCurrentTextIndex(newIndex);
        onNext?.(newIndex);
      },
      [onNext],
    );

    const next = React.useCallback(() => {
      const nextIndex =
        currentTextIndex === texts.length - 1
          ? loop
            ? 0
            : currentTextIndex
          : currentTextIndex + 1;
      if (nextIndex !== currentTextIndex) handleIndexChange(nextIndex);
    }, [currentTextIndex, texts.length, loop, handleIndexChange]);

    const previous = React.useCallback(() => {
      const prevIndex =
        currentTextIndex === 0
          ? loop
            ? texts.length - 1
            : currentTextIndex
          : currentTextIndex - 1;
      if (prevIndex !== currentTextIndex) handleIndexChange(prevIndex);
    }, [currentTextIndex, texts.length, loop, handleIndexChange]);

    const jumpTo = React.useCallback(
      (index: number) => {
        const validIndex = Math.max(0, Math.min(index, texts.length - 1));
        if (validIndex !== currentTextIndex) handleIndexChange(validIndex);
      },
      [texts.length, currentTextIndex, handleIndexChange],
    );

    const reset = React.useCallback(() => {
      if (currentTextIndex !== 0) handleIndexChange(0);
    }, [currentTextIndex, handleIndexChange]);

    const getAnimationProps = React.useCallback(
      (index: number) => {
        const getProp = (prop: unknown) =>
          Array.isArray(prop) ? prop[index % prop.length] : prop;
        return {
          initial: getProp(initial) as MotionProps["initial"],
          animate: getProp(animate) as MotionProps["animate"],
          exit: getProp(exit) as MotionProps["exit"],
        };
      },
      [initial, animate, exit],
    );

    React.useImperativeHandle(ref, () => ({ next, previous, jumpTo, reset }), [
      next,
      previous,
      jumpTo,
      reset,
    ]);

    React.useEffect(() => {
      if (!auto) return;
      const id = setInterval(next, rotationInterval);
      return () => clearInterval(id);
    }, [next, rotationInterval, auto]);

    return (
      <MotionComponent
        className={cn("flex flex-wrap whitespace-pre-wrap", mainClassName)}
        transition={transition}
        layout
      >
        <span className="sr-only">{texts[currentTextIndex]}</span>
        <AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>
          <motion.span
            key={currentTextIndex}
            className={cn("flex flex-wrap", splitBy === "lines" && "w-full flex-col")}
            aria-hidden
            layout
          >
            {(splitBy === "characters"
              ? (elements as WordObject[])
              : (elements as string[]).map((el, i) => ({
                  characters: [el],
                  needsSpace: i !== (elements as string[]).length - 1,
                }))
            ).map((wordObj, wordIndex, array) => {
              const previousCharsCount = array
                .slice(0, wordIndex)
                .reduce((sum, word) => sum + word.characters.length, 0);
              const totalChars = array.reduce(
                (sum, word) => sum + word.characters.length,
                0,
              );
              return (
                <span key={wordIndex} className={cn("inline-flex", splitLevelClassName)}>
                  {wordObj.characters.map((char, charIndex) => {
                    const totalIndex = previousCharsCount + charIndex;
                    const animationProps = getAnimationProps(totalIndex);
                    return (
                      <span key={totalIndex} className={cn(elementLevelClassName)}>
                        <motion.span
                          {...animationProps}
                          transition={{
                            ...transition,
                            delay: getStaggerDelay(totalIndex, totalChars),
                          }}
                          className="inline-block"
                        >
                          {char}
                        </motion.span>
                      </span>
                    );
                  })}
                  {wordObj.needsSpace && <span className="whitespace-pre"> </span>}
                </span>
              );
            })}
          </motion.span>
        </AnimatePresence>
      </MotionComponent>
    );
  },
);
