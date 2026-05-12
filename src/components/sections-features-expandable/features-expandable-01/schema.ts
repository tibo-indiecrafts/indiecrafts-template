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
   * opacity. Omit when the illustration itself is the visual focus
   * (e.g. the dotted map) and shouldn't compete with a backdrop.
   */
  bgImageUrl?: string;
  /** Aria-label for the expand button (md+ only). */
  ariaLabelKey: MessageKey;
  /** Bold prefix shown always, regardless of expanded state. */
  titleKey: MessageKey;
  /** Description fragment that fades in when the card is expanded. */
  bodyKey: MessageKey;
};

/**
 * Tailark Pro `expandable-features-1` — interactive 2-column expandable
 * grid: title only, then two cards each with a background image +
 * foreground illustration. On md+, clicking a card expands it (2fr)
 * while shrinking the other (1fr); auto-cycles every
 * `autoplayDurationMs` (default 7000); hovering the active card
 * pauses the timer; a thin progress bar animates left-to-right.
 *
 * On smaller viewports both cards always render expanded as a stack.
 *
 * Two cards is structural — the expand grid template is hardcoded for
 * exactly two slots. Converted to the template pattern: props-driven
 * items, MessageKey-typed strings, theme tokens.
 */
export type FeaturesExpandableBlock = {
  type: "features-expandable-01";
  id: string;
  titleKey: MessageKey;
  /** Default 7000ms. */
  autoplayDurationMs?: number;
  items: readonly [FeaturesExpandableItem, FeaturesExpandableItem];
};
