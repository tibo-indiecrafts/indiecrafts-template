"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface CubeFaces {
  front?: React.ReactNode;
  back?: React.ReactNode;
  right?: React.ReactNode;
  left?: React.ReactNode;
  top?: React.ReactNode;
  bottom?: React.ReactNode;
}

export interface CSSBoxRef {
  showFront: () => void;
  showBack: () => void;
  showLeft: () => void;
  showRight: () => void;
  showTop: () => void;
  showBottom: () => void;
  rotateTo: (x: number, y: number) => void;
  getCurrentRotation: () => { x: number; y: number };
}

export interface CSSBoxProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"
> {
  width: number;
  height: number;
  depth: number;
  className?: string;
  perspective?: number;
  stiffness?: number;
  damping?: number;
  showBackface?: boolean;
  faces?: CubeFaces;
  draggable?: boolean;
}

interface FaceProps {
  transform: string;
  className?: string;
  showBackface?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

function CubeFace({ transform, className, showBackface, children, style }: FaceProps) {
  return (
    <div
      className={cn(
        "absolute",
        showBackface ? "backface-visible" : "backface-hidden",
        className,
      )}
      style={{ transform, ...style }}
    >
      {children}
    </div>
  );
}

export const CSSBox = React.forwardRef<CSSBoxRef, CSSBoxProps>(function CSSBox(
  {
    width,
    height,
    depth,
    className,
    perspective = 600,
    stiffness = 100,
    damping = 30,
    showBackface = false,
    faces = {},
    draggable = true,
    ...props
  },
  ref,
) {
  const isDragging = React.useRef(false);
  const startPosition = React.useRef({ x: 0, y: 0 });
  const startRotation = React.useRef({ x: 0, y: 0 });
  const currentRotation = React.useRef({ x: 0, y: 0 });

  const baseRotateX = useMotionValue(0);
  const baseRotateY = useMotionValue(0);
  // Upstream tried to dynamically halve stiffness while dragging via a
  // ref read during render — that never re-runs, so the conditional did
  // nothing. Dropping it for a single, predictable spring.
  const springRotateX = useSpring(baseRotateX, { stiffness, damping });
  const springRotateY = useSpring(baseRotateY, { stiffness, damping });

  React.useImperativeHandle(
    ref,
    () => ({
      showFront: () => {
        baseRotateX.set(0);
        baseRotateY.set(0);
      },
      showBack: () => {
        baseRotateX.set(0);
        baseRotateY.set(180);
      },
      showLeft: () => {
        baseRotateX.set(0);
        baseRotateY.set(-90);
      },
      showRight: () => {
        baseRotateX.set(0);
        baseRotateY.set(90);
      },
      showTop: () => {
        baseRotateX.set(-90);
        baseRotateY.set(0);
      },
      showBottom: () => {
        baseRotateX.set(90);
        baseRotateY.set(0);
      },
      rotateTo: (x, y) => {
        baseRotateX.set(x);
        baseRotateY.set(y);
      },
      getCurrentRotation: () => currentRotation.current,
    }),
    [baseRotateX, baseRotateY],
  );

  const transform = useTransform(
    [springRotateX, springRotateY],
    ([x, y]) => `translateZ(-${depth / 2}px) rotateX(${x}deg) rotateY(${y}deg)`,
  );

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!draggable) return;
    isDragging.current = true;
    const point = "touches" in e ? e.touches[0] : e;
    startPosition.current = { x: point.clientX, y: point.clientY };
    startRotation.current = { x: baseRotateX.get(), y: baseRotateY.get() };
  };

  React.useEffect(() => {
    if (!draggable) return;
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;
      const point = "touches" in e ? e.touches[0] : e;
      const dx = point.clientX - startPosition.current.x;
      const dy = point.clientY - startPosition.current.y;
      baseRotateX.set(startRotation.current.x - dy / 2);
      baseRotateY.set(startRotation.current.y + dx / 2);
    };
    const onEnd = () => {
      isDragging.current = false;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [draggable, baseRotateX, baseRotateY]);

  React.useEffect(() => {
    const offX = baseRotateX.on("change", (v) => {
      currentRotation.current.x = v;
    });
    const offY = baseRotateY.on("change", (v) => {
      currentRotation.current.y = v;
    });
    return () => {
      offX();
      offY();
    };
  }, [baseRotateX, baseRotateY]);

  return (
    <div
      {...props}
      className={cn(draggable && "cursor-move", className)}
      style={{ width, height, perspective: `${perspective}px` }}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
    >
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        style={{ transform }}
      >
        <CubeFace
          transform={`rotateY(0deg) translateZ(${depth / 2}px)`}
          style={{ width, height }}
          showBackface={showBackface}
        >
          {faces.front}
        </CubeFace>
        <CubeFace
          transform={`rotateY(180deg) translateZ(${depth / 2}px)`}
          style={{ width, height }}
          showBackface={showBackface}
        >
          {faces.back}
        </CubeFace>
        <CubeFace
          transform={`rotateY(90deg) translateZ(${width / 2}px)`}
          style={{ width: depth, height, left: (width - depth) / 2 }}
          showBackface={showBackface}
        >
          {faces.right}
        </CubeFace>
        <CubeFace
          transform={`rotateY(-90deg) translateZ(${width / 2}px)`}
          style={{ width: depth, height, left: (width - depth) / 2 }}
          showBackface={showBackface}
        >
          {faces.left}
        </CubeFace>
        <CubeFace
          transform={`rotateX(90deg) translateZ(${height / 2}px)`}
          style={{ width, height: depth, top: (height - depth) / 2 }}
          showBackface={showBackface}
        >
          {faces.top}
        </CubeFace>
        <CubeFace
          transform={`rotateX(-90deg) translateZ(${height / 2}px)`}
          style={{ width, height: depth, top: (height - depth) / 2 }}
          showBackface={showBackface}
        >
          {faces.bottom}
        </CubeFace>
      </motion.div>
    </div>
  );
});
