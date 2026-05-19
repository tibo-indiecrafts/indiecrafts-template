/* eslint-disable @typescript-eslint/ban-ts-comment -- ts-nocheck below */
// @ts-nocheck -- ui-layouts upstream; motion[keyof] dynamic indexing + variant any types accepted as-is.
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any -- ui-layouts upstream */

import { motion, type HTMLMotionProps } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

function generateVariants(direction: Direction): { hidden: any; visible: any } {
  const axis = direction === "left" || direction === "right" ? "X" : "Y";
  const value = direction === "right" || direction === "down" ? 100 : -100;

  return {
    hidden: {
      filter: "blur(10px)",
      opacity: 0,
      [`translate${axis}`]: value,
    },
    visible: {
      filter: "blur(0px)",
      opacity: 1,
      [`translate${axis}`]: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };
}

const defaultViewport = { amount: 0.3, margin: "0px 0px 0px 0px" };

export interface TextAnimationProps {
  text: string;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  viewport?: { amount?: number; margin?: string; once?: boolean };
  variants?: { hidden?: any; visible?: any };
  direction?: Direction;
  letterAnime?: boolean;
  lineAnime?: boolean;
}

export default function TextAnimation({
  as = "h1",
  text,
  className,
  viewport = defaultViewport,
  variants,
  direction = "down",
  letterAnime = false,
  lineAnime = false,
}: Readonly<TextAnimationProps>) {
  const baseVariants = variants || generateVariants(direction);
  const modifiedVariants = {
    hidden: baseVariants.hidden,
    visible: { ...baseVariants.visible },
  };

  const MotionComponent = motion[as as keyof typeof motion] as React.ComponentType<
    HTMLMotionProps<any>
  >;

  return (
    <MotionComponent
      whileInView="visible"
      initial="hidden"
      variants={containerVariants}
      viewport={viewport}
      className={cn("inline-block text-black uppercase dark:text-white", className)}
    >
      {lineAnime ? (
        <motion.span className="inline-block" variants={modifiedVariants}>
          {text}
        </motion.span>
      ) : (
        <>
          {text.split(" ").map((word: string, index: number) => (
            <motion.span
              key={`${word}-${index}`}
              className="inline-block"
              variants={letterAnime === false ? modifiedVariants : {}}
            >
              {letterAnime ? (
                <>
                  {word.split("").map((letter: string, letterIndex: number) => (
                    <motion.span
                      key={letterIndex}
                      className="inline-block"
                      variants={modifiedVariants}
                    >
                      {letter}
                    </motion.span>
                  ))}
                  &nbsp;
                </>
              ) : (
                <>{word}&nbsp;</>
              )}
            </motion.span>
          ))}
        </>
      )}
    </MotionComponent>
  );
}
