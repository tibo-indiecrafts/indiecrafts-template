"use client";
import { motion, useMotionTemplate, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

const DEFAULT_SRC =
  "https://raw.githubusercontent.com/acme/assets/refs/heads/main/flower_a5umwb.webp";

export type ScrollRevealImageProps = {
  src?: string;
  alt?: string;
  className?: string;
};

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
