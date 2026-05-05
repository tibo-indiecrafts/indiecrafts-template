"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const DEFAULT_SRC =
  "https://raw.githubusercontent.com/tailark/assets/refs/heads/main/healthcare_ttc35b.jpg";

export type CursorGlowPhotoProps = {
  src?: string;
  alt?: string;
  className?: string;
  /**
   * Override classes on the inner gradient pill — nudges the glow's
   * anchor point relative to the cursor. Defaults to
   * `-translate-x-1/2 -translate-y-4/5`.
   */
  glowClassName?: string;
};

/**
 * Full-bleed photo with a cursor-tracking blurred gradient overlay
 * (mix-blend-overlay). Used by
 * `sections-secondary-hero/secondary-hero-2`. Photo is decorative and
 * the consumer can pass `src` + `alt` to swap it in. The overlay
 * tracks `mousemove` on the window — if you mount multiple instances
 * on the same page they'll all chase the same cursor.
 */
export const CursorGlowPhoto = ({
  src = DEFAULT_SRC,
  alt = "Photo backdrop",
  className,
  glowClassName = "-translate-x-1/2 -translate-y-4/5",
}: CursorGlowPhotoProps) => {
  const [mouse, setMouse] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      className={cn(
        "relative aspect-63/36 overflow-hidden 2xl:mx-auto 2xl:max-w-7xl",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        className="size-full object-cover"
        width={2000}
        height={1121}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 top-0 left-0 z-0 size-40 mix-blend-overlay blur-2xl will-change-transform md:size-72"
        style={{ transform: `translate(${mouse.x}px, ${mouse.y}px)` }}
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full bg-linear-to-r from-indigo-400 via-emerald-400 to-rose-500",
            glowClassName,
          )}
        />
      </div>
    </div>
  );
};
