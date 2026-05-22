"use client";

import {
  motion,
  type MotionValue,
  type PanInfo,
  useMotionValue,
  useTransform,
} from "motion/react";
import * as React from "react";

export interface TiltCarouselItem {
  id: number | string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface TiltCarouselProps {
  items?: TiltCarouselItem[];
  baseWidth?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  round?: boolean;
  className?: string;
}

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};
const JUMP_TRANSITION = { duration: 0 } as const;

interface CardProps {
  item: TiltCarouselItem;
  index: number;
  itemWidth: number;
  round: boolean;
  trackItemOffset: number;
  x: MotionValue<number>;
}

function Card({ item, index, itemWidth, round, trackItemOffset, x }: CardProps) {
  const range = [
    -(index + 1) * trackItemOffset,
    -index * trackItemOffset,
    -(index - 1) * trackItemOffset,
  ];
  const outputRange = [90, 0, -90];
  const rotateY = useTransform(x, range, outputRange, { clamp: false });

  return (
    <motion.div
      className={`relative flex shrink-0 cursor-grab flex-col overflow-hidden active:cursor-grabbing ${
        round
          ? "items-center justify-center border-0 bg-[#120F17] text-center"
          : "items-start justify-between rounded-[12px] border border-[#222] bg-[#222]"
      }`}
      style={{
        width: itemWidth,
        height: round ? itemWidth : "100%",
        rotateY,
        ...(round && { borderRadius: "50%" }),
      }}
    >
      <div className={round ? "m-0 p-0" : "mb-4 p-5"}>
        <span className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#120F17]">
          {item.icon}
        </span>
      </div>
      <div className="p-5">
        <div className="mb-1 text-lg font-black text-white">{item.title}</div>
        <p className="text-sm text-white">{item.description}</p>
      </div>
    </motion.div>
  );
}

export function TiltCarousel({
  items = [],
  baseWidth = 300,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  loop = false,
  round = false,
  className,
}: Readonly<TiltCarouselProps>) {
  const containerPadding = 16;
  const itemWidth = baseWidth - containerPadding * 2;
  const trackItemOffset = itemWidth + GAP;

  // When looping, head/tail clones live at index 0 and length-1 so the user
  // experiences a seamless wrap around the visible range [1, items.length].
  const itemsForRender = React.useMemo(() => {
    if (!loop) return items;
    if (items.length === 0) return [];
    return [items[items.length - 1], ...items, items[0]];
  }, [items, loop]);

  const [rawPosition, setPosition] = React.useState(loop ? 1 : 0);
  // Defensive clamp if `items` shrinks below the current `rawPosition` while
  // non-looping. Computed instead of synced via effect to satisfy the
  // React-Compiler "no setState in effect" rule.
  const position =
    !loop && rawPosition > itemsForRender.length - 1
      ? Math.max(0, itemsForRender.length - 1)
      : rawPosition;
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isJumping, setIsJumping] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!pauseOnHover) return;
    const container = containerRef.current;
    if (!container) return;
    const handleEnter = () => setIsHovered(true);
    const handleLeave = () => setIsHovered(false);
    container.addEventListener("mouseenter", handleEnter);
    container.addEventListener("mouseleave", handleLeave);
    return () => {
      container.removeEventListener("mouseenter", handleEnter);
      container.removeEventListener("mouseleave", handleLeave);
    };
  }, [pauseOnHover]);

  React.useEffect(() => {
    if (!autoplay || itemsForRender.length <= 1) return;
    if (pauseOnHover && isHovered) return;
    const timer = setInterval(() => {
      setPosition((prev) => {
        if (loop) return prev + 1; // wraps via the jump in onAnimationComplete
        return Math.min(prev + 1, itemsForRender.length - 1);
      });
    }, autoplayDelay);
    return () => clearInterval(timer);
  }, [autoplay, autoplayDelay, isHovered, pauseOnHover, itemsForRender.length, loop]);

  React.useEffect(() => {
    // Re-seed position when the item set or loop flag changes. setState here
    // is the synchronization signal — we're aligning the carousel's internal
    // index with the new external prop set, not deriving from prior state.
    const startingPosition = loop ? 1 : 0;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional external→internal sync
    setPosition(startingPosition);
    x.set(-startingPosition * trackItemOffset);
  }, [items.length, loop, trackItemOffset, x]);

  const effectiveTransition = isJumping ? JUMP_TRANSITION : SPRING_OPTIONS;

  const handleAnimationStart = () => setIsAnimating(true);

  const handleAnimationComplete = () => {
    if (!loop || itemsForRender.length <= 1) {
      setIsAnimating(false);
      return;
    }
    const lastCloneIndex = itemsForRender.length - 1;
    if (position === lastCloneIndex) {
      setIsJumping(true);
      const target = 1;
      setPosition(target);
      x.set(-target * trackItemOffset);
      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
      return;
    }
    if (position === 0) {
      setIsJumping(true);
      const target = items.length;
      setPosition(target);
      x.set(-target * trackItemOffset);
      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
      return;
    }
    setIsAnimating(false);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;
    const direction =
      offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD
        ? 1
        : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD
          ? -1
          : 0;
    if (direction === 0) return;
    setPosition((prev) => {
      const next = prev + direction;
      const max = itemsForRender.length - 1;
      return Math.max(0, Math.min(next, max));
    });
  };

  const dragProps = loop
    ? {}
    : {
        dragConstraints: {
          left: -trackItemOffset * Math.max(itemsForRender.length - 1, 0),
          right: 0,
        },
      };

  const activeIndex =
    items.length === 0
      ? 0
      : loop
        ? (position - 1 + items.length) % items.length
        : Math.min(position, items.length - 1);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden p-4 ${
        round ? "rounded-full border border-white" : "rounded-[24px] border border-[#222]"
      } ${className ?? ""}`}
      style={{
        width: `${baseWidth}px`,
        ...(round && { height: `${baseWidth}px` }),
      }}
    >
      <motion.div
        className="flex"
        drag={isAnimating ? false : "x"}
        {...dragProps}
        style={{
          width: itemWidth,
          gap: `${GAP}px`,
          perspective: 1000,
          perspectiveOrigin: `${position * trackItemOffset + itemWidth / 2}px 50%`,
          x,
        }}
        onDragEnd={handleDragEnd}
        animate={{ x: -(position * trackItemOffset) }}
        transition={effectiveTransition}
        onAnimationStart={handleAnimationStart}
        onAnimationComplete={handleAnimationComplete}
      >
        {itemsForRender.map((item, index) => (
          <Card
            key={`${item.id}-${index}`}
            item={item}
            index={index}
            itemWidth={itemWidth}
            round={round}
            trackItemOffset={trackItemOffset}
            x={x}
          />
        ))}
      </motion.div>
      <div
        className={`flex w-full justify-center ${
          round ? "absolute bottom-12 left-1/2 z-20 -translate-x-1/2" : ""
        }`}
      >
        <div className="mt-4 flex w-[150px] justify-between px-8">
          {items.map((_, index) => (
            <motion.button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 w-2 cursor-pointer rounded-full transition-colors duration-150 ${
                activeIndex === index
                  ? round
                    ? "bg-white"
                    : "bg-[#333333]"
                  : round
                    ? "bg-[#555]"
                    : "bg-[rgba(51,51,51,0.4)]"
              }`}
              animate={{ scale: activeIndex === index ? 1.2 : 1 }}
              onClick={() => setPosition(loop ? index + 1 : index)}
              transition={{ duration: 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
