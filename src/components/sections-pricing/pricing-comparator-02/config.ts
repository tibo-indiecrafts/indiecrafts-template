import type { PricingBlock } from "./schema";

export const pricingComparator02Key = "pricing-comparator-02" as const;
export const pricingComparator02Namespace = "blocks.pricing-comparator-02" as const;

export const pricingComparator02Sample: Omit<PricingBlock, "id"> = {
  type: "pricing-comparator-02",
  titleKey: "blocks.pricing-comparator-02.title",
  bodyKey: "blocks.pricing-comparator-02.body",
  free: {
    nameKey: "blocks.pricing-comparator-02.free.name",
    priceKey: "blocks.pricing-comparator-02.free.price",
    ctaLabelKey: "blocks.pricing-comparator-02.free.cta",
    ctaHref: "#",
  },
  pro: {
    nameKey: "blocks.pricing-comparator-02.pro.name",
    priceKey: "blocks.pricing-comparator-02.pro.price",
    ctaLabelKey: "blocks.pricing-comparator-02.pro.cta",
    ctaHref: "#",
  },
  rows: [
    {
      nameKey: "blocks.pricing-comparator-02.rows.integrations",
      free: { labelKey: "blocks.pricing-comparator-02.values.integrationsFree" },
      pro: { labelKey: "blocks.pricing-comparator-02.values.integrationsPro" },
    },
    {
      nameKey: "blocks.pricing-comparator-02.rows.apiCalls",
      free: { labelKey: "blocks.pricing-comparator-02.values.apiCallsFree" },
      pro: { labelKey: "blocks.pricing-comparator-02.values.apiCallsPro" },
    },
    {
      nameKey: "blocks.pricing-comparator-02.rows.teamMembers",
      free: { labelKey: "blocks.pricing-comparator-02.values.teamMembersFree" },
      pro: { labelKey: "blocks.pricing-comparator-02.values.teamMembersPro" },
    },
    {
      nameKey: "blocks.pricing-comparator-02.rows.support",
      free: { labelKey: "blocks.pricing-comparator-02.values.supportFree" },
      pro: { labelKey: "blocks.pricing-comparator-02.values.supportPro" },
    },
    {
      nameKey: "blocks.pricing-comparator-02.rows.analytics",
      free: false,
      pro: true,
    },
    {
      nameKey: "blocks.pricing-comparator-02.rows.webhooks",
      free: false,
      pro: true,
    },
    {
      nameKey: "blocks.pricing-comparator-02.rows.security",
      free: false,
      pro: true,
    },
    {
      nameKey: "blocks.pricing-comparator-02.rows.apiAccess",
      free: false,
      pro: true,
    },
  ],
};
