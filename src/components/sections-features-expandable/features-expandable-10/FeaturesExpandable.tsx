"use client";
import { ChevronDown, ChevronUp, PlusCircle } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ServerIllustration } from "@/components/ui-illustrations/server-illustration";
import { Button } from "@/components/ui-primitives/button";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { featuresExpandable10Namespace } from "./config";
import type { FeaturesExpandableBlock } from "./schema";

const DEFAULT_AUTOPLAY_MS = 7000;

export default function FeaturesExpandable(props: Readonly<FeaturesExpandableBlock>) {
  const [, tr, tRoot] = useScopedT(featuresExpandable10Namespace);
  const autoplayMs = props.autoplayDurationMs ?? DEFAULT_AUTOPLAY_MS;
  const [expandedIndex, setExpandedIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setExpandedIndex((current) => (current + 1) % props.items.length);
    }, autoplayMs);
  }, [autoplayMs, props.items.length]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [resetTimer]);

  const handleSelect = (index: number) => {
    if (index === expandedIndex) return;
    setExpandedIndex(index);
    resetTimer();
  };

  return (
    <section
      aria-labelledby={`${props.id}-title`}
      className="bg-background @container pt-24"
    >
      <div className="mx-auto max-w-5xl px-(--gutter)">
        <div className="max-w-lg">
          <h2
            id={`${props.id}-title`}
            className="text-foreground text-3xl font-semibold lg:text-4xl"
          >
            {tr(props.titleKey, "title")}
          </h2>
          <p className="text-muted-foreground mx-auto mt-3 max-w-lg text-lg">
            {tr(props.bodyKey, "body")}
          </p>
        </div>
      </div>

      <div className="relative mt-16 pb-24">
        <div className="mx-auto max-w-5xl px-(--gutter)">
          <div className="grid items-end max-lg:gap-12 lg:grid-cols-5">
            <div className="relative lg:col-span-2 lg:pb-12">
              <div className="absolute inset-y-0 flex items-center justify-center gap-3 max-sm:-inset-x-4 max-sm:justify-between sm:flex-col lg:-left-8 lg:-translate-x-full">
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="rounded-full"
                  aria-label="Previous"
                  disabled={expandedIndex === 0}
                  onClick={() => handleSelect(expandedIndex - 1)}
                >
                  <ChevronUp />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="rounded-full"
                  aria-label="Next"
                  disabled={expandedIndex === props.items.length - 1}
                  onClick={() => handleSelect(expandedIndex + 1)}
                >
                  <ChevronDown />
                </Button>
              </div>

              <div role="tablist" className="space-y-3 max-lg:px-16 max-sm:px-9">
                <LayoutGroup>
                  {props.items.map((item, index) => {
                    const isActive = expandedIndex === index;
                    return (
                      <motion.div
                        key={index}
                        layout
                        layoutDependency={expandedIndex}
                        layoutId={`item-${index}`}
                        data-expanded={isActive}
                        initial={false}
                        animate={{
                          paddingTop: isActive ? 18 : 0,
                          paddingBottom: isActive ? 18 : 0,
                          width: isActive ? "100%" : "fit-content",
                        }}
                        transition={{
                          layout: { type: "spring", bounce: 0.2, duration: 0.5 },
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.5,
                        }}
                        className={cn(
                          "ring-border group relative max-w-xs min-w-0 overflow-hidden rounded-3xl text-left ring transition-colors duration-500",
                          isActive
                            ? "bg-card dark:bg-muted/50 ring-border w-full shadow-md shadow-black/4"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <AnimatePresence initial={false}>
                          {isActive ? (
                            <motion.div
                              key="expanded"
                              layout="position"
                              role="tabpanel"
                              initial={{
                                opacity: 0,
                                height: 0,
                                filter: "blur(4px)",
                                y: 4,
                              }}
                              animate={{
                                opacity: 1,
                                height: "auto",
                                filter: "blur(0px)",
                                y: 0,
                              }}
                              exit={{
                                opacity: 0,
                                height: 0,
                                filter: "blur(4px)",
                                y: -4,
                              }}
                              transition={{
                                duration: 0.6,
                                type: "spring",
                                bounce: 0.2,
                              }}
                              className="px-6"
                            >
                              <p className="text-muted-foreground max-w-md">
                                <strong className="text-foreground font-medium">
                                  {tRoot(item.titleKey)}.
                                </strong>{" "}
                                {tRoot(item.bodyKey)}
                              </p>
                            </motion.div>
                          ) : (
                            <motion.button
                              key="collapsed"
                              type="button"
                              role="tab"
                              aria-selected={isActive}
                              layout="position"
                              onClick={() => handleSelect(index)}
                              initial={{ opacity: 0, filter: "blur(4px)", y: 4 }}
                              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                              exit={{ opacity: 0, filter: "blur(4px)", y: -4 }}
                              transition={{ duration: 0.5 }}
                              className="flex h-10 cursor-pointer items-center gap-2 px-4"
                            >
                              <PlusCircle className="size-3.5" aria-hidden="true" />
                              <h3 className="text-sm font-medium text-nowrap">
                                {tRoot(item.titleKey)}
                              </h3>
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </LayoutGroup>
              </div>
            </div>

            <div className="flex grid gap-2 max-lg:row-start-1 max-lg:mx-auto max-lg:w-full max-lg:max-w-md lg:col-span-3 @lg:grid-cols-[auto_1fr]">
              <div className="-space-y-28 @max-lg:mx-auto">
                <motion.div
                  initial={false}
                  animate={{ y: expandedIndex > 0 ? -20 : 0 }}
                  transition={{
                    delay: expandedIndex === 0 ? 0.15 : 0,
                    type: "spring",
                    bounce: 0.3,
                    duration: 0.8,
                  }}
                  className="relative z-2"
                >
                  <ServerIllustration isActive={expandedIndex === 0} />
                </motion.div>
                <motion.div
                  initial={false}
                  animate={{
                    y: expandedIndex === 2 ? -26 : expandedIndex === 0 ? 12 : -6,
                  }}
                  transition={{
                    delay: expandedIndex === 1 ? 0.15 : 0.075,
                    type: "spring",
                    bounce: 0.3,
                    duration: 0.8,
                  }}
                  className="relative z-1"
                >
                  <ServerIllustration isActive={expandedIndex === 1} />
                </motion.div>
                <motion.div
                  initial={false}
                  animate={{ y: expandedIndex < 2 ? 6 : 0 }}
                  transition={{
                    delay: 0.15,
                    type: "spring",
                    bounce: 0.3,
                    duration: 0.8,
                  }}
                  className="relative"
                >
                  <ServerIllustration isActive={expandedIndex === 2} />
                </motion.div>
              </div>

              <motion.div
                initial={false}
                animate={{
                  y: expandedIndex === 0 ? 0 : expandedIndex === 1 ? "105%" : "210%",
                }}
                transition={{
                  duration: expandedIndex === 0 ? 0.65 : 0.8,
                  type: "spring",
                  bounce: 0.2,
                }}
                className="grid h-30 translate-y-15.5 grid-cols-[1fr_auto] items-center gap-3 @max-lg:hidden"
              >
                <div className="grid h-30 shrink-0 grid-cols-[1fr_auto] items-center">
                  <div className="bg-border h-px w-full" />
                  <div className="h-full w-4 rounded-l-lg border-y border-l" />
                </div>
                <p className="text-muted-foreground w-44 text-sm text-balance">
                  {tr(props.captionKey ?? props.bodyKey, "body")}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
