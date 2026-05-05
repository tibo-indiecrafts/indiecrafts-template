import type { FeaturesBlock } from "./schema";

export const features06Key = "features-06" as const;
export const features06Namespace = "blocks.features-06" as const;

export const features06Sample: Omit<FeaturesBlock, "id"> = {
  type: "features-06",
  titleKey: "blocks.features-06.title",
  bodyKey: "blocks.features-06.body",
  upperImageUrl: "/placeholder.svg",
  backImageLightUrl: "/placeholder.svg",
  backImageDarkUrl: "/placeholder.svg",
  imageAltKey: "blocks.features-06.imageAlt",
  features: [
    {
      iconKey: "zap",
      titleKey: "blocks.features-06.features.fast.title",
      bodyKey: "blocks.features-06.features.fast.body",
    },
    {
      iconKey: "cpu",
      titleKey: "blocks.features-06.features.powerful.title",
      bodyKey: "blocks.features-06.features.powerful.body",
    },
    {
      iconKey: "lock",
      titleKey: "blocks.features-06.features.secure.title",
      bodyKey: "blocks.features-06.features.secure.body",
    },
    {
      iconKey: "sparkles",
      titleKey: "blocks.features-06.features.smart.title",
      bodyKey: "blocks.features-06.features.smart.body",
    },
  ],
};
