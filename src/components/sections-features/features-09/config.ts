import type { FeaturesBlock } from "./schema";

export const features09Key = "features-09" as const;
export const features09Namespace = "blocks.features-09" as const;

export const features09Sample: Omit<FeaturesBlock, "id"> = {
  type: "features-09",
  locationEyebrowKey: "blocks.features-09.location.eyebrow",
  locationBodyKey: "blocks.features-09.location.body",
  supportEyebrowKey: "blocks.features-09.support.eyebrow",
  supportBodyKey: "blocks.features-09.support.body",
  uptimeKey: "blocks.features-09.uptime",
  activityEyebrowKey: "blocks.features-09.activity.eyebrow",
  activityBodyKey: "blocks.features-09.activity.body",
  activityMutedBodyKey: "blocks.features-09.activity.muted",
};
