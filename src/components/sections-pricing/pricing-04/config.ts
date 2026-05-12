import type { PricingBlock } from "./schema";

export const pricing04Key = "pricing-04" as const;
export const pricing04Namespace = "blocks.pricing-04" as const;

export const pricing04Sample: Omit<PricingBlock, "id"> = {
  type: "pricing-04",
  titleKey: "blocks.pricing-04.title",
  bodyKey: "blocks.pricing-04.body",
  tiers: [
    {
      nameKey: "blocks.pricing-04.tiers.starter.name",
      descriptionKey: "blocks.pricing-04.tiers.starter.description",
      priceKey: "blocks.pricing-04.tiers.starter.price",
      periodKey: "blocks.pricing-04.period",
      featureKeys: [
        "blocks.pricing-04.tiers.starter.features.1",
        "blocks.pricing-04.tiers.starter.features.2",
        "blocks.pricing-04.tiers.starter.features.3",
        "blocks.pricing-04.tiers.starter.features.4",
      ],
      cta: { labelKey: "blocks.pricing-04.tiers.starter.cta", href: "#" },
    },
    {
      nameKey: "blocks.pricing-04.tiers.pro.name",
      descriptionKey: "blocks.pricing-04.tiers.pro.description",
      priceKey: "blocks.pricing-04.tiers.pro.price",
      periodKey: "blocks.pricing-04.period",
      featureKeys: [
        "blocks.pricing-04.tiers.pro.features.1",
        "blocks.pricing-04.tiers.pro.features.2",
        "blocks.pricing-04.tiers.pro.features.3",
        "blocks.pricing-04.tiers.pro.features.4",
        "blocks.pricing-04.tiers.pro.features.5",
        "blocks.pricing-04.tiers.pro.features.6",
      ],
      cta: { labelKey: "blocks.pricing-04.tiers.pro.cta", href: "#" },
      highlighted: true,
    },
    {
      nameKey: "blocks.pricing-04.tiers.enterprise.name",
      descriptionKey: "blocks.pricing-04.tiers.enterprise.description",
      priceKey: "blocks.pricing-04.tiers.enterprise.price",
      periodKey: "blocks.pricing-04.tiers.enterprise.period",
      featureKeys: [
        "blocks.pricing-04.tiers.enterprise.features.1",
        "blocks.pricing-04.tiers.enterprise.features.2",
        "blocks.pricing-04.tiers.enterprise.features.3",
        "blocks.pricing-04.tiers.enterprise.features.4",
        "blocks.pricing-04.tiers.enterprise.features.5",
        "blocks.pricing-04.tiers.enterprise.features.6",
      ],
      cta: { labelKey: "blocks.pricing-04.tiers.enterprise.cta", href: "#" },
    },
  ],
};
