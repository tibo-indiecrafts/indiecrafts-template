import type { MessageKey } from "@/types/messages";

export type FeatureIllustration =
  | "notesMeeting"
  | "calendarMeeting"
  | "agentTaskPlanning"
  | "calendar"
  | "collaborationComment"
  | "flowCards"
  | "kanban"
  | "aiSearch"
  | "agentFeedback"
  | "email"
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

  titleKey: MessageKey;

  bodyKey: MessageKey;
};

export type FeaturesExpandableBlock = {
  type: "features-expandable-13";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;

  autoplayDurationMs?: number;
  items: readonly [
    FeaturesExpandableItem,
    FeaturesExpandableItem,
    FeaturesExpandableItem,
  ];
};
