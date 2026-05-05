import type { MessageKey } from "@/types/messages";

export type FeaturesBulletIcon =
  | "mail"
  | "zap"
  | "activity"
  | "compass"
  | "shield"
  | "sparkles";

export type FeaturesBullet = {
  iconKey: FeaturesBulletIcon;
  labelKey: MessageKey;
};

/**
 * Tailark `features-5` — 2-col layout: headline + bullet list on the left,
 * large image on the right (lg: 2/3 width).
 */
export type FeaturesBlock = {
  type: "features-05";
  id: string;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  bullets: readonly FeaturesBullet[];
  imageLightUrl: string;
  imageDarkUrl?: string;
  imageAltKey?: MessageKey;
};
