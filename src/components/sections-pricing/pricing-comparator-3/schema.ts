import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type FeatureValue = { labelKey: MessageKey } | boolean;

export type ComparatorFeature = {
  /** Stable id used as React key + maps to the row label. */
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
  /** Map of feature id → value. Keys must match `features[].id`. */
  values: Readonly<Record<string, FeatureValue>>;
};

export type PricingBlock = {
  type: "pricing-comparator-3";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  features: ReadonlyArray<ComparatorFeature>;
  tiers: ReadonlyArray<ComparatorTier>;
};
