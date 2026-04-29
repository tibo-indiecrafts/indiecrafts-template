import type { Pricing1Block } from "./schema";

export const pricing1Sample: Omit<Pricing1Block, "id"> = {
  type: "pricing-1",
  titleKey: "blocks.pricing-1.title",
  bodyKey: "blocks.pricing-1.body",
  tiers: [
    {
      id: "free",
      nameKey: "blocks.pricing-1.tiers.free.name",
      priceKey: "blocks.pricing-1.tiers.free.price",
      periodKey: "blocks.pricing-1.tiers.free.period",
      descriptionKey: "blocks.pricing-1.tiers.free.description",
      cta: { labelKey: "blocks.pricing-1.tiers.free.cta", href: "/about" },
      featureKeys: [
        "blocks.pricing-1.tiers.free.features.analytics",
        "blocks.pricing-1.tiers.free.features.storage",
        "blocks.pricing-1.tiers.free.features.support",
      ],
    },
    {
      id: "pro",
      nameKey: "blocks.pricing-1.tiers.pro.name",
      priceKey: "blocks.pricing-1.tiers.pro.price",
      periodKey: "blocks.pricing-1.tiers.pro.period",
      descriptionKey: "blocks.pricing-1.tiers.pro.description",
      cta: { labelKey: "blocks.pricing-1.tiers.pro.cta", href: "/about" },
      badgeKey: "blocks.pricing-1.tiers.pro.badge",
      featureKeys: [
        "blocks.pricing-1.tiers.pro.features.everything",
        "blocks.pricing-1.tiers.pro.features.community",
        "blocks.pricing-1.tiers.pro.features.singleUser",
        "blocks.pricing-1.tiers.pro.features.templates",
        "blocks.pricing-1.tiers.pro.features.mobile",
        "blocks.pricing-1.tiers.pro.features.reports",
        "blocks.pricing-1.tiers.pro.features.updates",
        "blocks.pricing-1.tiers.pro.features.security",
      ],
    },
    {
      id: "startup",
      nameKey: "blocks.pricing-1.tiers.startup.name",
      priceKey: "blocks.pricing-1.tiers.startup.price",
      periodKey: "blocks.pricing-1.tiers.startup.period",
      descriptionKey: "blocks.pricing-1.tiers.startup.description",
      cta: { labelKey: "blocks.pricing-1.tiers.startup.cta", href: "/about" },
      featureKeys: [
        "blocks.pricing-1.tiers.startup.features.everything",
        "blocks.pricing-1.tiers.startup.features.storage",
        "blocks.pricing-1.tiers.startup.features.support",
      ],
    },
  ],
};
