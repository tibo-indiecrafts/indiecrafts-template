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
