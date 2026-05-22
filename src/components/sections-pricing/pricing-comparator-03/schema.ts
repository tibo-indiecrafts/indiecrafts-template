import type { StaticAppPathname } from "@/config";
import type { MessageKey } from "@/types/messages";

export type FeatureValue = { labelKey: MessageKey } | boolean;

export type ComparatorFeature = {
  id: string;
  labelKey: MessageKey;
};

export type ComparatorTier = {
  nameKey: MessageKey;
  descriptionKey: MessageKey;
  priceKey: MessageKey;
  periodKey: MessageKey;
  cta: { labelKey: MessageKey; href: StaticAppPathname | `http${string}` | `#${string}` };
  highlighted?: boolean;

  values: Readonly<Record<string, FeatureValue>>;
};

export type PricingBlock = {
  type: "pricing-comparator-03";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  features: ReadonlyArray<ComparatorFeature>;
  tiers: ReadonlyArray<ComparatorTier>;
};
