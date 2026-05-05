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

export type TabIcon = "brain" | "globe" | "bot" | "sparkles" | "zap" | "cpu";

export type FeaturesExpandableItem = {
  illustration: FeatureIllustration;
  /** Lucide icon rendered before the tab label. */
  iconKey: TabIcon;
  /** Decorative bg image painted behind the illustration. */
  bgImageUrl: string;
  /** Tab button label (also used as the bg image alt). */
  tabLabelKey: MessageKey;
};

/**
 * Tailark Pro `expandable-features-5` — sister of
 * `features-expandable-4` with three visual changes:
 *   - 2-column hero header (title + body side-by-side, not stacked).
 *   - Tab rail floats over the illustration panel and each tab gets
 *     a leading lucide icon (Brain / Globe / Bot by default).
 *   - Panel uses a CSS mask (`/illustration-mask.svg`) for its shape
 *     instead of beveled corners. To swap the silhouette, replace
 *     that file in `public/` with any white-fill SVG.
 *
 * Three slots is structural — the layout fits exactly three tabs.
 * Converted to the template pattern: props-driven items, MessageKey-
 * typed strings, theme tokens.
 */
export type FeaturesExpandableBlock = {
  type: "features-expandable-5";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  items: readonly [
    FeaturesExpandableItem,
    FeaturesExpandableItem,
    FeaturesExpandableItem,
  ];
};
