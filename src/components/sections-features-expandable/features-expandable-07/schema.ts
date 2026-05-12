import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type FeatureIllustration =
  | "agentFeedback"
  | "email"
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

export type StatIcon = "shieldCheck" | "hourglass" | "rocket" | "lock";

export type StatItem = {
  iconKey: StatIcon;
  labelKey: MessageKey;
};

export type SupportiveContent =
  | { kind: "metrics"; stats: readonly StatItem[] }
  | {
      kind: "testimonial";
      quoteKey: MessageKey;
      authorNameKey: MessageKey;
      authorRoleKey: MessageKey;
      authorAvatarUrl: string;
    };

export type FeaturesExpandableItem = {
  illustration: FeatureIllustration;
  iconKey: TabIcon;
  bgImageUrl: string;

  tabLabelKey: MessageKey;

  titleKey: MessageKey;

  bodyKey: MessageKey;

  supportive: SupportiveContent;
};

export type FeaturesExpandableBlock = {
  type: "features-expandable-07";
  id: string;
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
  items: readonly [FeaturesExpandableItem, FeaturesExpandableItem];
};
