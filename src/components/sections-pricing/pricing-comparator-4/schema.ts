import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type FeatureValue = { labelKey: MessageKey } | boolean;

export type ComparatorFeature = {
  /** Stable id used as React key + maps to the row label. */
  id: string;
  labelKey: MessageKey;
};

export type ComparatorTier = {
  /** Stable id used as React key + maps to per-feature `values[id]`. */
  id: string;
  nameKey: MessageKey;
  priceKey: MessageKey;
  periodKey: MessageKey;
  cta: { labelKey: MessageKey; href: StaticAppPathname | `http${string}` | `#${string}` };
  highlighted?: boolean;
};

export type PricingBlock = {
  type: "pricing-comparator-4";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  /** Tier headers (typically 3 — Basic / Pro / Team). */
  tiers: ReadonlyArray<ComparatorTier>;
  /** Feature row labels. */
  features: ReadonlyArray<ComparatorFeature>;
  /** Per-feature × per-tier value matrix: `values[feature.id][tier.id]`. */
  values: Readonly<Record<string, Readonly<Record<string, FeatureValue>>>>;
};
