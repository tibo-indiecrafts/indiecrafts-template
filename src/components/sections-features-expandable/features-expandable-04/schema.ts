import type { MessageKey } from "@/types/messages";

export type FeatureIllustration =
  | "notesMeeting"
  | "calendar"
  | "agentTaskPlanning"
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
  /** Decorative bg image painted behind the illustration in the panel. */
  bgImageUrl: string;
  /** Tab button label on the left rail (also used as accessible name). */
  tabLabelKey: MessageKey;
};

/**
 * Tailark Pro `expandable-features-4` — two-column hero (text +
 * tab-rail on the left, beveled illustration panel on the right) with
 * 3 manually selectable tabs. Clicking a tab crossfades the panel's
 * illustration and bg image via Framer Motion's `AnimatePresence`. No
 * auto-cycle. Three slots is structural — the layout fits exactly
 * three buttons. Converted to the template pattern: props-driven
 * items, MessageKey-typed strings, theme tokens.
 */
export type FeaturesExpandableBlock = {
  type: "features-expandable-04";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  items: readonly [
    FeaturesExpandableItem,
    FeaturesExpandableItem,
    FeaturesExpandableItem,
  ];
};
