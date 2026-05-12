"use client";
import type { ComponentType, ReactNode } from "react";
import { AiAutocompleteIllustration } from "@/components/ui-illustrations/ai-autocomplete-illustration";
import { EmailIllustration } from "@/components/ui-illustrations/email-illustration";
import { NotesChecklistIllustration } from "@/components/ui-illustrations/notes-checklist-illustration";
import { TranslationIllustration } from "@/components/ui-illustrations/translation-illustration";
import { Card } from "@/components/ui-primitives/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui-primitives/embla-carousel";
import { useScopedT } from "@/i18n/scoped-t";
import { featuresCarousel01Namespace } from "./config";
import type { CarouselIllustration, FeaturesCarouselBlock } from "./schema";

const ILLUSTRATIONS: Record<CarouselIllustration, ComponentType> = {
  email: EmailIllustration,
  notesChecklist: NotesChecklistIllustration,
  aiAutocomplete: AiAutocompleteIllustration,
  translation: TranslationIllustration,
};

const RICH_LEAD = {
  strong: (chunks: ReactNode) => (
    <strong className="text-foreground font-medium">{chunks}</strong>
  ),
};

export default function FeaturesCarousel(props: Readonly<FeaturesCarouselBlock>) {
  const [, tr, tRoot] = useScopedT(featuresCarousel01Namespace);

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
          },
        }}
        className="mx-auto max-w-5xl"
      >
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 px-(--gutter) lg:mb-10">
          <h2
            id={`${props.id}-title`}
            className="text-foreground max-w-xs text-4xl font-semibold text-balance"
          >
            {tr(props.titleKey, "title")}
          </h2>
          <div className="flex items-center gap-2">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </div>
        <CarouselContent className="gap-1 pt-6">
          {props.items.map((item, i) => {
            const Illustration = ILLUSTRATIONS[item.illustration];
            return (
              <CarouselItem key={i} className="space-y-4 md:basis-1/2">
                <Card className="flex aspect-square items-center justify-center rounded-2xl shadow-md shadow-black/4 *:scale-90">
                  <Illustration />
                </Card>
                <p className="text-muted-foreground text-balance">
                  {tRoot.rich(item.bodyKey, RICH_LEAD)}
                </p>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
