import type { PricingComparatorBlock } from "./schema";

export const pricingComparatorSample: Omit<PricingComparatorBlock, "id"> = {
  type: "pricing-comparator",
  includedSrKey: "blocks.pricing-comparator.sr.included",
  notIncludedSrKey: "blocks.pricing-comparator.sr.notIncluded",
  tiers: [
    {
      id: "free",
      labelKey: "blocks.pricing-comparator.tiers.free.label",
      ctaLabelKey: "blocks.pricing-comparator.tiers.free.cta",
      ctaHref: "#",
    },
    {
      id: "pro",
      labelKey: "blocks.pricing-comparator.tiers.pro.label",
      ctaLabelKey: "blocks.pricing-comparator.tiers.pro.cta",
      ctaHref: "#",
      highlighted: true,
    },
    {
      id: "startup",
      labelKey: "blocks.pricing-comparator.tiers.startup.label",
      ctaLabelKey: "blocks.pricing-comparator.tiers.startup.cta",
      ctaHref: "#",
    },
  ],
  groups: [
    {
      iconKey: "cpu",
      labelKey: "blocks.pricing-comparator.groups.features.label",
      rows: [
        {
          labelKey: "blocks.pricing-comparator.groups.features.rows.tokens",
          values: [
            undefined,
            "blocks.pricing-comparator.values.twentyUsers",
            "blocks.pricing-comparator.values.unlimited",
          ],
        },
        {
          labelKey: "blocks.pricing-comparator.groups.features.rows.videoCalls",
          values: [
            undefined,
            "blocks.pricing-comparator.values.twelveWeeks",
            "blocks.pricing-comparator.values.fiftySix",
          ],
        },
        {
          labelKey: "blocks.pricing-comparator.groups.features.rows.support",
          values: [
            undefined,
            "blocks.pricing-comparator.values.seconds",
            "blocks.pricing-comparator.values.unlimited",
          ],
        },
        {
          labelKey: "blocks.pricing-comparator.groups.features.rows.security",
          values: [
            undefined,
            "blocks.pricing-comparator.values.twentyUsers",
            "blocks.pricing-comparator.values.unlimited",
          ],
        },
      ],
    },
    {
      iconKey: "sparkles",
      labelKey: "blocks.pricing-comparator.groups.ai.label",
      rows: [
        {
          labelKey: "blocks.pricing-comparator.groups.ai.rows.feature1",
          values: [true, true, true],
        },
        {
          labelKey: "blocks.pricing-comparator.groups.ai.rows.feature2",
          values: [true, true, true],
        },
        {
          labelKey: "blocks.pricing-comparator.groups.ai.rows.feature3",
          values: [undefined, true, true],
        },
      ],
    },
  ],
};
