import type { MessageKey } from "@/types/messages";

export type CarouselIllustration =
  | "email"
  | "notesChecklist"
  | "aiAutocomplete"
  | "translation";

export type CarouselItemBlock = {
  illustration: CarouselIllustration;

  bodyKey: MessageKey;
};

export type FeaturesCarouselBlock = {
  type: "features-carousel-01";
  id: string;
  titleKey: MessageKey;
  items: readonly CarouselItemBlock[];
};
