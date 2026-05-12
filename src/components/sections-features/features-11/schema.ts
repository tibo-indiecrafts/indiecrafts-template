import type { MessageKey } from "@/types/messages";

export type FeaturesBlock = {
  type: "features-11";
  id: string;
  trackingTitleKey?: MessageKey;
  trackingBodyKey?: MessageKey;
  /** Top-left card image (light/dark variants). */
  trackingImageLightUrl: string;
  trackingImageDarkUrl: string;
  trackingImageAltKey?: MessageKey;
  uxTitleKey?: MessageKey;
  /** Top-right card image (light/dark variants). */
  uxImageLightUrl: string;
  uxImageDarkUrl: string;
  uxImageAltKey?: MessageKey;
  shortcutTitleKey?: MessageKey;
  integrationsTitleKey?: MessageKey;
  integrationsBodyKey?: MessageKey;
};
