import type { MessageKey } from "@/types/messages";

/**
 * Tailark Pro `bento-11` — fixed-shape composition with 5 sections
 * inside a single bordered container. The grid is
 * `@3xl:grid-cols-2` and uses `grid-rows-subgrid` so the title and
 * illustration rows align across all four feature cells.
 *
 * ┌── financial ──┬── documents ──┐
 * ├──────── testimonial ──────────┤
 * └── collab ─────┴── scheduling ─┘
 *
 * The middle `testimonialCell` spans both columns and renders a
 * full blockquote with a Glodie avatar attribution.
 *
 * Five sections is structural — the layout balances at 2+(full-row)+2.
 */
export type BentoBlock = {
  type: "bento-11";
  id: string;
  financialCell: { titleKey: MessageKey; bodyKey: MessageKey };
  documentsCell: { titleKey: MessageKey; bodyKey: MessageKey };
  testimonialCell: {
    quoteKey: MessageKey;
    authorNameKey: MessageKey;
    authorHandleKey: MessageKey;
    authorAvatarUrl: string;
  };
  collaborationCell: { titleKey: MessageKey; bodyKey: MessageKey };
  schedulingCell: { titleKey: MessageKey; bodyKey: MessageKey };
};
