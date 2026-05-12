import type { MessageKey } from "@/types/messages";

export type FeaturesExpandableItem = {
  titleKey: MessageKey;

  bodyKey: MessageKey;
};

export type FeaturesExpandableBlock = {
  type: "features-expandable-10";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;

  captionKey?: MessageKey;

  autoplayDurationMs?: number;
  items: readonly [
    FeaturesExpandableItem,
    FeaturesExpandableItem,
    FeaturesExpandableItem,
  ];
};
