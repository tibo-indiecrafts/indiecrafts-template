import type { StaticAppPathname } from "@/config";
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
  | "map"
  | "models"
  | "modelsCredits"
  | "notes"
  | "notesChecklist"
  | "notesMeeting"
  | "tokenCounter"
  | "translation"
  | "workflow";

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

export type FeaturesExpandableItem = {
  illustration: FeatureIllustration;

  bgImageUrl: string;

  tabLabelKey: MessageKey;
};

export type FeaturesExpandableBlock = {
  type: "features-expandable-18";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;

  autoplayDurationMs?: number;
  items: readonly [
    FeaturesExpandableItem,
    FeaturesExpandableItem,
    FeaturesExpandableItem,
  ];
  stats: readonly StatItem[];
  testimonial: Testimonial;
};
