import type { MessageKey } from "@/types/messages";

export type FeaturesBlock = {
  type: "features-11";
  id: string;
  trackingTitleKey?: MessageKey;
  trackingBodyKey?: MessageKey;

  trackingImageLightUrl: string;
  trackingImageDarkUrl: string;
  trackingImageAltKey?: MessageKey;
  uxTitleKey?: MessageKey;

  uxImageLightUrl: string;
  uxImageDarkUrl: string;
  uxImageAltKey?: MessageKey;
  shortcutTitleKey?: MessageKey;
  integrationsTitleKey?: MessageKey;
  integrationsBodyKey?: MessageKey;
};
