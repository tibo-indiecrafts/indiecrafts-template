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
  /** Decorative bg image painted (with dither overlay) behind the illustration. */
  bgImageUrl: string;
  /** Accordion-row title (e.g. "AI Models"). */
  titleKey: MessageKey;
  /** Body paragraph that slides open under the active row. */
  bodyKey: MessageKey;
};

/**
 * Tailark Pro `expandable-features-19` — click-driven 2×2 quadrant
 * grid sibling of `-18`. Same `bg-foreground/10 gap-px` ring with
 * four equally-sized cards:
 *   1) top-left:    shared section title + body + "Learn more" CTA
 *                   above a vertical accordion list (3 rows). Each
 *                   row has icon + title; clicking expands the body
 *                   underneath via a `grid-rows-[1fr|0fr]` slide.
 *   2) top-right:   `aspect-3/4` illustration card with dithered bg.
 *   3) bottom-left: shared metrics list (`shieldCheck`/`hourglass`).
 *   4) bottom-right: shared testimonial card.
 *
 * Title/body/CTA, stats, and testimonial are SHARED across tabs.
 * Three items is structural (the accordion's grid-rows template
 * hardcodes three positions). No autoplay — manual click only.
 */
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
