import type { BentoBlock } from "./schema";

export const bento1Key = "bento-1" as const;
export const bento1Namespace = "blocks.bento-1" as const;

export const bento1Sample: Omit<BentoBlock, "id"> = {
  type: "bento-1",
  cells: [
    {
      span: "double",
      illustration: "notification",
      notificationVariant: "mixed",
      titleKey: "blocks.bento-1.cells.cell1.title",
      bodyKey: "blocks.bento-1.cells.cell1.body",
    },
    {
      span: "double",
      illustration: "currency",
      titleKey: "blocks.bento-1.cells.cell2.title",
      bodyKey: "blocks.bento-1.cells.cell2.body",
    },
    {
      span: "double",
      illustration: "reply",
      titleKey: "blocks.bento-1.cells.cell3.title",
      bodyKey: "blocks.bento-1.cells.cell3.body",
    },
    {
      span: "double",
      illustration: "poll",
      titleKey: "blocks.bento-1.cells.cell4.title",
      bodyKey: "blocks.bento-1.cells.cell4.body",
    },
    {
      span: "wide",
      illustration: "visualization",
      titleKey: "blocks.bento-1.cells.cell5.title",
      bodyKey: "blocks.bento-1.cells.cell5.body",
    },
  ],
};
