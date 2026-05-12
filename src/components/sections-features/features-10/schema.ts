import type { MessageKey } from "@/types/messages";

export type FeaturesBlock = {
  type: "features-10";
  id: string;
  trackingEyebrowKey?: MessageKey;
  trackingBodyKey?: MessageKey;
  /** Image shown in the tracking card (light + dark variants). */
  trackingImageLightUrl: string;
  trackingImageDarkUrl: string;
  trackingImageAltKey?: MessageKey;
  schedulingEyebrowKey?: MessageKey;
  schedulingBodyKey?: MessageKey;
  schedulingImageLightUrl: string;
  schedulingImageDarkUrl: string;
  schedulingImageAltKey?: MessageKey;
  stampsTitleKey?: MessageKey;
};
