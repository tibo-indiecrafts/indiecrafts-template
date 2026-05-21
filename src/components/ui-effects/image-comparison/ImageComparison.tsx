"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
  type SpringOptions,
} from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const ImageComparisonContext = React.createContext<
  | {
      sliderPosition: number;
      setSliderPosition: (pos: number) => void;
      motionSliderPosition: MotionValue<number>;
    }
  | undefined
>(undefined);

function useImageComparisonContext() {
  const ctx = React.useContext(ImageComparisonContext);
  if (!ctx) {
    throw new Error(
      "ImageComparisonImage and ImageComparisonSlider must be used inside an <ImageComparison>",
    );
  }
  return ctx;
}

const DEFAULT_SPRING_OPTIONS: SpringOptions = { bounce: 0, duration: 0 };

export type ImageComparisonProps = {
  children: React.ReactNode;
  className?: string;
  enableHover?: boolean;
  springOptions?: SpringOptions;
};

export function ImageComparison({
  children,
  className,
  enableHover,
  springOptions,
}: Readonly<ImageComparisonProps>) {
  const [isDragging, setIsDragging] = React.useState(false);
  const motionValue = useMotionValue(50);
  const motionSliderPosition = useSpring(
    motionValue,
    springOptions ?? DEFAULT_SPRING_OPTIONS,
  );
  const [sliderPosition, setSliderPosition] = React.useState(50);

  const handleDrag = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging && !enableHover) return;
    const containerRect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x =
      "touches" in event
        ? event.touches[0].clientX - containerRect.left
        : (event as React.MouseEvent).clientX - containerRect.left;
    const percentage = Math.min(Math.max((x / containerRect.width) * 100, 0), 100);
    motionValue.set(percentage);
    setSliderPosition(percentage);
  };

  const setPosition = (next: number) => {
    const clamped = Math.min(Math.max(next, 0), 100);
    motionValue.set(clamped);
    setSliderPosition(clamped);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const step = event.shiftKey ? 10 : 5;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setPosition(sliderPosition - step);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setPosition(sliderPosition + step);
    } else if (event.key === "Home") {
      event.preventDefault();
      setPosition(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setPosition(100);
    }
  };

  return (
    <ImageComparisonContext.Provider
      value={{ sliderPosition, setSliderPosition, motionSliderPosition }}
    >
      <div
        role="slider"
        tabIndex={0}
        aria-label="Image comparison slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(sliderPosition)}
        className={cn(
          "relative overflow-hidden select-none focus-visible:outline-2",
          enableHover && "cursor-ew-resize",
          className,
        )}
        onMouseMove={handleDrag}
        onMouseDown={() => !enableHover && setIsDragging(true)}
        onMouseUp={() => !enableHover && setIsDragging(false)}
        onMouseLeave={() => !enableHover && setIsDragging(false)}
        onTouchMove={handleDrag}
        onTouchStart={() => !enableHover && setIsDragging(true)}
        onTouchEnd={() => !enableHover && setIsDragging(false)}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    </ImageComparisonContext.Provider>
  );
}

export type ImageComparisonImageProps = {
  className?: string;
  alt: string;
  src: string;
  position: "left" | "right";
};

export function ImageComparisonImage({
  className,
  alt,
  src,
  position,
}: Readonly<ImageComparisonImageProps>) {
  const { motionSliderPosition } = useImageComparisonContext();
  const leftClipPath = useTransform(
    motionSliderPosition,
    (value) => `inset(0 0 0 ${value}%)`,
  );
  const rightClipPath = useTransform(
    motionSliderPosition,
    (value) => `inset(0 ${100 - value}% 0 0)`,
  );

  return (
    <motion.img
      src={src}
      alt={alt}
      className={cn("absolute inset-0 h-full w-full object-cover", className)}
      style={{
        clipPath: position === "left" ? leftClipPath : rightClipPath,
      }}
    />
  );
}

export type ImageComparisonSliderProps = {
  className?: string;
  children?: React.ReactNode;
};

export function ImageComparisonSlider({
  className,
  children,
}: Readonly<ImageComparisonSliderProps>) {
  const { motionSliderPosition } = useImageComparisonContext();
  const left = useTransform(motionSliderPosition, (value) => `${value}%`);

  return (
    <motion.div
      className={cn("absolute top-0 bottom-0 w-1 cursor-ew-resize", className)}
      style={{ left }}
    >
      {children}
    </motion.div>
  );
}
