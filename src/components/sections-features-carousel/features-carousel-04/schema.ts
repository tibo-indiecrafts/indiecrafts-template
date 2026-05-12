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
 * Tailark Pro `features-carousel-04` — sister of `features-carousel-03`
 * with the bordered-grid frame replaced by individual shadowed
 * `<Card>` slides and an `mask-x-from-95%` viewport fade. Same
 * scroll breakpoints (3-up on lg, 2 on md, 1 mobile). Converted to
 * the template pattern: props-driven items with illustration
 * discriminator, MessageKey-typed strings, theme tokens.
 */
export type FeaturesCarouselBlock = {
  type: "features-carousel-04";
  id: string;
  titleKey: MessageKey;
  items: readonly CarouselItemBlock[];
};
