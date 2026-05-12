import type { BentoBlock } from "./schema";

export const bento01Key = "bento-01" as const;
export const bento01Namespace = "blocks.bento-01" as const;

export const bento01Sample: Omit<BentoBlock, "id"> = {
  type: "bento-01",
  cells: [
    {
      span: "double",
      illustration: "notification",
      notificationVariant: "mixed",
      titleKey: "blocks.bento-01.cells.cell1.title",
      bodyKey: "blocks.bento-01.cells.cell1.body",
    },
    {
      span: "double",
      illustration: "currency",
      titleKey: "blocks.bento-01.cells.cell2.title",
      bodyKey: "blocks.bento-01.cells.cell2.body",
    },
    {
      span: "double",
      illustration: "reply",
      titleKey: "blocks.bento-01.cells.cell3.title",
      bodyKey: "blocks.bento-01.cells.cell3.body",
    },
    {
      span: "double",
      illustration: "poll",
      titleKey: "blocks.bento-01.cells.cell4.title",
      bodyKey: "blocks.bento-01.cells.cell4.body",
    },
    {
      span: "wide",
      illustration: "visualization",
      titleKey: "blocks.bento-01.cells.cell5.title",
      bodyKey: "blocks.bento-01.cells.cell5.body",
    },
  ],
};
