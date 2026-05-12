import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type FeaturesExpandableItem = {
  /** Decorative bg image painted (with dither overlay) behind the hero card. */
  bgImageUrl: string;
  /** Tab label shown inside the segmented control. */
  tabLabelKey: MessageKey;
  /** Per-item title shown BELOW the hero card. */
  titleKey: MessageKey;
  /** Per-item body shown next to the title (2-col grid). */
  bodyKey: MessageKey;
};

export type FeaturesExpandableBlock = {
  type: "features-expandable-22";
  id: string;
  /** Section heading at the top. */
  headerTitleKey: MessageKey;
  /** Section subhead. */
  headerBodyKey: MessageKey;
  /** Single shared CTA label sitting next to the segmented control. */
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
  items: readonly [
    FeaturesExpandableItem,
    FeaturesExpandableItem,
    FeaturesExpandableItem,
  ];
};
