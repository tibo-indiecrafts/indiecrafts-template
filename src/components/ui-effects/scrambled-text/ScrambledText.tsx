"use client";

import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { SplitText } from "gsap/SplitText";
import * as React from "react";

gsap.registerPlugin(SplitText, ScrambleTextPlugin);

export interface ScrambledTextProps {
  radius?: number;
  duration?: number;
  speed?: number;
  scrambleChars?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export function ScrambledText({
  radius = 100,
  duration = 1.2,
  speed = 0.5,
  scrambleChars = ".:",
  className,
  style,
  children,
}: Readonly<ScrambledTextProps>) {
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const p = root.querySelector("p");
    if (!p) return;

    const split = SplitText.create(p, {
      type: "chars",
      charsClass: "inline-block will-change-transform",
    });

    for (const el of split.chars) {
      const c = el as HTMLElement;
      gsap.set(c, { attr: { "data-content": c.innerHTML } });
    }

    const handleMove = (e: PointerEvent) => {
      for (const el of split.chars) {
        const c = el as HTMLElement;
        const { left, top, width, height } = c.getBoundingClientRect();
        const dx = e.clientX - (left + width / 2);
        const dy = e.clientY - (top + height / 2);
        const dist = Math.hypot(dx, dy);
        if (dist < radius) {
          gsap.to(c, {
            overwrite: true,
            duration: duration * (1 - dist / radius),
            scrambleText: {
              text: c.dataset.content ?? "",
              chars: scrambleChars,
              speed,
            },
            ease: "none",
          });
        }
      }
    };

    root.addEventListener("pointermove", handleMove);
    return () => {
      root.removeEventListener("pointermove", handleMove);
      split.revert();
    };
  }, [radius, duration, speed, scrambleChars]);

  return (
    <div
      ref={rootRef}
      className={`m-[7vw] max-w-[800px] font-mono text-[clamp(14px,4vw,32px)] text-white ${className ?? ""}`}
      style={style}
    >
      <p>{children}</p>
    </div>
  );
}
