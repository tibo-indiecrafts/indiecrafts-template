import type { MessageKey } from "@/types/messages";

export type FeatureIllustration =
  | "agentFeedback"
  | "agentTaskPlanning"
  | "aiAutocomplete"
  | "aiSearch"
  | "calendar"
  | "calendarMeeting"
  | "campaign"
  | "collaborationComment"
  | "collaborationText"
  | "email"
  | "flow"
  | "flowCards"
  | "kanban"
  | "kanbanTasks"
  | "map"
  | "models"
  | "modelsCredits"
  | "notes"
  | "notesChecklist"
  | "notesMeeting"
  | "tokenCounter"
  | "translation"
  | "workflow";

export type FeatureIcon = "lassoSelect" | "brain" | "globe" | "bot";

export type FeaturesExpandableItem = {
  illustration: FeatureIllustration;
  iconKey: FeatureIcon;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  /** Used by the inactive-card aria-label so screen-reader users can identify the target ("Expand <slug> feature"). */
  ariaSlug: string;
};

export type FeaturesExpandableBlock = {
  type: "features-expandable-20";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  /** Default 7000ms. */
  autoplayDurationMs?: number;
  items: readonly [FeaturesExpandableItem, FeaturesExpandableItem];
};
