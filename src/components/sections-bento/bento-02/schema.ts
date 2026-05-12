import type { MessageKey } from "@/types/messages";

export type BentoIllustration =
  | "currency"
  | "map"
  | "notification"
  | "poll"
  | "reply"
  | "visualization";

export type NotificationVariant = "elevated" | "outlined" | "mixed";

/** Cell layout in the 6-column bento grid: 2/6 ("double") or 3/6 ("triple"). */
export type BentoCellSpan = "double" | "triple";

/** Background treatment painted behind the illustration area. */
export type BentoCellBg =
  | "stripes" // diagonal stripe overlay (used by the 3 top-row "double" cells)
  | "none" // no background (used by the visualization cell)
  | "radialMask"; // transparent bg + radial mask-image (used by the map cell)

export type BentoCell = {
  span: BentoCellSpan;
  illustration: BentoIllustration;
  /** Only consumed when `illustration === "notification"`. */
  notificationVariant?: NotificationVariant;
  /** Defaults: stripes for `double`, none for `triple`. */
  bg?: BentoCellBg;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

export type BentoBlock = {
  type: "bento-02";
  id: string;
  cells: readonly [BentoCell, BentoCell, BentoCell, BentoCell, BentoCell];
};
