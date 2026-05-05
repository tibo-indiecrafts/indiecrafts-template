import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type FeatureIllustration =
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

export type TabIcon = "brain" | "globe" | "bot" | "sparkles" | "zap" | "cpu" | "shield";

export type FeaturesExpandableItem = {
  illustration: FeatureIllustration;
  iconKey: TabIcon;
  bgImageUrl: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

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

/**
 * Tailark Pro `expandable-features-6` — two-column hero (left: title +
 * body + outline CTA + an accordion of 3 feature rows; right: dithered
 * background-image panel that swaps the active illustration and bg
 * image via Framer Motion). Below the hero, a dashed divider and then
 * a compliance/stats row paired with a customer testimonial.
 *
 * The accordion expands the active row's description in-place via a
 * `grid-rows-[1fr]` ↔ `grid-rows-[0fr]` transition rather than the
 * card-flip pattern used by `features-expandable-1..-5`.
 *
 * Three items is structural (the accordion `grid-rows` template
 * hardcodes three positions). Converted to the template pattern:
 * props-driven items, stats, and testimonial; MessageKey-typed
 * strings; theme tokens.
 */
export type FeaturesExpandableBlock = {
  type: "features-expandable-6";
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
