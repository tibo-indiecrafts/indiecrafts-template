"use client";

import { motion, useSpring, useTransform, type SpringOptions } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

export type SpotlightProps = {
  className?: string;
  size?: number;
  springOptions?: SpringOptions;
};

export function Spotlight({
  className,
  size = 200,
  springOptions = { bounce: 0 },
}: Readonly<SpotlightProps>) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);

  const mouseX = useSpring(0, springOptions);
  const mouseY = useSpring(0, springOptions);

  const spotlightLeft = useTransform(mouseX, (x) => `${x - size / 2}px`);
  const spotlightTop = useTransform(mouseY, (y) => `${y - size / 2}px`);

  React.useEffect(() => {
    const parent = containerRef.current?.parentElement;
    if (!parent) return;

    parent.style.position = "relative";
    parent.style.overflow = "hidden";

    const ac = new AbortController();

    parent.addEventListener(
      "mousemove",
      (e: MouseEvent) => {
        const { left, top } = parent.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
      },
      { signal: ac.signal },
    );
    parent.addEventListener("mouseenter", () => setIsHovered(true), {
      signal: ac.signal,
    });
    parent.addEventListener("mouseleave", () => setIsHovered(false), {
      signal: ac.signal,
    });

    return () => ac.abort();
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        "spotlight-glow pointer-events-none absolute rounded-full blur-xl transition-opacity duration-200",
        isHovered ? "opacity-100" : "opacity-0",
        className,
      )}
      style={{
        width: size,
        height: size,
        left: spotlightLeft,
        top: spotlightTop,
      }}
    />
  );
}
