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

/**
 * Tailark Pro `expandable-features-13` — three-column layout: section
 * title + body + auto-cycling tab list (with a circular SVG loader on
 * the active tab) on the left; a beveled illustration panel + bg
 * image in the middle; a centered title + description for the active
 * item on the right. Auto-cycles every `autoplayDurationMs` (default
 * 6000); manual click resets the timer.
 *
 * Three items is structural — the layout's center panel is balanced
 * for exactly three tabs. Converted to the template pattern: props-
 * driven items, MessageKey-typed strings, theme tokens.
 */
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
