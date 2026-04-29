import type { Features6Block } from "./schema";

export const features6Sample: Omit<Features6Block, "id"> = {
  type: "features-6",
  titleKey: "blocks.features-6.title",
  bodyKey: "blocks.features-6.body",
  upperImageUrl: "/placeholder.svg",
  backImageLightUrl: "/placeholder.svg",
  backImageDarkUrl: "/placeholder.svg",
  imageAltKey: "blocks.features-6.imageAlt",
  features: [
    {
      iconKey: "zap",
      titleKey: "blocks.features-6.features.fast.title",
      bodyKey: "blocks.features-6.features.fast.body",
    },
    {
      iconKey: "cpu",
      titleKey: "blocks.features-6.features.powerful.title",
      bodyKey: "blocks.features-6.features.powerful.body",
    },
    {
      iconKey: "lock",
      titleKey: "blocks.features-6.features.secure.title",
      bodyKey: "blocks.features-6.features.secure.body",
    },
    {
      iconKey: "sparkles",
      titleKey: "blocks.features-6.features.smart.title",
      bodyKey: "blocks.features-6.features.smart.body",
    },
  ],
};
