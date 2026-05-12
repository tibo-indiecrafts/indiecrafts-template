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
