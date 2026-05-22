"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
  type SpringOptions,
} from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

type PreserveAspectRatioAlign =
  | "none"
  | "xMinYMin"
  | "xMidYMin"
  | "xMaxYMin"
  | "xMinYMid"
  | "xMidYMid"
  | "xMaxYMid"
  | "xMinYMax"
  | "xMidYMax"
  | "xMaxYMax";

type PreserveAspectRatioMeetOrSlice = "meet" | "slice";

export type PreserveAspectRatio =
  | PreserveAspectRatioAlign
  | `${Exclude<PreserveAspectRatioAlign, "none">} ${PreserveAspectRatioMeetOrSlice}`;

export interface CssVariableInterpolation {
  property: string;
  from: number | string;
  to: number | string;
}

export interface MarqueeAlongSvgPathProps {
  children: React.ReactNode;
  className?: string;
  path: string;
  pathId?: string;
  preserveAspectRatio?: PreserveAspectRatio;
  showPath?: boolean;
  width?: string | number;
  height?: string | number;
  viewBox?: string;
  baseVelocity?: number;
  direction?: "normal" | "reverse";
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
  grabCursor?: boolean;
  enableRollingZIndex?: boolean;
  zIndexBase?: number;
  zIndexRange?: number;
  cssVariableInterpolation?: CssVariableInterpolation[];
  responsive?: boolean;
}

