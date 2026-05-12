import type { FeaturesCarouselBlock } from "./schema";

export const featuresCarousel02Key = "features-carousel-02" as const;
export const featuresCarousel02Namespace = "blocks.features-carousel-02" as const;

export const featuresCarousel02Sample: Omit<FeaturesCarouselBlock, "id"> = {
  type: "features-carousel-02",
  titleKey: "blocks.features-carousel-02.title",
  items: [
    {
      illustration: "notes",
      bgImageUrl:
        "https://raw.githubusercontent.com/tailark/assets/refs/heads/main/c1_sc01ut.png",
      bodyKey: "blocks.features-carousel-02.items.slide1.body",
    },
    {
      illustration: "notesChecklist",
      bgImageUrl:
        "https://raw.githubusercontent.com/tailark/assets/refs/heads/main/c2_ynz6fw.png",
      bodyKey: "blocks.features-carousel-02.items.slide2.body",
    },
    {
      illustration: "aiAutocomplete",
      bgImageUrl:
        "https://raw.githubusercontent.com/tailark/assets/refs/heads/main/c3_fzqepj.png",
      bodyKey: "blocks.features-carousel-02.items.slide3.body",
    },
    {
      illustration: "translation",
      bgImageUrl:
        "https://raw.githubusercontent.com/tailark/assets/refs/heads/main/c4_rg6vjt.png",
      bodyKey: "blocks.features-carousel-02.items.slide4.body",
    },
  ],
};
