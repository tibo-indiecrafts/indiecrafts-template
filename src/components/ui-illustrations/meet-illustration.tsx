"use client";
import {
  ArrowUp,
  ChevronDown,
  Lightbulb,
  MicOff,
  PenLine,
  Phone,
  ScreenShare,
  Search,
  Smile,
  Sparkle,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui-primitives/button";
import Image from "next/image";
import { motion } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Meeting-app illustration — two-up video grid + meeting controls,
 * paired with a draggable forced-dark AI assistant chat panel that
 * floats over the top-right corner. Used by `sections-hero/hero-12`.
 * Mock copy is decorative; treat as illustrations-only (no
 * translations).
 */
export const MeetIllustration = ({ className }: { className?: string }) => {
  const constraintsRef = useRef(null);

  return (
    <div ref={constraintsRef} className={cn("relative", className)}>
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.2}
        dragMomentum={false}
        className="absolute top-2 right-2 z-10 w-76 max-md:hidden"
      >
        <div
          data-theme="dark"
          className="text-foreground border-foreground/10 bg-illustration/85 flex h-96 flex-col rounded-2xl border p-4 shadow-2xl ring-1 shadow-blue-950/75 ring-black backdrop-blur-lg"
        >
          <div>
            <div className="relative size-fit">
              <div className="relative flex size-5 items-center justify-center rounded-full bg-conic/decreasing from-violet-500 via-lime-300 to-violet-400 blur-md" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkle className="size-4 fill-white stroke-white drop-shadow-sm" />
              </div>
            </div>
            <p className="mt-3 text-sm leading-tight text-balance">
              Hi there — how can I help you today?
            </p>
          </div>

          <div className="my-6 text-sm">
            <div className="text-muted-foreground text-xs">Suggestions</div>
            <div className="-mx-2 mt-2 cursor-pointer">
              <div className="hover:bg-foreground/5 flex items-center gap-2 rounded-lg px-2 py-1.5">
                <Search className="size-4" />
                <span>Ask anything</span>
              </div>
              <div className="hover:bg-foreground/5 flex items-center gap-2 rounded-lg px-2 py-1.5">
                <PenLine className="size-4" />
                <span>Write a cover letter</span>
              </div>
              <div className="hover:bg-foreground/5 flex items-center gap-2 rounded-lg px-2 py-1.5">
                <Lightbulb className="size-4" />
                <span>Explore ideas</span>
              </div>
            </div>
          </div>
          <div className="bg-foreground/3 ring-border-illustration mt-auto overflow-hidden rounded-lg shadow ring-1 shadow-indigo-950/10">
            <div className="text-muted-foreground bg-foreground/3 border-foreground/5 rounded-lg border-b p-3 text-xs">
              <span>
                Added corresponding &ldquo;ghost&rdquo; stroke lines for both series.
              </span>
            </div>

            <div className="text-muted-foreground px-3 py-2 text-xs">
              <span>Reply...</span>
            </div>
          </div>

          <div className="bg-card ring-border-illustration -mx-4 mt-auto -mb-4 hidden items-center justify-between rounded-lg border border-transparent p-0.5 shadow ring-1">
            <div className="text-muted-foreground pl-2 text-xs">Ask anything</div>

            <Button
              size="icon"
              className="text-background size-7 border-transparent [--color-primary:var(--color-foreground)]"
            >
              <ArrowUp strokeWidth={2} />
            </Button>
          </div>
        </div>
      </motion.div>
      <div className="bg-background border-background ring-foreground/10 m-auto flex aspect-video flex-col rounded-2xl rounded-tr-3xl border border-transparent p-6 shadow-lg ring-1 shadow-black/10 backdrop-blur">
        <div aria-hidden className="flex gap-1.5">
          <span className="border-foreground/10 bg-foreground/10 block size-2 rounded-full border" />
          <span className="border-foreground/10 bg-foreground/10 block size-2 rounded-full border" />
          <span className="border-foreground/10 bg-foreground/10 block size-2 rounded-full border" />
        </div>

        <div className="mt-12 grid grid-rows-[1fr_auto] gap-6">
          <div className="mx-auto grid max-w-2xl grid-cols-2 gap-2">
            {[
              {
                img: "https://raw.githubusercontent.com/tailark/assets/refs/heads/main/person-1_e2jmus.jpg",
                name: "You",
              },
              {
                img: "https://raw.githubusercontent.com/tailark/assets/refs/heads/main/person-2_lzr6yo.jpg",
                name: "Mira",
              },
            ].map((item) => (
              <div
                key={item.name}
                className="relative aspect-square overflow-hidden rounded-xl first:border-2 first:border-emerald-500"
              >
                <span className="bg-foreground/25 border-background/10 absolute bottom-2 left-2 rounded border px-1.5 py-0.5 text-xs text-white">
                  {item.name}
                </span>
                <Image
                  src={item.img}
                  alt={item.name}
                  width={2000}
                  height={1333}
                  className="size-full object-cover"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
            ))}
          </div>

          <div className="relative flex justify-center gap-3 pt-6 md:p-6">
            <div className="flex items-center gap-px">
              <Button
                variant="outline"
                asChild
                className="h-7 gap-1 rounded-l-3xl px-2 text-xs"
              >
                <div>
                  <Video className="!size-3.5" />
                  <span className="max-sm:hidden">Camera</span>
                  <ChevronDown strokeWidth={2} className="!size-3" />
                </div>
              </Button>
              <Button
                variant="outline"
                asChild
                className="h-7 gap-1 rounded-r-3xl px-2 text-xs"
              >
                <div>
                  <MicOff className="!size-3.5" />
                  <span className="max-sm:hidden">Microphone</span>
                  <ChevronDown strokeWidth={2} className="!size-3" />
                </div>
              </Button>
            </div>
            <Button variant="outline" asChild className="size-7 gap-1 rounded-3xl px-0">
              <div>
                <Smile strokeWidth={2} className="!size-3" />
              </div>
            </Button>
            <Button variant="outline" asChild className="size-7 gap-1 rounded-3xl px-0">
              <div>
                <ScreenShare strokeWidth={2} className="!size-3" />
              </div>
            </Button>
            <Button
              variant="destructive"
              asChild
              className="h-7 w-10 gap-1 rounded-3xl px-0"
            >
              <div>
                <Phone className="!size-3.5 rotate-135 fill-white" />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
