import type { MessageKey } from "@/types/messages";

export type FeatureIllustration =
  | "models"
  | "modelsCredits"
  | "notesChecklist"
  | "map"
  | "aiAutocomplete"
  | "workflow"
  | "tokenCounter"
  | "translation"
  | "flow";

export type FeaturesExpandableItem = {
  illustration: FeatureIllustration;
  /** Optional className applied to the illustration's wrapper div. */
  illustrationClassName?: string;
  /**
   * Optional className for the card surface (e.g. `h-96` for a fixed
   * height). Omit to let the card size to the illustration's natural
   * dimensions — useful when an illustration like the dotted map has
   * its own intrinsic size that the card and bg image should match.
   */
  cardClassName?: string;
  /**
   * Decorative image painted behind the illustration at 50%/25%
   * opacity. Omit when the illustration itself is the visual focus.
   */
  bgImageUrl?: string;
  /** Aria-label for the expand button (md+ only). */
  ariaLabelKey: MessageKey;
  /** Card title rendered above the body. */
  titleKey: MessageKey;
  /** Description rendered below the title. */
  bodyKey: MessageKey;
};

/**
 * Tailark Pro `expandable-features-2` — sister of
 * `features-expandable-01` with the body styling simplified: the title
 * is its own `<h3>` above the body (rather than inline-bold), and the
 * body uses opacity dimming on inactive items (instead of the
 * blur-and-fade-in transition). 2 cards is structural — the expand
 * grid template hardcodes two slots. Converted to the template
 * pattern: props-driven items, MessageKey-typed strings, theme
 * tokens.
 */
export type FeaturesExpandableBlock = {
  type: "features-expandable-02";
  id: string;
  titleKey: MessageKey;
  /** Default 7000ms. */
  autoplayDurationMs?: number;
  items: readonly [FeaturesExpandableItem, FeaturesExpandableItem];
};
