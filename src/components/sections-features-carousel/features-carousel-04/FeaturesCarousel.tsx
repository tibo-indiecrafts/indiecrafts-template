"use client";
import type { ComponentType, ReactNode } from "react";
import { AiAutocompleteIllustration } from "@/components/ui-illustrations/ai-autocomplete-illustration";
import { ModelsIllustration } from "@/components/ui-illustrations/models-illustration";
import { NotesChecklistIllustration } from "@/components/ui-illustrations/notes-checklist-illustration";
import { TokenCounterIllustration } from "@/components/ui-illustrations/token-counter-illustration";
import { TranslationIllustration } from "@/components/ui-illustrations/translation-illustration";
import { WorkflowIllustration } from "@/components/ui-illustrations/workflow-illustration";
import { Card } from "@/components/ui-primitives/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui-primitives/embla-carousel";
import { useScopedT } from "@/i18n/scoped-t";
import { featuresCarousel04Namespace } from "./config";
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
  const [, tr, tRoot] = useScopedT(featuresCarousel04Namespace);

  return (
    <section
      aria-labelledby={`${props.id}-title`}
      className="bg-background @container py-24 max-lg:px-1"
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
      >
        <div className="mx-auto max-w-5xl px-(--gutter)">
          <div className="flex flex-wrap items-end justify-between gap-4 pb-6 lg:pb-6">
            <h2
              id={`${props.id}-title`}
              className="text-foreground max-w-md text-4xl font-semibold text-balance"
            >
              {tr(props.titleKey, "title")}
            </h2>
            <div className="flex items-center gap-2">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl mask-x-from-95% md:mask-x-from-98%">
          <CarouselContent className="mx-0 py-6 *:px-1 sm:*:basis-1/2 lg:*:basis-1/3">
            {props.items.map((item, i) => {
              const Illustration = ILLUSTRATIONS[item.illustration];
              return (
                <CarouselItem key={i}>
                  <Card className="row-span-2 grid h-full grid-rows-subgrid gap-6 overflow-hidden rounded-2xl p-6 shadow-md shadow-black/4">
                    <div className="m-auto scale-90 self-center">
                      <Illustration />
                    </div>
                    <p className="text-foreground/65 max-w-xs self-end font-medium text-balance lg:max-w-xs">
                      {tRoot.rich(item.bodyKey, RICH_LEAD)}
                    </p>
                  </Card>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </div>
      </Carousel>
    </section>
  );
}
