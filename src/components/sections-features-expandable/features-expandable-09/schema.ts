import type { MessageKey } from "@/types/messages";
import type { SceneDevice } from "@/components/ui-illustrations/scene-illustration";

export type FeaturesExpandableItem = {
  device: SceneDevice;

  titleKey: MessageKey;

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
