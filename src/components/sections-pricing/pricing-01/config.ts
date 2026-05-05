import type { PricingBlock } from "./schema";

export const pricing01Key = "pricing-01" as const;
export const pricing01Namespace = "blocks.pricing-01" as const;

export const pricing01Sample: Omit<PricingBlock, "id"> = {
  type: "pricing-01",
  titleKey: "blocks.pricing-01.title",
  bodyKey: "blocks.pricing-01.body",
  tiers: [
    {
      id: "free",
      nameKey: "blocks.pricing-01.tiers.free.name",
      priceKey: "blocks.pricing-01.tiers.free.price",
      periodKey: "blocks.pricing-01.tiers.free.period",
      descriptionKey: "blocks.pricing-01.tiers.free.description",
      cta: { labelKey: "blocks.pricing-01.tiers.free.cta", href: "/about" },
      featureKeys: [
        "blocks.pricing-01.tiers.free.features.analytics",
        "blocks.pricing-01.tiers.free.features.storage",
        "blocks.pricing-01.tiers.free.features.support",
      ],
    },
    {
      id: "pro",
      nameKey: "blocks.pricing-01.tiers.pro.name",
      priceKey: "blocks.pricing-01.tiers.pro.price",
      periodKey: "blocks.pricing-01.tiers.pro.period",
      descriptionKey: "blocks.pricing-01.tiers.pro.description",
      cta: { labelKey: "blocks.pricing-01.tiers.pro.cta", href: "/about" },
      badgeKey: "blocks.pricing-01.tiers.pro.badge",
      featureKeys: [
        "blocks.pricing-01.tiers.pro.features.everything",
        "blocks.pricing-01.tiers.pro.features.community",
        "blocks.pricing-01.tiers.pro.features.singleUser",
        "blocks.pricing-01.tiers.pro.features.templates",
        "blocks.pricing-01.tiers.pro.features.mobile",
        "blocks.pricing-01.tiers.pro.features.reports",
        "blocks.pricing-01.tiers.pro.features.updates",
        "blocks.pricing-01.tiers.pro.features.security",
      ],
    },
    {
      id: "startup",
      nameKey: "blocks.pricing-01.tiers.startup.name",
      priceKey: "blocks.pricing-01.tiers.startup.price",
      periodKey: "blocks.pricing-01.tiers.startup.period",
      descriptionKey: "blocks.pricing-01.tiers.startup.description",
      cta: { labelKey: "blocks.pricing-01.tiers.startup.cta", href: "/about" },
      featureKeys: [
        "blocks.pricing-01.tiers.startup.features.everything",
        "blocks.pricing-01.tiers.startup.features.storage",
        "blocks.pricing-01.tiers.startup.features.support",
      ],
    },
  ],
};
