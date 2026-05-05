import type { FeaturesBlock } from "./schema";

export const features07Key = "features-07" as const;
export const features07Namespace = "blocks.features-07" as const;

export const features07Sample: Omit<FeaturesBlock, "id"> = {
  type: "features-07",
  titleKey: "blocks.features-07.title",
  bodyKey: "blocks.features-07.body",
  upperImageUrl: "/placeholder.svg",
  backImageLightUrl: "/placeholder.svg",
  backImageDarkUrl: "/placeholder.svg",
  imageAltKey: "blocks.features-07.imageAlt",
  features: [
    {
      iconKey: "zap",
      titleKey: "blocks.features-07.features.fast.title",
      bodyKey: "blocks.features-07.features.fast.body",
    },
    {
      iconKey: "cpu",
      titleKey: "blocks.features-07.features.powerful.title",
      bodyKey: "blocks.features-07.features.powerful.body",
    },
    {
      iconKey: "lock",
      titleKey: "blocks.features-07.features.secure.title",
      bodyKey: "blocks.features-07.features.secure.body",
    },
    {
      iconKey: "sparkles",
      titleKey: "blocks.features-07.features.smart.title",
      bodyKey: "blocks.features-07.features.smart.body",
    },
  ],
};
