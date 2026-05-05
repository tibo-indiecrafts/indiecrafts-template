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
   * Decorative image painted behind the illustration at 50%/25%
   * opacity. Omit when the illustration itself is the visual focus.
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
 * Tailark Pro `expandable-features-3` — three-column expandable
 * variant. Three cards each with `h-104` and a ringed
 * (`inset-ring-1`) border instead of `features-expandable-1`'s
 * shadow + before-border. The active card expands (2fr) while the
 * other two stay 1fr each. Auto-cycles every `autoplayDurationMs`
 * (default 7000); progress bar uses the emerald → indigo gradient.
 *
 * Three cards is structural — the expand grid template hardcodes
 * three slots. Converted to the template pattern: props-driven items,
 * MessageKey-typed strings, theme tokens.
 */
export type FeaturesExpandableBlock = {
  type: "features-expandable-3";
  id: string;
  titleKey: MessageKey;
  /** Default 7000ms. */
  autoplayDurationMs?: number;
  items: readonly [
    FeaturesExpandableItem,
    FeaturesExpandableItem,
    FeaturesExpandableItem,
  ];
};
