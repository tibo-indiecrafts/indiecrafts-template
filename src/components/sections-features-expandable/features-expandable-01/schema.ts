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

  illustrationClassName?: string;

  cardClassName?: string;

  bgImageUrl?: string;

  ariaLabelKey: MessageKey;

  titleKey: MessageKey;

  bodyKey: MessageKey;
};

export type FeaturesExpandableBlock = {
  type: "features-expandable-01";
  id: string;
  titleKey: MessageKey;

  autoplayDurationMs?: number;
  items: readonly [FeaturesExpandableItem, FeaturesExpandableItem];
};
