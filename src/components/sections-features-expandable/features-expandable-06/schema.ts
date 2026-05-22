import type { StaticAppPathname } from "@/config";
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

export type TabIcon = "brain" | "globe" | "bot" | "sparkles" | "zap" | "cpu" | "shield";

export type FeaturesExpandableItem = {
  illustration: FeatureIllustration;
  iconKey: TabIcon;
  bgImageUrl: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

export type StatIcon = "shieldCheck" | "hourglass" | "rocket" | "lock";

export type StatItem = {
  iconKey: StatIcon;
  labelKey: MessageKey;
};

export type Testimonial = {
  quoteKey: MessageKey;
  authorNameKey: MessageKey;
  authorRoleKey: MessageKey;
  authorAvatarUrl: string;
};

export type FeaturesExpandableBlock = {
  type: "features-expandable-06";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
  items: readonly [
    FeaturesExpandableItem,
    FeaturesExpandableItem,
    FeaturesExpandableItem,
  ];
  stats: readonly StatItem[];
  testimonial: Testimonial;
};
