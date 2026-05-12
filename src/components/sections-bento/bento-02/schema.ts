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

/**
 * Tailark Pro `bento-02` — 5-cell asymmetric bento grid in a
 * 6-column layout. Inverted from `bento-01`: the illustration sits
 * on TOP of each `Card` (`grid-rows-[1fr_auto]`) and the title +
 * body are anchored to the bottom.
 *
 * Row 1: three `double` cells (`@3xl:col-span-2` × 3 = 6 cols),
 * each with a stripe-pattern background under its illustration.
 * Row 2: two `triple` cells (`@3xl:col-span-3` × 2 = 6 cols) —
 * the first holds a Visualization (no background pattern), the
 * second holds a Map illustration with a radial mask on the
 * container (`[mask-image:radial-gradient(ellipse_50%_45%_at_50%_50%,#000_70%,transparent_100%)]`)
 * and a transparent background override.
 *
 * Five cells is structural — the 6-col arithmetic balances at
 * 2+2+2 then 3+3. No autoplay, no state, no tabs — pure layout.
 */
export type BentoBlock = {
  type: "bento-02";
  id: string;
  cells: readonly [BentoCell, BentoCell, BentoCell, BentoCell, BentoCell];
};
