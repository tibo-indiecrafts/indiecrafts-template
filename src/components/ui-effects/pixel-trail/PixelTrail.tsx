"use client";

import { motion, useAnimationControls } from "motion/react";
import * as React from "react";

import { useDimensions } from "@/hooks/use-dimensions";
import { cn } from "@/lib/utils";

export interface PixelTrailProps {
  pixelSize?: number;
  fadeDuration?: number;
  delay?: number;
  className?: string;
  pixelClassName?: string;
}

type AnimateFn = () => void;

interface PixelRegistry {
  register: (key: string, fn: AnimateFn) => void;
  unregister: (key: string) => void;
}

const RegistryContext = React.createContext<PixelRegistry | null>(null);

export function PixelTrail({
  pixelSize = 20,
  fadeDuration = 500,
  delay = 0,
  className,
  pixelClassName,
}: Readonly<PixelTrailProps>) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const dimensions = useDimensions(containerRef);

  // Replaces the upstream's DOM-node monkey-patching (`(node as any).__animatePixel`)
  // and uuid lookups: each PixelDot registers its trigger by key; the mouse
  // handler resolves the key from the cursor's grid cell and fires the trigger.
  const triggersRef = React.useRef(new Map<string, AnimateFn>());
  const registry = React.useMemo<PixelRegistry>(
    () => ({
      register: (key, fn) => triggersRef.current.set(key, fn),
      unregister: (key) => triggersRef.current.delete(key),
    }),
    [],
  );

  const columns = Math.ceil(dimensions.width / pixelSize);
  const rows = Math.ceil(dimensions.height / pixelSize);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / pixelSize);
    const y = Math.floor((e.clientY - rect.top) / pixelSize);
    triggersRef.current.get(`${x}-${y}`)?.();
  };

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-auto absolute inset-0 h-full w-full", className)}
      onMouseMove={handleMouseMove}
      aria-hidden="true"
    >
      <RegistryContext.Provider value={registry}>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <PixelDot
                key={`${colIndex}-${rowIndex}`}
                col={colIndex}
                row={rowIndex}
                size={pixelSize}
                fadeDuration={fadeDuration}
                delay={delay}
                className={pixelClassName}
              />
            ))}
          </div>
        ))}
      </RegistryContext.Provider>
    </div>
  );
}

interface PixelDotProps {
  col: number;
  row: number;
  size: number;
  fadeDuration: number;
  delay: number;
  className?: string;
}

const PixelDot = React.memo(function PixelDot({
  col,
  row,
  size,
  fadeDuration,
  delay,
  className,
}: PixelDotProps) {
  const controls = useAnimationControls();
  const registry = React.useContext(RegistryContext);
  const key = `${col}-${row}`;

  React.useEffect(() => {
    if (!registry) return;
    const animate = () =>
      controls.start({
        opacity: [1, 0],
        transition: {
          duration: fadeDuration / 1000,
          delay: delay / 1000,
        },
      });
    registry.register(key, animate);
    return () => registry.unregister(key);
  }, [controls, registry, key, fadeDuration, delay]);

  return (
    <motion.div
      className={cn(className)}
      style={{ width: size, height: size }}
      initial={{ opacity: 0 }}
      animate={controls}
      exit={{ opacity: 0 }}
    />
  );
});
