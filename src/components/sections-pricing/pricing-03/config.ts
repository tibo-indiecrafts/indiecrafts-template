import type { PricingBlock } from "./schema";

export const pricing03Key = "pricing-03" as const;
export const pricing03Namespace = "blocks.pricing-03" as const;

export const pricing03Sample: Omit<PricingBlock, "id"> = {
  type: "pricing-03",
  titleKey: "blocks.pricing-03.title",
  bodyKey: "blocks.pricing-03.body",
  planTitleKey: "blocks.pricing-03.planTitle",
  planSubtitleKey: "blocks.pricing-03.planSubtitle",
  priceCurrencyKey: "blocks.pricing-03.priceCurrency",
  priceAmountKey: "blocks.pricing-03.priceAmount",
  cta: { labelKey: "blocks.pricing-03.cta", href: "#" },
  includesKey: "blocks.pricing-03.includes",
  partnersTaglineKey: "blocks.pricing-03.partnersTagline",
  featureKeys: [
    "blocks.pricing-03.features.1",
    "blocks.pricing-03.features.2",
    "blocks.pricing-03.features.3",
    "blocks.pricing-03.features.4",
  ],
};
