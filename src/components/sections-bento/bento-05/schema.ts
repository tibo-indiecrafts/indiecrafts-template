import type { MessageKey } from "@/types/messages";

/**
 * Tailark Pro `bento-05` — fixed-shape 5-cell grid in a 10-col
 * layout. Cells have asymmetric column spans (4 + 6 then 3 + 4 + 3)
 * and the rightmost cell of row 2 hops up to row 1 at narrow widths
 * via `row-start-1` / `@4xl:row-start-auto` for visual balance.
 *
 * ┌──── keys (4) ────┬──────── chart (6) ───────┐
 * ├ fingerprint(3) ──┬─ campaign (4) ──┬ docs (3) ┤
 * └──────────────────┴─────────────────┴──────────┘
 *
 * Cell breakdown:
 *   - `keys`: title above, KeysIllustration below
 *   - `chart`: title above, ChartIllustration below (muted bg)
 *   - `fingerprint`: FingerprintScanIllustration above, title below
 *     (force-dark card via `data-theme="dark"`)
 *   - `campaign`: CampaignIllustration above, title below (muted bg)
 *   - `docs`: 3×2 grid of six DocumentIllustrations above, title
 *     below (this cell takes `row-start-1` at narrow widths so the
 *     short cards fall in line)
 *
 * No autoplay, no state, no tabs — pure layout.
 */
export type BentoBlock = {
  type: "bento-05";
  id: string;
  keysCell: { titleKey: MessageKey; bodyKey: MessageKey };
  chartCell: { titleKey: MessageKey; bodyKey: MessageKey };
  fingerprintCell: { titleKey: MessageKey; bodyKey: MessageKey };
  campaignCell: { titleKey: MessageKey; bodyKey: MessageKey };
  docsCell: { titleKey: MessageKey; bodyKey: MessageKey };
};
