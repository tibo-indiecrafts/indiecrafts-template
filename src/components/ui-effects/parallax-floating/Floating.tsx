"use client";

import { useAnimationFrame } from "motion/react";
import * as React from "react";

import { useMousePositionRef } from "@/components/_hooks/use-mouse-position-ref";
import { cn } from "@/lib/utils";

interface FloatingContextValue {
  registerElement: (id: string, element: HTMLDivElement, depth: number) => void;
  unregisterElement: (id: string) => void;
}

const FloatingContext = React.createContext<FloatingContextValue | null>(null);

export interface FloatingProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Overall parallax intensity multiplier per element. Combined with each
   * FloatingElement's `depth`.
   * @default 1
   */
  sensitivity?: number;
  /**
   * Lerp factor for the per-frame position chase. Smaller = smoother /
   * laggier; larger = snappier.
   * @default 0.05
   */
  easingFactor?: number;
}

interface RegisteredElement {
  element: HTMLDivElement;
  depth: number;
  currentPosition: { x: number; y: number };
}

function Floating({
  children,
  className,
  sensitivity = 1,
  easingFactor = 0.05,
}: Readonly<FloatingProps>) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const elementsMap = React.useRef(new Map<string, RegisteredElement>());
  const mousePositionRef = useMousePositionRef(containerRef);

  const registry = React.useMemo<FloatingContextValue>(
    () => ({
      registerElement: (id, element, depth) => {
        elementsMap.current.set(id, {
          element,
          depth,
          currentPosition: { x: 0, y: 0 },
        });
      },
      unregisterElement: (id) => {
        elementsMap.current.delete(id);
      },
    }),
    [],
  );

  useAnimationFrame(() => {
    if (!containerRef.current) return;
    elementsMap.current.forEach((data) => {
      const strength = (data.depth * sensitivity) / 20;
      const targetX = mousePositionRef.current.x * strength;
      const targetY = mousePositionRef.current.y * strength;
      data.currentPosition.x += (targetX - data.currentPosition.x) * easingFactor;
      data.currentPosition.y += (targetY - data.currentPosition.y) * easingFactor;
      data.element.style.transform = `translate3d(${data.currentPosition.x}px, ${data.currentPosition.y}px, 0)`;
    });
  });

  return (
    <FloatingContext.Provider value={registry}>
      <div
        ref={containerRef}
        className={cn("absolute top-0 left-0 h-full w-full", className)}
      >
        {children}
      </div>
    </FloatingContext.Provider>
  );
}

export interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  /**
   * How far this element drifts relative to the cursor. Typically 0.5 → 4.
   * @default 1
   */
  depth?: number;
}

export function FloatingElement({
  children,
  className,
  depth = 1,
}: Readonly<FloatingElementProps>) {
  const elementRef = React.useRef<HTMLDivElement>(null);
  const reactId = React.useId();
  const context = React.useContext(FloatingContext);

  React.useEffect(() => {
    if (!elementRef.current || !context) return;
    context.registerElement(reactId, elementRef.current, depth ?? 0.01);
    return () => context.unregisterElement(reactId);
  }, [context, reactId, depth]);

  return (
    <div ref={elementRef} className={cn("absolute will-change-transform", className)}>
      {children}
    </div>
  );
}

export default Floating;
