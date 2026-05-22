"use client";

import { gsap } from "gsap";
import * as React from "react";

export interface GridMotionProps {
  items?: (string | React.ReactNode)[];
  gradientColor?: string;
  className?: string;
}

const TOTAL_ITEMS = 28;
const INERTIA_FACTORS = [0.6, 0.4, 0.3, 0.2];
const MAX_MOVE_AMOUNT = 300;
const BASE_DURATION = 0.8;

export function GridMotion({
  items = [],
  gradientColor = "black",
  className,
}: Readonly<GridMotionProps>) {
  const rowRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const mouseXRef = React.useRef<number | null>(null);

  const defaultItems = React.useMemo(
    () => Array.from({ length: TOTAL_ITEMS }, (_, i) => `Item ${i + 1}`),
    [],
  );
  const combinedItems = items.length > 0 ? items.slice(0, TOTAL_ITEMS) : defaultItems;

  React.useEffect(() => {
    mouseXRef.current = window.innerWidth / 2;
    gsap.ticker.lagSmoothing(0);

    const handleMouseMove = (e: MouseEvent) => {
      mouseXRef.current = e.clientX;
    };

    const updateMotion = () => {
      const mouseX = mouseXRef.current ?? window.innerWidth / 2;
      rowRefs.current.forEach((row, index) => {
        if (!row) return;
        const direction = index % 2 === 0 ? 1 : -1;
        const moveAmount =
          ((mouseX / window.innerWidth) * MAX_MOVE_AMOUNT - MAX_MOVE_AMOUNT / 2) *
          direction;
        gsap.to(row, {
          x: moveAmount,
          duration: BASE_DURATION + INERTIA_FACTORS[index % INERTIA_FACTORS.length],
          ease: "power3.out",
          overwrite: "auto",
        });
      });
    };

    const removeAnimationLoop = gsap.ticker.add(updateMotion);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      removeAnimationLoop();
    };
  }, []);

  return (
    <div className={`h-full w-full overflow-hidden ${className ?? ""}`}>
      <section
        className="relative flex h-screen w-full items-center justify-center overflow-hidden"
        style={{
          background: `radial-gradient(circle, ${gradientColor} 0%, transparent 100%)`,
        }}
      >
        <div className="pointer-events-none absolute inset-0 z-[4] bg-[length:250px]" />
        <div className="relative z-[2] grid h-[150vh] w-[150vw] flex-none origin-center rotate-[-15deg] grid-cols-1 grid-rows-4 gap-4">
          {Array.from({ length: 4 }, (_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-7 gap-4"
              style={{ willChange: "transform, filter" }}
              ref={(el) => {
                rowRefs.current[rowIndex] = el;
              }}
            >
              {Array.from({ length: 7 }, (_, itemIndex) => {
                const content = combinedItems[rowIndex * 7 + itemIndex];
                return (
                  <div key={itemIndex} className="relative">
                    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[10px] bg-[#111] text-[1.5rem] text-white">
                      {typeof content === "string" && content.startsWith("http") ? (
                        <div
                          className="absolute top-0 left-0 h-full w-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${content})` }}
                        />
                      ) : (
                        <div className="z-[1] p-4 text-center">{content}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="pointer-events-none relative top-0 left-0 h-full w-full" />
      </section>
    </div>
  );
}
