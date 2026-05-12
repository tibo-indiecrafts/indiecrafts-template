import type { MessageKey } from "@/types/messages";

export type BentoIllustration =
  | "currency"
  | "notification"
  | "poll"
  | "reply"
  | "visualization";

/**
 * Notification illustration takes one of three styling variants —
 * encoded here so the picker stays in the data layer rather than
 * leaking variant strings into the component file.
 */
export type NotificationVariant = "elevated" | "outlined" | "mixed";

/**
 * Cell layout in the 6-column bento grid. The default cell spans
 * `2/6` columns; the wide cell spans `4/6` (full row when paired
 * with two `2/6` cells preceding it). Stripes background pattern is
 * the upstream default for "double" cells; the wide cell omits it.
 */
export type BentoCellSpan = "double" | "wide";

export type BentoCell = {
  span: BentoCellSpan;
  illustration: BentoIllustration;
  /** Only consumed when `illustration === "notification"`. */
  notificationVariant?: NotificationVariant;
  /** Decorative diagonal stripes behind the illustration (default true for `double`, false for `wide`). */
  showStripes?: boolean;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

export type BentoBlock = {
  type: "bento-01";
  id: string;
  cells: readonly [BentoCell, BentoCell, BentoCell, BentoCell, BentoCell];
};
