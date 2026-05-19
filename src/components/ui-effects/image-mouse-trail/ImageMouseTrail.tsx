/* eslint-disable @typescript-eslint/ban-ts-comment -- ts-nocheck below */
// @ts-nocheck -- ui-layouts upstream; DOM-event + ref type quirks accepted as-is.
"use client";
/* eslint-disable @next/next/no-img-element, jsx-a11y/no-static-element-interactions -- ui-layouts upstream; decorative mouse-tracking surface */

import * as React from "react";

import { cn } from "@/lib/utils";

export interface ImageMouseTrailProps {
  items: string[];
  children?: React.ReactNode;
  className?: string;
  imgClass?: string;
  distance?: number;
  maxNumberOfImages?: number;
  fadeAnimation?: boolean;
}

export default function ImageMouseTrail({
  items,
  children,
  className,
  maxNumberOfImages = 5,
  imgClass = "w-40 h-48",
  distance = 20,
  fadeAnimation = false,
}: Readonly<ImageMouseTrailProps>) {
  const containerRef = React.useRef<HTMLElement>(null);
  const itemRefs = React.useRef<(HTMLImageElement | null)[]>([]);
  const currentZIndexRef = React.useRef(1);
  const globalIndexRef = React.useRef(0);
  const lastRef = React.useRef({ x: 0, y: 0 });

  const activate = (image: HTMLImageElement, x: number, y: number) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    image.style.left = `${x - containerRect.left}px`;
    image.style.top = `${y - containerRect.top}px`;

    if (currentZIndexRef.current > 40) {
      currentZIndexRef.current = 1;
    }
    image.style.zIndex = String(currentZIndexRef.current);
    currentZIndexRef.current++;

    image.dataset.status = "active";
    if (fadeAnimation) {
      setTimeout(() => {
        image.dataset.status = "inactive";
      }, 1500);
    }
    lastRef.current = { x, y };
  };

  const distanceFromLast = (x: number, y: number) =>
    Math.hypot(x - lastRef.current.x, y - lastRef.current.y);

  const deactivate = (image: HTMLImageElement) => {
    image.dataset.status = "inactive";
  };

  const handleOnMove = (point: { clientX: number; clientY: number }) => {
    if (distanceFromLast(point.clientX, point.clientY) > window.innerWidth / distance) {
      const total = itemRefs.current.length;
      if (total === 0) return;
      const lead = itemRefs.current[globalIndexRef.current % total];
      const tailIdx =
        (((globalIndexRef.current - maxNumberOfImages) % total) + total) % total;
      const tail = itemRefs.current[tailIdx];

      if (lead) activate(lead, point.clientX, point.clientY);
      if (tail && globalIndexRef.current >= maxNumberOfImages) deactivate(tail);
      globalIndexRef.current++;
    }
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={(e) => handleOnMove(e)}
      onTouchMove={(e) => handleOnMove(e.touches[0])}
      className={cn(
        "relative grid h-[600px] w-full place-content-center overflow-hidden rounded-lg bg-[#e0dfdf]",
        className,
      )}
    >
      {items.map((item, index) => (
        <img
          key={`${index}-${item}`}
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          data-index={index}
          data-status="inactive"
          src={item}
          alt=""
          className={cn(
            "absolute -translate-x-1/2 -translate-y-1/2 scale-0 object-cover opacity-0 transition-transform duration-300",
            "data-[status='active']:ease-out-expo data-[status='active']:scale-100 data-[status='active']:opacity-100 data-[status='active']:duration-500",
            imgClass,
          )}
        />
      ))}
      {children}
    </section>
  );
}
