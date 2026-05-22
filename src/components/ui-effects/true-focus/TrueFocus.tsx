"use client";

import { motion } from "motion/react";
import * as React from "react";

export interface TrueFocusProps {
  sentence?: string;
  separator?: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
  className?: string;
}

interface FocusRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function TrueFocus({
  sentence = "True Focus",
  separator = " ",
  manualMode = false,
  blurAmount = 5,
  borderColor = "green",
  glowColor = "rgba(0, 255, 0, 0.6)",
  animationDuration = 0.5,
  pauseBetweenAnimations = 1,
  className,
}: Readonly<TrueFocusProps>) {
  const words = React.useMemo(() => sentence.split(separator), [sentence, separator]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [lastActiveIndex, setLastActiveIndex] = React.useState<number | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const wordRefs = React.useRef<(HTMLElement | null)[]>([]);
  const [focusRect, setFocusRect] = React.useState<FocusRect>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  React.useEffect(() => {
    if (manualMode) return;
    const interval = setInterval(
      () => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
      },
      (animationDuration + pauseBetweenAnimations) * 1000,
    );
    return () => clearInterval(interval);
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

  React.useEffect(() => {
    if (currentIndex < 0) return;
    const activeEl = wordRefs.current[currentIndex];
    const container = containerRef.current;
    if (!activeEl || !container) return;
    const parentRect = container.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();
    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height,
    });
  }, [currentIndex, words.length]);

  const handleMouseEnter = (index: number) => {
    if (!manualMode) return;
    setLastActiveIndex(index);
    setCurrentIndex(index);
  };

  const handleMouseLeave = () => {
    if (!manualMode) return;
    if (lastActiveIndex !== null) setCurrentIndex(lastActiveIndex);
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-wrap items-center justify-center gap-4 ${className ?? ""}`}
      style={{ outline: "none", userSelect: "none" }}
    >
      {words.map((word, index) => {
        const isActive = index === currentIndex;
        const sharedStyle: React.CSSProperties = {
          filter: isActive ? "blur(0px)" : `blur(${blurAmount}px)`,
          transition: `filter ${animationDuration}s ease`,
          outline: "none",
          userSelect: "none",
        };
        const sharedClass = "relative cursor-pointer text-[3rem] font-black";

        // In manualMode each word is interactive (hover/focus to focus it);
        // otherwise it's purely decorative and rotates on a timer.
        if (manualMode) {
          return (
            <button
              key={index}
              type="button"
              ref={(el) => {
                wordRefs.current[index] = el;
              }}
              className={`${sharedClass} bg-transparent p-0`}
              style={sharedStyle}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              onFocus={() => handleMouseEnter(index)}
              onBlur={handleMouseLeave}
            >
              {word}
            </button>
          );
        }
        return (
          <span
            key={index}
            ref={(el) => {
              wordRefs.current[index] = el;
            }}
            className={sharedClass}
            style={sharedStyle}
          >
            {word}
          </span>
        );
      })}

      <motion.div
        className="pointer-events-none absolute top-0 left-0 box-border border-0"
        animate={{
          x: focusRect.x,
          y: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
          opacity: currentIndex >= 0 ? 1 : 0,
        }}
        transition={{ duration: animationDuration }}
        style={
          {
            "--border-color": borderColor,
            "--glow-color": glowColor,
          } as React.CSSProperties
        }
      >
        <span
          className="absolute top-[-10px] left-[-10px] h-4 w-4 rounded-[3px] border-[3px] border-r-0 border-b-0"
          style={{
            borderColor: "var(--border-color)",
            filter: "drop-shadow(0 0 4px var(--border-color))",
          }}
        />
        <span
          className="absolute top-[-10px] right-[-10px] h-4 w-4 rounded-[3px] border-[3px] border-b-0 border-l-0"
          style={{
            borderColor: "var(--border-color)",
            filter: "drop-shadow(0 0 4px var(--border-color))",
          }}
        />
        <span
          className="absolute bottom-[-10px] left-[-10px] h-4 w-4 rounded-[3px] border-[3px] border-t-0 border-r-0"
          style={{
            borderColor: "var(--border-color)",
            filter: "drop-shadow(0 0 4px var(--border-color))",
          }}
        />
        <span
          className="absolute right-[-10px] bottom-[-10px] h-4 w-4 rounded-[3px] border-[3px] border-t-0 border-l-0"
          style={{
            borderColor: "var(--border-color)",
            filter: "drop-shadow(0 0 4px var(--border-color))",
          }}
        />
      </motion.div>
    </div>
  );
}
