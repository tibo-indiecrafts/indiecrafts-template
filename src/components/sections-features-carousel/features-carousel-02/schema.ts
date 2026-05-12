import type { MessageKey } from "@/types/messages";

export type CarouselIllustration =
  | "notes"
  | "notesChecklist"
  | "aiAutocomplete"
  | "translation";

export type CarouselItemBlock = {
  illustration: CarouselIllustration;

  bgImageUrl: string;

  bodyKey: MessageKey;
};

export type FeaturesCarouselBlock = {
  type: "features-carousel-02";
  id: string;
  titleKey: MessageKey;
  items: readonly CarouselItemBlock[];
};
