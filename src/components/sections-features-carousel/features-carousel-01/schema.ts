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

/**
 * Tailark Pro `features-carousel-01` — header + Embla carousel of N
 * square illustrated cards. Each card has an illustration and a
 * rich-text caption with an emphasised inline lead. Converted to the
 * template pattern: props-driven items with illustration discriminator,
 * MessageKey-typed strings, theme tokens.
 */
export type FeaturesCarouselBlock = {
  type: "features-carousel-01";
  id: string;
  titleKey: MessageKey;
  items: readonly CarouselItemBlock[];
};
