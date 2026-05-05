import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type StatIcon = "zap" | "cpu" | "lock" | "sparkles";

export type StatItem = {
  iconKey: StatIcon;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

/**
 * Tailark Pro `features-14` — sister of `features-22` with the layout
 * flipped (text on the left, dropdown illustration on the right) plus
 * an optional rich-text intro paragraph that supports an inline
 * `<strong>` accent. 4-stat footer is identical. Converted to the
 * template pattern: props-driven copy, MessageKey-typed strings,
 * theme tokens.
 */
export type FeaturesBlock = {
  type: "features-26";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  /**
   * Rich-text supporting paragraph rendered below the body. The
   * translation may use `<strong>...</strong>` tags to render an
   * emphasised fragment (rendered as `text-foreground font-medium`).
   */
  introKey?: MessageKey;
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
  stats: readonly [StatItem, StatItem, StatItem, StatItem];
};
