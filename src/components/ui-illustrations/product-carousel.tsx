"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

const SCREENSHOTS = [
  {
    light:
      "https://raw.githubusercontent.com/acme/assets/refs/heads/main/circle_un3f39.png",
    dark: "https://raw.githubusercontent.com/acme/assets/refs/heads/main/circle-dark_cv2taw.png",
  },
  {
    light:
      "https://raw.githubusercontent.com/acme/assets/refs/heads/main/circle-2_qt7ip8.png",
    dark: "https://raw.githubusercontent.com/acme/assets/refs/heads/main/circle-dark_cv2taw.png",
  },
  {
    light:
      "https://raw.githubusercontent.com/acme/assets/refs/heads/main/circle-3_tgdnaa.png",
    dark: "https://raw.githubusercontent.com/acme/assets/refs/heads/main/circle-dark_cv2taw.png",
  },
];

export const ProductCarousel = ({ className }: { className?: string }) => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % SCREENSHOTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={active}
        initial={{ opacity: 0, scale: 0.9, y: 32 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 1.1, y: -32 }}
        transition={{
          duration: 1.2,
          type: "spring",
          bounce: 0.2,
          ease: "easeInOut",
        }}
        className={cn("origin-bottom", className)}
      >
        <div className="bg-background/60 ring-foreground/10 rounded-2xl p-1 shadow-xl ring-1 shadow-black/10">
          <div className="bg-card dark:bg-background ring-border-illustration relative aspect-auto origin-top overflow-hidden rounded-xl border-4 border-l-8 border-transparent shadow ring-1">
            <Image
              className="size-full min-w-xl object-cover object-top-left dark:hidden"
              src={SCREENSHOTS[active].light}
              alt="App preview"
              width={2880}
              height={1920}
              sizes="(max-width: 640px) 768px, (max-width: 768px) 1024px, (max-width: 1024px) 1280px, 1280px"
            />
            <Image
              className="size-full min-w-xl object-cover object-top-left not-dark:hidden"
              src={SCREENSHOTS[active].dark}
              alt="App preview"
              width={2880}
              height={1920}
              sizes="(max-width: 640px) 768px, (max-width: 768px) 1024px, (max-width: 1024px) 1280px, 1280px"
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
