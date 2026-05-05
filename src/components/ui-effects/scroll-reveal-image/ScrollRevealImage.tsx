"use client";
import { motion, useMotionTemplate, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

const DEFAULT_SRC =
  "https://raw.githubusercontent.com/tailark/assets/refs/heads/main/flower_a5umwb.webp";

export type ScrollRevealImageProps = {
  src?: string;
  alt?: string;
  className?: string;
};

/**
 * Scroll-driven reveal-zoom image effect — as the user scrolls, the
 * clip-path inset shrinks from 5% to 0% (full reveal) and the inner
 * image scales from 1.4 to 1 (zoom-out). Result: the image starts as
 * a small zoomed-in window and grows / un-zooms into a full panorama.
 * Authored from `@tailark-pro/secondary-hero-11`'s `ImageIllustration`.
 */
export const ScrollRevealImage = ({
  src = DEFAULT_SRC,
  alt = "Hero backdrop",
  className,
}: ScrollRevealImageProps) => {
  const { scrollY } = useScroll();
  const maxClip = 5;
  const maxScale = 1.4;
  const scale = useTransform(scrollY, [0, 1500], [maxScale, 1], {
    clamp: true,
  });
  const clip = useTransform(scrollY, [0, 500], [maxClip, 0], { clamp: true });
  const clipPath = useMotionTemplate`inset(${clip}% ${clip}% ${clip}% ${clip}% round 0.75rem)`;

  return (
    <motion.div
      className={cn(
        "mx-auto aspect-3/2 max-w-7xl overflow-hidden perspective-near md:aspect-video",
        className,
      )}
      style={{ clipPath }}
    >
      <motion.img
        src={src}
        alt={alt}
        style={{ scale }}
        className="origin-top"
        width={2270}
        height={1578}
      />
    </motion.div>
  );
};
