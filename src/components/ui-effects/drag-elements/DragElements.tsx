"use client";

import { motion, type InertiaOptions } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface DragElementsProps {
  children: React.ReactNode;
  dragElastic?:
    | number
    | { top?: number; left?: number; right?: number; bottom?: number }
    | boolean;
  dragConstraints?:
    | { top?: number; left?: number; right?: number; bottom?: number }
    | React.RefObject<Element | null>;
  dragMomentum?: boolean;
  dragTransition?: InertiaOptions;
  dragPropagation?: boolean;
  /** When true, the last-dragged element rises above the rest. @default true */
  selectedOnTop?: boolean;
  className?: string;
}

export function DragElements({
  children,
  dragElastic = 0.5,
  dragConstraints,
  dragMomentum = true,
  dragTransition = { bounceStiffness: 200, bounceDamping: 300 },
  dragPropagation = true,
  selectedOnTop = true,
  className,
}: Readonly<DragElementsProps>) {
  const constraintsRef = React.useRef<HTMLDivElement>(null);
  const childCount = React.Children.count(children);

  // Lazy initial order so the first paint already has stable z-indices.
  const [zIndices, setZIndices] = React.useState<number[]>(() =>
    Array.from({ length: childCount }, (_, i) => i),
  );
  // "Adjusting state when a prop changes" pattern: when caller passes a
  // different child count we reset during render rather than via an effect.
  // https://react.dev/reference/react/useState#storing-information-from-previous-renders
  const [prevCount, setPrevCount] = React.useState(childCount);
  if (prevCount !== childCount) {
    setPrevCount(childCount);
    setZIndices(Array.from({ length: childCount }, (_, i) => i));
  }

  const bringToFront = (index: number) => {
    if (!selectedOnTop) return;
    setZIndices((prev) => {
      const next = [...prev];
      const at = next.indexOf(index);
      if (at < 0) return prev;
      next.splice(at, 1);
      next.push(index);
      return next;
    });
  };

  return (
    <div ref={constraintsRef} className={cn("relative h-full w-full", className)}>
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          drag
          dragElastic={dragElastic}
          dragConstraints={dragConstraints ?? constraintsRef}
          dragMomentum={dragMomentum}
          dragTransition={dragTransition}
          dragPropagation={dragPropagation}
          style={{ zIndex: zIndices.indexOf(index), cursor: "grab" }}
          whileDrag={{ cursor: "grabbing" }}
          onDragStart={() => bringToFront(index)}
          className="absolute"
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
