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

export type FeaturesExpandableBlock = {
  type: "features-expandable-03";
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
