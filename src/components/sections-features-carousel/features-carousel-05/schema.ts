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
  /**
   * `small` → `lg:basis-1/3`, `large` → `lg:basis-2/3`. On smaller
   * breakpoints both fall back to `sm:basis-1/2`.
   */
  span: CarouselSpan;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

/**
 * Tailark Pro `features-carousel-05` — two-column header (title + body)
 * over a card carousel where each slide has an alternating `small` /
 * `large` width (1/3 vs 2/3 columns on lg+) plus a per-item title +
 * body. Prev / Next arrows are centered below the carousel rather
 * than in the header row. Converted to the template pattern: props-
 * driven items with illustration + span discriminators, MessageKey-
 * typed strings, theme tokens.
 */
export type FeaturesCarouselBlock = {
  type: "features-carousel-05";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  items: readonly CarouselItemBlock[];
};
