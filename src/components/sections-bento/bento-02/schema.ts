import type { MessageKey } from "@/types/messages";

export type BentoIllustration =
  | "currency"
  | "map"
  | "notification"
  | "poll"
  | "reply"
  | "visualization";

export type NotificationVariant = "elevated" | "outlined" | "mixed";

export type BentoCellSpan = "double" | "triple";

export type BentoCellBg = "stripes" | "none" | "radialMask";

export type BentoCell = {
  span: BentoCellSpan;
  illustration: BentoIllustration;

  notificationVariant?: NotificationVariant;

  bg?: BentoCellBg;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

export type BentoBlock = {
  type: "bento-02";
  id: string;
  cells: readonly [BentoCell, BentoCell, BentoCell, BentoCell, BentoCell];
};
