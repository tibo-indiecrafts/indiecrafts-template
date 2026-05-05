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
  /** Decorative bg image painted (with dither overlay) behind the illustration. */
  bgImageUrl: string;
  /** Pill-button label (no icon — the active tab shows a circular loader instead). */
  tabLabelKey: MessageKey;
};

/**
 * Tailark Pro `expandable-features-18` — auto-cycling 3-tab variant
 * with a 2×2 quadrant grid (`md:grid-cols-2`) wrapped in a shared
 * `bg-foreground/10 gap-px` ring so each quadrant looks like a card
 * separated by a hairline:
 *   1) top-left:    shared title + body + "Learn more" CTA + a tab
 *                   pill row (text + circular SVG loader on active)
 *   2) top-right:   `aspect-7/8` illustration card with dithered bg
 *   3) bottom-left: metrics list (`shieldCheck`/`hourglass` rows)
 *   4) bottom-right: testimonial card (quote + avatar)
 *
 * Title/body/CTA, stats, and testimonial are SHARED across tabs —
 * only the illustration + bg image swap. Three items is structural;
 * stats / testimonial are arrays / single objects (not tied to the
 * tab index). Default 6s autoplay; manual click resets the timer.
 */
export type FeaturesExpandableBlock = {
  type: "features-expandable-18";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
  /** Default 6000ms. */
  autoplayDurationMs?: number;
  items: readonly [
    FeaturesExpandableItem,
    FeaturesExpandableItem,
    FeaturesExpandableItem,
  ];
  stats: readonly StatItem[];
  testimonial: Testimonial;
};
