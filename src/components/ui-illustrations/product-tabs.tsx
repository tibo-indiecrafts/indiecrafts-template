"use client";
import Image from "next/image";
import { ChartBar, Globe, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";

type Preview = "task-management" | "analytics" | "ai-copilot";

type PreviewItem = {
  name: Preview;
  label: string;
  image: string;
  imageDark: string;
  icon: React.ReactNode;
};

const previews: PreviewItem[] = [
  {
    name: "task-management",
    label: "Task Management",
    image:
      "https://raw.githubusercontent.com/tailark/assets/refs/heads/main/circle-dark_cv2taw.png",
    imageDark:
      "https://raw.githubusercontent.com/tailark/assets/refs/heads/main/circle_un3f39.png",
    icon: <Globe />,
  },
  {
    name: "analytics",
    label: "Analytics",
    image:
      "https://raw.githubusercontent.com/tailark/assets/refs/heads/main/circle-dark_cv2taw.png",
    imageDark:
      "https://raw.githubusercontent.com/tailark/assets/refs/heads/main/circle-2_qt7ip8.png",
    icon: <ChartBar />,
  },
  {
    name: "ai-copilot",
    label: "AI Copilot",
    image:
      "https://raw.githubusercontent.com/tailark/assets/refs/heads/main/circle-dark_cv2taw.png",
    imageDark:
      "https://raw.githubusercontent.com/tailark/assets/refs/heads/main/circle-3_tgdnaa.png",
    icon: <Sparkles />,
  },
];

/**
 * Animated tabbed product preview — three pillars (Task Management /
 * Analytics / AI Copilot) with crossfading circle decoration backdrops
 * sourced from Tailark's CDN assets. Used by `sections-hero/hero-7`
 * and `sections-hero/hero-8`. Mock labels are decorative; treat as
 * illustrations-only (no translations).
 */
export const ProductTabs = ({ className }: { className?: string }) => {
  const [active, setActive] = useState<Preview>("task-management");
  const currentPreview = previews.find((p) => p.name === active)!;
  return (
    <div
      className={cn(
        "@container relative z-10 border-b [mask-image:radial-gradient(ellipse_80%_95%_at_50%_0%,#000_80%,transparent_100%)] pt-12 lg:pt-30",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl">
        <div className="border-border-illustration grid grid-cols-[1fr_auto_1fr] border-y pb-2">
          <div className="h-[calc(100%+0.5rem)] [background:repeating-linear-gradient(45deg,var(--color-border-illustration),var(--color-border-illustration)_1px,transparent_1px,transparent_6px)]" />
          <div className="bg-foreground/3 max-w-3xl lg:min-w-[42.5rem]">
            <div className="divide-border-illustration border-border-illustration relative z-20 grid grid-cols-3 items-center justify-center gap-px divide-x border-x *:h-16">
              {previews.map((preview) => (
                <button
                  key={preview.name}
                  type="button"
                  onClick={() => setActive(preview.name)}
                  className="group flex cursor-pointer items-center justify-center px-2"
                >
                  <div
                    className={cn(
                      "ring-border-illustration flex h-10 items-center gap-2 rounded-full px-4 ring-1 transition-all duration-150 group-active:scale-99 [&>svg]:size-4",
                      active === preview.name
                        ? "bg-background shadow shadow-black/10"
                        : "group-hover:bg-background/50",
                    )}
                  >
                    {preview.icon}
                    <span className="@max-md:hidden">{preview.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="h-[calc(100%+0.5rem)] [background:repeating-linear-gradient(45deg,var(--color-border-illustration),var(--color-border-illustration)_1px,transparent_1px,transparent_6px)]" />
        </div>
      </div>
      <div className="relative mx-auto -mt-2 max-w-6xl max-md:mx-1 lg:px-10">
        <div className="bg-background/60 ring-foreground/10 aspect-square rounded-2xl p-1 shadow-2xl ring-1 shadow-black/10 backdrop-blur sm:aspect-3/2">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.995 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.995 }}
              transition={{ duration: 0.2 }}
              className="bg-card dark:bg-background ring-border relative aspect-square origin-top overflow-hidden rounded-xl border-4 border-l-8 border-transparent shadow ring-1 sm:aspect-3/2"
            >
              <Image
                className="size-full object-cover object-top-left not-dark:hidden"
                src={currentPreview.image}
                alt={currentPreview.name}
                width={2880}
                height={1920}
                sizes="(max-width: 640px) 768px, (max-width: 768px) 1024px, (max-width: 1024px) 1280px, 1280px"
              />
              <Image
                className="size-full object-cover object-top-left dark:hidden"
                src={currentPreview.imageDark}
                alt={currentPreview.name}
                width={2880}
                height={1920}
                sizes="(max-width: 640px) 768px, (max-width: 768px) 1024px, (max-width: 1024px) 1280px, 1280px"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
