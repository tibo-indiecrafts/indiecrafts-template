"use client";

import * as React from "react";

export function useMousePositionRef(
  containerRef?: React.RefObject<HTMLElement | SVGElement | null>,
) {
  const positionRef = React.useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    const update = (x: number, y: number) => {
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        positionRef.current = { x: x - rect.left, y: y - rect.top };
      } else {
        positionRef.current = { x, y };
      }
    };

    const onMouseMove = (ev: MouseEvent) => update(ev.clientX, ev.clientY);
    const onTouchMove = (ev: TouchEvent) => {
      const touch = ev.touches[0];
      if (touch) update(touch.clientX, touch.clientY);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [containerRef]);

  return positionRef;
}
