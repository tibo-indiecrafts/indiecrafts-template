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

export type TabIcon = "brain" | "globe" | "bot" | "sparkles" | "zap" | "cpu" | "shield";

export type StatIcon = "shieldCheck" | "hourglass" | "rocket" | "lock";

export type StatItem = {
  iconKey: StatIcon;
  labelKey: MessageKey;
};

export type SupportiveContent =
  | { kind: "metrics"; stats: readonly StatItem[] }
  | {
      kind: "testimonial";
      quoteKey: MessageKey;
      authorNameKey: MessageKey;
      authorRoleKey: MessageKey;
      authorAvatarUrl: string;
    };

export type FeaturesExpandableItem = {
  illustration: FeatureIllustration;
  iconKey: TabIcon;
  bgImageUrl: string;
  /** Short label shown in the top tab bar. */
  tabLabelKey: MessageKey;
  /** Long title shown in the detail panel below. */
  titleKey: MessageKey;
  /** Detail-panel description. */
  bodyKey: MessageKey;
  /**
   * Per-item supporting content rendered under the description — a
   * compliance/stat list (`kind: "metrics"`) or a customer
   * testimonial (`kind: "testimonial"`). Different items can pick
   * different supportive content.
   */
  supportive: SupportiveContent;
};

/**
 * Tailark Pro `expandable-features-7` — top tab bar (icons + labels,
 * no title) with an animated motion.div indicator that slides under
 * the active tab. Below: 2-column grid where the left column shows
 * the active item's title + description + CTA + supportive content
 * (metrics list OR testimonial) and the right column shows the active
 * illustration over a dithered background image (`aspect-7/8`).
 *
 * Shared CTA (`ctaLabelKey` + `ctaHref`) stays the same across all
 * items. Two items is structural — the upstream balances exactly two
 * tabs in the centered top bar. Converted to the template pattern:
 * props-driven items, MessageKey-typed strings, theme tokens.
 */
export type FeaturesExpandableBlock = {
  type: "features-expandable-7";
  id: string;
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
  items: readonly [FeaturesExpandableItem, FeaturesExpandableItem];
};
