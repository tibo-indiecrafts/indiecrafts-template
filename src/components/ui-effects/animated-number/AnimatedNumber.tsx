"use client";

import { motion, useSpring, useTransform, type SpringOptions } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const motionElements = {
  article: motion.article,
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
  h6: motion.h6,
  li: motion.li,
  p: motion.p,
  section: motion.section,
  span: motion.span,
} as const;

export type AnimatedNumberElement = keyof typeof motionElements;

export type AnimatedNumberProps = {
  value: number;
  className?: string;
  springOptions?: SpringOptions;
  as?: AnimatedNumberElement;
};

export function AnimatedNumber({
  value,
  className,
  springOptions,
  as = "span",
}: Readonly<AnimatedNumberProps>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- motion element union resolves to a generic forwardRef TS can't construct without `any`
  const MotionComponent = motionElements[as] as React.ComponentType<any>;

  const spring = useSpring(value, springOptions);
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

  React.useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return (
    <MotionComponent className={cn("tabular-nums", className)}>{display}</MotionComponent>
  );
}
