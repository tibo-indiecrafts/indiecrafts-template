import type { BentoBlock } from "./schema";

export const bento03Key = "bento-03" as const;
export const bento03Namespace = "blocks.bento-03" as const;

export const bento03Sample: Omit<BentoBlock, "id"> = {
  type: "bento-03",
  cells: [
    {
      kind: "illustration",
      span: "double",
      illustration: "scan",
      titleKey: "blocks.bento-03.cells.cell1.title",
      bodyKey: "blocks.bento-03.cells.cell1.body",
    },
    {
      kind: "illustration",
      span: "quad",
      illustration: "visualization",
      titleKey: "blocks.bento-03.cells.cell2.title",
      bodyKey: "blocks.bento-03.cells.cell2.body",
    },
    {
      kind: "illustration",
      span: "triple",
      illustration: "campaign",
      titleKey: "blocks.bento-03.cells.cell3.title",
      bodyKey: "blocks.bento-03.cells.cell3.body",
    },
    {
      kind: "integrations",
      span: "triple",
      brands: ["vsCodium", "replit", "googlePalm", "linear", "openAi", "cloudflare"],
      titleKey: "blocks.bento-03.cells.cell4.title",
      bodyKey: "blocks.bento-03.cells.cell4.body",
    },
  ],
};
