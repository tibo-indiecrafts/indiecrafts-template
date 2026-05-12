import type { FeaturesCarouselBlock } from "./schema";

export const featuresCarousel01Key = "features-carousel-01" as const;
export const featuresCarousel01Namespace = "blocks.features-carousel-01" as const;

export const featuresCarousel01Sample: Omit<FeaturesCarouselBlock, "id"> = {
  type: "features-carousel-01",
  titleKey: "blocks.features-carousel-01.title",
  items: [
    {
      illustration: "email",
      bodyKey: "blocks.features-carousel-01.items.slide1.body",
    },
    {
      illustration: "notesChecklist",
      bodyKey: "blocks.features-carousel-01.items.slide2.body",
    },
    {
      illustration: "aiAutocomplete",
      bodyKey: "blocks.features-carousel-01.items.slide3.body",
    },
    {
      illustration: "translation",
      bodyKey: "blocks.features-carousel-01.items.slide4.body",
    },
  ],
};
