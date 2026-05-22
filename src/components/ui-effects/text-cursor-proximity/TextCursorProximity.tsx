"use client";

import { mix, motion, useAnimationFrame } from "motion/react";
import * as React from "react";

import { useMousePositionRef } from "@/hooks/use-mouse-position-ref";
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

export type TextCursorProximityElement = keyof typeof motionElements;

export type TextCursorProximityFalloff = "linear" | "exponential" | "gaussian";

type StyleValue = { from: string | number; to: string | number };

export interface TextCursorProximityProps extends Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  "style" | "children"
> {
  children: React.ReactNode;
  as?: TextCursorProximityElement;
  styles: Record<string, StyleValue>;
  containerRef: React.RefObject<HTMLElement | null>;
  radius?: number;
  falloff?: TextCursorProximityFalloff;
}

function buildFalloff(falloff: TextCursorProximityFalloff, radius: number) {
  switch (falloff) {
    case "exponential":
      return (distance: number) => {
        const n = Math.min(Math.max(1 - distance / radius, 0), 1);
        return n * n;
      };
    case "gaussian":
      return (distance: number) => Math.exp(-Math.pow(distance / (radius / 2), 2) / 2);
    case "linear":
    default:
      return (distance: number) => Math.min(Math.max(1 - distance / radius, 0), 1);
  }
}

export const TextCursorProximity = React.forwardRef<
  HTMLElement,
  TextCursorProximityProps
>(function TextCursorProximity(
  {
    children,
    as = "span",
    styles,
    containerRef,
    radius = 50,
    falloff = "linear",
    className,
    ...props
  },
  ref,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- motion element union resolves to a generic forwardRef that TS can't construct without `any`
  const MotionComponent = motionElements[as] as React.ComponentType<any>;

  const text = React.Children.toArray(children).join("");
  const letterRefs = React.useRef<(HTMLSpanElement | null)[]>([]);
  const mousePositionRef = useMousePositionRef(containerRef);

  // Precompute style mixers once per styles prop. mix() handles CSS strings
  // (filter, color, transform, etc.) and numeric values uniformly.
  const mixers = React.useMemo(
    () =>
      Object.entries(styles).map(([key, { from, to }]) => ({
        key: key as keyof CSSStyleDeclaration,
        mix: mix(from, to),
      })),
    [styles],
  );

  const computeFalloff = React.useMemo(
    () => buildFalloff(falloff, radius),
    [falloff, radius],
  );

  useAnimationFrame(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();

    for (let i = 0; i < letterRefs.current.length; i++) {
      const el = letterRefs.current[i];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2 - containerRect.left;
      const cy = rect.top + rect.height / 2 - containerRect.top;
      const dx = mousePositionRef.current.x - cx;
      const dy = mousePositionRef.current.y - cy;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const t = computeFalloff(distance);
      for (const m of mixers) {
        // The mix() return type is unknown; we trust CSSStyleDeclaration to
        // coerce strings. Numeric mixes are converted to strings by the browser.
        const value = m.mix(t);
        (el.style as unknown as Record<string, string>)[m.key as string] =
          typeof value === "number" ? String(value) : (value as string);
      }
    }
  });

  const words = text.split(" ");
  let letterIndex = -1;

  return (
    <MotionComponent ref={ref} className={cn(className)} {...props}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block" aria-hidden="true">
          {word.split("").map((letter) => {
            letterIndex += 1;
            const currentIndex = letterIndex;
            return (
              <motion.span
                key={currentIndex}
                ref={(el: HTMLSpanElement | null) => {
                  letterRefs.current[currentIndex] = el;
                }}
                className="inline-block"
                aria-hidden="true"
              >
                {letter}
              </motion.span>
            );
          })}
          {wordIndex < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
      <span className="sr-only">{text}</span>
    </MotionComponent>
  );
});
