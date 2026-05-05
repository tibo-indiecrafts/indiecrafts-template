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
 * Tailark Pro `expandable-features-14` — click-driven 3-column footer
 * variant. The hero is one big illustration panel (default
 * `aspect-4/5`, `aspect-square` on `sm`, `aspect-video` on `md`)
 * masked at the bottom (`mask-b-from-35%`) so it fades into the
 * content row. Below: a 3-column grid where each cell is icon +
 * title + always-visible description, and the active cell is opaque
 * while the inactive ones drop to `opacity-50`. Click any cell to
 * swap the illustration above. No autoplay (manual only).
 *
 * Three items is structural — the footer grid is balanced for
 * exactly three. Converted to the template pattern: props-driven
 * items, MessageKey-typed strings, theme tokens.
 */
export type FeaturesExpandableBlock = {
  type: "features-expandable-14";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  items: readonly [
    FeaturesExpandableItem,
    FeaturesExpandableItem,
    FeaturesExpandableItem,
  ];
};
