import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type PricingTier = {
  id: string;
  nameKey: MessageKey;
  priceKey: MessageKey;
  periodKey?: MessageKey;
  descriptionKey?: MessageKey;
  cta: { labelKey: MessageKey; href: StaticAppPathname };
  featureKeys: readonly MessageKey[];
  /** Show a badge (e.g. "Popular") above the tier. */
  badgeKey?: MessageKey;
};

/**
 * Tailark `pricing` — 3-tier grid with optional "Popular" badge. Converted
 * to the template pattern: props-driven content, MessageKey strings,
 * theme tokens.
 */
export type PricingBlock = {
  type: "pricing-01";
  id: string;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  tiers: readonly PricingTier[];
};
