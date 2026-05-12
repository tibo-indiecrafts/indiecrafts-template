import type { MessageKey } from "@/types/messages";

export type BentoIllustration = "scan" | "visualization" | "campaign" | "integrations";

export type BentoCellSpan = "double" | "quad" | "triple";

export type IntegrationBrand =
  | "vsCodium"
  | "replit"
  | "googlePalm"
  | "linear"
  | "openAi"
  | "cloudflare";

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
