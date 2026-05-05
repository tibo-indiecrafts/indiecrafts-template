import type { MessageKey } from "@/types/messages";

export type FeatureIllustration =
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
 * Tailark Pro `expandable-features-11` — auto-cycling 3-item variant
 * with an accordion-style left rail (each row carries its own
 * supportive content slot) and a dotted-grid illustration panel on
 * the right. Three supportive content kinds are supported per-item
 * via a discriminated union: `ideSupport` (3 IDE icon tiles),
 * `metrics` (compliance/stat list), `testimonial` (quote + author
 * card). Auto-cycles every 7s; manual click resets the timer.
 *
 * Three items is structural — the layout's `grid-rows` template
 * hardcodes three accordion positions. Converted to the template
 * pattern: props-driven items with discriminated supportive content,
 * MessageKey-typed strings, theme tokens.
 */
export type FeaturesExpandableBlock = {
  type: "features-expandable-11";
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
