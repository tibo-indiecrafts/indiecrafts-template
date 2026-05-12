import type { MessageKey } from "@/types/messages";

export type CarouselIllustration =
  | "models"
  | "notesChecklist"
  | "workflow"
  | "aiAutocomplete"
  | "tokenCounter"
  | "translation";

export type CarouselItemBlock = {
  illustration: CarouselIllustration;
  /**
   * Rich-text caption. The translation may use `<strong>...</strong>`
   * to render an emphasised inline lead (`text-foreground font-medium`).
   */
  bodyKey: MessageKey;
};

export type FeaturesCarouselBlock = {
  type: "features-carousel-04";
  id: string;
  titleKey: MessageKey;
  items: readonly CarouselItemBlock[];
};
