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

export type SupportiveContent =
  | { kind: "metrics"; stats: readonly StatItem[] }
  | { kind: "testimonial"; testimonial: Testimonial };

export type FeaturesExpandableItem = {
  illustration: FeatureIllustration;
  iconKey: FeatureIcon;

  bgImageUrl: string;

  labelKey: MessageKey;

  titleKey: MessageKey;

  bodyKey: MessageKey;
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
  supportive: SupportiveContent;
};

export type FeaturesExpandableBlock = {
  type: "features-expandable-17";
  id: string;
  items: readonly [FeaturesExpandableItem, FeaturesExpandableItem];
};
