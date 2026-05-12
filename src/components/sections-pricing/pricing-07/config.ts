import type { PricingBlock } from "./schema";

export const pricing07Key = "pricing-07" as const;
export const pricing07Namespace = "blocks.pricing-07" as const;

export const pricing07Sample: Omit<PricingBlock, "id"> = {
  type: "pricing-07",
  titleKey: "blocks.pricing-07.title",
  bodyKey: "blocks.pricing-07.body",
  proFeaturesIntroKey: "blocks.pricing-07.proFeaturesIntro",
  basic: {
    nameKey: "blocks.pricing-07.tiers.free.name",
    priceKey: "blocks.pricing-07.tiers.free.price",
    cadenceKey: "blocks.pricing-07.cadence",
    featureKeys: [
      "blocks.pricing-07.tiers.free.features.1",
      "blocks.pricing-07.tiers.free.features.2",
      "blocks.pricing-07.tiers.free.features.3",
    ],
    cta: { labelKey: "blocks.pricing-07.ctaGetStarted", href: "#" },
  },
  pro: {
    nameKey: "blocks.pricing-07.tiers.pro.name",
    priceKey: "blocks.pricing-07.tiers.pro.price",
    cadenceKey: "blocks.pricing-07.cadence",
    featureKeys: [
      "blocks.pricing-07.tiers.pro.features.1",
      "blocks.pricing-07.tiers.pro.features.2",
      "blocks.pricing-07.tiers.pro.features.3",
      "blocks.pricing-07.tiers.pro.features.4",
      "blocks.pricing-07.tiers.pro.features.5",
      "blocks.pricing-07.tiers.pro.features.6",
      "blocks.pricing-07.tiers.pro.features.7",
      "blocks.pricing-07.tiers.pro.features.8",
      "blocks.pricing-07.tiers.pro.features.9",
      "blocks.pricing-07.tiers.pro.features.10",
    ],
    cta: { labelKey: "blocks.pricing-07.ctaGetStarted", href: "#" },
  },
};
