"use client";

import * as React from "react";

export interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out";
  extraScale?: number;
  children?: React.ReactNode;
  className?: string;
}

interface Spark {
  x: number;
  y: number;
  angle: number;
  startTime: number;
}

function easeFn(name: ClickSparkProps["easing"], t: number) {
  switch (name) {
    case "linear":
      return t;
    case "ease-in":
      return t * t;
    case "ease-in-out":
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    default:
      return t * (2 - t); // ease-out
  }
}

export function ClickSpark({
  sparkColor = "#fff",
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = "ease-out",
  extraScale = 1.0,
  children,
  className,
}: Readonly<ClickSparkProps>) {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const sparksRef = React.useRef<Spark[]>([]);

  // Hot props for the rAF loop so live edits don't restart the animation.
  const propsRef = React.useRef({
    sparkColor,
    sparkSize,
    sparkRadius,
    sparkCount,
    duration,
    easing,
    extraScale,
  });
  React.useLayoutEffect(() => {
    propsRef.current = {
      sparkColor,
      sparkSize,
      sparkRadius,
      sparkCount,
      duration,
      easing,
      extraScale,
    };
  });

  React.useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const resizeCanvas = () => {
      const { width, height } = wrapper.getBoundingClientRect();
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 100);
    };
    const ro = new ResizeObserver(handleResize);
    ro.observe(wrapper);
    resizeCanvas();

    // Click listener attached imperatively so the wrapper <div> doesn't
    // attract jsx-a11y/click-events-have-key-events. The spark is purely
    // decorative — child interactive elements keep their native keyboard
    // semantics, and bubbling means we still see clicks on them.
    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const now = performance.now();
      const count = propsRef.current.sparkCount;
      for (let i = 0; i < count; i++) {
        sparksRef.current.push({
          x,
          y,
          angle: (2 * Math.PI * i) / count,
          startTime: now,
        });
      }
    };
    wrapper.addEventListener("click", onClick);

    let rafId = 0;
    const draw = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const p = propsRef.current;
      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= p.duration) return false;
        const progress = elapsed / p.duration;
        const eased = easeFn(p.easing, progress);
        const distance = eased * p.sparkRadius * p.extraScale;
        const lineLength = p.sparkSize * (1 - eased);
        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);
        ctx.strokeStyle = p.sparkColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        return true;
      });
      rafId = requestAnimationFrame(draw);
    };
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimeout);
      ro.disconnect();
      wrapper.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={`relative h-full w-full ${className ?? ""}`}>
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" />
      {children}
    </div>
  );
}
