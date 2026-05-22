"use client";

import { motion, type Variants } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

export type TypewriterElement =
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

export interface TypewriterProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "children"
> {
  text: string | string[];
  as?: TypewriterElement;
  speed?: number;
  initialDelay?: number;
  waitTime?: number;
  deleteSpeed?: number;
  loop?: boolean;
  showCursor?: boolean;
  hideCursorOnType?: boolean;
  cursorChar?: string | React.ReactNode;
  cursorAnimationVariants?: {
    initial: Variants["initial"];
    animate: Variants["animate"];
  };
  cursorClassName?: string;
}

const DEFAULT_CURSOR_VARIANTS: TypewriterProps["cursorAnimationVariants"] = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.01,
      repeat: Infinity,
      repeatDelay: 0.4,
      repeatType: "reverse",
    },
  },
};

export function Typewriter({
  text,
  as: Tag = "span",
  speed = 50,
  initialDelay = 0,
  waitTime = 2000,
  deleteSpeed = 30,
  loop = true,
  className,
  showCursor = true,
  hideCursorOnType = false,
  cursorChar = "|",
  cursorClassName = "ml-1",
  cursorAnimationVariants = DEFAULT_CURSOR_VARIANTS,
  ...props
}: Readonly<TypewriterProps>) {
  // Stable texts array so the timing effect doesn't tear on every render.
  const texts = React.useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

  const [displayText, setDisplayText] = React.useState("");
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [currentTextIndex, setCurrentTextIndex] = React.useState(0);

  React.useEffect(() => {
    const currentText = texts[currentTextIndex];
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const scheduleTick = (delay: number) => {
      timeoutId = setTimeout(() => {
        if (isDeleting) {
          if (displayText === "") {
            if (currentTextIndex === texts.length - 1 && !loop) return;
            setIsDeleting(false);
            setCurrentTextIndex((p) => (p + 1) % texts.length);
            setCurrentIndex(0);
          } else {
            setDisplayText((p) => p.slice(0, -1));
          }
        } else if (currentIndex < currentText.length) {
          setDisplayText((p) => p + currentText[currentIndex]);
          setCurrentIndex((p) => p + 1);
        } else if (texts.length > 1) {
          setIsDeleting(true);
        }
      }, delay);
    };

    if (isDeleting) {
      scheduleTick(displayText === "" ? waitTime : deleteSpeed);
    } else if (currentIndex < currentText.length) {
      const isFirstChar =
        currentIndex === 0 && displayText === "" && currentTextIndex === 0;
      scheduleTick(isFirstChar ? initialDelay : speed);
    } else if (texts.length > 1) {
      scheduleTick(waitTime);
    }

    return () => {
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [
    currentIndex,
    displayText,
    isDeleting,
    currentTextIndex,
    texts,
    speed,
    deleteSpeed,
    waitTime,
    initialDelay,
    loop,
  ]);

  const isTyping = currentIndex < texts[currentTextIndex].length || isDeleting;

  return (
    <Tag
      className={cn("inline tracking-tight whitespace-pre-wrap", className)}
      {...props}
    >
      <span>{displayText}</span>
      {showCursor && (
        <motion.span
          variants={cursorAnimationVariants}
          className={cn(cursorClassName, hideCursorOnType && isTyping ? "hidden" : "")}
          initial="initial"
          animate="animate"
        >
          {cursorChar}
        </motion.span>
      )}
    </Tag>
  );
}
