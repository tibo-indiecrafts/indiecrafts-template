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

/**
 * Tailark Pro `features-carousel-02` — sister of `features-carousel-01`
 * with a decorative per-item background image painted at 50% opacity
 * behind each illustration card. Slot 1 swaps to the voice-memo
 * `NotesIllustration` (vs. email in v1). Converted to the template
 * pattern: props-driven items with illustration + bgImageUrl,
 * MessageKey-typed strings, theme tokens.
 */
export type FeaturesCarouselBlock = {
  type: "features-carousel-02";
  id: string;
  titleKey: MessageKey;
  items: readonly CarouselItemBlock[];
};
