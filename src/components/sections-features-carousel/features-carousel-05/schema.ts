import type { MessageKey } from "@/types/messages";

export type CarouselIllustration =
  | "notesChecklist"
  | "models"
  | "workflow"
  | "map"
  | "aiAutocomplete"
  | "flow";

export type CarouselSpan = "small" | "large";

export type CarouselItemBlock = {
  illustration: CarouselIllustration;
  /**
   * `small` → `lg:basis-1/3`, `large` → `lg:basis-2/3`. On smaller
   * breakpoints both fall back to `sm:basis-1/2`.
   */
  span: CarouselSpan;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

export type FeaturesCarouselBlock = {
  type: "features-carousel-05";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  items: readonly CarouselItemBlock[];
};
