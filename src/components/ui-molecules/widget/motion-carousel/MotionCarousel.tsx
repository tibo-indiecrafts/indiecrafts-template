"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useMotionValue, type Transition } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

type MotionCarouselContextValue = {
  index: number;
  setIndex: (newIndex: number) => void;
  itemsCount: number;
  setItemsCount: (count: number) => void;
  disableDrag: boolean;
};

const MotionCarouselContext = React.createContext<MotionCarouselContextValue | null>(
  null,
);

function useMotionCarousel(consumer: string) {
  const ctx = React.useContext(MotionCarouselContext);
  if (!ctx) {
    throw new Error(`${consumer} must be used within a <MotionCarousel>`);
  }
  return ctx;
}

export type MotionCarouselProps = {
  children: React.ReactNode;
  className?: string;
  initialIndex?: number;
  index?: number;
  onIndexChange?: (newIndex: number) => void;
  disableDrag?: boolean;
};

export function MotionCarousel({
  children,
  className,
  initialIndex = 0,
  index: externalIndex,
  onIndexChange,
  disableDrag = false,
}: Readonly<MotionCarouselProps>) {
  const [internalIndex, setInternalIndex] = React.useState(initialIndex);
  const [itemsCount, setItemsCount] = React.useState(0);
  const isControlled = externalIndex !== undefined;
  const currentIndex = isControlled ? externalIndex : internalIndex;

  const setIndex = React.useCallback(
    (newIndex: number) => {
      if (!isControlled) setInternalIndex(newIndex);
      onIndexChange?.(newIndex);
    },
    [isControlled, onIndexChange],
  );

  const value = React.useMemo(
    () => ({
      index: currentIndex,
      setIndex,
      itemsCount,
      setItemsCount,
      disableDrag,
    }),
    [currentIndex, itemsCount, disableDrag, setIndex],
  );

  return (
    <MotionCarouselContext.Provider value={value}>
      <div className={cn("group/hover relative", className)}>{children}</div>
    </MotionCarouselContext.Provider>
  );
}

export type MotionCarouselContentProps = {
  children: React.ReactNode;
  className?: string;
  transition?: Transition;
};

export function MotionCarouselContent({
  children,
  className,
  transition,
}: Readonly<MotionCarouselContentProps>) {
  const { index, setIndex, setItemsCount, disableDrag } = useMotionCarousel(
    "MotionCarouselContent",
  );
  const [visibleItemsCount, setVisibleItemsCount] = React.useState(1);
  const dragX = useMotionValue(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const itemsLength = React.Children.count(children);

  React.useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const count = entries.filter((e) => e.isIntersecting).length;
        setVisibleItemsCount(count || 1);
      },
      { root, threshold: 0.5 },
    );
    Array.from(root.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [children]);

  React.useEffect(() => {
    if (itemsLength > 0) setItemsCount(itemsLength);
  }, [itemsLength, setItemsCount]);

  const onDragEnd = () => {
    const x = dragX.get();
    if (x <= -10 && index < itemsLength - 1) setIndex(index + 1);
    else if (x >= 10 && index > 0) setIndex(index - 1);
  };

  return (
    <div className="overflow-hidden">
      <motion.div
        ref={containerRef}
        drag={disableDrag ? false : "x"}
        dragConstraints={disableDrag ? undefined : { left: 0, right: 0 }}
        dragMomentum={disableDrag ? undefined : false}
        style={{ x: disableDrag ? undefined : dragX }}
        animate={{ translateX: `-${index * (100 / visibleItemsCount)}%` }}
        onDragEnd={disableDrag ? undefined : onDragEnd}
        transition={
          transition || {
            damping: 18,
            stiffness: 90,
            type: "spring",
            duration: 0.2,
          }
        }
        className={cn(
          "flex items-center",
          !disableDrag && "cursor-grab active:cursor-grabbing",
          className,
        )}
      >
        {children}
      </motion.div>
    </div>
  );
}

export type MotionCarouselItemProps = {
  children: React.ReactNode;
  className?: string;
};

export function MotionCarouselItem({
  children,
  className,
}: Readonly<MotionCarouselItemProps>) {
  return (
    <motion.div
      className={cn("w-full min-w-0 shrink-0 grow-0 overflow-hidden", className)}
    >
      {children}
    </motion.div>
  );
}

export type MotionCarouselNavigationProps = {
  className?: string;
  classNameButton?: string;
  alwaysShow?: boolean;
};

export function MotionCarouselNavigation({
  className,
  classNameButton,
  alwaysShow,
}: Readonly<MotionCarouselNavigationProps>) {
  const { index, setIndex, itemsCount } = useMotionCarousel("MotionCarouselNavigation");

  const buttonClass = cn(
    "pointer-events-auto h-fit w-fit rounded-full bg-zinc-50 p-2 transition-opacity duration-300 dark:bg-zinc-950",
    alwaysShow ? "opacity-100" : "opacity-0 group-hover/hover:opacity-100",
    alwaysShow ? "disabled:opacity-40" : "group-hover/hover:disabled:opacity-40",
    classNameButton,
  );

  return (
    <div
      className={cn(
        "pointer-events-none absolute top-1/2 left-[-12.5%] flex w-[125%] -translate-y-1/2 justify-between px-2",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Previous slide"
        disabled={index === 0}
        onClick={() => index > 0 && setIndex(index - 1)}
        className={buttonClass}
      >
        <ChevronLeft
          size={16}
          aria-hidden="true"
          className="stroke-zinc-600 dark:stroke-zinc-50"
        />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        disabled={index + 1 === itemsCount}
        onClick={() => index < itemsCount - 1 && setIndex(index + 1)}
        className={buttonClass}
      >
        <ChevronRight
          size={16}
          aria-hidden="true"
          className="stroke-zinc-600 dark:stroke-zinc-50"
        />
      </button>
    </div>
  );
}

export type MotionCarouselIndicatorProps = {
  className?: string;
  classNameButton?: string;
};

export function MotionCarouselIndicator({
  className,
  classNameButton,
}: Readonly<MotionCarouselIndicatorProps>) {
  const { index, itemsCount, setIndex } = useMotionCarousel("MotionCarouselIndicator");

  return (
    <div
      className={cn(
        "absolute bottom-0 z-10 flex w-full items-center justify-center",
        className,
      )}
    >
      <div className="flex space-x-2">
        {Array.from({ length: itemsCount }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={cn(
              "h-2 w-2 rounded-full transition-opacity duration-300",
              index === i
                ? "bg-zinc-950 dark:bg-zinc-50"
                : "bg-zinc-900/50 dark:bg-zinc-100/50",
              classNameButton,
            )}
          />
        ))}
      </div>
    </div>
  );
}
