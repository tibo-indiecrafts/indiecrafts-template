"use client";
import { ChevronDown, ChevronUp, PlusCircle } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useState } from "react";
import { SceneIllustration } from "@/components/ui-illustrations/scene-illustration";
import { Button } from "@/components/ui-primitives/button";
import { useScopedT } from "@/components/_lib/scoped-t";
import { cn } from "@/lib/utils";
import { featuresExpandable09Namespace } from "./config";
import type { FeaturesExpandableBlock } from "./schema";

export default function FeaturesExpandable(props: Readonly<FeaturesExpandableBlock>) {
  const [, tr, tRoot] = useScopedT(featuresExpandable09Namespace);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const activeDevice = expandedIndex !== null ? props.items[expandedIndex].device : null;

  const handleSelect = (index: number) => {
    setExpandedIndex((current) => (current === index ? null : index));
  };

  const previousIndex = (i: number | null) => (i !== null && i > 0 ? i - 1 : null);
  const nextIndex = (i: number | null) =>
    i !== null && i < props.items.length - 1 ? i + 1 : null;

  return (
    <section
      aria-labelledby={`${props.id}-title`}
      className="bg-background @container py-24"
    >
      <div className="mx-auto max-w-5xl px-(--gutter)">
        <div className="mb-12 grid items-end gap-4 text-balance md:grid-cols-2">
          <h2 id={`${props.id}-title`} className="text-foreground text-4xl font-semibold">
            {tr(props.titleKey, "title")}
          </h2>
          <p className="text-muted-foreground text-lg">{tr(props.bodyKey, "body")}</p>
        </div>

        <div className="grid items-center lg:grid-cols-5">
          <div className="relative z-10 lg:col-span-2">
            <AnimatePresence>
              {expandedIndex !== null ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.75, y: 44, filter: "blur(4px)" }}
                  animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.75, y: 44, filter: "blur(4px)" }}
                  className="absolute inset-y-0 flex items-center justify-center gap-3 max-sm:-inset-x-4 max-sm:justify-between sm:flex-col lg:-left-8 lg:-translate-x-full"
                >
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="rounded-full"
                    aria-label="Previous"
                    disabled={previousIndex(expandedIndex) === null}
                    onClick={() => {
                      const next = previousIndex(expandedIndex);
                      if (next !== null) handleSelect(next);
                    }}
                  >
                    <ChevronUp />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="rounded-full"
                    aria-label="Next"
                    disabled={nextIndex(expandedIndex) === null}
                    onClick={() => {
                      const next = nextIndex(expandedIndex);
                      if (next !== null) handleSelect(next);
                    }}
                  >
                    <ChevronDown />
                  </Button>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div role="tablist" className="space-y-3 max-lg:px-16 max-sm:px-9">
              <LayoutGroup>
                {props.items.map((item, index) => {
                  const isActive = expandedIndex === index;
                  return (
                    <motion.div
                      key={item.device}
                      layout
                      layoutDependency={expandedIndex}
                      layoutId={item.device}
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
                        duration: 0.6,
                      }}
                      className={cn(
                        "ring-border group relative max-w-xs min-w-0 overflow-hidden rounded-3xl text-left ring transition-colors duration-500 max-md:mx-auto",
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

          <div className="max-lg:row-start-1 lg:col-span-3 lg:-translate-x-20">
            <SceneIllustration activeDevice={activeDevice} />
          </div>
        </div>
      </div>
    </section>
  );
}
