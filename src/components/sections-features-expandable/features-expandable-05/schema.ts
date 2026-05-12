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

export type TabIcon = "brain" | "globe" | "bot" | "sparkles" | "zap" | "cpu";

export type FeaturesExpandableItem = {
  illustration: FeatureIllustration;
  /** Lucide icon rendered before the tab label. */
  iconKey: TabIcon;
  /** Decorative bg image painted behind the illustration. */
  bgImageUrl: string;
  /** Tab button label (also used as the bg image alt). */
  tabLabelKey: MessageKey;
};

export type FeaturesExpandableBlock = {
  type: "features-expandable-05";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  items: readonly [
    FeaturesExpandableItem,
    FeaturesExpandableItem,
    FeaturesExpandableItem,
  ];
};
