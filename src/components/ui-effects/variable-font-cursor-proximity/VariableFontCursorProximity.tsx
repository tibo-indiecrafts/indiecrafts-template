"use client";

import { motion, useAnimationFrame } from "motion/react";
import * as React from "react";

import { useMousePositionRef } from "@/hooks/use-mouse-position-ref";
import { cn } from "@/lib/utils";

export type VariableFontCursorProximityElement =
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

export type VariableFontCursorFalloff = "linear" | "exponential" | "gaussian";

export interface VariableFontCursorProximityProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "children"
> {
  children: React.ReactNode;
  as?: VariableFontCursorProximityElement;
  fromFontVariationSettings: string;
  toFontVariationSettings: string;
  containerRef: React.RefObject<HTMLElement | null>;
  radius?: number;
  falloff?: VariableFontCursorFalloff;
}

interface AxisDef {
  axis: string;
  fromValue: number;
  toValue: number;
}

function parseFontVariation(input: string): Map<string, number> {
  return new Map(
    input
      .split(",")
      .map((s) => s.trim())
      .map((s) => {
        const [name, value] = s.split(" ");
        return [name.replace(/['"]/g, ""), parseFloat(value)] as const;
      }),
  );
}

function buildFalloff(falloff: VariableFontCursorFalloff, radius: number) {
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

export const VariableFontCursorProximity = React.forwardRef<
  HTMLElement,
  VariableFontCursorProximityProps
>(function VariableFontCursorProximity(
  {
    children,
    as: Tag = "span",
    fromFontVariationSettings,
    toFontVariationSettings,
    containerRef,
    radius = 50,
    falloff = "linear",
    className,
    ...props
  },
  ref,
) {
  const letterRefs = React.useRef<(HTMLSpanElement | null)[]>([]);
  const mousePositionRef = useMousePositionRef(containerRef);

  const parsedAxes = React.useMemo<AxisDef[]>(() => {
    const fromMap = parseFontVariation(fromFontVariationSettings);
    const toMap = parseFontVariation(toFontVariationSettings);
    return Array.from(fromMap.entries()).map(([axis, fromValue]) => ({
      axis,
      fromValue,
      toValue: toMap.get(axis) ?? fromValue,
    }));
  }, [fromFontVariationSettings, toFontVariationSettings]);

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

      if (distance >= radius) {
        if (el.style.fontVariationSettings !== fromFontVariationSettings) {
          el.style.fontVariationSettings = fromFontVariationSettings;
        }
        continue;
      }

      const t = computeFalloff(distance);
      const settings = parsedAxes
        .map(
          ({ axis, fromValue, toValue }) =>
            `'${axis}' ${fromValue + (toValue - fromValue) * t}`,
        )
        .join(", ");
      el.style.fontVariationSettings = settings;
    }
  });

  const text = String(children);
  const words = text.split(" ");
  let letterIndex = -1;

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Tag is a union of intrinsic element strings; the per-tag ref types can't be unified without `any`
      ref={ref as React.Ref<any>}
      className={cn(className)}
      data-text={text}
      {...props}
    >
      {words.map((word, wordIndex) => (
        <span
          key={wordIndex}
          className="inline-block whitespace-nowrap"
          aria-hidden="true"
        >
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
                style={{ fontVariationSettings: fromFontVariationSettings }}
              >
                {letter}
              </motion.span>
            );
          })}
          {wordIndex < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
      <span className="sr-only">{text}</span>
    </Tag>
  );
});
