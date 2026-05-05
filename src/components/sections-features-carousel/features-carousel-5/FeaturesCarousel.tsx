"use client";
import type { ComponentType } from "react";
import { AiAutocompleteIllustration } from "@/components/ui-illustrations/ai-autocomplete-illustration";
import { FlowIllustration } from "@/components/ui-illustrations/flow-illustration";
import { MapIllustration } from "@/components/ui-illustrations/map-illustration";
import { ModelsIllustration } from "@/components/ui-illustrations/models-illustration";
import { NotesChecklistIllustration } from "@/components/ui-illustrations/notes-checklist-illustration";
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
import { featuresCarousel5Namespace } from "./config";
import type { CarouselIllustration, CarouselSpan, FeaturesCarouselBlock } from "./schema";

const ILLUSTRATIONS: Record<CarouselIllustration, ComponentType> = {
  notesChecklist: NotesChecklistIllustration,
  models: ModelsIllustration,
  workflow: WorkflowIllustration,
  map: MapIllustration,
  aiAutocomplete: AiAutocompleteIllustration,
  flow: FlowIllustration,
};

const SPAN_CLASS: Record<CarouselSpan, string> = {
  small: "sm:basis-1/2 lg:basis-1/3",
  large: "sm:basis-1/2 lg:basis-2/3",
};

/**
 * Map needs `relative` on its container because it positions pinned
 * avatars with `absolute` over the dotted-map svg, and Flow needs an
 * `origin-bottom` so the scale reads correctly. Per-illustration tweak
 * preserved as a wrapper class lookup.
 */
const ILLUSTRATION_WRAPPER: Record<CarouselIllustration, string> = {
  notesChecklist: "mx-auto scale-90 self-center",
  models: "m-auto scale-90 self-center",
  workflow: "mx-auto origin-bottom scale-90 self-center",
  map: "origin-bottom scale-90 self-center relative h-56",
  aiAutocomplete: "mx-auto origin-bottom scale-90 self-center",
  flow: "scale-80 max-sm:-translate-x-22 self-center sm:max-lg:-translate-x-10",
};

export default function FeaturesCarousel(props: Readonly<FeaturesCarouselBlock>) {
  const [, tr, tRoot] = useScopedT(featuresCarousel5Namespace);

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
      >
        <div className="mx-auto max-w-5xl px-(--gutter)">
          <div className="grid items-end gap-6 md:grid-cols-2 md:gap-12 lg:gap-24">
            <h2
              id={`${props.id}-title`}
              className="text-foreground max-w-md text-4xl font-semibold text-balance lg:text-5xl"
            >
              {tr(props.titleKey, "title")}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed text-balance">
              {tr(props.bodyKey, "body")}
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-5xl mask-x-from-98%">
          <CarouselContent className="mx-0 py-12 *:px-1">
            {props.items.map((item, i) => {
              const Illustration = ILLUSTRATIONS[item.illustration];
              return (
                <CarouselItem key={i} className={SPAN_CLASS[item.span]}>
                  <Card className="row-span-2 grid h-full grid-rows-subgrid gap-6 overflow-hidden rounded-2xl p-6 shadow-lg shadow-black/4">
                    <div className={ILLUSTRATION_WRAPPER[item.illustration]}>
                      <Illustration />
                    </div>
                    <div className="space-y-3 self-end">
                      <h3 className="text-foreground font-medium">
                        {tRoot(item.titleKey)}
                      </h3>
                      <p className="text-foreground/65 text-balance">
                        {tRoot(item.bodyKey)}
                      </p>
                    </div>
                  </Card>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </div>

        <div className="flex items-center justify-center gap-2">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>
    </section>
  );
}
