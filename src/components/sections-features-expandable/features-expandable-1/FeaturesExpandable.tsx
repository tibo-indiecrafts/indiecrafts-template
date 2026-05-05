"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { AiAutocompleteIllustration } from "@/components/ui-illustrations/ai-autocomplete-illustration";
import { FlowIllustration } from "@/components/ui-illustrations/flow-illustration";
import { MapIllustration } from "@/components/ui-illustrations/map-illustration";
import { ModelsIllustration } from "@/components/ui-illustrations/models-illustration";
import { ModelsCreditsIllustration } from "@/components/ui-illustrations/models-credits-illustration";
import { NotesChecklistIllustration } from "@/components/ui-illustrations/notes-checklist-illustration";
import { TokenCounterIllustration } from "@/components/ui-illustrations/token-counter-illustration";
import { TranslationIllustration } from "@/components/ui-illustrations/translation-illustration";
import { WorkflowIllustration } from "@/components/ui-illustrations/workflow-illustration";
import { useMedia } from "@/hooks/use-media";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { featuresExpandable1Namespace } from "./config";
import type { FeatureIllustration, FeaturesExpandableBlock } from "./schema";

const ILLUSTRATIONS: Record<FeatureIllustration, ComponentType> = {
  models: ModelsIllustration,
  modelsCredits: ModelsCreditsIllustration,
  notesChecklist: NotesChecklistIllustration,
  map: MapIllustration,
  aiAutocomplete: AiAutocompleteIllustration,
  workflow: WorkflowIllustration,
  tokenCounter: TokenCounterIllustration,
  translation: TranslationIllustration,
  flow: FlowIllustration,
};

const DEFAULT_AUTOPLAY_MS = 7000;

export default function FeaturesExpandable(props: Readonly<FeaturesExpandableBlock>) {
  const [, tr, tRoot] = useScopedT(featuresExpandable1Namespace);
  const autoplayMs = props.autoplayDurationMs ?? DEFAULT_AUTOPLAY_MS;
  const isMd = useMedia("(min-width: 768px)");
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pausedRef = useRef(false);
  const activeIndex = isMd ? expandedIndex : 0;

  const resetTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (pausedRef.current) return;
      setExpandedIndex((current) => (current + 1) % props.items.length);
      setProgressKey((k) => k + 1);
    }, autoplayMs);
  }, [autoplayMs, props.items.length]);

  useEffect(() => {
    if (!isMd) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    resetTimer();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [resetTimer, isMd]);

  const handleSelect = (index: number) => {
    if (!isMd || index === activeIndex) return;
    setExpandedIndex(index);
    setProgressKey((k) => k + 1);
    resetTimer();
  };

  const setPausedState = (next: boolean) => {
    pausedRef.current = next;
    setPaused(next);
  };

  return (
    <section
      aria-labelledby={`${props.id}-title`}
      className="bg-background @container py-24 max-lg:px-1"
    >
      <div className="mx-auto max-w-5xl px-(--gutter)">
        <div className="mb-6 lg:mb-10">
          <h2
            id={`${props.id}-title`}
            className="text-foreground max-w-xs text-4xl font-semibold text-balance"
          >
            {tr(props.titleKey, "title")}
          </h2>
        </div>

        <div
          className={cn(
            "grid gap-8 md:grid-cols-[1fr_1fr] md:gap-3 md:transition-[grid-template-columns] md:duration-500 md:ease-in-out",
            expandedIndex === 0 && "md:grid-cols-[2fr_1fr]",
            expandedIndex === 1 && "md:grid-cols-[1fr_2fr]",
          )}
        >
          {props.items.map((item, index) => {
            const Illustration = ILLUSTRATIONS[item.illustration];
            const isActive = activeIndex === index;
            return (
              <div
                key={index}
                data-expanded={isActive}
                className="relative row-span-2 grid grid-rows-subgrid gap-4 text-left"
              >
                <div
                  className={cn(
                    "bg-card before:border-foreground/7.5 relative flex items-center justify-center overflow-hidden rounded-2xl shadow-md shadow-black/2 before:absolute before:inset-0 before:rounded-2xl before:border",
                    item.cardClassName,
                  )}
                >
                  {item.bgImageUrl ? (
                    <Image
                      src={item.bgImageUrl}
                      alt=""
                      aria-hidden="true"
                      width={980}
                      height={980}
                      className="absolute inset-0 size-full object-cover opacity-50 dark:opacity-25"
                      unoptimized
                    />
                  ) : null}
                  <div className={item.illustrationClassName}>
                    <Illustration />
                  </div>
                </div>
                <div>
                  {isMd ? (
                    <>
                      <button
                        type="button"
                        className="absolute inset-0 cursor-pointer"
                        aria-label={tRoot(item.ariaLabelKey)}
                        onClick={() => handleSelect(index)}
                        onMouseEnter={() => isActive && setPausedState(true)}
                        onMouseLeave={() => isActive && setPausedState(false)}
                        onFocus={() => isActive && setPausedState(true)}
                        onBlur={() => isActive && setPausedState(false)}
                        aria-expanded={isActive}
                      />
                      <div className="bg-muted relative h-px">
                        {isActive ? (
                          <div
                            key={progressKey}
                            className="to-foreground absolute inset-0 h-full origin-left rounded-full bg-linear-to-r"
                            style={{
                              animation: `features-expandable-progress ${autoplayMs}ms linear forwards`,
                              animationPlayState: paused ? "paused" : "running",
                            }}
                          />
                        ) : null}
                      </div>
                    </>
                  ) : null}

                  <p className="text-muted-foreground text-balance md:mt-4 md:h-12 md:overflow-hidden">
                    <strong className="text-foreground font-medium">
                      {tRoot(item.titleKey)}
                    </strong>{" "}
                    <span className="md:not-in-data-[expanded=true]:opacity-0 md:not-in-data-[expanded=true]:blur-xs md:in-data-[expanded=true]:delay-300 md:in-data-[expanded=true]:duration-300">
                      {tRoot(item.bodyKey)}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
