import type { Features9Block } from "./schema";

export const features9Sample: Omit<Features9Block, "id"> = {
  type: "features-9",
  locationEyebrowKey: "blocks.features-9.location.eyebrow",
  locationBodyKey: "blocks.features-9.location.body",
  supportEyebrowKey: "blocks.features-9.support.eyebrow",
  supportBodyKey: "blocks.features-9.support.body",
  uptimeKey: "blocks.features-9.uptime",
  activityEyebrowKey: "blocks.features-9.activity.eyebrow",
  activityBodyKey: "blocks.features-9.activity.body",
  activityMutedBodyKey: "blocks.features-9.activity.muted",
};
