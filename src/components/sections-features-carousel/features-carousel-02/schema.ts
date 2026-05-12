import type { MessageKey } from "@/types/messages";

export type CarouselIllustration =
  | "notes"
  | "notesChecklist"
  | "aiAutocomplete"
  | "translation";

export type CarouselItemBlock = {
  illustration: CarouselIllustration;
  /**
   * Decorative background image overlaid behind the illustration card
   * at 50% opacity. Plain URL (no MessageKey alt — the image is purely
   * decorative).
   */
  bgImageUrl: string;
  /**
   * Rich-text caption. The translation may use `<strong>...</strong>`
   * to render an emphasised inline lead (`text-foreground font-medium`).
   */
  bodyKey: MessageKey;
};

export type FeaturesCarouselBlock = {
  type: "features-carousel-02";
  id: string;
  titleKey: MessageKey;
  items: readonly CarouselItemBlock[];
};
