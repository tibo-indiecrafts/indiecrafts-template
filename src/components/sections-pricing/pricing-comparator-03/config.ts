import type { PricingBlock } from "./schema";

export const pricingComparator03Key = "pricing-comparator-03" as const;
export const pricingComparator03Namespace = "blocks.pricing-comparator-03" as const;

export const pricingComparator03Sample: Omit<PricingBlock, "id"> = {
  type: "pricing-comparator-03",
  titleKey: "blocks.pricing-comparator-03.title",
  bodyKey: "blocks.pricing-comparator-03.body",
  features: [
    {
      id: "integrations",
      labelKey: "blocks.pricing-comparator-03.features.integrations",
    },
    { id: "apiCalls", labelKey: "blocks.pricing-comparator-03.features.apiCalls" },
    { id: "support", labelKey: "blocks.pricing-comparator-03.features.support" },
    { id: "analytics", labelKey: "blocks.pricing-comparator-03.features.analytics" },
    { id: "webhooks", labelKey: "blocks.pricing-comparator-03.features.webhooks" },
    { id: "sso", labelKey: "blocks.pricing-comparator-03.features.sso" },
  ],
  tiers: [
    {
      nameKey: "blocks.pricing-comparator-03.starter.name",
      descriptionKey: "blocks.pricing-comparator-03.starter.description",
      priceKey: "blocks.pricing-comparator-03.starter.price",
      periodKey: "blocks.pricing-comparator-03.period",
      cta: { labelKey: "blocks.pricing-comparator-03.starter.cta", href: "#" },
      values: {
        integrations: {
          labelKey: "blocks.pricing-comparator-03.starter.values.integrations",
        },
        apiCalls: { labelKey: "blocks.pricing-comparator-03.starter.values.apiCalls" },
        support: { labelKey: "blocks.pricing-comparator-03.starter.values.support" },
        analytics: false,
        webhooks: false,
        sso: false,
      },
    },
    {
      nameKey: "blocks.pricing-comparator-03.pro.name",
      descriptionKey: "blocks.pricing-comparator-03.pro.description",
      priceKey: "blocks.pricing-comparator-03.pro.price",
      periodKey: "blocks.pricing-comparator-03.period",
      cta: { labelKey: "blocks.pricing-comparator-03.pro.cta", href: "#" },
      highlighted: true,
      values: {
        integrations: {
          labelKey: "blocks.pricing-comparator-03.pro.values.integrations",
        },
        apiCalls: { labelKey: "blocks.pricing-comparator-03.pro.values.apiCalls" },
        support: { labelKey: "blocks.pricing-comparator-03.pro.values.support" },
        analytics: true,
        webhooks: true,
        sso: false,
      },
    },
    {
      nameKey: "blocks.pricing-comparator-03.enterprise.name",
      descriptionKey: "blocks.pricing-comparator-03.enterprise.description",
      priceKey: "blocks.pricing-comparator-03.enterprise.price",
      periodKey: "blocks.pricing-comparator-03.enterprise.period",
      cta: { labelKey: "blocks.pricing-comparator-03.enterprise.cta", href: "#" },
      values: {
        integrations: {
          labelKey: "blocks.pricing-comparator-03.enterprise.values.integrations",
        },
        apiCalls: { labelKey: "blocks.pricing-comparator-03.enterprise.values.apiCalls" },
        support: { labelKey: "blocks.pricing-comparator-03.enterprise.values.support" },
        analytics: true,
        webhooks: true,
        sso: true,
      },
    },
  ],
};
