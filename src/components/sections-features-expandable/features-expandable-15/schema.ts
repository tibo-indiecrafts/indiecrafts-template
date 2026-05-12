import type { MessageKey } from "@/types/messages";

export type FeatureIllustration =
  | "campaign"
  | "collaborationText"
  | "notesMeeting"
  | "agentFeedback"
  | "agentTaskPlanning"
  | "aiAutocomplete"
  | "aiSearch"
  | "calendar"
  | "calendarMeeting"
  | "collaborationComment"
  | "email"
  | "flow"
  | "flowCards"
  | "kanban"
  | "map"
  | "models"
  | "modelsCredits"
  | "notes"
  | "notesChecklist"
  | "tokenCounter"
  | "translation"
  | "workflow";

export type FeatureIcon = "brain" | "globe" | "bot";

export type FeaturesExpandableItem = {
  illustration: FeatureIllustration;
  iconKey: FeatureIcon;

  bgImageUrl: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

export type FeaturesExpandableBlock = {
  type: "features-expandable-15";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  items: readonly [
    FeaturesExpandableItem,
    FeaturesExpandableItem,
    FeaturesExpandableItem,
  ];
};
