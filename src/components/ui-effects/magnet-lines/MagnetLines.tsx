"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

export type MagnetLinesProps = {
  rows?: number;
  columns?: number;
  containerSize?: string;
  /** Defaults to `currentColor` so the field inherits the surrounding text color. */
  lineColor?: string;
  lineWidth?: string;
  lineHeight?: string;
  /** Resting rotation when the cursor is outside the viewport or motion is reduced. */
  baseAngle?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Grid of small lines that point toward the cursor — a magnetic-field effect.
 * Each cell rotates to track the angle from its center to the pointer.
 *
 * Honors `prefers-reduced-motion`: lines stay at `baseAngle` when set.
 */
export function MagnetLines({
  rows = 9,
  columns = 9,
  containerSize = "80vmin",
  lineColor = "currentColor",
  lineWidth = "1vmin",
  lineHeight = "6vmin",
  baseAngle = -10,
  className,
  style,
}: Readonly<MagnetLinesProps>) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = container.querySelectorAll<HTMLSpanElement>("span");

    const orient = (px: number, py: number) => {
      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const cx = rect.x + rect.width / 2;
        const cy = rect.y + rect.height / 2;
        const dx = px - cx;
        const dy = py - cy;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const angle = ((Math.acos(dx / dist) * 180) / Math.PI) * (py > cy ? 1 : -1);
        item.style.setProperty("--rotate", `${angle}deg`);
      });
    };

    const onPointer = (e: PointerEvent) => orient(e.clientX, e.clientY);
    window.addEventListener("pointermove", onPointer);

    // Seed orientation aimed at the middle cell so the field has shape
    // on first paint, before the user moves the cursor.
    if (items.length > 0) {
      const middle = items[Math.floor(items.length / 2)].getBoundingClientRect();
      orient(middle.x, middle.y);
    }

    return () => window.removeEventListener("pointermove", onPointer);
  }, [rows, columns]);

  const lineStyle = {
    backgroundColor: lineColor,
    width: lineWidth,
    height: lineHeight,
    "--rotate": `${baseAngle}deg`,
    transform: "rotate(var(--rotate))",
    willChange: "transform",
  } as CSSProperties;

  return (
    <div
      ref={containerRef}
      className={cn("grid place-items-center", className)}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        width: containerSize,
        height: containerSize,
        ...style,
      }}
      aria-hidden="true"
    >
      {Array.from({ length: rows * columns }, (_, i) => (
        <span key={i} className="block origin-center" style={lineStyle} />
      ))}
    </div>
  );
}

export default MagnetLines;
