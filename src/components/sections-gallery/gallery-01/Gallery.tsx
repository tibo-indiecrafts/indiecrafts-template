"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import * as React from "react";

import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";

import { gallery01Namespace } from "./config";
import type { GalleryBlock } from "./schema";

export default function Gallery(props: Readonly<GalleryBlock>) {
  const [, , tRoot] = useScopedT(gallery01Namespace);
  const [index, setIndex] = React.useState(Math.min(5, props.items.length - 1));
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    document.body.classList.add("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const safeIndex = Math.min(Math.max(index, 0), props.items.length - 1);
  const selected = props.items[safeIndex];
  const dialogTitleId = `${props.id}-modal-title`;

  return (
    <section
      aria-labelledby={`${props.id}-heading`}
      className="bg-background relative py-12 lg:py-20"
    >
      <h2 id={`${props.id}-heading`} className="sr-only">
        {tRoot("title")}
      </h2>

      <div className="mx-auto flex w-fit gap-1 px-4 md:gap-2">
        {props.items.map((item, i) => (
          <motion.button
            key={item.titleKey}
            type="button"
            layoutId={`${props.id}-${i}`}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setIndex(i)}
            onFocus={() => setIndex(i)}
            onClick={() => {
              setIndex(i);
              setOpen(true);
            }}
            className={cn(
              "relative h-[200px] shrink-0 overflow-hidden rounded-2xl transition-[width] duration-300 ease-in-out",
              safeIndex === i
                ? "w-[250px]"
                : "w-[14px] sm:w-[20px] md:w-[30px] xl:w-[50px]",
            )}
          >
            <Image
              src={item.image}
              alt=""
              fill
              sizes="(min-width: 1280px) 250px, (min-width: 768px) 250px, 250px"
              className="object-cover"
            />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
            className="fixed inset-0 z-50"
          >
            <button
              type="button"
              aria-label={tRoot("closeLabel")}
              onClick={() => setOpen(false)}
              className="absolute inset-0 cursor-default bg-white/40 backdrop-blur-lg dark:bg-black/40"
            />
            <div className="relative grid h-full place-content-center">
              <motion.div
                layoutId={`${props.id}-${safeIndex}`}
                className="relative h-[400px] w-[400px] cursor-default overflow-hidden rounded-2xl"
              >
                <Image
                  src={selected.image}
                  alt=""
                  width={400}
                  height={400}
                  className="h-full w-full rounded-2xl object-cover"
                />
                <article className="absolute -bottom-1 left-0 w-full rounded-md bg-white/40 p-2 backdrop-blur-md dark:bg-black/40">
                  <motion.h3
                    id={dialogTitleId}
                    initial={{ scaleY: 0.2 }}
                    animate={{ scaleY: 1 }}
                    exit={{ scaleY: 0.2 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                    className="text-xl font-semibold"
                  >
                    {tRoot(selected.titleKey)}
                  </motion.h3>
                  <motion.p
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                    className="py-2 text-sm leading-[100%]"
                  >
                    {tRoot(selected.descriptionKey)}
                  </motion.p>
                </article>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
