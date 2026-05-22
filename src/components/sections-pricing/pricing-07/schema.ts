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
  type: "pricing-07";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;

  basic: PricingTier;

  pro: PricingTier;

  proFeaturesIntroKey: MessageKey;
};
