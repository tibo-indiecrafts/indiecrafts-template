import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type StatIcon = "zap" | "cpu" | "lock" | "sparkles";

export type StatItem = {
  iconKey: StatIcon;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

/**
 * Tailark Pro `features-10` — two-column hero (left: an account-
 * switcher dropdown illustration; right: title + body + outline CTA)
 * sitting above a 4-stat footer strip with icon highlights. Converted
 * to the template pattern: props-driven copy, MessageKey-typed
 * strings, theme tokens.
 */
export type FeaturesBlock = {
  type: "features-22";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
  stats: readonly [StatItem, StatItem, StatItem, StatItem];
};
