"use client";

import { gsap } from "gsap";
import * as React from "react";

import { useMedia } from "@/hooks/use-media";

export interface MasonryItem {
  id: string;
  img: string;
  url: string;
  height: number;
}

export interface MasonryProps {
  items: MasonryItem[];
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: "bottom" | "top" | "left" | "right" | "center" | "random";
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
  className?: string;
}

interface GridItem extends MasonryItem {
  x: number;
  y: number;
  w: number;
  h: number;
}

function useMeasure<T extends HTMLElement>() {
  const ref = React.useRef<T | null>(null);
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  React.useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, size] as const;
}

async function preloadImages(urls: string[]): Promise<void> {
  await Promise.all(
    urls.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = img.onerror = () => resolve();
        }),
    ),
  );
}

function useColumns() {
  const xl = useMedia("(min-width:1500px)");
  const lg = useMedia("(min-width:1000px)");
  const md = useMedia("(min-width:600px)");
  const sm = useMedia("(min-width:400px)");
  if (xl) return 5;
  if (lg) return 4;
  if (md) return 3;
  if (sm) return 2;
  return 1;
}

export function Masonry({
  items,
  ease = "power3.out",
  duration = 0.6,
  stagger = 0.05,
  animateFrom = "bottom",
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
  className,
}: Readonly<MasonryProps>) {
  const columns = useColumns();
  const [containerRef, { width }] = useMeasure<HTMLDivElement>();
  const [imagesReady, setImagesReady] = React.useState(false);
  const hasMounted = React.useRef(false);

  React.useEffect(() => {
    let cancelled = false;
    preloadImages(items.map((i) => i.img)).then(() => {
      if (!cancelled) setImagesReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [items]);

  const { grid, gridHeight } = React.useMemo<{
    grid: GridItem[];
    gridHeight: number;
  }>(() => {
    if (!width) return { grid: [], gridHeight: 0 };
    const colHeights = new Array(columns).fill(0);
    const gap = 16;
    const totalGaps = (columns - 1) * gap;
    const columnWidth = (width - totalGaps) / columns;
    const placed = items.map((child) => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = col * (columnWidth + gap);
      const height = child.height / 2;
      const y = colHeights[col];
      colHeights[col] += height + gap;
      return { ...child, x, y, w: columnWidth, h: height };
    });
    // Tallest column dictates the container height; subtract the trailing gap.
    const tallest = Math.max(0, ...colHeights) - gap;
    return { grid: placed, gridHeight: Math.max(0, tallest) };
  }, [columns, items, width]);

  React.useLayoutEffect(() => {
    if (!imagesReady) return;
    const container = containerRef.current;
    if (!container) return;

    const getInitialPosition = (item: GridItem) => {
      const rect = container.getBoundingClientRect();
      let direction = animateFrom;
      if (animateFrom === "random") {
        const dirs = ["top", "bottom", "left", "right"] as const;
        direction = dirs[Math.floor(Math.random() * dirs.length)];
      }
      switch (direction) {
        case "top":
          return { x: item.x, y: -200 };
        case "bottom":
          return { x: item.x, y: window.innerHeight + 200 };
        case "left":
          return { x: -200, y: item.y };
        case "right":
          return { x: window.innerWidth + 200, y: item.y };
        case "center":
          return {
            x: rect.width / 2 - item.w / 2,
            y: rect.height / 2 - item.h / 2,
          };
        default:
          return { x: item.x, y: item.y + 100 };
      }
    };

    grid.forEach((item, index) => {
      const selector = `[data-masonry-key="${item.id}"]`;
      const animProps = { x: item.x, y: item.y, width: item.w, height: item.h };
      if (!hasMounted.current) {
        const start = getInitialPosition(item);
        gsap.fromTo(
          selector,
          {
            opacity: 0,
            x: start.x,
            y: start.y,
            width: item.w,
            height: item.h,
            ...(blurToFocus && { filter: "blur(10px)" }),
          },
          {
            opacity: 1,
            ...animProps,
            ...(blurToFocus && { filter: "blur(0px)" }),
            duration: 0.8,
            ease: "power3.out",
            delay: index * stagger,
          },
        );
      } else {
        gsap.to(selector, {
          ...animProps,
          duration,
          ease,
          overwrite: "auto",
        });
      }
    });
    hasMounted.current = true;
  }, [
    grid,
    imagesReady,
    stagger,
    animateFrom,
    blurToFocus,
    duration,
    ease,
    containerRef,
  ]);

  const handleMouseEnter = (id: string, element: HTMLElement) => {
    if (scaleOnHover) {
      gsap.to(`[data-masonry-key="${id}"]`, {
        scale: hoverScale,
        duration: 0.3,
        ease: "power2.out",
      });
    }
    if (colorShiftOnHover) {
      const overlay = element.querySelector(".color-overlay") as HTMLElement | null;
      if (overlay) gsap.to(overlay, { opacity: 0.3, duration: 0.3 });
    }
  };

  const handleMouseLeave = (id: string, element: HTMLElement) => {
    if (scaleOnHover) {
      gsap.to(`[data-masonry-key="${id}"]`, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }
    if (colorShiftOnHover) {
      const overlay = element.querySelector(".color-overlay") as HTMLElement | null;
      if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3 });
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className ?? ""}`}
      style={{ height: gridHeight || undefined }}
    >
      {grid.map((item) => (
        <button
          key={item.id}
          data-masonry-key={item.id}
          type="button"
          aria-label={`Open ${item.url}`}
          className="absolute box-content cursor-pointer border-0 bg-transparent p-0"
          style={{ willChange: "transform, width, height, opacity" }}
          onClick={() => window.open(item.url, "_blank", "noopener")}
          onMouseEnter={(e) => handleMouseEnter(item.id, e.currentTarget)}
          onMouseLeave={(e) => handleMouseLeave(item.id, e.currentTarget)}
        >
          <div
            className="relative h-full w-full rounded-[10px] bg-cover bg-center text-[10px] leading-[10px] uppercase shadow-[0px_10px_50px_-10px_rgba(0,0,0,0.2)]"
            style={{ backgroundImage: `url(${item.img})` }}
          >
            {colorShiftOnHover && (
              <div className="color-overlay pointer-events-none absolute inset-0 rounded-[10px] bg-gradient-to-tr from-pink-500/50 to-sky-500/50 opacity-0" />
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
