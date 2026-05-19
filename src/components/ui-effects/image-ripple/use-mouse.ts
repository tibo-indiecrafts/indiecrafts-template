"use client";

import * as React from "react";

export function useMouse() {
  const [mouse, setMouse] = React.useState({ x: 0, y: 0, pixelRatio: 1 });

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const onMove = (e: MouseEvent) => {
      setMouse({
        x: e.clientX,
        y: e.clientY,
        pixelRatio: Math.min(window.devicePixelRatio, 2),
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return mouse;
}
