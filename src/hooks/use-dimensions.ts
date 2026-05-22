"use client";

import * as React from "react";

export interface Dimensions {
  width: number;
  height: number;
}

export function useDimensions(
  ref: React.RefObject<HTMLElement | SVGElement | null>,
): Dimensions {
  const [dimensions, setDimensions] = React.useState<Dimensions>({
    width: 0,
    height: 0,
  });

  React.useEffect(() => {
    const update = () => {
      if (ref.current) {
        const { width, height } = ref.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [ref]);

  return dimensions;
}
