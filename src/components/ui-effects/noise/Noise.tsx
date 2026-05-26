"use client";

import * as React from "react";

export interface NoiseProps {
  /** Pixel size of the source noise tile drawn into the canvas. */
  patternSize?: number;
  /** Horizontal scale applied via CSS `background-size`. */
  patternScaleX?: number;
  /** Vertical scale applied via CSS `background-size`. */
  patternScaleY?: number;
  /** Repaint every Nth frame (higher = slower regeneration). */
  patternRefreshInterval?: number;
  /** Alpha (0–255) baked into every noise pixel. */
  patternAlpha?: number;
  className?: string;
}

export function Noise({
  patternSize = 250,
  patternScaleX = 1,
  patternScaleY = 1,
  patternRefreshInterval = 2,
  patternAlpha = 15,
  className,
}: Readonly<NoiseProps>) {
  const grainRef = React.useRef<HTMLCanvasElement>(null);

  // Hot props for the rAF loop so we don't tear down and re-create the canvas
  // each prop change.
  const propsRef = React.useRef({ patternRefreshInterval, patternAlpha });
  React.useLayoutEffect(() => {
    propsRef.current = { patternRefreshInterval, patternAlpha };
  });

  React.useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    canvas.width = patternSize;
    canvas.height = patternSize;

    let frame = 0;
    let animationId = 0;

    const drawGrain = () => {
      const imageData = ctx.createImageData(patternSize, patternSize);
      const data = imageData.data;
      const alpha = propsRef.current.patternAlpha;
      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = alpha;
      }
      ctx.putImageData(imageData, 0, 0);
    };

    const loop = () => {
      const interval = Math.max(1, propsRef.current.patternRefreshInterval);
      if (frame % interval === 0) drawGrain();
      frame++;
      animationId = window.requestAnimationFrame(loop);
    };

    drawGrain();
    animationId = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(animationId);
    };
  }, [patternSize]);

  // CSS stretches the patternSize×patternSize canvas across the host. The
  // patternScale props bias the rendered tile size: scale > 1 makes the noise
  // look chunkier (each source pixel covers more screen real estate), scale
  // < 1 makes it finer.
  const widthPct = 100 * patternScaleX;
  const heightPct = 100 * patternScaleY;

  return (
    <canvas
      ref={grainRef}
      className={`pointer-events-none absolute top-0 left-0 ${className ?? ""}`}
      style={{
        imageRendering: "pixelated",
        width: `${widthPct}%`,
        height: `${heightPct}%`,
      }}
    />
  );
}
