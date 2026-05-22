"use client";

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Transition,
} from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface CarouselItem {
  id: string;
  type: "image" | "video";
  src: string;
  alt?: string;
  poster?: string;
}

export type RotationDirection = "top" | "bottom" | "left" | "right";

export interface SpringConfig {
  stiffness?: number;
  damping?: number;
  mass?: number;
}

export interface BoxCarouselRef {
  next: () => void;
  prev: () => void;
  getCurrentItemIndex: () => number;
}

export interface BoxCarouselProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"
> {
  items: CarouselItem[];
  width: number;
  height: number;
  className?: string;
  debug?: boolean;
  perspective?: number;
  direction?: RotationDirection;
  transition?: Transition;
  snapTransition?: Transition;
  dragSpring?: SpringConfig;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  onIndexChange?: (index: number) => void;
  enableDrag?: boolean;
  dragSensitivity?: number;
}

interface FaceProps {
  transform: string;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  debug?: boolean;
}

const CubeFace = React.memo(function CubeFace({
  transform,
  className,
  children,
  style,
  debug,
}: FaceProps) {
  return (
    <div
      className={cn(
        "absolute overflow-hidden",
        debug && "opacity-50 backface-visible",
        className,
      )}
      style={{ transform, ...style }}
    >
      {children}
    </div>
  );
});

