import type { FeaturesCarouselBlock } from "./schema";

export const featuresCarousel4Key = "features-carousel-4" as const;
export const featuresCarousel4Namespace = "blocks.features-carousel-4" as const;

export const featuresCarousel4Sample: Omit<FeaturesCarouselBlock, "id"> = {
  type: "features-carousel-4",
  titleKey: "blocks.features-carousel-4.title",
  items: [
    {
      illustration: "models",
      bodyKey: "blocks.features-carousel-4.items.slide1.body",
    },
    {
      illustration: "notesChecklist",
      bodyKey: "blocks.features-carousel-4.items.slide2.body",
    },
    {
      illustration: "workflow",
      bodyKey: "blocks.features-carousel-4.items.slide3.body",
    },
    {
      illustration: "aiAutocomplete",
      bodyKey: "blocks.features-carousel-4.items.slide4.body",
    },
    {
      illustration: "tokenCounter",
      bodyKey: "blocks.features-carousel-4.items.slide5.body",
    },
    {
      illustration: "translation",
      bodyKey: "blocks.features-carousel-4.items.slide6.body",
    },
  ],
};
