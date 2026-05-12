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
  /** Decorative bg image painted (low-opacity) behind the illustration. */
  bgImageUrl: string;
  /** Inline trigger pill label (e.g. "LLMs", "Personal Agents"). */
  triggerLabelKey: MessageKey;
  /** Big card heading for the active item. */
  titleKey: MessageKey;
  /** Body paragraph for the active item. */
  bodyKey: MessageKey;
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
  supportive: SupportiveContent;
};

export type FeaturesExpandableBlock = {
  type: "features-expandable-21";
  id: string;
  /** Mono eyebrow (e.g. "[ 0.1 ] Features"). */
  eyebrowKey: MessageKey;
  /** Sentence segments: lead {trigger1} mid {trigger2} tail. */
  headlineLeadKey: MessageKey;
  headlineMidKey: MessageKey;
  headlineTailKey: MessageKey;
  /** Default 7000ms. */
  autoplayDurationMs?: number;
  items: readonly [FeaturesExpandableItem, FeaturesExpandableItem];
};
