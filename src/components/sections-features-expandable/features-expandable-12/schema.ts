import type { MessageKey } from "@/types/messages";

export type FeatureIllustration =
  | "collaborationComment"
  | "flowCards"
  | "kanban"
  | "aiSearch"
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

export type IdeIcon = "antigravity" | "cursor" | "windsurf";

export type StatIcon = "shieldCheck" | "hourglass" | "rocket" | "lock";

export type StatItem = {
  iconKey: StatIcon;
  labelKey: MessageKey;
};

export type SupportiveContent =
  | {
      kind: "ideSupport";
      labelKey: MessageKey;
      ides: readonly [IdeIcon, IdeIcon, IdeIcon];
    }
  | {
      kind: "metrics";
      stats: readonly StatItem[];
    }
  | {
      kind: "testimonial";
      quoteKey: MessageKey;
      authorNameKey: MessageKey;
      authorRoleKey: MessageKey;
      authorAvatarUrl: string;
    };

export type FeaturesExpandableItem = {
  illustration: FeatureIllustration;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  supportive: SupportiveContent;
};

/**
 * Tailark Pro `expandable-features-12` — auto-cycling 3-row stack of
 * numbered accordion items (01 / 02 / 03). Each item collapses to a
 * single button row (number + title + active dot) and expands to a
 * 2-col panel (description + supportive content on the left,
 * illustration on the right). A dashed-pixel progress line at the
 * bottom of each row clip-paths from left to right over the autoplay
 * duration. Hover-pause via `peer-active`. Three supportive content
 * kinds via the same discriminated union as `-11`.
 *
 * Three items is structural. Numbers (`01`, `02`, …) are
 * auto-generated from the array index — they're not part of the
 * schema. Converted to the template pattern: props-driven items,
 * MessageKey-typed strings, theme tokens.
 */
export type FeaturesExpandableBlock = {
  type: "features-expandable-12";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  /** Default 7000ms. */
  autoplayDurationMs?: number;
  items: readonly [
    FeaturesExpandableItem,
    FeaturesExpandableItem,
    FeaturesExpandableItem,
  ];
};
