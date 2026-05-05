import type { MessageKey } from "@/types/messages";

/**
 * Tailark `features-10` — corner-decorated bento with dual-mode product
 * images + a circular UI-stamp row. Card headings + illustrations are
 * config-driven; the corner decorators stay in the component.
 */
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
