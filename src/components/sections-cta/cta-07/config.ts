import type { CallToActionBlock } from "./schema";

export const cta07Key = "cta-07" as const;
export const cta07Namespace = "blocks.cta-07" as const;

export const cta07Sample: Omit<CallToActionBlock, "id"> = {
  type: "cta-07",
  titleKey: "blocks.cta-07.title",
  bodyKey: "blocks.cta-07.body",
  benefits: [
    "blocks.cta-07.benefits.1",
    "blocks.cta-07.benefits.2",
    "blocks.cta-07.benefits.3",
    "blocks.cta-07.benefits.4",
  ],
  pricePrefixKey: "blocks.cta-07.pricePrefix",
  priceValueKey: "blocks.cta-07.priceValue",
  pricePeriodKey: "blocks.cta-07.pricePeriod",
  priceCaptionKey: "blocks.cta-07.priceCaption",
  cta: { labelKey: "blocks.cta-07.cta", href: "#" },
};
