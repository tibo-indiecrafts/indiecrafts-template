import type { PricingBlock } from "./schema";

export const pricing06Key = "pricing-06" as const;
export const pricing06Namespace = "blocks.pricing-06" as const;

export const pricing06Sample: Omit<PricingBlock, "id"> = {
  type: "pricing-06",
  titleKey: "blocks.pricing-06.title",
  bodyKey: "blocks.pricing-06.body",
  footnoteHeadingKey: "blocks.pricing-06.footnoteHeading",
  footnoteBodyKey: "blocks.pricing-06.footnoteBody",
  tiers: [
    {
      nameKey: "blocks.pricing-06.tiers.hobby.name",
      descriptionKey: "blocks.pricing-06.tiers.hobby.description",
      priceKey: "blocks.pricing-06.tiers.hobby.price",
      periodKey: "blocks.pricing-06.period",
      limitKey: "blocks.pricing-06.tiers.hobby.limit",
      ctaLabelKey: "blocks.pricing-06.ctaGetStarted",
      ctaHref: "#",
    },
    {
      nameKey: "blocks.pricing-06.tiers.pro.name",
      descriptionKey: "blocks.pricing-06.tiers.pro.description",
      priceKey: "blocks.pricing-06.tiers.pro.price",
      periodKey: "blocks.pricing-06.period",
      limitKey: "blocks.pricing-06.tiers.pro.limit",
      ctaLabelKey: "blocks.pricing-06.ctaGetStarted",
      ctaHref: "#",
      highlighted: true,
    },
    {
      nameKey: "blocks.pricing-06.tiers.scale.name",
      descriptionKey: "blocks.pricing-06.tiers.scale.description",
      priceKey: "blocks.pricing-06.tiers.scale.price",
      periodKey: "blocks.pricing-06.period",
      limitKey: "blocks.pricing-06.tiers.scale.limit",
      ctaLabelKey: "blocks.pricing-06.ctaGetStarted",
      ctaHref: "#",
    },
    {
      nameKey: "blocks.pricing-06.tiers.enterprise.name",
      descriptionKey: "blocks.pricing-06.tiers.enterprise.description",
      priceKey: "blocks.pricing-06.tiers.enterprise.price",
      periodKey: "blocks.pricing-06.tiers.enterprise.period",
      limitKey: "blocks.pricing-06.tiers.enterprise.limit",
      ctaLabelKey: "blocks.pricing-06.ctaContact",
      ctaHref: "#",
    },
  ],
};
