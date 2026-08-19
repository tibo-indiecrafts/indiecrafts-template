"use client";

import { useEffect, useRef } from "react";

/**
 * Thin scroll-progress bar fixed to the top of the viewport. Decorative
 * (`aria-hidden`) — screen readers don't want a value that changes on every
 * scroll tick. Updates the bar's `scaleX` directly via a ref (no state → no
 * re-render), throttled to one write per animation frame. Gated by
 * `blog.display.post.readingProgress`.
 */
export function ReadingProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      const progress = max > 0 ? el.scrollTop / max : 0;
      if (ref.current) ref.current.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-1"
    >
      <div ref={ref} className="bg-brand h-full origin-left scale-x-0" />
    </div>
  );
}
