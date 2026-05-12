import type { PricingBlock } from "./schema";

export const pricing05Key = "pricing-05" as const;
export const pricing05Namespace = "blocks.pricing-05" as const;

export const pricing05Sample: Omit<PricingBlock, "id"> = {
  type: "pricing-05",
  titleKey: "blocks.pricing-05.title",
  bodyKey: "blocks.pricing-05.body",
  outer: [
    {
      nameKey: "blocks.pricing-05.tiers.free.name",
      priceKey: "blocks.pricing-05.tiers.free.price",
      cadenceKey: "blocks.pricing-05.cadence",
      featureKeys: [
        "blocks.pricing-05.tiers.free.features.1",
        "blocks.pricing-05.tiers.free.features.2",
        "blocks.pricing-05.tiers.free.features.3",
      ],
      cta: { labelKey: "blocks.pricing-05.ctaGetStarted", href: "#" },
    },
    {
      nameKey: "blocks.pricing-05.tiers.proPlus.name",
      priceKey: "blocks.pricing-05.tiers.proPlus.price",
      cadenceKey: "blocks.pricing-05.cadence",
      featureKeys: [
        "blocks.pricing-05.tiers.proPlus.features.1",
        "blocks.pricing-05.tiers.proPlus.features.2",
        "blocks.pricing-05.tiers.proPlus.features.3",
      ],
      cta: { labelKey: "blocks.pricing-05.ctaGetStarted", href: "#" },
    },
  ],
  highlighted: {
    nameKey: "blocks.pricing-05.tiers.pro.name",
    priceKey: "blocks.pricing-05.tiers.pro.price",
    cadenceKey: "blocks.pricing-05.cadence",
    featureKeys: [
      "blocks.pricing-05.tiers.pro.features.1",
      "blocks.pricing-05.tiers.pro.features.2",
      "blocks.pricing-05.tiers.pro.features.3",
      "blocks.pricing-05.tiers.pro.features.4",
      "blocks.pricing-05.tiers.pro.features.5",
      "blocks.pricing-05.tiers.pro.features.6",
      "blocks.pricing-05.tiers.pro.features.7",
      "blocks.pricing-05.tiers.pro.features.8",
      "blocks.pricing-05.tiers.pro.features.9",
      "blocks.pricing-05.tiers.pro.features.10",
    ],
    cta: { labelKey: "blocks.pricing-05.ctaGetStarted", href: "#" },
  },
};
