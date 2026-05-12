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
  /** Short label used for the tab button (with circular loader on active). */
  tabLabelKey: MessageKey;
  /** Title rendered next to the illustration when active. */
  titleKey: MessageKey;
  /** Description rendered next to the illustration when active. */
  bodyKey: MessageKey;
};

export type FeaturesExpandableBlock = {
  type: "features-expandable-13";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  /** Default 6000ms. */
  autoplayDurationMs?: number;
  items: readonly [
    FeaturesExpandableItem,
    FeaturesExpandableItem,
    FeaturesExpandableItem,
  ];
};
