import type { MessageKey } from "@/types/messages";

/**
 * Tailark Pro `bento-12` — fixed-shape composition mirroring -11's
 * grid-rows-subgrid border layout but with five FEATURE cells (no
 * testimonial). Cells: Financial / FileSharing / Chat (full row,
 * 2-col internal) / Collaboration / Scheduling.
 *
 * ┌── financial ──┬── filesharing ──┐
 * ├── chat (full row, 2-col) ───────┤
 * └── collab ─────┴── scheduling ───┘
 *
 * Five cells is structural — the layout balances at 2+(full-row)+2.
 */
export type BentoBlock = {
  type: "bento-12";
  id: string;
  financialCell: { titleKey: MessageKey; bodyKey: MessageKey };
  filesharingCell: { titleKey: MessageKey; bodyKey: MessageKey };
  chatCell: { titleKey: MessageKey; bodyKey: MessageKey };
  collaborationCell: { titleKey: MessageKey; bodyKey: MessageKey };
  schedulingCell: { titleKey: MessageKey; bodyKey: MessageKey };
};
