"use client";

import { motion, useAnimationFrame } from "motion/react";
import * as React from "react";

import { useMousePositionRef } from "@/components/_hooks/use-mouse-position-ref";
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

export type VariableFontAndCursorElement = keyof typeof motionElements;

export interface FontVariationAxis {
  name: string;
  min: number;
  max: number;
}

export interface FontVariationMapping {
  x: FontVariationAxis;
  y: FontVariationAxis;
}

export interface VariableFontAndCursorProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "children"
> {
  children: React.ReactNode;
  as?: VariableFontAndCursorElement;
  fontVariationMapping: FontVariationMapping;
  containerRef: React.RefObject<HTMLElement | null>;
}

export function VariableFontAndCursor({
  children,
  as = "span",
  fontVariationMapping,
  className,
  containerRef,
  ...props
}: Readonly<VariableFontAndCursorProps>) {
  const mousePositionRef = useMousePositionRef(containerRef);
  const elementRef = React.useRef<HTMLElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- motion element union resolves to a generic forwardRef that TS can't construct without `any`
  const MotionComponent = motionElements[as] as React.ComponentType<any>;

  useAnimationFrame(() => {
    const container = containerRef.current;
    const target = elementRef.current;
    if (!container || !target) return;

    const w = container.clientWidth;
    const h = container.clientHeight;
    const xProgress = Math.min(Math.max(mousePositionRef.current.x / w, 0), 1);
    const yProgress = Math.min(Math.max(mousePositionRef.current.y / h, 0), 1);

    const xValue =
      fontVariationMapping.x.min +
      (fontVariationMapping.x.max - fontVariationMapping.x.min) * xProgress;
    const yValue =
      fontVariationMapping.y.min +
      (fontVariationMapping.y.max - fontVariationMapping.y.min) * yProgress;

    target.style.fontVariationSettings = `'${fontVariationMapping.x.name}' ${xValue}, '${fontVariationMapping.y.name}' ${yValue}`;
  });

  return (
    <MotionComponent
      ref={elementRef}
      className={cn(className)}
      data-text={typeof children === "string" ? children : undefined}
      {...props}
    >
      <span className="inline-block">{children}</span>
    </MotionComponent>
  );
}
