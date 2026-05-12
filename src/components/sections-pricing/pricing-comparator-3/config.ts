import type { PricingBlock } from "./schema";

export const pricingComparator3Key = "pricing-comparator-3" as const;
export const pricingComparator3Namespace = "blocks.pricing-comparator-3" as const;

export const pricingComparator3Sample: Omit<PricingBlock, "id"> = {
  type: "pricing-comparator-3",
  titleKey: "blocks.pricing-comparator-3.title",
  bodyKey: "blocks.pricing-comparator-3.body",
  features: [
    { id: "integrations", labelKey: "blocks.pricing-comparator-3.features.integrations" },
    { id: "apiCalls", labelKey: "blocks.pricing-comparator-3.features.apiCalls" },
    { id: "support", labelKey: "blocks.pricing-comparator-3.features.support" },
    { id: "analytics", labelKey: "blocks.pricing-comparator-3.features.analytics" },
    { id: "webhooks", labelKey: "blocks.pricing-comparator-3.features.webhooks" },
    { id: "sso", labelKey: "blocks.pricing-comparator-3.features.sso" },
  ],
  tiers: [
    {
      nameKey: "blocks.pricing-comparator-3.starter.name",
      descriptionKey: "blocks.pricing-comparator-3.starter.description",
      priceKey: "blocks.pricing-comparator-3.starter.price",
      periodKey: "blocks.pricing-comparator-3.period",
      cta: { labelKey: "blocks.pricing-comparator-3.starter.cta", href: "#" },
      values: {
        integrations: {
          labelKey: "blocks.pricing-comparator-3.starter.values.integrations",
        },
        apiCalls: { labelKey: "blocks.pricing-comparator-3.starter.values.apiCalls" },
        support: { labelKey: "blocks.pricing-comparator-3.starter.values.support" },
        analytics: false,
        webhooks: false,
        sso: false,
      },
    },
    {
      nameKey: "blocks.pricing-comparator-3.pro.name",
      descriptionKey: "blocks.pricing-comparator-3.pro.description",
      priceKey: "blocks.pricing-comparator-3.pro.price",
      periodKey: "blocks.pricing-comparator-3.period",
      cta: { labelKey: "blocks.pricing-comparator-3.pro.cta", href: "#" },
      highlighted: true,
      values: {
        integrations: { labelKey: "blocks.pricing-comparator-3.pro.values.integrations" },
        apiCalls: { labelKey: "blocks.pricing-comparator-3.pro.values.apiCalls" },
        support: { labelKey: "blocks.pricing-comparator-3.pro.values.support" },
        analytics: true,
        webhooks: true,
        sso: false,
      },
    },
    {
      nameKey: "blocks.pricing-comparator-3.enterprise.name",
      descriptionKey: "blocks.pricing-comparator-3.enterprise.description",
      priceKey: "blocks.pricing-comparator-3.enterprise.price",
      periodKey: "blocks.pricing-comparator-3.enterprise.period",
      cta: { labelKey: "blocks.pricing-comparator-3.enterprise.cta", href: "#" },
      values: {
        integrations: {
          labelKey: "blocks.pricing-comparator-3.enterprise.values.integrations",
        },
        apiCalls: { labelKey: "blocks.pricing-comparator-3.enterprise.values.apiCalls" },
        support: { labelKey: "blocks.pricing-comparator-3.enterprise.values.support" },
        analytics: true,
        webhooks: true,
        sso: true,
      },
    },
  ],
};
