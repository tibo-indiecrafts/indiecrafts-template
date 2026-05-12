import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type FeaturesExpandableItem = {
  bgImageUrl: string;

  tabLabelKey: MessageKey;

  titleKey: MessageKey;

  bodyKey: MessageKey;
};

export type FeaturesExpandableBlock = {
  type: "features-expandable-22";
  id: string;

  headerTitleKey: MessageKey;

  headerBodyKey: MessageKey;

  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
  items: readonly [
    FeaturesExpandableItem,
    FeaturesExpandableItem,
    FeaturesExpandableItem,
  ];
};
