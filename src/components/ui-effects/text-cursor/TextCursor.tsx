"use client";

import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

export interface TextCursorProps {
  text?: string;
  spacing?: number;
  followMouseDirection?: boolean;
  randomFloat?: boolean;
  exitDuration?: number;
  removalInterval?: number;
  maxPoints?: number;
  className?: string;
}

interface TrailItem {
  id: number;
  x: number;
  y: number;
  angle: number;
  randomX?: number;
  randomY?: number;
  randomRotate?: number;
}

export function TextCursor({
  text = "⚛️",
  spacing = 100,
  followMouseDirection = true,
  randomFloat = true,
  exitDuration = 0.5,
  removalInterval = 30,
  maxPoints = 5,
  className,
}: Readonly<TextCursorProps>) {
  const [trail, setTrail] = React.useState<TrailItem[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);
  // Seeded in the mount effect; Date.now() in render violates React purity.
  const lastMoveTimeRef = React.useRef<number>(0);
  const idCounter = React.useRef<number>(0);

  // Hot props for the mousemove handler.
  const configRef = React.useRef({
    spacing,
    followMouseDirection,
    randomFloat,
    maxPoints,
  });
  React.useLayoutEffect(() => {
    configRef.current = { spacing, followMouseDirection, randomFloat, maxPoints };
  });

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    lastMoveTimeRef.current = Date.now();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const cfg = configRef.current;

      setTrail((prev) => {
        let next = [...prev];
        if (next.length === 0) {
          next.push({
            id: idCounter.current++,
            x: mouseX,
            y: mouseY,
            angle: 0,
            ...(cfg.randomFloat && {
              randomX: Math.random() * 10 - 5,
              randomY: Math.random() * 10 - 5,
              randomRotate: Math.random() * 10 - 5,
            }),
          });
        } else {
          const last = next[next.length - 1];
          const dx = mouseX - last.x;
          const dy = mouseY - last.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance >= cfg.spacing) {
            let rawAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
            rawAngle = ((rawAngle + 180) % 360) - 180;
            const computedAngle = cfg.followMouseDirection ? rawAngle : 0;
            const steps = Math.floor(distance / cfg.spacing);
            for (let i = 1; i <= steps; i++) {
              const t = (cfg.spacing * i) / distance;
              next.push({
                id: idCounter.current++,
                x: last.x + dx * t,
                y: last.y + dy * t,
                angle: computedAngle,
                ...(cfg.randomFloat && {
                  randomX: Math.random() * 10 - 5,
                  randomY: Math.random() * 10 - 5,
                  randomRotate: Math.random() * 10 - 5,
                }),
              });
            }
          }
        }
        if (next.length > cfg.maxPoints) {
          next = next.slice(next.length - cfg.maxPoints);
        }
        return next;
      });
      lastMoveTimeRef.current = Date.now();
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastMoveTimeRef.current > 100) {
        setTrail((prev) => (prev.length > 0 ? prev.slice(1) : prev));
      }
    }, removalInterval);
    return () => clearInterval(interval);
  }, [removalInterval]);

  return (
    <div ref={containerRef} className={`relative h-full w-full ${className ?? ""}`}>
      <div className="pointer-events-none absolute inset-0">
        <AnimatePresence>
          {trail.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 1, rotate: item.angle }}
              animate={{
                opacity: 1,
                scale: 1,
                x: randomFloat ? [0, item.randomX ?? 0, 0] : 0,
                y: randomFloat ? [0, item.randomY ?? 0, 0] : 0,
                rotate: randomFloat
                  ? [item.angle, item.angle + (item.randomRotate ?? 0), item.angle]
                  : item.angle,
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                opacity: { duration: exitDuration, ease: "easeOut" },
                ...(randomFloat && {
                  x: {
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "mirror",
                  },
                  y: {
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "mirror",
                  },
                  rotate: {
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "mirror",
                  },
                }),
              }}
              className="absolute text-3xl whitespace-nowrap select-none"
              style={{ left: item.x, top: item.y }}
            >
              {text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
