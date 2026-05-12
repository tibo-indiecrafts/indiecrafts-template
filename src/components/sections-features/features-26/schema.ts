import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type StatIcon = "zap" | "cpu" | "lock" | "sparkles";

export type StatItem = {
  iconKey: StatIcon;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

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
