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

/**
 * Tailark Pro `features-carousel-03` — wide six-item carousel framed
 * in a dashed cross-rule border with subgrid rows aligning
 * illustration tops and caption baselines across visible columns.
 * Slides scroll 3-at-a-time on lg+, 2 on md, 1 on mobile. Converted
 * to the template pattern: props-driven items with illustration
 * discriminator, MessageKey-typed strings, theme tokens.
 */
export type FeaturesCarouselBlock = {
  type: "features-carousel-03";
  id: string;
  titleKey: MessageKey;
  items: readonly CarouselItemBlock[];
};
