"use client";

import { motion, useMotionValue, useSpring, type SpringOptions } from "motion/react";
import * as React from "react";

const SPRING_CONFIG = { stiffness: 26.7, damping: 4.1, mass: 0.2 };

export type MagneticProps = {
  children: React.ReactNode;
  intensity?: number;
  range?: number;
  actionArea?: "self" | "parent" | "global";
  springOptions?: SpringOptions;
};

export function Magnetic({
  children,
  intensity = 0.6,
  range = 100,
  actionArea = "self",
  springOptions = SPRING_CONFIG,
}: Readonly<MagneticProps>) {
  const [selfHovered, setSelfHovered] = React.useState(false);
  const [parentHovered, setParentHovered] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const isHovered =
    actionArea === "global"
      ? true
      : actionArea === "parent"
        ? parentHovered
        : selfHovered;

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, springOptions);
  const springY = useSpring(y, springOptions);

  React.useEffect(() => {
    const calculateDistance = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const absoluteDistance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

      if (isHovered && absoluteDistance <= range) {
        const scale = 1 - absoluteDistance / range;
        x.set(distanceX * intensity * scale);
        y.set(distanceY * intensity * scale);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    document.addEventListener("mousemove", calculateDistance);
    return () => document.removeEventListener("mousemove", calculateDistance);
  }, [isHovered, intensity, range, x, y]);

  React.useEffect(() => {
    if (actionArea !== "parent" || !ref.current?.parentElement) return;
    const parent = ref.current.parentElement;
    const onEnter = () => setParentHovered(true);
    const onLeave = () => setParentHovered(false);
    parent.addEventListener("mouseenter", onEnter);
    parent.addEventListener("mouseleave", onLeave);
    return () => {
      parent.removeEventListener("mouseenter", onEnter);
      parent.removeEventListener("mouseleave", onLeave);
    };
  }, [actionArea]);

  const handleMouseEnter = () => {
    if (actionArea === "self") setSelfHovered(true);
  };
  const handleMouseLeave = () => {
    if (actionArea === "self") {
      setSelfHovered(false);
      x.set(0);
      y.set(0);
    }
  };

  return (
    <motion.div
      ref={ref}
      onMouseEnter={actionArea === "self" ? handleMouseEnter : undefined}
      onMouseLeave={actionArea === "self" ? handleMouseLeave : undefined}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.div>
  );
}
