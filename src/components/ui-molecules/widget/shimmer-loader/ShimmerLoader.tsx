"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface ShimmerLoaderProps {
  labels: string[];
  icons: string[];
  duration: number;
  tokenTarget?: number;
  showPercent?: boolean;
  onComplete?: () => void;
  className?: string;
}

export function ShimmerLoader({
  labels,
  icons,
  duration,
  tokenTarget,
  showPercent = true,
  onComplete,
  className,
}: Readonly<ShimmerLoaderProps>) {
  const [progress, setProgress] = React.useState(0);
  const [iconIdx, setIconIdx] = React.useState(0);
  const [labelIdx, setLabelIdx] = React.useState(0);

  const onCompleteRef = React.useRef(onComplete);
  React.useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  React.useEffect(() => {
    const startedAt = performance.now();
    const completed = { value: false };
    let frame = 0;
    const tick = () => {
      const elapsed = performance.now() - startedAt;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);
      if (p < 1) {
        frame = requestAnimationFrame(tick);
      } else if (!completed.value) {
        completed.value = true;
        onCompleteRef.current?.();
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration]);

  React.useEffect(() => {
    if (icons.length <= 1) return;
    const id = setInterval(() => {
      setIconIdx((i) => (i + 1) % icons.length);
    }, 140);
    return () => clearInterval(id);
  }, [icons.length]);

  React.useEffect(() => {
    if (labels.length <= 1) return;
    const cycleMs = Math.max(duration / labels.length, 600);
    const id = setInterval(() => {
      setLabelIdx((i) => (i + 1) % labels.length);
    }, cycleMs);
    return () => clearInterval(id);
  }, [labels.length, duration]);

  const percent = Math.round(progress * 100);
  const tokenValue =
    tokenTarget !== undefined ? (tokenTarget * progress).toFixed(1) : null;

  return (
    <div className={cn("flex items-center gap-3 font-mono text-sm", className)}>
      <span aria-hidden="true" className="inline-block w-4 text-center text-violet-400">
        {icons[iconIdx]}
      </span>
      <span className="min-w-[6rem] text-zinc-300/80">{labels[labelIdx]}</span>
      <div
        className="relative h-1 flex-1 overflow-hidden rounded-full bg-zinc-50/10"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="absolute inset-y-0 left-0 bg-violet-400 transition-[width] duration-150 ease-linear"
          style={{ width: `${percent}%` }}
        />
      </div>
      {showPercent && (
        <span className="w-10 text-right text-zinc-300/60 tabular-nums">{percent}%</span>
      )}
      {tokenValue !== null && (
        <span className="w-12 text-right text-zinc-300/40 tabular-nums">
          {tokenValue}k
        </span>
      )}
    </div>
  );
}
