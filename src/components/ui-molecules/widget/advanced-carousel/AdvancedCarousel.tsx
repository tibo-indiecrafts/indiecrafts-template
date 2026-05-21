"use client";

import * as React from "react";

import {
  MotionCarousel,
  MotionCarouselContent,
  MotionCarouselIndicator,
  MotionCarouselItem,
  MotionCarouselNavigation,
  type MotionCarouselContentProps,
  type MotionCarouselIndicatorProps,
  type MotionCarouselItemProps,
  type MotionCarouselNavigationProps,
  type MotionCarouselProps,
} from "@/components/ui-molecules/widget/motion-carousel";

export type AdvancedCarouselProps = Omit<MotionCarouselProps, "children"> & {
  children: React.ReactNode;
  /** Auto-advance interval in ms. Set to 0 / omit to disable. */
  autoplayInterval?: number;
  /** Wrap from last → first slide when navigating. */
  loop?: boolean;
  /** Pause autoplay when the cursor is over the carousel. */
  pauseOnHover?: boolean;
  /** Number of slides — required when uncontrolled + autoplay/loop are enabled. */
  itemsCount: number;
};

export function AdvancedCarousel({
  children,
  index: controlledIndex,
  onIndexChange,
  initialIndex = 0,
  autoplayInterval = 0,
  loop = false,
  pauseOnHover = true,
  itemsCount,
  ...rest
}: Readonly<AdvancedCarouselProps>) {
  const [internalIndex, setInternalIndex] = React.useState(initialIndex);
  const [paused, setPaused] = React.useState(false);
  const isControlled = controlledIndex !== undefined;
  const currentIndex = isControlled ? controlledIndex : internalIndex;

  const setIndex = React.useCallback(
    (next: number) => {
      const clamped = loop
        ? ((next % itemsCount) + itemsCount) % itemsCount
        : Math.min(Math.max(next, 0), itemsCount - 1);
      if (!isControlled) setInternalIndex(clamped);
      onIndexChange?.(clamped);
    },
    [isControlled, onIndexChange, itemsCount, loop],
  );

  React.useEffect(() => {
    if (!autoplayInterval || autoplayInterval <= 0 || paused) return;
    const id = window.setInterval(() => {
      setIndex(currentIndex + 1);
    }, autoplayInterval);
    return () => window.clearInterval(id);
  }, [autoplayInterval, paused, currentIndex, setIndex]);

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- passive hover/focus listeners only pause autoplay; the carousel remains keyboard-operable via Navigation buttons inside
    <div
      role="region"
      aria-roledescription="carousel"
      onMouseEnter={pauseOnHover ? () => setPaused(true) : undefined}
      onMouseLeave={pauseOnHover ? () => setPaused(false) : undefined}
      onFocus={pauseOnHover ? () => setPaused(true) : undefined}
      onBlur={pauseOnHover ? () => setPaused(false) : undefined}
    >
      <MotionCarousel {...rest} index={currentIndex} onIndexChange={setIndex}>
        {children}
      </MotionCarousel>
    </div>
  );
}

export {
  MotionCarouselContent as AdvancedCarouselContent,
  MotionCarouselItem as AdvancedCarouselItem,
  MotionCarouselNavigation as AdvancedCarouselNavigation,
  MotionCarouselIndicator as AdvancedCarouselIndicator,
  type MotionCarouselContentProps as AdvancedCarouselContentProps,
  type MotionCarouselItemProps as AdvancedCarouselItemProps,
  type MotionCarouselNavigationProps as AdvancedCarouselNavigationProps,
  type MotionCarouselIndicatorProps as AdvancedCarouselIndicatorProps,
};
