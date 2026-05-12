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
  /** Decorative bg image painted behind the illustration. */
  bgImageUrl: string;
  /** Pill-button label (no icon — the active tab shows a loader instead). */
  tabLabelKey: MessageKey;
};

/**
 * Tailark Pro `expandable-features-8` — auto-cycling 3-tab variant
 * built from the same building blocks as `-6` and `-7`. Single
 * shared title + body + CTA on the left (they don't change when the
 * tab changes), with a row of pill-style tab buttons under them; the
 * active tab shows a **circular SVG loader** that draws across the
 * autoplay duration (default 6s). Right column shows the active
 * illustration over a dithered bg image (`aspect-7/8`).
 *
 * Below the hero: a dashed `h-px` divider, then the same stats +
 * testimonial footer as `-6`. Three items is structural — the pill
 * row is balanced for exactly three. Converted to the template
 * pattern: props-driven items, stats, testimonial.
 */
export type FeaturesExpandableBlock = {
  type: "features-expandable-08";
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
