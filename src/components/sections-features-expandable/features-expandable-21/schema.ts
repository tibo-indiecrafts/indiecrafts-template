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
  | "kanbanTasks"
  | "map"
  | "models"
  | "modelsCredits"
  | "notes"
  | "notesChecklist"
  | "notesMeeting"
  | "tokenCounter"
  | "translation"
  | "workflow";

export type FeatureIcon = "brain" | "bot" | "globe";

export type GradientKind = "amberFuchsia" | "greenSky" | "blueViolet";

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
  gradientKind: GradientKind;

  bgImageUrl: string;

  triggerLabelKey: MessageKey;

  titleKey: MessageKey;

  bodyKey: MessageKey;
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
  supportive: SupportiveContent;
};

export type FeaturesExpandableBlock = {
  type: "features-expandable-21";
  id: string;

  eyebrowKey: MessageKey;

  headlineLeadKey: MessageKey;
  headlineMidKey: MessageKey;
  headlineTailKey: MessageKey;

  autoplayDurationMs?: number;
  items: readonly [FeaturesExpandableItem, FeaturesExpandableItem];
};
