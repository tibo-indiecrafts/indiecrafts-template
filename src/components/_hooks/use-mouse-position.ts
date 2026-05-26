"use client";

import * as React from "react";

export function useMousePosition(
  containerRef?: React.RefObject<HTMLElement | SVGElement | null>,
) {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    // Seed to container center on mount so the rendered pointer isn't stuck
    // in the top-left corner (where overflow-hidden clips it) until the user
    // moves the mouse.
    if (containerRef?.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({ x: rect.width / 2, y: rect.height / 2 });
    }

    const update = (x: number, y: number) => {
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setPosition({ x: x - rect.left, y: y - rect.top });
      } else {
        setPosition({ x, y });
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

  return position;
}
