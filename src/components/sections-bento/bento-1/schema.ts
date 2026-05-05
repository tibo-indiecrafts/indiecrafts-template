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

/**
 * Tailark Pro `bento-1` — 5-cell asymmetric bento grid in a
 * 6-column layout. The first four cells each span 2 columns
 * (`@3xl:col-span-2`) and ship a "Stripes" diagonal-line
 * background under their illustration; the final cell spans
 * 4 columns (`@xl:col-span-2 @3xl:col-span-4`) and omits the
 * stripes — a wider canvas for the larger
 * VisualizationIllustration. Each cell is its own `Card`
 * (`bg-card/50` light mode), grid-rows `auto_1fr` with title +
 * body on top and the illustration anchored to the bottom via
 * `flex items-end`.
 *
 * Five cells is structural — the 6-col arithmetic only balances
 * for two rows of `2+2+2` then `2+4`. No autoplay, no state, no
 * tabs — pure layout.
 */
export type BentoBlock = {
  type: "bento-1";
  id: string;
  cells: readonly [BentoCell, BentoCell, BentoCell, BentoCell, BentoCell];
};
