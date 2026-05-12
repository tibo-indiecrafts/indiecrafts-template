import type { FeaturesCarouselBlock } from "./schema";

export const featuresCarousel03Key = "features-carousel-03" as const;
export const featuresCarousel03Namespace = "blocks.features-carousel-03" as const;

export const featuresCarousel03Sample: Omit<FeaturesCarouselBlock, "id"> = {
  type: "features-carousel-03",
  titleKey: "blocks.features-carousel-03.title",
  items: [
    {
      illustration: "models",
      bodyKey: "blocks.features-carousel-03.items.slide1.body",
    },
    {
      illustration: "notesChecklist",
      bodyKey: "blocks.features-carousel-03.items.slide2.body",
    },
    {
      illustration: "workflow",
      bodyKey: "blocks.features-carousel-03.items.slide3.body",
    },
    {
      illustration: "aiAutocomplete",
      bodyKey: "blocks.features-carousel-03.items.slide4.body",
    },
    {
      illustration: "tokenCounter",
      bodyKey: "blocks.features-carousel-03.items.slide5.body",
    },
    {
      illustration: "translation",
      bodyKey: "blocks.features-carousel-03.items.slide6.body",
    },
  ],
};
