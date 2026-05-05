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

/**
 * Tailark Pro `expandable-features-21` — auto-cycling 2-tab variant
 * where the trigger UI is built into the headline copy itself. The
 * heading reads as one sentence with two inline trigger pills mid-
 * paragraph (each pill renders an icon glyph in a glowing tile
 * floating left of its label and the label text fills with a
 * gradient when active). Headline structure is a three-segment
 * sentence: `lead {trigger1} mid {trigger2} tail`.
 *
 * Below: a 2-col grid — left is the active title + body + outline
 * "Learn more" CTA + supportive content (`metrics` OR `testimonial`
 * via discriminated union); right is an `aspect-7/8` illustration
 * card with bg image at `opacity-65` light / `dark:opacity-35`.
 *
 * Two items is structural — the three-segment headline literally
 * needs exactly two pills. Default 7s autoplay; manual click resets.
 */
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
