import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type PricingTier = {
  nameKey: MessageKey;
  descriptionKey: MessageKey;
  priceKey: MessageKey;
  periodKey: MessageKey;
  limitKey: MessageKey;
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
  highlighted?: boolean;
};

export type PricingBlock = {
  type: "pricing-06";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  tiers: ReadonlyArray<PricingTier>;
  footnoteHeadingKey: MessageKey;
  footnoteBodyKey: MessageKey;
};
