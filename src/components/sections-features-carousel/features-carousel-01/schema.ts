import type { MessageKey } from "@/types/messages";

export type CarouselIllustration =
  | "email"
  | "notesChecklist"
  | "aiAutocomplete"
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
  type: "features-carousel-01";
  id: string;
  titleKey: MessageKey;
  items: readonly CarouselItemBlock[];
};
