"use client";

import { gsap } from "gsap";
import * as React from "react";

export interface PixelTransitionProps {
  firstContent: React.ReactNode;
  secondContent: React.ReactNode;
  gridSize?: number;
  pixelColor?: string;
  animationStepDuration?: number;
  once?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /** Padding-top trick to lock an aspect ratio. Defaults to `100%` (square). */
  aspectRatio?: string;
}

function subscribeMatchMedia(query: string, cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mm = window.matchMedia(query);
  mm.addEventListener("change", cb);
  return () => mm.removeEventListener("change", cb);
}

function useIsTouch(): boolean {
  // SSR-safe — `useSyncExternalStore` ensures the initial render returns the
  // server snapshot (`false`) then hydrates to the real value on mount.
  return React.useSyncExternalStore(
    (cb) => subscribeMatchMedia("(pointer: coarse)", cb),
    () => {
      if (typeof window === "undefined") return false;
      return (
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches
      );
    },
    () => false,
  );
}

export function PixelTransition({
  firstContent,
  secondContent,
  gridSize = 7,
  pixelColor = "currentColor",
  animationStepDuration = 0.3,
  once = false,
  aspectRatio = "100%",
  className,
  style,
}: Readonly<PixelTransitionProps>) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const pixelGridRef = React.useRef<HTMLDivElement>(null);
  const activeRef = React.useRef<HTMLDivElement>(null);
  const delayedCallRef = React.useRef<gsap.core.Tween | null>(null);
  const [isActive, setIsActive] = React.useState(false);
  const isTouch = useIsTouch();

  React.useEffect(() => {
    const pixelGridEl = pixelGridRef.current;
    if (!pixelGridEl) return;
    pixelGridEl.innerHTML = "";
    const size = 100 / gridSize;
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const pixel = document.createElement("div");
        pixel.classList.add("pixelated-image-card__pixel", "absolute", "hidden");
        pixel.style.backgroundColor = pixelColor;
        pixel.style.width = `${size}%`;
        pixel.style.height = `${size}%`;
        pixel.style.left = `${col * size}%`;
        pixel.style.top = `${row * size}%`;
        pixelGridEl.appendChild(pixel);
      }
    }
  }, [gridSize, pixelColor]);

  const animatePixels = (activate: boolean) => {
    setIsActive(activate);
    const pixelGridEl = pixelGridRef.current;
    const activeEl = activeRef.current;
    if (!pixelGridEl || !activeEl) return;
    const pixels = pixelGridEl.querySelectorAll<HTMLDivElement>(
      ".pixelated-image-card__pixel",
    );
    if (!pixels.length) return;

    gsap.killTweensOf(pixels);
    delayedCallRef.current?.kill();
    gsap.set(pixels, { display: "none" });
    const staggerDuration = animationStepDuration / pixels.length;

    gsap.to(pixels, {
      display: "block",
      duration: 0,
      stagger: { each: staggerDuration, from: "random" },
    });
    delayedCallRef.current = gsap.delayedCall(animationStepDuration, () => {
      activeEl.style.display = activate ? "block" : "none";
      activeEl.style.pointerEvents = activate ? "none" : "";
    });
    gsap.to(pixels, {
      display: "none",
      duration: 0,
      delay: animationStepDuration,
      stagger: { each: staggerDuration, from: "random" },
    });
  };

  const handleEnter = () => {
    if (!isActive) animatePixels(true);
  };
  const handleLeave = () => {
    if (isActive && !once) animatePixels(false);
  };
  const handleToggle = () => {
    if (!isActive) animatePixels(true);
    else if (!once) animatePixels(false);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div
      ref={containerRef}
      role="button"
      tabIndex={0}
      className={`relative w-[300px] max-w-full overflow-hidden rounded-[15px] border-2 border-white bg-[#222] text-white ${className ?? ""}`}
      style={style}
      onMouseEnter={!isTouch ? handleEnter : undefined}
      onMouseLeave={!isTouch ? handleLeave : undefined}
      onClick={isTouch ? handleToggle : undefined}
      onKeyDown={handleKeyDown}
      onFocus={!isTouch ? handleEnter : undefined}
      onBlur={!isTouch ? handleLeave : undefined}
    >
      <div style={{ paddingTop: aspectRatio }} />
      <div className="absolute inset-0 h-full w-full" aria-hidden={isActive}>
        {firstContent}
      </div>
      <div
        ref={activeRef}
        className="absolute inset-0 z-[2] h-full w-full"
        style={{ display: "none" }}
        aria-hidden={!isActive}
      >
        {secondContent}
      </div>
      <div
        ref={pixelGridRef}
        className="pointer-events-none absolute inset-0 z-[3] h-full w-full"
      />
    </div>
  );
}
