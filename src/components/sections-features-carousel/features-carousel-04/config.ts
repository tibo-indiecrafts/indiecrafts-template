import type { FeaturesCarouselBlock } from "./schema";

export const featuresCarousel04Key = "features-carousel-04" as const;
export const featuresCarousel04Namespace = "blocks.features-carousel-04" as const;

export const featuresCarousel04Sample: Omit<FeaturesCarouselBlock, "id"> = {
  type: "features-carousel-04",
  titleKey: "blocks.features-carousel-04.title",
  items: [
    {
      illustration: "models",
      bodyKey: "blocks.features-carousel-04.items.slide1.body",
    },
    {
      illustration: "notesChecklist",
      bodyKey: "blocks.features-carousel-04.items.slide2.body",
    },
    {
      illustration: "workflow",
      bodyKey: "blocks.features-carousel-04.items.slide3.body",
    },
    {
      illustration: "aiAutocomplete",
      bodyKey: "blocks.features-carousel-04.items.slide4.body",
    },
    {
      illustration: "tokenCounter",
      bodyKey: "blocks.features-carousel-04.items.slide5.body",
    },
    {
      illustration: "translation",
      bodyKey: "blocks.features-carousel-04.items.slide6.body",
    },
  ],
};
