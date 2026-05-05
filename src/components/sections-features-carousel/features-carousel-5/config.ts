import type { FeaturesCarouselBlock } from "./schema";

export const featuresCarousel5Key = "features-carousel-5" as const;
export const featuresCarousel5Namespace = "blocks.features-carousel-5" as const;

export const featuresCarousel5Sample: Omit<FeaturesCarouselBlock, "id"> = {
  type: "features-carousel-5",
  titleKey: "blocks.features-carousel-5.title",
  bodyKey: "blocks.features-carousel-5.body",
  items: [
    {
      illustration: "notesChecklist",
      span: "small",
      titleKey: "blocks.features-carousel-5.items.slide1.title",
      bodyKey: "blocks.features-carousel-5.items.slide1.body",
    },
    {
      illustration: "models",
      span: "large",
      titleKey: "blocks.features-carousel-5.items.slide2.title",
      bodyKey: "blocks.features-carousel-5.items.slide2.body",
    },
    {
      illustration: "workflow",
      span: "small",
      titleKey: "blocks.features-carousel-5.items.slide3.title",
      bodyKey: "blocks.features-carousel-5.items.slide3.body",
    },
    {
      illustration: "map",
      span: "large",
      titleKey: "blocks.features-carousel-5.items.slide4.title",
      bodyKey: "blocks.features-carousel-5.items.slide4.body",
    },
    {
      illustration: "aiAutocomplete",
      span: "small",
      titleKey: "blocks.features-carousel-5.items.slide5.title",
      bodyKey: "blocks.features-carousel-5.items.slide5.body",
    },
    {
      illustration: "flow",
      span: "large",
      titleKey: "blocks.features-carousel-5.items.slide6.title",
      bodyKey: "blocks.features-carousel-5.items.slide6.body",
    },
  ],
};
