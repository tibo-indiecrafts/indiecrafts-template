import type { MessageKey } from "@/types/messages";

/**
 * Tailark Pro `bento-14` — fixed-shape 4-cell composition in a 6-col
 * grid. The currency cell spans 2 cols + the map cell spans 4 cols
 * (top row = 2+4); the monitoring chart cell spans 4 cols + the
 * documents cell spans 2 cols (bottom row = 4+2). `grid-rows-subgrid`
 * keeps title and illustration rows aligned across both rows.
 *
 * Four cells is structural — the col-span pattern is hardcoded.
 * Currency cell shows a "+44 Currencies" label below the
 * illustration; documents cell renders 6 stacked DocumentIllustrations.
 */
export type BentoBlock = {
  type: "bento-14";
  id: string;
  currencyCell: {
    titleKey: MessageKey;
    bodyKey: MessageKey;
    metaLabelKey: MessageKey;
  };
  mapCell: { titleKey: MessageKey; bodyKey: MessageKey };
  monitoringCell: { titleKey: MessageKey; bodyKey: MessageKey };
  documentsCell: { titleKey: MessageKey; bodyKey: MessageKey };
};
