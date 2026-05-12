import type { PricingBlock } from "./schema";

export const pricing09Key = "pricing-09" as const;
export const pricing09Namespace = "blocks.pricing-09" as const;

export const pricing09Sample: Omit<PricingBlock, "id"> = {
  type: "pricing-09",
  titleKey: "blocks.pricing-09.title",
  planTitleKey: "blocks.pricing-09.planTitle",
  planSubtitleKey: "blocks.pricing-09.planSubtitle",
  priceCurrencyKey: "blocks.pricing-09.priceCurrency",
  priceAmountKey: "blocks.pricing-09.priceAmount",
  cta: { labelKey: "blocks.pricing-09.cta", href: "#" },
  includesKey: "blocks.pricing-09.includes",
  partnersTaglineKey: "blocks.pricing-09.partnersTagline",
  featureKeys: [
    "blocks.pricing-09.features.1",
    "blocks.pricing-09.features.2",
    "blocks.pricing-09.features.3",
    "blocks.pricing-09.features.4",
  ],
};
