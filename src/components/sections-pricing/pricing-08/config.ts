import type { PricingBlock } from "./schema";

export const pricing08Key = "pricing-08" as const;
export const pricing08Namespace = "blocks.pricing-08" as const;

export const pricing08Sample: Omit<PricingBlock, "id"> = {
  type: "pricing-08",
  titleKey: "blocks.pricing-08.title",
  bodyKey: "blocks.pricing-08.body",
  trialNoteKey: "blocks.pricing-08.trialNote",
  tiers: [
    {
      nameKey: "blocks.pricing-08.tiers.monthly.name",
      descriptionKey: "blocks.pricing-08.tiers.monthly.description",
      priceKey: "blocks.pricing-08.tiers.monthly.price",
      periodKey: "blocks.pricing-08.period",
      featureKeys: [
        "blocks.pricing-08.tiers.monthly.features.1",
        "blocks.pricing-08.tiers.monthly.features.2",
        "blocks.pricing-08.tiers.monthly.features.3",
      ],
      cta: { labelKey: "blocks.pricing-08.ctaGetStarted", href: "#" },
    },
    {
      nameKey: "blocks.pricing-08.tiers.annual.name",
      descriptionKey: "blocks.pricing-08.tiers.annual.description",
      priceKey: "blocks.pricing-08.tiers.annual.price",
      periodKey: "blocks.pricing-08.period",
      featureKeys: [
        "blocks.pricing-08.tiers.annual.features.1",
        "blocks.pricing-08.tiers.annual.features.2",
        "blocks.pricing-08.tiers.annual.features.3",
      ],
      cta: { labelKey: "blocks.pricing-08.ctaGetStarted", href: "#" },
      highlighted: true,
    },
  ],
};
