"use client";

/* eslint-disable @next/next/no-img-element -- avatars are remote thumbnails, no next/image needed */

import { AnimatePresence, motion } from "motion/react";
import { Star, Zap } from "lucide-react";
import { useState, type ComponentProps, type ReactNode } from "react";
import { TextEffect } from "@/components/ui-effects/text-effect";
import { PrimeVideo as Primevideo } from "@/components/ui-primitives/svgs/dark-landing-prime-video";
import { Tailwindcss as TailwindCSS } from "@/components/ui-primitives/svgs/dark-landing-tailwindcss";
import { VercelWordmark as VercelFull } from "@/components/ui-primitives/svgs/dark-landing-vercel";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { testimonials02Namespace } from "./config";
import type { TestimonialLogoId, TestimonialsBlock } from "./schema";

const LOGOS: Record<TestimonialLogoId, (props: ComponentProps<"svg">) => ReactNode> = {
  tailwindcss: TailwindCSS,
  vercel: VercelFull,
  "prime-video": Primevideo,
};

const animationVariants = {
  exit: { opacity: 0, y: 6 },
  initial: { opacity: 0, y: -6 },
  animate: { opacity: 1, y: 0 },
};

function PlusDecorator({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "before:bg-foreground/25 after:bg-foreground/25 absolute z-1 size-3 mask-radial-from-15% before:absolute before:inset-0 before:m-auto before:h-px after:absolute after:inset-0 after:m-auto after:w-px",
        className,
      )}
    />
  );
}

export default function Testimonials(props: Readonly<TestimonialsBlock>) {
  const [, , tRoot] = useScopedT(testimonials02Namespace);
  const [activeId, setActiveId] = useState<string>(props.testimonials[0]?.id ?? "");
  const current = props.testimonials.find((item) => item.id === activeId);
  if (!current) return null;
  const Logo = LOGOS[current.logo];
  const activeName = tRoot(current.nameKey);

  return (
    <section
      aria-labelledby={`${props.id}-heading`}
      className="@container py-24 md:py-40"
    >
      <h2 id={`${props.id}-heading`} className="sr-only">
        Customer testimonials
      </h2>
      <div className="mx-auto w-full max-w-5xl px-6">
        <div className="relative">
          <div className="grid @2xl:grid-cols-3">
            <div className="row-span-3 grid grid-rows-subgrid gap-12">
              <div className="grid gap-3 self-start pl-px">
                <div className="before:border-foreground/25 relative aspect-square size-20 overflow-hidden rounded-xl shadow-md shadow-black/15 before:absolute before:inset-0 before:rounded-xl before:border before:ring-1 before:inset-ring-1 before:inset-ring-black/25">
                  <img
                    src={current.avatarUrl}
                    alt={activeName}
                    height="460"
                    width="460"
                  />
                </div>
                <div className="space-y-0.5 text-base *:block">
                  <span className="text-foreground font-medium">{activeName}</span>
                  <span className="text-muted-foreground text-sm">
                    {tRoot(current.titleKey)}
                  </span>
                </div>
              </div>

              <div className="relative w-fit self-center py-0.5 @max-2xl:row-start-1">
                <span
                  aria-hidden
                  className="border-foreground/10 absolute -inset-x-12 inset-y-0 border-y mask-x-from-75%"
                />
                <div className="flex items-center gap-3 py-1">
                  {props.testimonials.map((item) => {
                    const itemName = tRoot(item.nameKey);
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setActiveId(item.id)}
                        aria-label={itemName}
                        aria-pressed={item.id === activeId}
                        className={cn(
                          "relative aspect-square size-8 cursor-pointer overflow-hidden rounded-md shadow-md shadow-black/15 duration-200 ease-out",
                          "before:border-foreground/25 before:absolute before:inset-0 before:rounded-md before:border before:ring-1 before:inset-ring-1 before:inset-ring-black/25",
                          item.id !== activeId && "scale-98 opacity-50 grayscale-100",
                        )}
                      >
                        <img
                          src={item.avatarUrl}
                          alt={itemName}
                          height="460"
                          width="460"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="row-span-3 grid grid-rows-subgrid gap-12 @2xl:col-span-2">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={current.id}
                  variants={animationVariants}
                  exit="exit"
                  initial="initial"
                  animate="animate"
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <p className="text-2xl before:mr-1 before:font-serif before:content-['\\201C'] after:ml-1 after:font-serif after:content-['\\201D'] lg:text-3xl">
                    {tRoot(current.textKey)}
                  </p>
                </motion.div>
              </AnimatePresence>
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={`logo-${current.id}`}
                  variants={animationVariants}
                  exit="exit"
                  initial="initial"
                  animate="animate"
                  transition={{
                    duration: 0.25,
                    delay: 0.075,
                    ease: "easeInOut",
                  }}
                  className="**:fill-foreground self-center"
                >
                  <Logo className={current.logoClassName} />
                </motion.div>
              </AnimatePresence>

              <div className="relative">
                <PlusDecorator className="-translate-[calc(50%-0.5px)]" />
                <PlusDecorator className="right-0 translate-x-[calc(50%-0.5px)] -translate-y-[calc(50%-0.5px)]" />
                <PlusDecorator className="right-0 bottom-0 translate-x-[calc(50%-0.5px)] translate-y-[calc(50%-0.5px)]" />
                <PlusDecorator className="bottom-0 -translate-x-[calc(50%-0.5px)] translate-y-[calc(50%-0.5px)]" />
                <div className="relative grid grid-cols-2 border py-6">
                  <span
                    aria-hidden
                    className="bg-foreground/10 border-background pointer-events-none absolute inset-y-4 left-1/2 w-0.5 rounded border-r"
                  />
                  <div className="space-y-4 px-6">
                    <div aria-hidden className="flex justify-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="fill-muted-foreground stroke-muted-foreground size-5 drop-shadow"
                        />
                      ))}
                    </div>
                    <TextEffect
                      preset="fade"
                      per="char"
                      delay={0.25}
                      speedReveal={5}
                      key={`r1-${current.id}`}
                      className="text-muted-foreground text-center text-sm font-medium text-balance"
                    >
                      {tRoot(current.resultTextKey)}
                    </TextEffect>
                  </div>
                  <div className="space-y-4 px-6">
                    <div aria-hidden className="flex justify-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Zap
                          key={i}
                          className="fill-muted-foreground stroke-muted-foreground size-5 drop-shadow"
                        />
                      ))}
                    </div>
                    <TextEffect
                      preset="fade"
                      per="char"
                      delay={0.25}
                      speedReveal={5}
                      key={`r2-${current.id}`}
                      className="text-muted-foreground text-center text-sm font-medium text-balance"
                    >
                      {tRoot(current.resultText2Key)}
                    </TextEffect>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
