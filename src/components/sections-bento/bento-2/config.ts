import type { BentoBlock } from "./schema";

export const bento2Key = "bento-2" as const;
export const bento2Namespace = "blocks.bento-2" as const;

export const bento2Sample: Omit<BentoBlock, "id"> = {
  type: "bento-2",
  cells: [
    {
      span: "double",
      illustration: "notification",
      notificationVariant: "mixed",
      titleKey: "blocks.bento-2.cells.cell1.title",
      bodyKey: "blocks.bento-2.cells.cell1.body",
    },
    {
      span: "double",
      illustration: "currency",
      titleKey: "blocks.bento-2.cells.cell2.title",
      bodyKey: "blocks.bento-2.cells.cell2.body",
    },
    {
      span: "double",
      illustration: "reply",
      titleKey: "blocks.bento-2.cells.cell3.title",
      bodyKey: "blocks.bento-2.cells.cell3.body",
    },
    {
      span: "triple",
      illustration: "visualization",
      titleKey: "blocks.bento-2.cells.cell4.title",
      bodyKey: "blocks.bento-2.cells.cell4.body",
    },
    {
      span: "triple",
      illustration: "map",
      bg: "radialMask",
      titleKey: "blocks.bento-2.cells.cell5.title",
      bodyKey: "blocks.bento-2.cells.cell5.body",
    },
  ],
};
