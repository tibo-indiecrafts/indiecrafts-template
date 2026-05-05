"use client";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui-primitives/button";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { featuresExpandable22Namespace } from "./config";
import type { FeaturesExpandableBlock } from "./schema";

const FRAME_VARIANTS = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function FeaturesExpandable(props: Readonly<FeaturesExpandableBlock>) {
  const [, tr, tRoot] = useScopedT(featuresExpandable22Namespace);
  const [expandedIndex, setExpandedIndex] = useState(0);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const active = props.items[expandedIndex];
  const ctaExternal = props.ctaHref.startsWith("http");

  useEffect(() => {
    const btn = buttonsRef.current[expandedIndex];
    if (btn) {
      setIndicatorStyle({ left: btn.offsetLeft, width: btn.offsetWidth });
    }
  }, [expandedIndex]);

  const handleSelect = (index: number) => {
    if (index === expandedIndex) return;
    setExpandedIndex(index);
  };

  return (
    <section
      aria-labelledby={`${props.id}-title`}
      className="bg-background @container relative overflow-hidden py-24"
    >
      <div className="mx-auto my-1 max-w-6xl px-(--gutter)">
        <div className="grid items-end gap-6 md:grid-cols-2 lg:gap-12 lg:px-12">
          <h2
            id={`${props.id}-title`}
            className="text-foreground text-4xl font-semibold text-balance"
          >
            {tr(props.headerTitleKey, "headerTitle")}
          </h2>
          <p className="text-muted-foreground text-lg text-balance">
            {tr(props.headerBodyKey, "headerBody")}
          </p>
        </div>

        <div className="mt-6 grid items-end gap-12 md:mt-8 md:grid-cols-2 lg:px-12">
          <div
            role="tablist"
            className="not-dark:bg-muted dark:ring-border ring-muted relative flex w-fit rounded-xl p-1 ring"
          >
            <motion.div
              aria-hidden
              className="bg-illustration dark:bg-muted absolute inset-y-1 rounded-lg shadow"
              initial={false}
              animate={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
            {props.items.map((item, index) => {
              const isActive = expandedIndex === index;
              return (
                <button
                  key={index}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  ref={(el) => {
                    buttonsRef.current[index] = el;
                  }}
                  onClick={() => handleSelect(index)}
                  data-state={isActive ? "expanded" : "collapsed"}
                  className="group relative cursor-pointer rounded-lg px-3 duration-200 active:scale-98"
                >
                  <div className="flex h-8 items-center duration-200">
                    <span
                      className={cn(
                        "group-hover:text-foreground text-sm font-medium transition-colors",
                        isActive ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {tRoot(item.tabLabelKey)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="py-1 max-md:row-start-1">
            <Button asChild variant="outline" size="sm">
              <a
                href={props.ctaHref}
                target={ctaExternal ? "_blank" : undefined}
                rel={ctaExternal ? "noopener noreferrer" : undefined}
              >
                {tr(props.ctaLabelKey, "ctaLabel")}
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-6 mask-b-from-35% mask-b-to-95% md:mt-20">
          <div className="bg-background relative overflow-hidden rounded-t-2xl px-3 pt-3 sm:px-12 sm:pt-12">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={`mock-${expandedIndex}`}
                variants={FRAME_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5, type: "spring", bounce: 0.1 }}
                className="relative z-10 flex aspect-square h-full items-center justify-center -space-x-6 pt-6 sm:-space-x-20 md:aspect-video"
              >
                <div className="bg-card ring-border h-full basis-1/2 translate-y-16 rounded-2xl shadow-xl ring shadow-black/25" />
                <div className="bg-illustration ring-border relative h-full basis-1/2 rounded-2xl shadow-xl ring shadow-black/25 ring-black/25" />
              </motion.div>
            </AnimatePresence>

            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={`bg-${expandedIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="before:border-foreground/10 absolute inset-0 before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded-t-2xl before:border"
              >
                <div className="dither absolute inset-0 opacity-25 dark:opacity-30">
                  <Image
                    src={active.bgImageUrl}
                    alt=""
                    aria-hidden="true"
                    fill
                    className="size-full object-cover opacity-50"
                    unoptimized
                  />
                </div>
                <Image
                  src={active.bgImageUrl}
                  alt=""
                  aria-hidden="true"
                  fill
                  className="size-full object-cover opacity-50"
                  unoptimized
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="relative grid gap-px pt-6 sm:grid-cols-2 md:pt-12 lg:px-12">
          <h3 className="text-foreground text-lg font-medium">
            {tRoot(active.titleKey)}
          </h3>
          <p className="text-muted-foreground max-w-sm text-balance">
            {tRoot(active.bodyKey)}
          </p>
        </div>
      </div>
    </section>
  );
}
