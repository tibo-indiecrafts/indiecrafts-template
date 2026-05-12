import type { StaticAppPathname } from "@/config/routes.types";
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

export type FeatureIcon = "brain" | "globe" | "bot";

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
  iconKey: FeatureIcon;

  bgImageUrl: string;

  titleKey: MessageKey;

  bodyKey: MessageKey;
};

export type FeaturesExpandableBlock = {
  type: "features-expandable-19";
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
