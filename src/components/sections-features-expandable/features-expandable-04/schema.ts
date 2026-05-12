import type { MessageKey } from "@/types/messages";

export type FeatureIllustration =
  | "notesMeeting"
  | "calendar"
  | "agentTaskPlanning"
  | "models"
  | "modelsCredits"
  | "notes"
  | "notesChecklist"
  | "map"
  | "aiAutocomplete"
  | "workflow"
  | "tokenCounter"
  | "translation"
  | "flow";

export type FeaturesExpandableItem = {
  illustration: FeatureIllustration;

  bgImageUrl: string;

  tabLabelKey: MessageKey;
};

export type FeaturesExpandableBlock = {
  type: "features-expandable-04";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  items: readonly [
    FeaturesExpandableItem,
    FeaturesExpandableItem,
    FeaturesExpandableItem,
  ];
};
