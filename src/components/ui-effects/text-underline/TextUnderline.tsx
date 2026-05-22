"use client";

import {
  motion,
  useAnimationControls,
  type ValueAnimationTransition,
} from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const motionElements = {
  a: motion.a,
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

export type TextUnderlineElement = keyof typeof motionElements;

export interface TextUnderlineBaseProps {
  children: React.ReactNode;
  as?: TextUnderlineElement;
  className?: string;
  underlineHeightRatio?: number;
  underlinePaddingRatio?: number;
  transition?: ValueAnimationTransition;
}

function useUnderlineSizing(
  ref: React.RefObject<HTMLElement | null>,
  heightRatio: number,
  paddingRatio: number,
) {
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const fontSize = parseFloat(getComputedStyle(el).fontSize);
      el.style.setProperty("--underline-height", `${fontSize * heightRatio}px`);
      el.style.setProperty("--underline-padding", `${fontSize * paddingRatio}px`);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [ref, heightRatio, paddingRatio]);
}

// ---------- Center reveal ----------

export function CenterUnderline({
  children,
  as = "span",
  className,
  transition = { duration: 0.25, ease: "easeInOut" },
  underlineHeightRatio = 0.1,
  underlinePaddingRatio = 0.01,
}: Readonly<TextUnderlineBaseProps>) {
  const textRef = React.useRef<HTMLElement>(null);
  useUnderlineSizing(textRef, underlineHeightRatio, underlinePaddingRatio);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- motion element union resolves to a generic forwardRef that TS can't construct without `any`
  const MotionComponent = motionElements[as] as React.ComponentType<any>;

  const underlineVariants = {
    hidden: { width: 0, originX: 0.5 },
    visible: { width: "100%", transition },
  };

  return (
    <MotionComponent
      ref={textRef}
      className={cn("relative inline-block cursor-pointer", className)}
      whileHover="visible"
    >
      <span>{children}</span>
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 bg-current"
        style={{
          height: "var(--underline-height)",
          bottom: "calc(-1 * var(--underline-padding))",
        }}
        variants={underlineVariants}
        aria-hidden="true"
      />
    </MotionComponent>
  );
}

// ---------- Comes in, goes out ----------

export interface DirectionalUnderlineProps extends TextUnderlineBaseProps {
  direction?: "left" | "right";
}

export function ComesInGoesOutUnderline({
  children,
  as = "span",
  direction = "left",
  className,
  underlineHeightRatio = 0.1,
  underlinePaddingRatio = 0.01,
  transition = { duration: 0.4, ease: "easeInOut" },
}: Readonly<DirectionalUnderlineProps>) {
  const controls = useAnimationControls();
  const blockedRef = React.useRef(false);
  const textRef = React.useRef<HTMLElement>(null);
  useUnderlineSizing(textRef, underlineHeightRatio, underlinePaddingRatio);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- motion element union resolves to a generic forwardRef that TS can't construct without `any`
  const MotionComponent = motionElements[as] as React.ComponentType<any>;

  const animate = async () => {
    if (blockedRef.current) return;
    blockedRef.current = true;
    await controls.start({
      width: "100%",
      transition,
      transitionEnd: {
        left: direction === "left" ? "auto" : 0,
        right: direction === "left" ? 0 : "auto",
      },
    });
    await controls.start({
      width: 0,
      transition,
      transitionEnd: {
        left: direction === "left" ? 0 : "",
        right: direction === "left" ? "" : 0,
      },
    });
    blockedRef.current = false;
  };

  return (
    <MotionComponent
      ref={textRef}
      className={cn("relative inline-block cursor-pointer", className)}
      onHoverStart={animate}
    >
      <span>{children}</span>
      <motion.span
        className={cn(
          "absolute w-0 bg-current",
          direction === "left" ? "left-0" : "right-0",
        )}
        style={{
          height: "var(--underline-height)",
          bottom: "calc(1 * var(--underline-padding))",
        }}
        animate={controls}
        aria-hidden="true"
      />
    </MotionComponent>
  );
}

// ---------- Underline grows to fill text background ----------

export interface UnderlineToBackgroundProps extends TextUnderlineBaseProps {
  /** Color the text animates to once the underline has covered it. */
  targetTextColor: string;
}

export function UnderlineToBackground({
  children,
  as = "span",
  className,
  transition = { type: "spring", damping: 30, stiffness: 300 },
  underlineHeightRatio = 0.1,
  underlinePaddingRatio = 0.01,
  targetTextColor,
}: Readonly<UnderlineToBackgroundProps>) {
  const textRef = React.useRef<HTMLElement>(null);
  useUnderlineSizing(textRef, underlineHeightRatio, underlinePaddingRatio);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- motion element union resolves to a generic forwardRef that TS can't construct without `any`
  const MotionComponent = motionElements[as] as React.ComponentType<any>;

  const underlineVariants = {
    initial: { height: "var(--underline-height)" },
    target: { height: "100%", transition },
  };

  const textVariants = {
    initial: { color: "currentColor" },
    target: { color: targetTextColor, transition },
  };

  return (
    <MotionComponent
      ref={textRef}
      className={cn("relative inline-block cursor-pointer", className)}
      whileHover="target"
    >
      <motion.div
        className="absolute w-full bg-current"
        style={{
          height: "var(--underline-height)",
          bottom: "calc(-1 * var(--underline-padding))",
        }}
        variants={underlineVariants}
        aria-hidden="true"
      />
      <motion.span variants={textVariants} className="relative text-current">
        {children}
      </motion.span>
    </MotionComponent>
  );
}

// ---------- Goes out, comes in ----------

export function GoesOutComesInUnderline({
  children,
  as = "span",
  direction = "left",
  className,
  underlineHeightRatio = 0.1,
  underlinePaddingRatio = 0.01,
  transition = { duration: 0.5, ease: "easeOut" },
}: Readonly<DirectionalUnderlineProps>) {
  const controls = useAnimationControls();
  const blockedRef = React.useRef(false);
  const textRef = React.useRef<HTMLElement>(null);
  useUnderlineSizing(textRef, underlineHeightRatio, underlinePaddingRatio);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- motion element union resolves to a generic forwardRef that TS can't construct without `any`
  const MotionComponent = motionElements[as] as React.ComponentType<any>;

  const animate = async () => {
    if (blockedRef.current) return;
    blockedRef.current = true;
    await controls.start({
      width: 0,
      transition,
      transitionEnd: {
        left: direction === "left" ? "auto" : 0,
        right: direction === "left" ? 0 : "auto",
      },
    });
    await controls.start({
      width: "100%",
      transition,
      transitionEnd: {
        left: direction === "left" ? 0 : "",
        right: direction === "left" ? "" : 0,
      },
    });
    blockedRef.current = false;
  };

  return (
    <MotionComponent
      ref={textRef}
      className={cn("relative inline-block cursor-pointer", className)}
      onHoverStart={animate}
    >
      <span>{children}</span>
      <motion.span
        className={cn("absolute bg-current", direction === "left" ? "left-0" : "right-0")}
        style={{
          height: "var(--underline-height)",
          bottom: "calc(-1 * var(--underline-padding))",
          width: "100%",
        }}
        animate={controls}
        aria-hidden="true"
      />
    </MotionComponent>
  );
}
