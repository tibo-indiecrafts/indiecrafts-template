import type { StaticAppPathname } from "@/config";
import type { MessageKey } from "@/types/messages";

export type PricingTier = {
  nameKey: MessageKey;
  priceKey: MessageKey;
  cadenceKey: MessageKey;
  featureKeys: ReadonlyArray<MessageKey>;
  cta: { labelKey: MessageKey; href: StaticAppPathname | `http${string}` | `#${string}` };
};

export type PricingBlock = {
  type: "pricing-05";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;

  outer: readonly [PricingTier, PricingTier];

  highlighted: PricingTier;
};