function wrap(min: number, max: number, value: number): number {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

export function MarqueeAlongSvgPath({
  children,
  className,
  path,
  pathId,
  preserveAspectRatio = "xMidYMid meet",
  showPath = false,
  width = "100%",
  height = "100%",
  viewBox = "0 0 100 100",
  baseVelocity = 5,
  direction = "normal",
  easing,
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
  grabCursor = false,
  enableRollingZIndex = true,
  zIndexBase = 1,
  zIndexRange = 10,
  cssVariableInterpolation,
  responsive = false,
}: Readonly<MarqueeAlongSvgPathProps>) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const marqueeContainerRef = React.useRef<HTMLDivElement>(null);
  const baseOffset = useMotionValue(0);
  const reactId = React.useId();
  const id = pathId ?? `marquee-path-${reactId.replace(/:/g, "")}`;

  // Responsive: scale the fixed-size marquee container to fit the wrapper.
  React.useEffect(() => {
    if (!responsive) return;
    const [, , vbW, vbH] = viewBox.split(" ").map(Number);
    const originalW = vbW || 100;
    const originalH = vbH || 100;

    const update = () => {
      const wrapper = containerRef.current;
      const marquee = marqueeContainerRef.current;
      if (!wrapper || !marquee) return;
      const wrapperW = wrapper.clientWidth;
      const wrapperH = wrapper.clientHeight;
      const scale = Math.min(wrapperW / originalW, wrapperH / originalH);
      const offsetX = (wrapperW - originalW * scale) / 2;
      const offsetY = (wrapperH - originalH * scale) / 2;
      marquee.style.width = `${originalW}px`;
      marquee.style.height = `${originalH}px`;
      marquee.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
      marquee.style.transformOrigin = "top left";
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [responsive, viewBox]);

  // Stable item list: one entry per (child × repeat).
  const items = React.useMemo(() => {
    const arr = React.Children.toArray(children);
    return arr.flatMap((child, childIndex) =>
      Array.from({ length: repeat }, (_, repeatIndex) => ({
        child,
        repeatIndex,
        itemIndex: repeatIndex * arr.length + childIndex,
        key: `${childIndex}-${repeatIndex}`,
      })),
    );
  }, [children, repeat]);

  const { scrollY } = useScroll({
    container: scrollContainer ?? containerRef,
  });
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, scrollSpringConfig);

  const isHovered = React.useRef(false);
  const isDragging = React.useRef(false);
  const dragVelocity = React.useRef(0);
  const directionFactor = React.useRef(direction === "normal" ? 1 : -1);
  const lastPointerPosition = React.useRef({ x: 0, y: 0 });

  const hoverFactorValue = useMotionValue(1);
  const defaultVelocity = useMotionValue(1);
  const smoothHoverFactor = useSpring(hoverFactorValue, slowDownSpringConfig);

  const velocityFactor = useTransform(
    useScrollVelocity ? smoothVelocity : defaultVelocity,
    [0, 1000],
    [0, 5],
    { clamp: false },
  );

  useAnimationFrame((_t, delta) => {
    if (isDragging.current && draggable) {
      baseOffset.set(baseOffset.get() + dragVelocity.current);
      dragVelocity.current *= 0.9;
      if (Math.abs(dragVelocity.current) < 0.01) dragVelocity.current = 0;
      return;
    }
    hoverFactorValue.set(isHovered.current && slowdownOnHover ? slowDownFactor : 1);
    let moveBy =
      directionFactor.current * baseVelocity * (delta / 1000) * smoothHoverFactor.get();
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
    baseOffset.set(baseOffset.get() + moveBy);
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
    const mag = Math.sqrt(dx * dx + dy * dy);
    const signed = dx > 0 ? mag : -mag;
    dragVelocity.current = signed * dragSensitivity;
    lastPointerPosition.current = { x: e.clientX, y: e.clientY };
  };
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggable) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    isDragging.current = false;
    if (grabCursor) e.currentTarget.style.cursor = "grab";
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={cn("relative", className)}
    >
      <div
        ref={marqueeContainerRef}
        className="relative"
        style={{ contain: "layout style" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={width}
          height={height}
          viewBox={viewBox}
          preserveAspectRatio={preserveAspectRatio}
          className="h-full w-full"
        >
          <path
            id={id}
            d={path}
            stroke={showPath ? "currentColor" : "none"}
            fill="none"
          />
        </svg>

        {items.map(({ child, repeatIndex, itemIndex, key }) => (
          <MarqueeItem
            key={key}
            child={child}
            itemIndex={itemIndex}
            totalItems={items.length}
            baseOffset={baseOffset}
            path={path}
            easing={easing}
            draggable={draggable}
            grabCursor={grabCursor}
            enableRollingZIndex={enableRollingZIndex}
            zIndexBase={zIndexBase}
            zIndexRange={zIndexRange}
            cssVariableInterpolation={cssVariableInterpolation}
            isHoveredRef={isHovered}
            aria-hidden={repeatIndex > 0}
          />
        ))}
      </div>
    </div>
  );
}

interface MarqueeItemProps {
  child: React.ReactNode;
  itemIndex: number;
  totalItems: number;
  baseOffset: MotionValue<number>;
  path: string;
  easing?: (value: number) => number;
  draggable: boolean;
  grabCursor: boolean;
  enableRollingZIndex: boolean;
  zIndexBase: number;
  zIndexRange: number;
  cssVariableInterpolation?: CssVariableInterpolation[];
  isHoveredRef: React.RefObject<boolean>;
  "aria-hidden"?: boolean;
}

function MarqueeItem({
  child,
  itemIndex,
  totalItems,
  baseOffset,
  path,
  easing,
  draggable,
  grabCursor,
  enableRollingZIndex,
  zIndexBase,
  zIndexRange,
  cssVariableInterpolation,
  isHoveredRef,
  "aria-hidden": ariaHidden,
}: Readonly<MarqueeItemProps>) {
  // offsetDistance string driven by the shared base offset.
  const itemOffset = useTransform(baseOffset, (v) => {
    const position = (itemIndex * 100) / totalItems;
    const w = wrap(0, 100, v + position);
    return `${easing ? easing(w / 100) * 100 : w}%`;
  });

  // Numeric mirror for downstream interpolations (z-index + CSS vars).
  const offsetNumeric = useMotionValue(0);
  React.useEffect(() => {
    const unsubscribe = itemOffset.on("change", (value: string) => {
      const match = value.match(/^([\d.]+)%$/);
      if (match?.[1]) offsetNumeric.set(parseFloat(match[1]));
    });
    return unsubscribe;
  }, [itemOffset, offsetNumeric]);

  const zIndex = useTransform(offsetNumeric, (v) => {
    if (!enableRollingZIndex) return undefined as unknown as number;
    return Math.floor(zIndexBase + (v / 100) * zIndexRange);
  });

  // Single useTransform yields an object of all CSS-var interpolations.
  // Keeps hook count stable regardless of `cssVariableInterpolation` length.
  const cssVarStyle = useTransform(offsetNumeric, (v) => {
    if (!cssVariableInterpolation?.length) return {};
    const ratio = v / 100;
    return Object.fromEntries(
      cssVariableInterpolation.map(({ property, from, to }) => {
        if (typeof from === "number" && typeof to === "number") {
          return [property, from + (to - from) * ratio];
        }
        return [property, ratio < 0.5 ? from : to];
      }),
    );
  });

  return (
    <motion.div
      className={cn("absolute top-0 left-0", draggable && grabCursor && "cursor-grab")}
      style={{
        offsetPath: `path('${path}')`,
        offsetDistance: itemOffset,
        zIndex: enableRollingZIndex ? zIndex : undefined,
        willChange: "offset-distance",
        backfaceVisibility: "hidden",
        ...(cssVarStyle as unknown as React.CSSProperties),
      }}
      aria-hidden={ariaHidden}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
    >
      {child}
    </motion.div>
  );
}
