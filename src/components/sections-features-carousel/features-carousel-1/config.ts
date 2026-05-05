import type { FeaturesCarouselBlock } from "./schema";

export const featuresCarousel1Key = "features-carousel-1" as const;
export const featuresCarousel1Namespace = "blocks.features-carousel-1" as const;

export const featuresCarousel1Sample: Omit<FeaturesCarouselBlock, "id"> = {
  type: "features-carousel-1",
  titleKey: "blocks.features-carousel-1.title",
  items: [
    {
      illustration: "email",
      bodyKey: "blocks.features-carousel-1.items.slide1.body",
    },
    {
      illustration: "notesChecklist",
      bodyKey: "blocks.features-carousel-1.items.slide2.body",
    },
    {
      illustration: "aiAutocomplete",
      bodyKey: "blocks.features-carousel-1.items.slide3.body",
    },
    {
      illustration: "translation",
      bodyKey: "blocks.features-carousel-1.items.slide4.body",
    },
  ],
};
