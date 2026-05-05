import type { FeaturesBlock } from "./schema";

export const features05Key = "features-05" as const;
export const features05Namespace = "blocks.features-05" as const;

export const features05Sample: Omit<FeaturesBlock, "id"> = {
  type: "features-05",
  titleKey: "blocks.features-05.title",
  bodyKey: "blocks.features-05.body",
  bullets: [
    { iconKey: "mail", labelKey: "blocks.features-05.bullets.support" },
    { iconKey: "zap", labelKey: "blocks.features-05.bullets.response" },
    { iconKey: "activity", labelKey: "blocks.features-05.bullets.monitoring" },
    { iconKey: "compass", labelKey: "blocks.features-05.bullets.review" },
  ],
  imageLightUrl: "/placeholder.svg",
  imageDarkUrl: "/placeholder.svg",
  imageAltKey: "blocks.features-05.imageAlt",
};
