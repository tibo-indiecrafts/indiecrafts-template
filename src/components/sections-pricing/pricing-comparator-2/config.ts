import type { PricingBlock } from "./schema";

export const pricingComparator2Key = "pricing-comparator-2" as const;
export const pricingComparator2Namespace = "blocks.pricing-comparator-2" as const;

export const pricingComparator2Sample: Omit<PricingBlock, "id"> = {
  type: "pricing-comparator-2",
  titleKey: "blocks.pricing-comparator-2.title",
  bodyKey: "blocks.pricing-comparator-2.body",
  free: {
    nameKey: "blocks.pricing-comparator-2.free.name",
    priceKey: "blocks.pricing-comparator-2.free.price",
    ctaLabelKey: "blocks.pricing-comparator-2.free.cta",
    ctaHref: "#",
  },
  pro: {
    nameKey: "blocks.pricing-comparator-2.pro.name",
    priceKey: "blocks.pricing-comparator-2.pro.price",
    ctaLabelKey: "blocks.pricing-comparator-2.pro.cta",
    ctaHref: "#",
  },
  rows: [
    {
      nameKey: "blocks.pricing-comparator-2.rows.integrations",
      free: { labelKey: "blocks.pricing-comparator-2.values.integrationsFree" },
      pro: { labelKey: "blocks.pricing-comparator-2.values.integrationsPro" },
    },
    {
      nameKey: "blocks.pricing-comparator-2.rows.apiCalls",
      free: { labelKey: "blocks.pricing-comparator-2.values.apiCallsFree" },
      pro: { labelKey: "blocks.pricing-comparator-2.values.apiCallsPro" },
    },
    {
      nameKey: "blocks.pricing-comparator-2.rows.teamMembers",
      free: { labelKey: "blocks.pricing-comparator-2.values.teamMembersFree" },
      pro: { labelKey: "blocks.pricing-comparator-2.values.teamMembersPro" },
    },
    {
      nameKey: "blocks.pricing-comparator-2.rows.support",
      free: { labelKey: "blocks.pricing-comparator-2.values.supportFree" },
      pro: { labelKey: "blocks.pricing-comparator-2.values.supportPro" },
    },
    {
      nameKey: "blocks.pricing-comparator-2.rows.analytics",
      free: false,
      pro: true,
    },
    {
      nameKey: "blocks.pricing-comparator-2.rows.webhooks",
      free: false,
      pro: true,
    },
    {
      nameKey: "blocks.pricing-comparator-2.rows.security",
      free: false,
      pro: true,
    },
    {
      nameKey: "blocks.pricing-comparator-2.rows.apiAccess",
      free: false,
      pro: true,
    },
  ],
};
