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
  /** Plain label — e.g. "SOC 2", "99.9% uptime". */
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
  /** Decorative bg image painted (with dither overlay) behind the illustration. */
  bgImageUrl: string;
  /** Short pill-button label (e.g. "AI Models"). */
  labelKey: MessageKey;
  /** Large headline shown when the item is active. */
  titleKey: MessageKey;
  /** Body paragraph shown under the headline. */
  bodyKey: MessageKey;
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
  supportive: SupportiveContent;
};

/**
 * Tailark Pro `expandable-features-17` — click-driven 2-tab variant
 * with an asymmetric 2-column layout. The left column holds a
 * pill-button row, the active item's title + body + "Learn more"
 * outline button, AND a supportive-content slot pinned to the
 * bottom (`metrics` 4-line stat list OR `testimonial` quote-card).
 * The right column shows an `aspect-3/4` illustration card with a
 * dithered bg image (`opacity-65` light / `dark:opacity-35`).
 *
 * Two items is structural — the layout assumes two pills sit on
 * one row. Converted to the template pattern: props-driven items,
 * MessageKey-typed strings, theme tokens.
 */
export type FeaturesExpandableBlock = {
  type: "features-expandable-17";
  id: string;
  items: readonly [FeaturesExpandableItem, FeaturesExpandableItem];
};
