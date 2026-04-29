import type { Features10Block } from "./schema";

export const features10Sample: Omit<Features10Block, "id"> = {
  type: "features-10",
  trackingEyebrowKey: "blocks.features-10.tracking.eyebrow",
  trackingBodyKey: "blocks.features-10.tracking.body",
  trackingImageLightUrl: "/placeholder.svg",
  trackingImageDarkUrl: "/placeholder.svg",
  trackingImageAltKey: "blocks.features-10.tracking.imageAlt",
  schedulingEyebrowKey: "blocks.features-10.scheduling.eyebrow",
  schedulingBodyKey: "blocks.features-10.scheduling.body",
  schedulingImageLightUrl: "/placeholder.svg",
  schedulingImageDarkUrl: "/placeholder.svg",
  schedulingImageAltKey: "blocks.features-10.scheduling.imageAlt",
  stampsTitleKey: "blocks.features-10.stamps",
};
