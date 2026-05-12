import type { MessageKey } from "@/types/messages";

/**
 * Tailark Pro `bento-06` — fixed-shape 3-cell composition in a 5-col
 * grid (`@4xl:grid-cols-5`). The left column (`@4xl:col-span-2`)
 * holds two stacked cards (chart + message); the right column
 * (`@4xl:col-span-3`) holds a single tall card with the kit
 * illustration. Title goes on top of every card, illustration
 * underneath.
 *
 * The kit cell's body supports inline `<strong>...</strong>` markup
 * via `t.rich(...)` so the translation file can mark which fragment
 * to highlight (rendered as `text-foreground font-medium`).
 */
export type BentoBlock = {
  type: "bento-06";
  id: string;
  chartCell: { titleKey: MessageKey; bodyKey: MessageKey };
  messageCell: { titleKey: MessageKey; bodyKey: MessageKey };
  kitCell: {
    titleKey: MessageKey;
    /** Body MAY contain inline `<strong>` markup (rendered as foreground/medium). */
    bodyKey: MessageKey;
  };
};
