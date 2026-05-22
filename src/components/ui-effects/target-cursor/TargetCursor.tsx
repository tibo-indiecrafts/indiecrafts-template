"use client";

import { gsap } from "gsap";
import * as React from "react";

export interface TargetCursorProps {
  targetSelector?: string;
  spinDuration?: number;
  hideDefaultCursor?: boolean;
  hoverDuration?: number;
  parallaxOn?: boolean;
}

const CORNER_SIZE = 12;
const BORDER_WIDTH = 3;

function subscribeToResize(callback: () => void): () => void {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

function detectMobile(): boolean {
  if (typeof window === "undefined") return false;
  const hasTouchScreen = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth <= 768;
  const userAgent =
    navigator.userAgent ||
    navigator.vendor ||
    (window as unknown as { opera?: string }).opera ||
    "";
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  return (hasTouchScreen && isSmallScreen) || mobileRegex.test(userAgent.toLowerCase());
}

export function TargetCursor({
  targetSelector = ".cursor-target",
  spinDuration = 2,
  hideDefaultCursor = true,
  hoverDuration = 0.2,
  parallaxOn = true,
}: Readonly<TargetCursorProps>) {
  const cursorRef = React.useRef<HTMLDivElement>(null);
  const dotRef = React.useRef<HTMLDivElement>(null);
  const cornersRef = React.useRef<NodeListOf<HTMLDivElement> | null>(null);
  const spinTl = React.useRef<gsap.core.Timeline | null>(null);
  const tickerFnRef = React.useRef<(() => void) | null>(null);
  const targetCornerPositionsRef = React.useRef<{ x: number; y: number }[] | null>(null);
  const activeStrengthRef = React.useRef({ current: 0 });

  // useSyncExternalStore subscribes to window resize so the mobile flag
  // hydrates client-side and updates when the viewport crosses the breakpoint
  // — without using setState-in-effect (forbidden by the project's React 19
  // purity rules; see CLAUDE.md).
  const isMobile = React.useSyncExternalStore(
    subscribeToResize,
    detectMobile,
    () => false,
  );

  React.useEffect(() => {
    if (isMobile) return;
    const cursor = cursorRef.current;
    if (!cursor) return;
    // Stable reference to the strength object for cleanup; the ref itself
    // never changes identity, but the lint wants a local snapshot.
    const strengthObj = activeStrengthRef.current;

    const originalCursor = document.body.style.cursor;
    if (hideDefaultCursor) document.body.style.cursor = "none";

    cornersRef.current = cursor.querySelectorAll<HTMLDivElement>(".target-cursor-corner");

    let activeTarget: Element | null = null;
    let currentLeaveHandler: (() => void) | null = null;
    let resumeTimeout: ReturnType<typeof setTimeout> | null = null;

    const cleanupTarget = (target: Element) => {
      if (currentLeaveHandler) {
        target.removeEventListener("mouseleave", currentLeaveHandler);
      }
      currentLeaveHandler = null;
    };

    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    const createSpinTimeline = () => {
      spinTl.current?.kill();
      spinTl.current = gsap
        .timeline({ repeat: -1 })
        .to(cursor, { rotation: "+=360", duration: spinDuration, ease: "none" });
    };
    createSpinTimeline();

    const tickerFn = () => {
      if (
        !targetCornerPositionsRef.current ||
        !cursorRef.current ||
        !cornersRef.current
      ) {
        return;
      }
      const strength = activeStrengthRef.current.current;
      if (strength === 0) return;
      const cursorX = gsap.getProperty(cursorRef.current, "x") as number;
      const cursorY = gsap.getProperty(cursorRef.current, "y") as number;
      const corners = Array.from(cornersRef.current);
      corners.forEach((corner, i) => {
        const currentX = gsap.getProperty(corner, "x") as number;
        const currentY = gsap.getProperty(corner, "y") as number;
        const targetX = (targetCornerPositionsRef.current?.[i].x ?? 0) - cursorX;
        const targetY = (targetCornerPositionsRef.current?.[i].y ?? 0) - cursorY;
        const finalX = currentX + (targetX - currentX) * strength;
        const finalY = currentY + (targetY - currentY) * strength;
        const duration = strength >= 0.99 ? (parallaxOn ? 0.2 : 0) : 0.05;
        gsap.to(corner, {
          x: finalX,
          y: finalY,
          duration,
          ease: duration === 0 ? "none" : "power1.out",
          overwrite: "auto",
        });
      });
    };
    tickerFnRef.current = tickerFn;

    const moveCursor = (x: number, y: number) => {
      gsap.to(cursor, { x, y, duration: 0.1, ease: "power3.out" });
    };
    const moveHandler = (e: MouseEvent) => moveCursor(e.clientX, e.clientY);
    window.addEventListener("mousemove", moveHandler);

    const scrollHandler = () => {
      if (!activeTarget || !cursorRef.current) return;
      const mouseX = gsap.getProperty(cursorRef.current, "x") as number;
      const mouseY = gsap.getProperty(cursorRef.current, "y") as number;
      const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);
      const stillOver =
        elementUnderMouse &&
        (elementUnderMouse === activeTarget ||
          elementUnderMouse.closest(targetSelector) === activeTarget);
      if (!stillOver) currentLeaveHandler?.();
    };
    window.addEventListener("scroll", scrollHandler, { passive: true });

    const mouseDownHandler = () => {
      if (!dotRef.current) return;
      gsap.to(dotRef.current, { scale: 0.7, duration: 0.3 });
      gsap.to(cursor, { scale: 0.9, duration: 0.2 });
    };
    const mouseUpHandler = () => {
      if (!dotRef.current) return;
      gsap.to(dotRef.current, { scale: 1, duration: 0.3 });
      gsap.to(cursor, { scale: 1, duration: 0.2 });
    };
    window.addEventListener("mousedown", mouseDownHandler);
    window.addEventListener("mouseup", mouseUpHandler);

    const enterHandler = (e: MouseEvent) => {
      let current: Element | null = e.target as Element;
      let target: Element | null = null;
      while (current && current !== document.body) {
        if (current.matches(targetSelector)) {
          target = current;
          break;
        }
        current = current.parentElement;
      }
      if (!target || !cursorRef.current || !cornersRef.current) return;
      if (activeTarget === target) return;
      if (activeTarget) cleanupTarget(activeTarget);
      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
        resumeTimeout = null;
      }

      activeTarget = target;
      const corners = Array.from(cornersRef.current);
      corners.forEach((corner) => gsap.killTweensOf(corner));
      gsap.killTweensOf(cursorRef.current, "rotation");
      spinTl.current?.pause();
      gsap.set(cursorRef.current, { rotation: 0 });

      const rect = target.getBoundingClientRect();
      const cursorX = gsap.getProperty(cursorRef.current, "x") as number;
      const cursorY = gsap.getProperty(cursorRef.current, "y") as number;

      targetCornerPositionsRef.current = [
        { x: rect.left - BORDER_WIDTH, y: rect.top - BORDER_WIDTH },
        {
          x: rect.right + BORDER_WIDTH - CORNER_SIZE,
          y: rect.top - BORDER_WIDTH,
        },
        {
          x: rect.right + BORDER_WIDTH - CORNER_SIZE,
          y: rect.bottom + BORDER_WIDTH - CORNER_SIZE,
        },
        {
          x: rect.left - BORDER_WIDTH,
          y: rect.bottom + BORDER_WIDTH - CORNER_SIZE,
        },
      ];

      gsap.ticker.add(tickerFnRef.current!);
      gsap.to(activeStrengthRef.current, {
        current: 1,
        duration: hoverDuration,
        ease: "power2.out",
      });

      corners.forEach((corner, i) => {
        gsap.to(corner, {
          x: (targetCornerPositionsRef.current?.[i].x ?? 0) - cursorX,
          y: (targetCornerPositionsRef.current?.[i].y ?? 0) - cursorY,
          duration: 0.2,
          ease: "power2.out",
        });
      });

      const leaveHandler = () => {
        if (tickerFnRef.current) gsap.ticker.remove(tickerFnRef.current);
        targetCornerPositionsRef.current = null;
        gsap.set(activeStrengthRef.current, { current: 0, overwrite: true });
        activeTarget = null;
        if (cornersRef.current) {
          const cornerList = Array.from(cornersRef.current);
          gsap.killTweensOf(cornerList);
          const positions = [
            { x: -CORNER_SIZE * 1.5, y: -CORNER_SIZE * 1.5 },
            { x: CORNER_SIZE * 0.5, y: -CORNER_SIZE * 1.5 },
            { x: CORNER_SIZE * 0.5, y: CORNER_SIZE * 0.5 },
            { x: -CORNER_SIZE * 1.5, y: CORNER_SIZE * 0.5 },
          ];
          const tl = gsap.timeline();
          cornerList.forEach((corner, index) => {
            tl.to(
              corner,
              {
                x: positions[index].x,
                y: positions[index].y,
                duration: 0.3,
                ease: "power3.out",
              },
              0,
            );
          });
        }
        resumeTimeout = setTimeout(() => {
          if (!activeTarget && cursorRef.current && spinTl.current) {
            const rotation = gsap.getProperty(cursorRef.current, "rotation") as number;
            const normalized = rotation % 360;
            spinTl.current.kill();
            spinTl.current = gsap.timeline({ repeat: -1 }).to(cursorRef.current, {
              rotation: "+=360",
              duration: spinDuration,
              ease: "none",
            });
            gsap.to(cursorRef.current, {
              rotation: normalized + 360,
              duration: spinDuration * (1 - normalized / 360),
              ease: "none",
              onComplete: () => spinTl.current?.restart(),
            });
          }
          resumeTimeout = null;
        }, 50);
        cleanupTarget(target!);
      };
      currentLeaveHandler = leaveHandler;
      target.addEventListener("mouseleave", leaveHandler);
    };
    window.addEventListener("mouseover", enterHandler);

    return () => {
      if (tickerFnRef.current) gsap.ticker.remove(tickerFnRef.current);
      window.removeEventListener("mousemove", moveHandler);
      window.removeEventListener("mouseover", enterHandler);
      window.removeEventListener("scroll", scrollHandler);
      window.removeEventListener("mousedown", mouseDownHandler);
      window.removeEventListener("mouseup", mouseUpHandler);
      if (resumeTimeout) clearTimeout(resumeTimeout);
      if (activeTarget) cleanupTarget(activeTarget);
      spinTl.current?.kill();
      document.body.style.cursor = originalCursor;
      targetCornerPositionsRef.current = null;
      strengthObj.current = 0;
    };
  }, [
    targetSelector,
    spinDuration,
    hideDefaultCursor,
    isMobile,
    hoverDuration,
    parallaxOn,
  ]);

  if (isMobile) return null;

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[9999] h-0 w-0"
      style={{ willChange: "transform" }}
    >
      <div
        ref={dotRef}
        className="absolute top-1/2 left-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        style={{ willChange: "transform" }}
      />
      <div
        className="target-cursor-corner absolute top-1/2 left-1/2 h-3 w-3 -translate-x-[150%] -translate-y-[150%] border-[3px] border-r-0 border-b-0 border-white"
        style={{ willChange: "transform" }}
      />
      <div
        className="target-cursor-corner absolute top-1/2 left-1/2 h-3 w-3 translate-x-1/2 -translate-y-[150%] border-[3px] border-b-0 border-l-0 border-white"
        style={{ willChange: "transform" }}
      />
      <div
        className="target-cursor-corner absolute top-1/2 left-1/2 h-3 w-3 translate-x-1/2 translate-y-1/2 border-[3px] border-t-0 border-l-0 border-white"
        style={{ willChange: "transform" }}
      />
      <div
        className="target-cursor-corner absolute top-1/2 left-1/2 h-3 w-3 -translate-x-[150%] translate-y-1/2 border-[3px] border-t-0 border-r-0 border-white"
        style={{ willChange: "transform" }}
      />
    </div>
  );
}
