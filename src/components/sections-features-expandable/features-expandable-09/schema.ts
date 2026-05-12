import type { MessageKey } from "@/types/messages";
import type { SceneDevice } from "@/components/ui-illustrations/scene-illustration";

export type FeaturesExpandableItem = {
  /** Which SVG group in the SceneIllustration this row binds to. */
  device: SceneDevice;
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
  type: "features-expandable-09";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  items: readonly [
    FeaturesExpandableItem,
    FeaturesExpandableItem,
    FeaturesExpandableItem,
    FeaturesExpandableItem,
    FeaturesExpandableItem,
  ];
};
