import type { FeaturesCarouselBlock } from "./schema";

export const featuresCarousel05Key = "features-carousel-05" as const;
export const featuresCarousel05Namespace = "blocks.features-carousel-05" as const;

export const featuresCarousel05Sample: Omit<FeaturesCarouselBlock, "id"> = {
  type: "features-carousel-05",
  titleKey: "blocks.features-carousel-05.title",
  bodyKey: "blocks.features-carousel-05.body",
  items: [
    {
      illustration: "notesChecklist",
      span: "small",
      titleKey: "blocks.features-carousel-05.items.slide1.title",
      bodyKey: "blocks.features-carousel-05.items.slide1.body",
    },
    {
      illustration: "models",
      span: "large",
      titleKey: "blocks.features-carousel-05.items.slide2.title",
      bodyKey: "blocks.features-carousel-05.items.slide2.body",
    },
    {
      illustration: "workflow",
      span: "small",
      titleKey: "blocks.features-carousel-05.items.slide3.title",
      bodyKey: "blocks.features-carousel-05.items.slide3.body",
    },
    {
      illustration: "map",
      span: "large",
      titleKey: "blocks.features-carousel-05.items.slide4.title",
      bodyKey: "blocks.features-carousel-05.items.slide4.body",
    },
    {
      illustration: "aiAutocomplete",
      span: "small",
      titleKey: "blocks.features-carousel-05.items.slide5.title",
      bodyKey: "blocks.features-carousel-05.items.slide5.body",
    },
    {
      illustration: "flow",
      span: "large",
      titleKey: "blocks.features-carousel-05.items.slide6.title",
      bodyKey: "blocks.features-carousel-05.items.slide6.body",
    },
  ],
};
