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

export type BentoBlock = {
  type: "bento-03";
  id: string;
  cells: readonly [BentoCell, BentoCell, BentoCell, BentoCell];
};
