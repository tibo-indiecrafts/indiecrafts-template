"use client";

import Lenis from "lenis";
import * as React from "react";

export interface ScrollStackItemProps {
  itemClassName?: string;
  children: React.ReactNode;
}

export function ScrollStackItem({
  children,
  itemClassName = "",
}: Readonly<ScrollStackItemProps>) {
  return (
    <div
      className={`scroll-stack-card relative my-8 box-border h-80 w-full origin-top rounded-[40px] p-12 shadow-[0_0_30px_rgba(0,0,0,0.1)] will-change-transform ${itemClassName}`.trim()}
      style={{
        backfaceVisibility: "hidden",
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  );
}

export interface ScrollStackProps {
  className?: string;
  children: React.ReactNode;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  scaleDuration?: number;
  rotationAmount?: number;
  blurAmount?: number;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
}

interface Transform {
  translateY: number;
  scale: number;
  rotation: number;
  blur: number;
}

export function ScrollStack({
  children,
  className,
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = "20%",
  scaleEndPosition = "10%",
  baseScale = 0.85,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete,
}: Readonly<ScrollStackProps>) {
  const scrollerRef = React.useRef<HTMLDivElement>(null);

  // Hot props for the scroll handler; effect stays minimal-deps so prop
  // tweaks update on the next scroll event without re-creating Lenis.
  const propsRef = React.useRef({
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    onStackComplete,
  });
  React.useLayoutEffect(() => {
    propsRef.current = {
      itemScale,
      itemStackDistance,
      stackPosition,
      scaleEndPosition,
      baseScale,
      rotationAmount,
      blurAmount,
      onStackComplete,
    };
  });

  React.useLayoutEffect(() => {
    const scroller = useWindowScroll ? null : scrollerRef.current;
    if (!useWindowScroll && !scroller) return;

    let cards: HTMLElement[] = Array.from(
      useWindowScroll
        ? document.querySelectorAll(".scroll-stack-card")
        : (scroller?.querySelectorAll(".scroll-stack-card") ?? []),
    );
    const lastTransforms = new Map<number, Transform>();
    let stackCompleted = false;
    let isUpdating = false;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      if (i < cards.length - 1) card.style.marginBottom = `${itemDistance}px`;
      card.style.willChange = "transform, filter";
      card.style.transformOrigin = "top center";
      card.style.backfaceVisibility = "hidden";
      card.style.transform = "translateZ(0)";
      card.style.perspective = "1000px";
    }

    const calcProgress = (t: number, start: number, end: number) => {
      if (t < start) return 0;
      if (t > end) return 1;
      return (t - start) / (end - start);
    };

    const parsePct = (value: string, containerHeight: number) => {
      if (value.includes("%")) return (parseFloat(value) / 100) * containerHeight;
      return parseFloat(value);
    };

    const getScrollData = () => {
      if (useWindowScroll) {
        return {
          scrollTop: window.scrollY,
          containerHeight: window.innerHeight,
        };
      }
      return {
        scrollTop: scroller?.scrollTop ?? 0,
        containerHeight: scroller?.clientHeight ?? 0,
      };
    };

    const getElementOffset = (el: HTMLElement) =>
      useWindowScroll ? el.getBoundingClientRect().top + window.scrollY : el.offsetTop;

    const updateCardTransforms = () => {
      if (!cards.length || isUpdating) return;
      isUpdating = true;
      const p = propsRef.current;
      const { scrollTop, containerHeight } = getScrollData();
      const stackPx = parsePct(p.stackPosition, containerHeight);
      const scaleEndPx = parsePct(p.scaleEndPosition, containerHeight);
      const endEl = useWindowScroll
        ? (document.querySelector(".scroll-stack-end") as HTMLElement | null)
        : (scroller?.querySelector(".scroll-stack-end") as HTMLElement | null);
      const endTop = endEl ? getElementOffset(endEl) : 0;

      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const cardTop = getElementOffset(card);
        const triggerStart = cardTop - stackPx - p.itemStackDistance * i;
        const triggerEnd = cardTop - scaleEndPx;
        const pinStart = triggerStart;
        const pinEnd = endTop - containerHeight / 2;
        const scaleProgress = calcProgress(scrollTop, triggerStart, triggerEnd);
        const targetScale = p.baseScale + i * p.itemScale;
        const scale = 1 - scaleProgress * (1 - targetScale);
        const rotation = p.rotationAmount ? i * p.rotationAmount * scaleProgress : 0;

        let blur = 0;
        if (p.blurAmount) {
          let topCardIndex = 0;
          for (let j = 0; j < cards.length; j++) {
            const jCardTop = getElementOffset(cards[j]);
            const jTriggerStart = jCardTop - stackPx - p.itemStackDistance * j;
            if (scrollTop >= jTriggerStart) topCardIndex = j;
          }
          if (i < topCardIndex) blur = Math.max(0, (topCardIndex - i) * p.blurAmount);
        }

        let translateY = 0;
        const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isPinned) {
          translateY = scrollTop - cardTop + stackPx + p.itemStackDistance * i;
        } else if (scrollTop > pinEnd) {
          translateY = pinEnd - cardTop + stackPx + p.itemStackDistance * i;
        }

        const next: Transform = {
          translateY: Math.round(translateY * 100) / 100,
          scale: Math.round(scale * 1000) / 1000,
          rotation: Math.round(rotation * 100) / 100,
          blur: Math.round(blur * 100) / 100,
        };
        const last = lastTransforms.get(i);
        const changed =
          !last ||
          Math.abs(last.translateY - next.translateY) > 0.1 ||
          Math.abs(last.scale - next.scale) > 0.001 ||
          Math.abs(last.rotation - next.rotation) > 0.1 ||
          Math.abs(last.blur - next.blur) > 0.1;
        if (changed) {
          card.style.transform = `translate3d(0, ${next.translateY}px, 0) scale(${next.scale}) rotate(${next.rotation}deg)`;
          card.style.filter = next.blur > 0 ? `blur(${next.blur}px)` : "";
          lastTransforms.set(i, next);
        }

        if (i === cards.length - 1) {
          const inView = scrollTop >= pinStart && scrollTop <= pinEnd;
          if (inView && !stackCompleted) {
            stackCompleted = true;
            p.onStackComplete?.();
          } else if (!inView && stackCompleted) {
            stackCompleted = false;
          }
        }
      }
      isUpdating = false;
    };

    const lenis = useWindowScroll
      ? new Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          touchMultiplier: 2,
          infinite: false,
          wheelMultiplier: 1,
          lerp: 0.1,
          syncTouch: true,
          syncTouchLerp: 0.075,
        })
      : new Lenis({
          wrapper: scroller!,
          content: scroller!.querySelector(".scroll-stack-inner") as HTMLElement,
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          touchMultiplier: 2,
          infinite: false,
          gestureOrientation: "vertical",
          wheelMultiplier: 1,
          lerp: 0.1,
          syncTouch: true,
          syncTouchLerp: 0.075,
        });

    lenis.on("scroll", updateCardTransforms);

    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    updateCardTransforms();

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lastTransforms.clear();
      cards = [];
      stackCompleted = false;
      isUpdating = false;
    };
  }, [itemDistance, useWindowScroll]);

  return (
    <div
      ref={scrollerRef}
      className={`relative h-full w-full overflow-x-visible overflow-y-auto ${className ?? ""}`.trim()}
      style={{
        overscrollBehavior: "contain",
        WebkitOverflowScrolling: "touch",
        scrollBehavior: "smooth",
        transform: "translateZ(0)",
        willChange: "scroll-position",
      }}
    >
      <div className="scroll-stack-inner min-h-screen px-20 pt-[20vh] pb-[50rem]">
        {children}
        {/* Spacer so the last pin can release cleanly */}
        <div className="scroll-stack-end h-px w-full" />
      </div>
    </div>
  );
}
