import type { MessageKey } from "@/types/messages";

export type FeaturesExpandableItem = {
  /**
   * Bold lead label rendered both as the collapsed pill text AND as
   * the prefix on the expanded body. The expanded paragraph reads
   * "<strong>{title}.</strong> {body}".
   */
  titleKey: MessageKey;
  /** Description shown only when the row is expanded. */
  bodyKey: MessageKey;
};

/**
 * Tailark Pro `expandable-features-10` — auto-cycling 3-tier variant
 * built on the same `LayoutGroup` pill-stack as `-9` but with the
 * SceneIllustration replaced by **three stacked `ServerIllustration`
 * cards** that translate vertically per active state, plus a
 * horizontal connector line + caption that slides up/down as the
 * active row changes. Auto-cycles every `autoplayDurationMs` (default
 * 7000); manual click resets the timer. Prev/next chevrons sit
 * alongside the pill stack (always visible — no `null` state).
 *
 * Three items is structural — the right column hardcodes three
 * stacked server cards. Converted to the template pattern: props-
 * driven items, MessageKey-typed strings, theme tokens.
 */
export type FeaturesExpandableBlock = {
  type: "features-expandable-10";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  /**
   * Caption rendered next to the horizontal connector line in the
   * right column. Defaults to the section `bodyKey` if omitted.
   */
  captionKey?: MessageKey;
  /** Default 7000ms. */
  autoplayDurationMs?: number;
  items: readonly [
    FeaturesExpandableItem,
    FeaturesExpandableItem,
    FeaturesExpandableItem,
  ];
};
