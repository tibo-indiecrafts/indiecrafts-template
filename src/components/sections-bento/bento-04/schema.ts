import type { MessageKey } from "@/types/messages";

/**
 * Tailark Pro `bento-04` — fixed-shape 6-cell composition that
 * doesn't fit the simple "array of cells" pattern of `bento-01..3`.
 * The grid is `@4xl:grid-cols-3 / @xl:grid-cols-2`, with cells laid
 * out in this exact arrangement:
 *
 * ┌──────────┬──────────┬──────────┐  row 1 (3 single-col cards):
 * │  shield  │   keys   │  reply   │    iso shield, keys, reply
 * ├──────────┴──────────┼──────────┤  row 2:
 * │   formula (2-col)   │ leader   │    formula visualization
 * │                     │  board   │    + leaderboard (then a
 * │                     │  + stat  │    65% stat card stacked
 * │                     │          │    inside the same column)
 * └─────────────────────┴──────────┘
 *
 * The `formula` cell composes a `DocumentIllustration` →
 * `IDCheckIllustration` → three stacked Documents (with a
 * `CardDecorator` corner outline around the leading document and
 * `ArrowBigRight` / `Equal` connector glyphs between steps). The
 * `stat` card hides at `@xl` and re-shows at `@4xl` per upstream.
 *
 * Every cell carries its own copy via two MessageKeys; the `stat`
 * cell adds a third for its big percentage figure.
 */
export type BentoBlock = {
  type: "bento-04";
  id: string;
  shieldCell: { titleKey: MessageKey; bodyKey: MessageKey };
  keysCell: { titleKey: MessageKey; bodyKey: MessageKey };
  replyCell: { titleKey: MessageKey; bodyKey: MessageKey };
  formulaCell: { titleKey: MessageKey; bodyKey: MessageKey };
  leaderboardCell: { titleKey: MessageKey; bodyKey: MessageKey };
  statCell: { percentKey: MessageKey; labelKey: MessageKey };
};
