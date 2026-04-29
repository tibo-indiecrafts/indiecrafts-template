import type { Features7Block } from "./schema";

export const features7Sample: Omit<Features7Block, "id"> = {
  type: "features-7",
  titleKey: "blocks.features-7.title",
  bodyKey: "blocks.features-7.body",
  upperImageUrl: "/placeholder.svg",
  backImageLightUrl: "/placeholder.svg",
  backImageDarkUrl: "/placeholder.svg",
  imageAltKey: "blocks.features-7.imageAlt",
  features: [
    {
      iconKey: "zap",
      titleKey: "blocks.features-7.features.fast.title",
      bodyKey: "blocks.features-7.features.fast.body",
    },
    {
      iconKey: "cpu",
      titleKey: "blocks.features-7.features.powerful.title",
      bodyKey: "blocks.features-7.features.powerful.body",
    },
    {
      iconKey: "lock",
      titleKey: "blocks.features-7.features.secure.title",
      bodyKey: "blocks.features-7.features.secure.body",
    },
    {
      iconKey: "sparkles",
      titleKey: "blocks.features-7.features.smart.title",
      bodyKey: "blocks.features-7.features.smart.body",
    },
  ],
};
