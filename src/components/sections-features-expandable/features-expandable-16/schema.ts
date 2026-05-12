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

export type FeaturesExpandableItem = {
  illustration: FeatureIllustration;
  /** Decorative bg image painted (with dither overlay) behind the illustration. */
  bgImageUrl: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

export type FeaturesExpandableBlock = {
  type: "features-expandable-16";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  items: readonly [
    FeaturesExpandableItem,
    FeaturesExpandableItem,
    FeaturesExpandableItem,
  ];
};
