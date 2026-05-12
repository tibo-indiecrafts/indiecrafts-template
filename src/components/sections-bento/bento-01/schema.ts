import type { MessageKey } from "@/types/messages";

export type BentoIllustration =
  | "currency"
  | "notification"
  | "poll"
  | "reply"
  | "visualization";

export type NotificationVariant = "elevated" | "outlined" | "mixed";

export type BentoCellSpan = "double" | "wide";

export type BentoCell = {
  span: BentoCellSpan;
  illustration: BentoIllustration;

  notificationVariant?: NotificationVariant;

  showStripes?: boolean;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

export type BentoBlock = {
  type: "bento-01";
  id: string;
  cells: readonly [BentoCell, BentoCell, BentoCell, BentoCell, BentoCell];
};
