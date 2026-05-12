import type { PricingBlock } from "./schema";

export const pricing02Key = "pricing-02" as const;
export const pricing02Namespace = "blocks.pricing-02" as const;

export const pricing02Sample: Omit<PricingBlock, "id"> = {
  type: "pricing-02",
  titleKey: "blocks.pricing-02.title",
  bodyKey: "blocks.pricing-02.body",
  tiers: [
    {
      nameKey: "blocks.pricing-02.tiers.free.name",
      priceKey: "blocks.pricing-02.tiers.free.price",
      cadenceKey: "blocks.pricing-02.cadence",
      featureKeys: [
        "blocks.pricing-02.tiers.free.features.1",
        "blocks.pricing-02.tiers.free.features.2",
        "blocks.pricing-02.tiers.free.features.3",
      ],
      cta: { labelKey: "blocks.pricing-02.ctaGetStarted", href: "#" },
    },
    {
      nameKey: "blocks.pricing-02.tiers.pro.name",
      priceKey: "blocks.pricing-02.tiers.pro.price",
      cadenceKey: "blocks.pricing-02.cadence",
      featureKeys: [
        "blocks.pricing-02.tiers.pro.features.1",
        "blocks.pricing-02.tiers.pro.features.2",
        "blocks.pricing-02.tiers.pro.features.3",
        "blocks.pricing-02.tiers.pro.features.4",
        "blocks.pricing-02.tiers.pro.features.5",
        "blocks.pricing-02.tiers.pro.features.6",
        "blocks.pricing-02.tiers.pro.features.7",
        "blocks.pricing-02.tiers.pro.features.8",
        "blocks.pricing-02.tiers.pro.features.9",
        "blocks.pricing-02.tiers.pro.features.10",
      ],
      cta: { labelKey: "blocks.pricing-02.ctaGetStarted", href: "#" },
      popular: true,
      popularLabelKey: "blocks.pricing-02.popularBadge",
    },
    {
      nameKey: "blocks.pricing-02.tiers.startup.name",
      priceKey: "blocks.pricing-02.tiers.startup.price",
      cadenceKey: "blocks.pricing-02.cadence",
      featureKeys: [
        "blocks.pricing-02.tiers.startup.features.1",
        "blocks.pricing-02.tiers.startup.features.2",
        "blocks.pricing-02.tiers.startup.features.3",
      ],
      cta: { labelKey: "blocks.pricing-02.ctaGetStarted", href: "#" },
    },
  ],
};
