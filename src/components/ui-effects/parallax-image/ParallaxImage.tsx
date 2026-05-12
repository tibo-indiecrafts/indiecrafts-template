"use client";
import { Button } from "@/components/ui-primitives/button";
import { Play } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const DEFAULT_IMAGE_SRC =
  "https://images.unsplash.com/photo-1547673516-a94ece1efe0c?q=80&w=2069&auto=format&fit=crop";

export type ParallaxImageProps = {
  src?: string;
  alt?: string;
  ctaLabel?: string;
  className?: string;
};

export const ParallaxImage = ({
  src = DEFAULT_IMAGE_SRC,
  alt = "Hero preview",
  ctaLabel = "Watch demo",
  className,
}: ParallaxImageProps) => {
  const { scrollY } = useScroll();
  const parallaxFactor = 0.2;
  const y = useTransform(scrollY, [0, 500], [0, 500 * parallaxFactor], {
    clamp: false,
  });
  const maxScale = 1.5;
  const scale = useTransform(scrollY, [0, 500], [1, maxScale], { clamp: true });
  const rotateX = useTransform(scrollY, [0, 500], [12, 0], { clamp: true });

  return (
    <motion.div
      style={{ y, scale }}
      className={cn("mx-auto mt-8 max-w-md perspective-near", className)}
    >
      <motion.div style={{ rotateX }} className="relative mx-auto max-w-xs">
        <div className="group relative">
          <div className="absolute inset-1 z-10 flex items-center justify-center rounded-xl border border-dotted border-white/15">
            <Button
              size="sm"
              variant="outline"
              asChild
              className="m-auto w-fit rounded-full bg-white/15 text-white shadow-lg ring-white/25 backdrop-blur transition-all duration-200 before:absolute before:inset-0 hover:-translate-y-1 hover:scale-105 hover:bg-white/20 active:-translate-y-0.5 active:scale-99"
            >
              <button type="button">
                <Play className="size-3.5!" aria-hidden />
                {ctaLabel}
              </button>
            </Button>
          </div>
          <div className="ring-background/25 before:border-foreground relative aspect-video overflow-hidden rounded-2xl shadow-2xl ring-1 shadow-black/40 before:absolute before:inset-0 before:z-1 before:rounded-2xl before:border before:mask-y-from-55% before:inset-ring-4 before:inset-ring-white/35">
            <Image
              src={src}
              alt={alt}
              className="size-full scale-102 object-cover duration-200 group-hover:scale-100"
              height={2069}
              width={2069}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
