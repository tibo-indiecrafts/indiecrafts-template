import type { MessageKey } from "@/types/messages";

export type FeatureIllustration =
  | "collaborationComment"
  | "flowCards"
  | "kanban"
  | "aiSearch"
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

export type IdeIcon = "antigravity" | "cursor" | "windsurf";

export type StatIcon = "shieldCheck" | "hourglass" | "rocket" | "lock";

export type StatItem = {
  iconKey: StatIcon;
  labelKey: MessageKey;
};

export type SupportiveContent =
  | {
      kind: "ideSupport";
      labelKey: MessageKey;
      ides: readonly [IdeIcon, IdeIcon, IdeIcon];
    }
  | {
      kind: "metrics";
      stats: readonly StatItem[];
    }
  | {
      kind: "testimonial";
      quoteKey: MessageKey;
      authorNameKey: MessageKey;
      authorRoleKey: MessageKey;
      authorAvatarUrl: string;
    };

export type FeaturesExpandableItem = {
  illustration: FeatureIllustration;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  supportive: SupportiveContent;
};

export type FeaturesExpandableBlock = {
  type: "features-expandable-12";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  /** Default 7000ms. */
  autoplayDurationMs?: number;
  items: readonly [
    FeaturesExpandableItem,
    FeaturesExpandableItem,
    FeaturesExpandableItem,
  ];
};
