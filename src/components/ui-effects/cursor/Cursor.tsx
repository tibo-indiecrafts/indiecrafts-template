"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  type SpringOptions,
  type Transition,
  type Variant,
} from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

export type CursorProps = {
  children: React.ReactNode;
  className?: string;
  springConfig?: SpringOptions;
  attachToParent?: boolean;
  transition?: Transition;
  variants?: {
    initial: Variant;
    animate: Variant;
    exit: Variant;
  };
  onPositionChange?: (x: number, y: number) => void;
};

export function Cursor({
  children,
  className,
  springConfig,
  attachToParent,
  variants,
  transition,
  onPositionChange,
}: Readonly<CursorProps>) {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const cursorRef = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(!attachToParent);

  const onPositionChangeRef = React.useRef(onPositionChange);
  React.useEffect(() => {
    onPositionChangeRef.current = onPositionChange;
  }, [onPositionChange]);

  React.useEffect(() => {
    cursorX.set(window.innerWidth / 2);
    cursorY.set(window.innerHeight / 2);
  }, [cursorX, cursorY]);

  React.useEffect(() => {
    const previousBodyCursor = document.body.style.cursor;
    if (!attachToParent) document.body.style.cursor = "none";

    const updatePosition = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      onPositionChangeRef.current?.(e.clientX, e.clientY);
    };
    document.addEventListener("mousemove", updatePosition);

    return () => {
      document.removeEventListener("mousemove", updatePosition);
      document.body.style.cursor = previousBodyCursor;
    };
  }, [attachToParent, cursorX, cursorY]);

  const cursorXSpring = useSpring(cursorX, springConfig || { duration: 0 });
  const cursorYSpring = useSpring(cursorY, springConfig || { duration: 0 });

  React.useEffect(() => {
    if (!attachToParent || !cursorRef.current) return;
    const parent = cursorRef.current.parentElement;
    if (!parent) return;

    const previousParentCursor = parent.style.cursor;
    const onEnter = () => {
      parent.style.cursor = "none";
      setIsVisible(true);
    };
    const onLeave = () => {
      parent.style.cursor = "auto";
      setIsVisible(false);
    };
    parent.addEventListener("mouseenter", onEnter);
    parent.addEventListener("mouseleave", onLeave);

    return () => {
      parent.removeEventListener("mouseenter", onEnter);
      parent.removeEventListener("mouseleave", onLeave);
      parent.style.cursor = previousParentCursor;
    };
  }, [attachToParent]);

  return (
    <motion.div
      ref={cursorRef}
      className={cn("pointer-events-none fixed top-0 left-0 z-50", className)}
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            transition={transition}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
