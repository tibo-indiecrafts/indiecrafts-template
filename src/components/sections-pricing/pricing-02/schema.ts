import type { StaticAppPathname } from "@/config";
import type { MessageKey } from "@/types/messages";

export type PricingTier = {
  nameKey: MessageKey;
  priceKey: MessageKey;
  cadenceKey: MessageKey;
  featureKeys: ReadonlyArray<MessageKey>;
  cta: { labelKey: MessageKey; href: StaticAppPathname | `http${string}` | `#${string}` };
  popular?: boolean;
  popularLabelKey?: MessageKey;
};

export type PricingBlock = {
  type: "pricing-02";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  tiers: readonly [PricingTier, PricingTier, PricingTier];
};
