import type { StaticAppPathname } from "@/config";
import type { MessageKey } from "@/types/messages";

export type StatIcon = "zap" | "cpu" | "lock" | "sparkles";

export type StatItem = {
  iconKey: StatIcon;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

export type FeaturesBlock = {
  type: "features-22";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
  stats: readonly [StatItem, StatItem, StatItem, StatItem];
};
