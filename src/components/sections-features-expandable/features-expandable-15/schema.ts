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
  /** Decorative bg image painted (with dither overlay) behind the illustration. */
  bgImageUrl: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

/**
 * Tailark Pro `expandable-features-15` — click-driven sibling of
 * `-14`. The hero illustration panel is identical (`mask-b-from-35%`
 * fade-out, `aspect-4/5` → `aspect-square` (sm) → `aspect-video`
 * (md)), but the footer splits into a 2-column grid: a vertical
 * stack of icon + title BUTTONS on the left and a single
 * description panel on the right that swaps with the active item.
 * No autoplay (manual click only).
 *
 * Three items is structural — the button stack and description
 * panel both assume an exactly-three array. Converted to the
 * template pattern: props-driven items, MessageKey-typed strings,
 * theme tokens.
 */
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
