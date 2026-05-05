import type { MessageKey } from "@/types/messages";

/**
 * Tailark Pro `bento-10` — fixed-shape 7-cell composition rendered
 * as a single bordered grid with internal `divide-x`/`divide-y`
 * separators, plus four PlusDecorator marks at the outer corners.
 * Layout flows `@2xl:grid-cols-2` then `@4xl:grid-cols-3` with
 * `@4xl:grid-rows-[auto_1fr_auto]` rows.
 *
 * The `kitCell` spans two rows at `@4xl:row-span-2`; the
 * `communicationCell` spans the full bottom row at `@2xl:col-span-2`
 * and renders a 2-col internal layout (campaign illustration on the
 * left, title + body + Shadcn testimonial blockquote on the right)
 * with its own central PlusDecorator at `@4xl`.
 *
 * Seven cells is structural — the `nth-child` rules and row/col
 * spans are all hardcoded. Every body supports inline `<strong>`
 * markup highlights via `t.rich(...)`.
 */
export type BentoBlock = {
  type: "bento-10";
  id: string;
  messagingCell: { titleKey: MessageKey; bodyKey: MessageKey };
  analyticsCell: { titleKey: MessageKey; bodyKey: MessageKey };
  resourcesCell: { titleKey: MessageKey; bodyKey: MessageKey };
  /** Spans 2 rows at @4xl. */
  kitCell: { titleKey: MessageKey; bodyKey: MessageKey };
  /** Spans 2 cols at @2xl with embedded testimonial. */
  communicationCell: {
    titleKey: MessageKey;
    bodyKey: MessageKey;
    quoteKey: MessageKey;
    authorNameKey: MessageKey;
    authorAvatarUrl: string;
  };
  identityCell: { titleKey: MessageKey; bodyKey: MessageKey };
  uptimeCell: { titleKey: MessageKey; bodyKey: MessageKey };
};
