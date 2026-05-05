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

/**
 * Tailark Pro `expandable-features-16` — click-driven sibling of
 * `-15` with a horizontal tab row instead of a vertical button
 * stack. The hero illustration card is fully bordered (`rounded-2xl
 * p-12`, no `mask-b-from-35%` fade-out), and below it sits a
 * left-aligned row of TEXT-ONLY pill tabs followed by the active
 * item's description (`max-w-xl text-lg`). Upstream imports lucide
 * icons but never renders them — `iconKey` is intentionally absent
 * from this schema.
 *
 * Three items is structural — the tab row and description panel
 * both assume an exactly-three array.
 */
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
