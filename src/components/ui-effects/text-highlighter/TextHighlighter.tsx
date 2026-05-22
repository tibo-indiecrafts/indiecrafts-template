"use client";

import { motion, useInView, type Transition, type UseInViewOptions } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

export type TextHighlighterElement =
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

export type HighlightDirection = "ltr" | "rtl" | "ttb" | "btt";

export type TextHighlighterTriggerType = "hover" | "ref" | "inView" | "auto";

export interface TextHighlighterProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "children" | "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration"
> {
  children: React.ReactNode;
  as?: TextHighlighterElement;
  triggerType?: TextHighlighterTriggerType;
  transition?: Transition;
  useInViewOptions?: UseInViewOptions;
  highlightColor?: string;
  direction?: HighlightDirection;
}

export interface TextHighlighterRef {
  animate: (direction?: HighlightDirection) => void;
  reset: () => void;
}

const DEFAULT_IN_VIEW: UseInViewOptions = {
  once: true,
  initial: false,
  amount: 0.1,
};

const DEFAULT_TRANSITION: Transition = {
  type: "spring",
  duration: 1,
  delay: 0,
  bounce: 0,
};

function backgroundSize(direction: HighlightDirection, animated: boolean) {
  if (direction === "ttb" || direction === "btt") {
    return animated ? "100% 100%" : "100% 0%";
  }
  return animated ? "100% 100%" : "0% 100%";
}

function backgroundPosition(direction: HighlightDirection) {
  switch (direction) {
    case "rtl":
      return "100% 0%";
    case "btt":
      return "0% 100%";
    case "ttb":
    case "ltr":
    default:
      return "0% 0%";
  }
}

export const TextHighlighter = React.forwardRef<TextHighlighterRef, TextHighlighterProps>(
  function TextHighlighter(
    {
      children,
      as: Tag = "span",
      triggerType = "inView",
      transition = DEFAULT_TRANSITION,
      useInViewOptions = DEFAULT_IN_VIEW,
      className,
      highlightColor = "hsl(25, 90%, 80%)",
      direction = "ltr",
      ...props
    },
    ref,
  ) {
    const componentRef = React.useRef<HTMLElement>(null);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);
    // Imperative `animate(direction)` overrides the prop; until called, the
    // prop direction is the source of truth. Avoids a sync useEffect.
    const [directionOverride, setDirectionOverride] =
      React.useState<HighlightDirection | null>(null);

    // Always call useInView (rules of hooks); ignore result when not in
    // "inView" trigger mode.
    const isInViewFromHook = useInView(componentRef, useInViewOptions);
    const isInView = triggerType === "inView" ? isInViewFromHook : false;

    const currentDirection = directionOverride ?? direction;

    React.useImperativeHandle(
      ref,
      () => ({
        animate: (animationDirection?: HighlightDirection) => {
          if (animationDirection) setDirectionOverride(animationDirection);
          setIsAnimating(true);
        },
        reset: () => {
          setIsAnimating(false);
          setDirectionOverride(null);
        },
      }),
      [],
    );

    let shouldAnimate = false;
    if (triggerType === "hover") shouldAnimate = isHovered;
    else if (triggerType === "inView") shouldAnimate = isInView;
    else if (triggerType === "ref") shouldAnimate = isAnimating;
    else if (triggerType === "auto") shouldAnimate = true;

    const animatedSize = backgroundSize(currentDirection, shouldAnimate);
    const initialSize = backgroundSize(currentDirection, false);
    const position = backgroundPosition(currentDirection);

    const highlightStyle: React.CSSProperties = {
      backgroundImage: `linear-gradient(${highlightColor}, ${highlightColor})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: position,
      backgroundSize: animatedSize,
      boxDecorationBreak: "clone",
      WebkitBoxDecorationBreak: "clone",
    };

    const handleMouseEnter = () => {
      if (triggerType === "hover") setIsHovered(true);
    };
    const handleMouseLeave = () => {
      if (triggerType === "hover") setIsHovered(false);
    };

    return (
      <Tag
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Tag is a union of intrinsic element strings; the per-tag ref types can't be unified without `any`
        ref={componentRef as React.Ref<any>}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <motion.span
          className={cn("inline", className)}
          style={highlightStyle}
          animate={{ backgroundSize: animatedSize }}
          initial={{ backgroundSize: initialSize }}
          transition={transition}
        >
          {children}
        </motion.span>
      </Tag>
    );
  },
);