const MediaRenderer = React.memo(function MediaRenderer({
  item,
  debug = false,
}: {
  item: CarouselItem;
  debug?: boolean;
}) {
  if (debug) {
    return (
      <div className="flex h-full w-full items-center justify-center border text-2xl">
        {item.id}
      </div>
    );
  }
  if (item.type === "video") {
    return (
      <video
        src={item.src}
        poster={item.poster}
        className="h-full w-full object-cover"
        muted
        loop
        autoPlay
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- carousel slides accept arbitrary external URLs; next/image needs domain config callers can't always satisfy
    <img
      src={item.src}
      alt={item.alt ?? ""}
      draggable={false}
      className="h-full w-full object-cover"
    />
  );
});

const DEFAULT_TRANSITION: Transition = {
  duration: 1.25,
  ease: [0.953, 0.001, 0.019, 0.995],
};

const DEFAULT_SNAP: Transition = {
  type: "spring",
  damping: 30,
  stiffness: 200,
};

const DEFAULT_DRAG_SPRING: SpringConfig = { stiffness: 200, damping: 30 };

function quarterRotationSign(direction: RotationDirection, action: "next" | "prev") {
  // Returns +1 for clockwise-on-axis, -1 otherwise. The mapping mirrors the
  // 4 cases in the upstream next/prev/dragSnap helpers.
  if (direction === "top") return action === "next" ? 1 : -1;
  if (direction === "bottom") return action === "next" ? -1 : 1;
  if (direction === "left") return action === "next" ? -1 : 1;
  return action === "next" ? 1 : -1; // right
}

export const BoxCarousel = React.forwardRef<BoxCarouselRef, BoxCarouselProps>(
  function BoxCarousel(
    {
      items,
      width,
      height,
      className,
      perspective = 600,
      debug = false,
      direction = "left",
      transition = DEFAULT_TRANSITION,
      snapTransition = DEFAULT_SNAP,
      dragSpring = DEFAULT_DRAG_SPRING,
      autoPlay = false,
      autoPlayInterval = 3000,
      onIndexChange,
      enableDrag = true,
      dragSensitivity = 0.5,
      ...props
    },
    ref,
  ) {
    const [currentItemIndex, setCurrentItemIndex] = React.useState(0);
    const [currentFrontFaceIndex, setCurrentFrontFaceIndex] = React.useState(1);
    const [prevIndex, setPrevIndex] = React.useState(items.length - 1);
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [nextIndex, setNextIndex] = React.useState(1);
    const [afterNextIndex, setAfterNextIndex] = React.useState(2);
    const [currentRotation, setCurrentRotation] = React.useState(0);

    const prefersReducedMotion = useReducedMotion();
    const effectiveTransition = prefersReducedMotion ? { duration: 0 } : transition;

    const isRotating = React.useRef(false);
    const pendingIndexChange = React.useRef<number | null>(null);
    const isDraggingRef = React.useRef(false);
    const startPosition = React.useRef({ x: 0, y: 0 });
    const startRotation = React.useRef(0);

    const baseRotateX = useMotionValue(0);
    const baseRotateY = useMotionValue(0);
    // Springs follow the base values and feed the rendered transform. Drag
    // sets base directly (spring smooths); next/prev animate base (spring
    // smooths slightly, dominated by the snap transition).
    const springRotateX = useSpring(baseRotateX, dragSpring);
    const springRotateY = useSpring(baseRotateY, dragSpring);

    const handleAnimationComplete = (triggeredBy: "next" | "prev") => {
      if (!(isRotating.current && pendingIndexChange.current !== null)) return;
      isRotating.current = false;

      const newFrontFaceIndex =
        triggeredBy === "next"
          ? (currentFrontFaceIndex + 1) % 4
          : (currentFrontFaceIndex - 1 + 4) % 4;
      const backFaceIndex =
        triggeredBy === "next"
          ? (newFrontFaceIndex + 2) % 4
          : (newFrontFaceIndex + 3) % 4;
      const indexOffset = triggeredBy === "next" ? 2 : -1;
      const newBackItemIndex =
        (pendingIndexChange.current + indexOffset + items.length) % items.length;

      setCurrentItemIndex(pendingIndexChange.current);
      onIndexChange?.(pendingIndexChange.current);

      if (backFaceIndex === 0) setPrevIndex(newBackItemIndex);
      else if (backFaceIndex === 1) setCurrentIndex(newBackItemIndex);
      else if (backFaceIndex === 2) setNextIndex(newBackItemIndex);
      else if (backFaceIndex === 3) setAfterNextIndex(newBackItemIndex);

      pendingIndexChange.current = null;
      setCurrentFrontFaceIndex(newFrontFaceIndex);
    };

    const advance = (action: "next" | "prev") => {
      if (items.length === 0 || isRotating.current) return;
      isRotating.current = true;
      const newIndex =
        action === "next"
          ? (currentItemIndex + 1) % items.length
          : currentItemIndex === 0
            ? items.length - 1
            : currentItemIndex - 1;
      pendingIndexChange.current = newIndex;

      const isVertical = direction === "top" || direction === "bottom";
      const target = isVertical ? baseRotateX : baseRotateY;
      const delta = quarterRotationSign(direction, action) * 90;
      const next = currentRotation + delta;

      animate(target, next, {
        ...effectiveTransition,
        onComplete: () => {
          handleAnimationComplete(action);
          setCurrentRotation(next);
        },
      });
    };

    const next = () => advance("next");
    const prev = () => advance("prev");

    React.useImperativeHandle(ref, () => ({
      next,
      prev,
      getCurrentItemIndex: () => currentItemIndex,
    }));

    // --- Drag handling ---

    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
      if (!enableDrag || isRotating.current) return;
      isDraggingRef.current = true;
      const point = "touches" in e ? e.touches[0] : e;
      startPosition.current = { x: point.clientX, y: point.clientY };
      startRotation.current = currentRotation;
      e.preventDefault();
    };

    React.useEffect(() => {
      if (!enableDrag) return;

      const onMove = (e: MouseEvent | TouchEvent) => {
        if (!isDraggingRef.current || isRotating.current) return;
        const point = "touches" in e ? e.touches[0] : e;
        const dx = point.clientX - startPosition.current.x;
        const dy = point.clientY - startPosition.current.y;
        const isVertical = direction === "top" || direction === "bottom";
        const raw = ((isVertical ? dy : dx) * dragSensitivity) / 2;
        const signed = direction === "top" || direction === "right" ? raw : -raw;
        const min = startRotation.current - 120;
        const max = startRotation.current + 120;
        const value = Math.max(min, Math.min(max, startRotation.current + signed));
        (isVertical ? baseRotateX : baseRotateY).set(value);
      };

      const onEnd = () => {
        if (!isDraggingRef.current) return;
        isDraggingRef.current = false;
        const isVertical = direction === "top" || direction === "bottom";
        const target = isVertical ? baseRotateX : baseRotateY;
        const value = target.get();
        const snapped = Math.round(value / 90) * 90;
        const steps = Math.round((snapped - currentRotation) / 90);

        if (steps !== 0) {
          isRotating.current = true;
          let newItemIndex = currentItemIndex;
          for (let i = 0; i < Math.abs(steps); i++) {
            newItemIndex =
              steps > 0
                ? (newItemIndex + 1) % items.length
                : newItemIndex === 0
                  ? items.length - 1
                  : newItemIndex - 1;
          }
          pendingIndexChange.current = newItemIndex;
          animate(target, snapped, {
            ...snapTransition,
            onComplete: () => {
              handleAnimationComplete(steps > 0 ? "next" : "prev");
              setCurrentRotation(snapped);
            },
          });
        } else {
          animate(target, currentRotation, snapTransition);
        }
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
      // eslint-disable-next-line react-hooks/exhaustive-deps -- the handlers close over fresh state via direct reads each invocation; rebinding on every state change would thrash the window listeners
    }, [enableDrag, direction]);

    // --- Auto play ---
    React.useEffect(() => {
      if (!(autoPlay && items.length > 0)) return;
      const id = setInterval(() => advance("next"), autoPlayInterval);
      return () => clearInterval(id);
      // eslint-disable-next-line react-hooks/exhaustive-deps -- advance reads the latest state per call; reactive deps would create new intervals constantly
    }, [autoPlay, autoPlayInterval, items.length]);

    // --- Render ---

    const depth = direction === "top" || direction === "bottom" ? height : width;
    const transform = useTransform(
      [springRotateX, springRotateY],
      ([x, y]) => `translateZ(-${depth / 2}px) rotateX(${x}deg) rotateY(${y}deg)`,
    );

    const faceTransforms = (() => {
      switch (direction) {
        case "top":
          return [
            `rotateX(90deg) translateZ(${height / 2}px)`,
            `rotateY(0deg) translateZ(${depth / 2}px)`,
            `rotateX(-90deg) translateZ(${height / 2}px)`,
            `rotateY(180deg) translateZ(${depth / 2}px) rotateZ(180deg)`,
          ];
        case "right":
          return [
            `rotateY(90deg) translateZ(${width / 2}px)`,
            `rotateY(0deg) translateZ(${depth / 2}px)`,
            `rotateY(-90deg) translateZ(${width / 2}px)`,
            `rotateY(180deg) translateZ(${depth / 2}px)`,
          ];
        case "bottom":
          return [
            `rotateX(-90deg) translateZ(${height / 2}px)`,
            `rotateY(0deg) translateZ(${depth / 2}px)`,
            `rotateX(90deg) translateZ(${height / 2}px)`,
            `rotateY(180deg) translateZ(${depth / 2}px) rotateZ(180deg)`,
          ];
        case "left":
        default:
          return [
            `rotateY(-90deg) translateZ(${width / 2}px)`,
            `rotateY(0deg) translateZ(${depth / 2}px)`,
            `rotateY(90deg) translateZ(${width / 2}px)`,
            `rotateY(180deg) translateZ(${depth / 2}px)`,
          ];
      }
    })();

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (isRotating.current) return;
      const isVertical = direction === "top" || direction === "bottom";
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        if (
          (e.key === "ArrowLeft" && !isVertical) ||
          (e.key === "ArrowUp" && isVertical)
        ) {
          e.preventDefault();
          prev();
        }
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        if (
          (e.key === "ArrowRight" && !isVertical) ||
          (e.key === "ArrowDown" && isVertical)
        ) {
          e.preventDefault();
          next();
        }
      }
    };

    const faceStyle = (color: string): React.CSSProperties =>
      debug ? { width, height, backgroundColor: color } : { width, height };

    const indices = [prevIndex, currentIndex, nextIndex, afterNextIndex];
    const debugColors = ["#ff9999", "#99ff99", "#9999ff", "#ffff99"];

    return (
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- custom carousel widget; keyboard arrow + drag handlers ARE the interaction surface
      <div
        {...props}
        className={cn("relative focus:outline-0", enableDrag && "cursor-move", className)}
        style={{ width, height, perspective: `${perspective}px` }}
        onKeyDown={handleKeyDown}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- custom carousel widget needs to be focusable for keyboard arrow navigation
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label={`3D carousel with ${items.length} items`}
        aria-live="polite"
        aria-atomic="true"
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        <div className="sr-only" aria-live="assertive">
          Showing item {currentItemIndex + 1} of {items.length}:{" "}
          {items[currentItemIndex]?.alt ?? `Item ${currentItemIndex + 1}`}
        </div>
        <motion.div
          className="relative h-full w-full [transform-style:preserve-3d]"
          style={{ transform }}
        >
          {faceTransforms.map((t, i) => (
            <CubeFace
              key={i}
              transform={t}
              style={faceStyle(debugColors[i])}
              debug={debug}
            >
              <MediaRenderer item={items[indices[i]]} debug={debug} />
            </CubeFace>
          ))}
        </motion.div>
      </div>
    );
  },
);
