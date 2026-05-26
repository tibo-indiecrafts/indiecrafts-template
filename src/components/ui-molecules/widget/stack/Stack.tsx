"use client";

import { motion, type PanInfo, useMotionValue, useTransform } from "motion/react";
import * as React from "react";

export interface StackProps {
  randomRotation?: boolean;
  sensitivity?: number;
  sendToBackOnClick?: boolean;
  cards?: React.ReactNode[];
  animationConfig?: { stiffness: number; damping: number };
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  mobileClickOnly?: boolean;
  mobileBreakpoint?: number;
}

interface CardRotateProps {
  children: React.ReactNode;
  onSendToBack: () => void;
  sensitivity: number;
  disableDrag?: boolean;
}

function CardRotate({
  children,
  onSendToBack,
  sensitivity,
  disableDrag = false,
}: CardRotateProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [60, -60]);
  const rotateY = useTransform(x, [-100, 100], [-60, 60]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > sensitivity || Math.abs(info.offset.y) > sensitivity) {
      onSendToBack();
    } else {
      x.set(0);
      y.set(0);
    }
  };

  if (disableDrag) {
    return (
      <motion.div className="absolute inset-0 cursor-pointer" style={{ x: 0, y: 0 }}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="absolute inset-0 cursor-grab"
      style={{ x, y, rotateX, rotateY }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.6}
      whileTap={{ cursor: "grabbing" }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
}

// Deterministic per-id jitter in the range (-5, 5). Used instead of
// `Math.random` so the value is pure under React Compiler and stays stable
// across re-renders without needing a ref.
function seededRotate(id: number) {
  const x = Math.sin(id * 9301 + 49297) * 233280;
  return (x - Math.floor(x)) * 10 - 5;
}

function subscribeResize(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
}

function useIsBelow(breakpoint: number): boolean {
  return React.useSyncExternalStore(
    subscribeResize,
    () => (typeof window === "undefined" ? false : window.innerWidth < breakpoint),
    () => false,
  );
}

export function Stack({
  randomRotation = false,
  sensitivity = 200,
  cards,
  animationConfig = { stiffness: 260, damping: 20 },
  sendToBackOnClick = false,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  mobileClickOnly = false,
  mobileBreakpoint = 768,
}: Readonly<StackProps>) {
  const isMobile = useIsBelow(mobileBreakpoint);
  const [isPaused, setIsPaused] = React.useState(false);

  const shouldDisableDrag = mobileClickOnly && isMobile;
  const shouldEnableClick = sendToBackOnClick || shouldDisableDrag;

  const initial = React.useMemo(
    () => (cards ?? []).map((content, index) => ({ id: index + 1, content })),
    [cards],
  );

  const [stack, setStack] = React.useState(initial);

  // Re-seed when the `cards` prop array reference changes. Synchronization
  // from external prop → internal mutable order; legit external sync.
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional external→internal sync
    setStack(initial);
  }, [initial]);

  const sendToBack = (id: number) => {
    setStack((prev) => {
      const next = [...prev];
      const idx = next.findIndex((card) => card.id === id);
      if (idx < 0) return prev;
      const [card] = next.splice(idx, 1);
      next.unshift(card);
      return next;
    });
  };

  React.useEffect(() => {
    if (!autoplay || stack.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      const topCardId = stack[stack.length - 1].id;
      sendToBack(topCardId);
    }, autoplayDelay);
    return () => clearInterval(interval);
  }, [autoplay, autoplayDelay, stack, isPaused]);

  return (
    // Decorative widget — the deck cycles via drag gesture (or a tap when
    // drag is disabled on mobile). No semantic role, no keyboard target,
    // hidden from assistive tech. Consumers needing real navigation should
    // wrap each card's content in their own interactive element.
    <div
      className="relative h-full w-full"
      style={{ perspective: 600 }}
      aria-hidden="true"
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {stack.map((card, index) => {
        const randomRotate = randomRotation ? seededRotate(card.id) : 0;
        return (
          <CardRotate
            key={card.id}
            onSendToBack={() => sendToBack(card.id)}
            sensitivity={sensitivity}
            disableDrag={shouldDisableDrag}
          >
            <motion.div
              className="h-full w-full overflow-hidden rounded-2xl"
              onClick={shouldEnableClick ? () => sendToBack(card.id) : undefined}
              animate={{
                rotateZ: (stack.length - index - 1) * 4 + randomRotate,
                scale: 1 + index * 0.06 - stack.length * 0.06,
                transformOrigin: "90% 90%",
              }}
              initial={false}
              transition={{
                type: "spring",
                stiffness: animationConfig.stiffness,
                damping: animationConfig.damping,
              }}
            >
              {card.content}
            </motion.div>
          </CardRotate>
        );
      })}
    </div>
  );
}
