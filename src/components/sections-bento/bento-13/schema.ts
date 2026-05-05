import type { MessageKey } from "@/types/messages";

/**
 * Tailark Pro `bento-13` — fixed-shape 6-cell composition in a
 * 6-col grid. Cells default to `col-span-3` for a 2-up `@3xl`
 * layout; the middle row's `financialCell` (`@4xl:col-span-2`) +
 * `chatCell` (`@4xl:col-span-4`) widen to a 1/3 + 2/3 split at
 * `@4xl`. `grid-rows-subgrid` keeps title and illustration rows
 * aligned across the full grid.
 *
 * Six cells is structural — the col-span and row-span shifts are
 * all hardcoded.
 */
export type BentoBlock = {
  type: "bento-13";
  id: string;
  collaborationCell: { titleKey: MessageKey; bodyKey: MessageKey };
  documentsCell: { titleKey: MessageKey; bodyKey: MessageKey };
  financialCell: { titleKey: MessageKey; bodyKey: MessageKey };
  chatCell: { titleKey: MessageKey; bodyKey: MessageKey };
  schedulingCell: { titleKey: MessageKey; bodyKey: MessageKey };
  filesharingCell: { titleKey: MessageKey; bodyKey: MessageKey };
};
