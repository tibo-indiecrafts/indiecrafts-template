"use client";

import gsap from "gsap";
import * as React from "react";

export interface BlobCursorProps {
  blobType?: "circle" | "square";
  fillColor?: string;
  trailCount?: number;
  sizes?: number[];
  innerSizes?: number[];
  innerColor?: string;
  opacities?: number[];
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  filterId?: string;
  filterStdDeviation?: number;
  filterColorMatrixValues?: string;
  useFilter?: boolean;
  fastDuration?: number;
  slowDuration?: number;
  fastEase?: string;
  slowEase?: string;
  zIndex?: number;
  className?: string;
}

export function BlobCursor({
  blobType = "circle",
  fillColor = "#5227FF",
  trailCount = 3,
  sizes = [60, 125, 75],
  innerSizes = [20, 35, 25],
  innerColor = "rgba(255,255,255,0.8)",
  opacities = [0.6, 0.6, 0.6],
  shadowColor = "rgba(0,0,0,0.75)",
  shadowBlur = 5,
  shadowOffsetX = 10,
  shadowOffsetY = 10,
  filterId,
  filterStdDeviation = 30,
  filterColorMatrixValues = "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 35 -10",
  useFilter = true,
  fastDuration = 0.1,
  slowDuration = 0.5,
  fastEase = "power3.out",
  slowEase = "power1.out",
  zIndex = 100,
  className,
}: Readonly<BlobCursorProps>) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const blobsRef = React.useRef<(HTMLDivElement | null)[]>([]);
  // Unique SVG filter id per instance; consumers can still override via prop.
  const autoId = React.useId();
  const effectiveFilterId = filterId ?? `blob-${autoId.replace(/:/g, "")}`;

  const handleMove = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = "clientX" in e ? e.clientX : e.touches[0].clientX;
    const y = "clientY" in e ? e.clientY : e.touches[0].clientY;
    for (let i = 0; i < blobsRef.current.length; i++) {
      const el = blobsRef.current[i];
      if (!el) continue;
      const isLead = i === 0;
      gsap.to(el, {
        x: x - rect.left,
        y: y - rect.top,
        duration: isLead ? fastDuration : slowDuration,
        ease: isLead ? fastEase : slowEase,
      });
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMove}
      onTouchMove={handleMove}
      className={`relative top-0 left-0 h-full w-full ${className ?? ""}`}
      style={{ zIndex }}
    >
      {useFilter && (
        <svg className="absolute h-0 w-0">
          <filter id={effectiveFilterId}>
            <feGaussianBlur
              in="SourceGraphic"
              result="blur"
              stdDeviation={filterStdDeviation}
            />
            <feColorMatrix in="blur" values={filterColorMatrixValues} />
          </filter>
        </svg>
      )}

      <div
        className="pointer-events-none absolute inset-0 cursor-default overflow-hidden select-none"
        style={{ filter: useFilter ? `url(#${effectiveFilterId})` : undefined }}
      >
        {Array.from({ length: trailCount }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              blobsRef.current[i] = el;
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 transform will-change-transform"
            style={{
              width: sizes[i],
              height: sizes[i],
              borderRadius: blobType === "circle" ? "50%" : "0",
              backgroundColor: fillColor,
              opacity: opacities[i],
              boxShadow: `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px 0 ${shadowColor}`,
            }}
          >
            <div
              className="absolute"
              style={{
                width: innerSizes[i],
                height: innerSizes[i],
                top: (sizes[i] - innerSizes[i]) / 2,
                left: (sizes[i] - innerSizes[i]) / 2,
                backgroundColor: innerColor,
                borderRadius: blobType === "circle" ? "50%" : "0",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
