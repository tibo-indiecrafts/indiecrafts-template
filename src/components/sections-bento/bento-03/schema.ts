import type { MessageKey } from "@/types/messages";

export type BentoIllustration = "scan" | "visualization" | "campaign" | "integrations";

/** Cell layout in the 6-column bento grid. */
export type BentoCellSpan = "double" | "quad" | "triple";

export type IntegrationBrand =
  | "vsCodium"
  | "replit"
  | "googlePalm"
  | "linear"
  | "openAi"
  | "cloudflare";

/**
 * Discriminated cell shape — `integrations` cells carry an array of
 * brand keys driving the inner icon grid; everything else uses a
 * single illustration discriminator.
 */
export type BentoCell =
  | {
      kind: "illustration";
      span: BentoCellSpan;
      illustration: Exclude<BentoIllustration, "integrations">;
      titleKey: MessageKey;
      bodyKey: MessageKey;
    }
  | {
      kind: "integrations";
      span: BentoCellSpan;
      /** Six brand keys — rendered alternating with dashed empty squares. */
      brands: readonly [
        IntegrationBrand,
        IntegrationBrand,
        IntegrationBrand,
        IntegrationBrand,
        IntegrationBrand,
        IntegrationBrand,
      ];
      titleKey: MessageKey;
      bodyKey: MessageKey;
    };

/**
 * Tailark Pro `bento-03` — 4-cell asymmetric bento grid in a 6-col
 * layout. The cell stack inverts to show **title + body on top**,
 * illustration BELOW (`grid-rows-[auto_1fr]`).
 *
 * Row 1: a `double` ScanIllustration cell (animated face-scan with
 * `LightDarkParticles` + `TextScramble` reveal) and a `quad`
 * Visualization cell (3-segment spending-limit progress bar).
 * Row 2: two `triple` cells — a Campaign illustration card and an
 * Integrations grid (12-square layout: 6 brand icon tiles
 * alternating with 6 dashed-empty placeholders, brands rendered in
 * a structural 6-tuple at row positions [r1c2, r1c4, r1c6, r2c1,
 * r2c3, r2c5]). Stripes background painted under the integrations
 * cell only.
 *
 * Four cells is structural — the 6-col arithmetic balances at
 * 2+4 then 3+3.
 */
export type BentoBlock = {
  type: "bento-03";
  id: string;
  cells: readonly [BentoCell, BentoCell, BentoCell, BentoCell];
};
