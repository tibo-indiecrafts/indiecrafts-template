import type { MessageKey } from "@/types/messages";

export type StatIcon = "clock" | "zap" | "calendar";

export type StatItem = {
  iconKey: StatIcon;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

/**
 * Tailark Pro `features-7` — full-bleed framed panel with masked dashed
 * cross-rules: a tabbed code-block illustration sits above a 3-column
 * stat grid with icon highlights. Converted to the template pattern:
 * props-driven stats, MessageKey-typed strings, theme tokens.
 *
 * The upstream registry repeated the 3rd stat as a `md:hidden` 4th
 * item to fill the mobile 2x2 grid. Dropped — an orphan card on mobile
 * 2nd row is the cleaner outcome than visible duplicate copy.
 */
export type FeaturesBlock = {
  type: "features-19";
  id: string;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  stats: readonly [StatItem, StatItem, StatItem];
};
