"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type SpringOptions,
} from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface SimpleMarqueeProps {
  children: React.ReactNode;
  className?: string;
  direction?: "left" | "right" | "up" | "down";
  baseVelocity?: number;
  easing?: (value: number) => number;
  slowdownOnHover?: boolean;
  slowDownFactor?: number;
  slowDownSpringConfig?: SpringOptions;
  useScrollVelocity?: boolean;
  scrollAwareDirection?: boolean;
  scrollSpringConfig?: SpringOptions;
  scrollContainer?: React.RefObject<HTMLElement | null>;
  repeat?: number;
  draggable?: boolean;
  dragSensitivity?: number;
  dragVelocityDecay?: number;
  dragAwareDirection?: boolean;
  /** Angle (deg) used to project pointer drag onto a single axis. @default 0 */
  dragAngle?: number;
  grabCursor?: boolean;
}

function wrap(min: number, max: number, value: number): number {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

export function SimpleMarquee({
  children,
  className,
  direction = "right",
  baseVelocity = 5,
  slowdownOnHover = false,
  slowDownFactor = 0.3,
  slowDownSpringConfig = { damping: 50, stiffness: 400 },
  useScrollVelocity = false,
  scrollAwareDirection = false,
  scrollSpringConfig = { damping: 50, stiffness: 400 },
  scrollContainer,
  repeat = 3,
  draggable = false,
  dragSensitivity = 0.2,
  dragVelocityDecay = 0.96,
  dragAwareDirection = false,
  dragAngle = 0,
  grabCursor = false,
  easing,
}: Readonly<SimpleMarqueeProps>) {
  const baseX = useMotionValue(0);
  const baseY = useMotionValue(0);

  const { scrollY } = useScroll(
    scrollContainer ? { container: scrollContainer as React.RefObject<HTMLElement> } : {},
  );
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, scrollSpringConfig);

  const hoverFactorValue = useMotionValue(1);
  const defaultVelocity = useMotionValue(1);
  const smoothHoverFactor = useSpring(hoverFactorValue, slowDownSpringConfig);

  const isDragging = React.useRef(false);
  const dragVelocity = React.useRef(0);
  const lastPointerPosition = React.useRef({ x: 0, y: 0 });
  const isHovered = React.useRef(false);
  const directionFactor = React.useRef(1);

  const velocityFactor = useTransform(
    useScrollVelocity ? smoothVelocity : defaultVelocity,
    [0, 1000],
    [0, 5],
    { clamp: false },
  );

  const isHorizontal = direction === "left" || direction === "right";
  const actualBaseVelocity =
    direction === "left" || direction === "up" ? -baseVelocity : baseVelocity;

  const x = useTransform(baseX, (v) => {
    const w = wrap(0, -100, v);
    return `${easing ? easing(w / -100) * -100 : w}%`;
  });
  const y = useTransform(baseY, (v) => {
    const w = wrap(0, -100, v);
    return `${easing ? easing(w / -100) * -100 : w}%`;
  });

  useAnimationFrame((_t, delta) => {
    // Drag-driven motion takes precedence over scroll/base velocity.
    if (isDragging.current && draggable) {
      (isHorizontal ? baseX : baseY).set(
        (isHorizontal ? baseX : baseY).get() + dragVelocity.current,
      );
      dragVelocity.current *= 0.9;
      if (Math.abs(dragVelocity.current) < 0.01) dragVelocity.current = 0;
      return;
    }

    hoverFactorValue.set(isHovered.current && slowdownOnHover ? slowDownFactor : 1);

    let moveBy =
      directionFactor.current *
      actualBaseVelocity *
      (delta / 1000) *
      smoothHoverFactor.get();

    if (scrollAwareDirection && !isDragging.current) {
      const v = velocityFactor.get();
      if (v < 0) directionFactor.current = -1;
      else if (v > 0) directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    if (draggable) {
      moveBy += dragVelocity.current;
      if (dragAwareDirection && Math.abs(dragVelocity.current) > 0.1) {
        directionFactor.current = Math.sign(dragVelocity.current);
      }
      if (!isDragging.current && Math.abs(dragVelocity.current) > 0.01) {
        dragVelocity.current *= dragVelocityDecay;
      } else if (!isDragging.current) {
        dragVelocity.current = 0;
      }
    }

    (isHorizontal ? baseX : baseY).set((isHorizontal ? baseX : baseY).get() + moveBy);
  });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggable) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    if (grabCursor) e.currentTarget.style.cursor = "grabbing";
    isDragging.current = true;
    lastPointerPosition.current = { x: e.clientX, y: e.clientY };
    dragVelocity.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggable || !isDragging.current) return;
    const dx = e.clientX - lastPointerPosition.current.x;
    const dy = e.clientY - lastPointerPosition.current.y;
    const a = (dragAngle * Math.PI) / 180;
    const projected = dx * Math.cos(a) + dy * Math.sin(a);
    dragVelocity.current = projected * dragSensitivity;
    lastPointerPosition.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggable) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    isDragging.current = false;
  };

  return (
    <motion.div
      className={cn("flex", isHorizontal ? "flex-row" : "flex-col", className)}
      onHoverStart={() => {
        isHovered.current = true;
      }}
      onHoverEnd={() => {
        isHovered.current = false;
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {Array.from({ length: repeat }, (_, i) => (
        <motion.div
          key={i}
          className={cn(
            "shrink-0",
            isHorizontal && "flex",
            draggable && grabCursor && "cursor-grab",
          )}
          style={isHorizontal ? { x } : { y }}
          aria-hidden={i > 0}
        >
          {children}
        </motion.div>
      ))}
    </motion.div>
  );
}
