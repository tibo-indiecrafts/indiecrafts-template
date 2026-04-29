import type { Features5Block } from "./schema";

export const features5Sample: Omit<Features5Block, "id"> = {
  type: "features-5",
  titleKey: "blocks.features-5.title",
  bodyKey: "blocks.features-5.body",
  bullets: [
    { iconKey: "mail", labelKey: "blocks.features-5.bullets.support" },
    { iconKey: "zap", labelKey: "blocks.features-5.bullets.response" },
    { iconKey: "activity", labelKey: "blocks.features-5.bullets.monitoring" },
    { iconKey: "compass", labelKey: "blocks.features-5.bullets.review" },
  ],
  imageLightUrl: "/placeholder.svg",
  imageDarkUrl: "/placeholder.svg",
  imageAltKey: "blocks.features-5.imageAlt",
};
