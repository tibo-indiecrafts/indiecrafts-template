import type { MessageKey } from "@/types/messages";

export type FeaturesBlock = {
  type: "features-09";
  id: string;
  locationEyebrowKey?: MessageKey;
  locationBodyKey?: MessageKey;
  supportEyebrowKey?: MessageKey;
  supportBodyKey?: MessageKey;
  uptimeKey?: MessageKey;
  activityEyebrowKey?: MessageKey;
  activityBodyKey?: MessageKey;
  activityMutedBodyKey?: MessageKey;
};
