import type { StaticAppPathname } from "@/config";
import type { MessageKey } from "@/types/messages";

export type FeatureValue = { labelKey: MessageKey } | boolean;

export type ComparatorFeature = {
  id: string;
  labelKey: MessageKey;
};

export type ComparatorTier = {
  id: string;
  nameKey: MessageKey;
  priceKey: MessageKey;
  periodKey: MessageKey;
  cta: { labelKey: MessageKey; href: StaticAppPathname | `http${string}` | `#${string}` };
  highlighted?: boolean;
};

export type PricingBlock = {
  type: "pricing-comparator-04";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;

  tiers: ReadonlyArray<ComparatorTier>;

  features: ReadonlyArray<ComparatorFeature>;

  values: Readonly<Record<string, Readonly<Record<string, FeatureValue>>>>;
};
