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

  badgeKey?: MessageKey;
};

export type PricingBlock = {
  type: "pricing-01";
  id: string;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  tiers: readonly PricingTier[];
};
