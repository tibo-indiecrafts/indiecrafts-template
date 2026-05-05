import type { FeaturesBlock } from "./schema";

export const features11Key = "features-11" as const;
export const features11Namespace = "blocks.features-11" as const;

export const features11Sample: Omit<FeaturesBlock, "id"> = {
  type: "features-11",
  trackingTitleKey: "blocks.features-11.tracking.title",
  trackingBodyKey: "blocks.features-11.tracking.body",
  trackingImageLightUrl: "/placeholder.svg",
  trackingImageDarkUrl: "/placeholder.svg",
  trackingImageAltKey: "blocks.features-11.tracking.imageAlt",
  uxTitleKey: "blocks.features-11.ux",
  uxImageLightUrl: "/placeholder.svg",
  uxImageDarkUrl: "/placeholder.svg",
  uxImageAltKey: "blocks.features-11.uxImageAlt",
  shortcutTitleKey: "blocks.features-11.shortcut",
  integrationsTitleKey: "blocks.features-11.integrations.title",
  integrationsBodyKey: "blocks.features-11.integrations.body",
};
