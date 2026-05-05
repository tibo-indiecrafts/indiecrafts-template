import type { FeaturesCarouselBlock } from "./schema";

export const featuresCarousel3Key = "features-carousel-3" as const;
export const featuresCarousel3Namespace = "blocks.features-carousel-3" as const;

export const featuresCarousel3Sample: Omit<FeaturesCarouselBlock, "id"> = {
  type: "features-carousel-3",
  titleKey: "blocks.features-carousel-3.title",
  items: [
    {
      illustration: "models",
      bodyKey: "blocks.features-carousel-3.items.slide1.body",
    },
    {
      illustration: "notesChecklist",
      bodyKey: "blocks.features-carousel-3.items.slide2.body",
    },
    {
      illustration: "workflow",
      bodyKey: "blocks.features-carousel-3.items.slide3.body",
    },
    {
      illustration: "aiAutocomplete",
      bodyKey: "blocks.features-carousel-3.items.slide4.body",
    },
    {
      illustration: "tokenCounter",
      bodyKey: "blocks.features-carousel-3.items.slide5.body",
    },
    {
      illustration: "translation",
      bodyKey: "blocks.features-carousel-3.items.slide6.body",
    },
  ],
};
