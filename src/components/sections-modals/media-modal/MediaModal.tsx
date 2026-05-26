"use client";

import { XIcon } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import Image from "next/image";
import * as React from "react";

import { useScopedT } from "@/components/_lib/scoped-t";
import { cn } from "@/lib/utils";

import { mediaModalNamespace } from "./config";
import type { MediaModalBlock } from "./schema";

export const transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 0.5,
} as const;

export default function MediaModal(props: Readonly<MediaModalBlock>) {
  const [, , tRoot] = useScopedT(mediaModalNamespace);
  const [open, setOpen] = React.useState(false);
  const reactId = React.useId();
  const layoutId = `${props.id}-${reactId}`;

  const altText = props.altKey ? tRoot(props.altKey) : "";
  const closeLabel = tRoot(props.closeLabelKey);

  React.useEffect(() => {
    if (open) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section
      aria-labelledby={`${props.id}-heading`}
      className="bg-background py-12 lg:py-20"
    >
      <h2 id={`${props.id}-heading`} className="sr-only">
        {tRoot(props.titleKey)}
      </h2>

      <div className="mx-auto w-full max-w-5xl px-6">
        <MotionConfig transition={transition}>
          <motion.button
            type="button"
            layoutId={`dialog-${layoutId}`}
            onClick={() => setOpen(true)}
            aria-label={altText || tRoot(props.titleKey)}
            className="relative flex aspect-video h-auto w-full cursor-zoom-in flex-col overflow-hidden border bg-neutral-300 hover:bg-neutral-200 dark:bg-black dark:hover:bg-neutral-950"
            style={{ borderRadius: "12px" }}
          >
            {props.imgSrc && (
              <motion.div
                layoutId={`dialog-img-${layoutId}`}
                className="relative h-full w-full"
              >
                <Image
                  src={props.imgSrc}
                  alt={altText}
                  fill
                  unoptimized
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover"
                />
              </motion.div>
            )}
            {props.videoSrc && (
              <motion.div layoutId={`dialog-video-${layoutId}`} className="h-full w-full">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full rounded-xs object-cover"
                >
                  <source src={props.videoSrc} type="video/mp4" />
                  <track kind="captions" />
                </video>
              </motion.div>
            )}
          </motion.button>

          <AnimatePresence initial={false} mode="popLayout">
            {open && (
              <>
                <motion.button
                  key={`backdrop-${layoutId}`}
                  type="button"
                  aria-label={closeLabel}
                  onClick={() => setOpen(false)}
                  className="fixed inset-0 z-50 h-full w-full cursor-default bg-white/95 backdrop-blur-xs dark:bg-black/25"
                  variants={{ open: { opacity: 1 }, closed: { opacity: 0 } }}
                  initial="closed"
                  animate="open"
                  exit="closed"
                />
                <motion.div
                  key="dialog"
                  role="dialog"
                  aria-modal="true"
                  aria-label={closeLabel}
                  className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
                >
                  <motion.div
                    className={cn(
                      "pointer-events-auto relative flex h-[90%] w-[80%] flex-col overflow-hidden border bg-neutral-200 dark:bg-neutral-950",
                      props.imgSrc && "cursor-zoom-out",
                    )}
                    layoutId={`dialog-${layoutId}`}
                    tabIndex={-1}
                    style={{ borderRadius: "24px" }}
                  >
                    {props.imgSrc && (
                      <motion.button
                        type="button"
                        layoutId={`dialog-img-${layoutId}`}
                        aria-label={closeLabel}
                        onClick={() => setOpen(false)}
                        className="relative h-full w-full"
                      >
                        <Image
                          src={props.imgSrc}
                          alt={altText}
                          fill
                          unoptimized
                          sizes="80vw"
                          className="object-cover"
                        />
                      </motion.button>
                    )}
                    {props.videoSrc && (
                      <motion.div
                        layoutId={`dialog-video-${layoutId}`}
                        className="h-full w-full"
                      >
                        <video
                          autoPlay
                          muted
                          loop
                          controls
                          playsInline
                          className="h-full w-full rounded-xs object-cover"
                        >
                          <source src={props.videoSrc} type="video/mp4" />
                          <track kind="captions" />
                        </video>
                      </motion.div>
                    )}
                    {props.videoSrc && (
                      <button
                        type="button"
                        aria-label={closeLabel}
                        onClick={() => setOpen(false)}
                        className="absolute top-6 right-6 cursor-pointer rounded-xl bg-neutral-400 p-3 text-zinc-50 hover:bg-neutral-500 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                      >
                        <XIcon size={24} aria-hidden="true" />
                      </button>
                    )}
                  </motion.div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </MotionConfig>
      </div>
    </section>
  );
}
