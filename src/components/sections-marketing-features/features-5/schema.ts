import type { MessageKey } from "@/types/messages";

export type Features5BulletIcon =
  | "mail"
  | "zap"
  | "activity"
  | "compass"
  | "shield"
  | "sparkles";

export type Features5Bullet = {
  iconKey: Features5BulletIcon;
  labelKey: MessageKey;
};

/**
 * Tailark `features-5` — 2-col layout: headline + bullet list on the left,
 * large image on the right (lg: 2/3 width).
 */
export type Features5Block = {
  type: "features-5";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  bullets: readonly Features5Bullet[];
  imageLightUrl: string;
  imageDarkUrl?: string;
  imageAltKey: MessageKey;
};
