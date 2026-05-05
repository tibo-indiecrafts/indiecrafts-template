"use client";
import type { ComponentType, ReactNode } from "react";
import { AiAutocompleteIllustration } from "@/components/ui-illustrations/ai-autocomplete-illustration";
import { ModelsIllustration } from "@/components/ui-illustrations/models-illustration";
import { NotesChecklistIllustration } from "@/components/ui-illustrations/notes-checklist-illustration";
import { TokenCounterIllustration } from "@/components/ui-illustrations/token-counter-illustration";
import { TranslationIllustration } from "@/components/ui-illustrations/translation-illustration";
import { WorkflowIllustration } from "@/components/ui-illustrations/workflow-illustration";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui-primitives/embla-carousel";
import { useScopedT } from "@/i18n/scoped-t";
import { featuresCarousel3Namespace } from "./config";
import type { CarouselIllustration, FeaturesCarouselBlock } from "./schema";

const ILLUSTRATIONS: Record<CarouselIllustration, ComponentType> = {
  models: ModelsIllustration,
  notesChecklist: NotesChecklistIllustration,
  workflow: WorkflowIllustration,
  aiAutocomplete: AiAutocompleteIllustration,
  tokenCounter: TokenCounterIllustration,
  translation: TranslationIllustration,
};

const RICH_LEAD = {
  strong: (chunks: ReactNode) => (
    <strong className="text-foreground font-medium">{chunks}</strong>
  ),
};

export default function FeaturesCarousel(props: Readonly<FeaturesCarouselBlock>) {
  const [, tr, tRoot] = useScopedT(featuresCarousel3Namespace);

  return (
    <section
      aria-labelledby={`${props.id}-title`}
      className="bg-background @container max-lg:px-1"
    >
      <Carousel
        opts={{
          align: "start",
          loop: true,
          breakpoints: {
            "(max-width: 768px)": { slidesToScroll: 1 },
            "(min-width: 768px)": { slidesToScroll: 2 },
            "(min-width: 1024px)": { slidesToScroll: 3 },
          },
        }}
        className="mx-auto"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4 border-x border-dashed px-(--gutter) pt-24 pb-6 lg:px-8 lg:pb-12">
            <h2
              id={`${props.id}-title`}
              className="text-foreground max-w-xl text-4xl font-semibold text-balance lg:text-5xl"
            >
              {tr(props.titleKey, "title")}
            </h2>
            <div className="flex items-center gap-2">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-[1fr_auto_1fr]">
          <div aria-hidden className="border-y border-dashed max-lg:hidden" />
          <div className="mx-auto border lg:max-w-6xl">
            <CarouselContent className="*:bg-card *:not-dark:bg-card/50 *:p-8 *:pt-12 *:nth-3:border-r-0 md:divide-x md:*:basis-1/2 lg:-mr-4 lg:*:basis-1/3">
              {props.items.map((item, i) => {
                const Illustration = ILLUSTRATIONS[item.illustration];
                return (
                  <CarouselItem
                    key={i}
                    className="row-span-2 grid grid-rows-subgrid gap-12"
                  >
                    <div className="m-auto scale-90 self-center">
                      <Illustration />
                    </div>
                    <p className="text-foreground/65 self-end font-medium text-balance lg:max-w-xs">
                      {tRoot.rich(item.bodyKey, RICH_LEAD)}
                    </p>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </div>
          <div aria-hidden className="border-y border-dashed max-lg:hidden" />
        </div>

        <div className="mx-auto w-full max-w-6xl border-x border-dashed pb-24" />
      </Carousel>
    </section>
  );
}
