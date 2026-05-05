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

/**
 * Tailark Pro `expandable-features-20` — auto-cycling 2-card row
 * that animates `grid-template-columns` between `[2fr_1fr]` and
 * `[1fr_2fr]`. The active card grows; the inactive one shrinks and
 * its illustration clips at `overflow-hidden`. Each card is its own
 * unit (icon + title + body on the left, illustration on the right
 * inside an internal 2-column subgrid). Click anywhere on a card
 * (full-bleed `<button>` overlay) to swap.
 *
 * Two items is structural — the 2fr/1fr ↔ 1fr/2fr animation
 * literally only works for two cards. Default 7s autoplay; manual
 * click resets the timer.
 */
export type FeaturesExpandableBlock = {
  type: "features-expandable-20";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  /** Default 7000ms. */
  autoplayDurationMs?: number;
  items: readonly [FeaturesExpandableItem, FeaturesExpandableItem];
};
