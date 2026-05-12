import type { BentoBlock } from "./schema";

export const bento02Key = "bento-02" as const;
export const bento02Namespace = "blocks.bento-02" as const;

export const bento02Sample: Omit<BentoBlock, "id"> = {
  type: "bento-02",
  cells: [
    {
      span: "double",
      illustration: "notification",
      notificationVariant: "mixed",
      titleKey: "blocks.bento-02.cells.cell1.title",
      bodyKey: "blocks.bento-02.cells.cell1.body",
    },
    {
      span: "double",
      illustration: "currency",
      titleKey: "blocks.bento-02.cells.cell2.title",
      bodyKey: "blocks.bento-02.cells.cell2.body",
    },
    {
      span: "double",
      illustration: "reply",
      titleKey: "blocks.bento-02.cells.cell3.title",
      bodyKey: "blocks.bento-02.cells.cell3.body",
    },
    {
      span: "triple",
      illustration: "visualization",
      titleKey: "blocks.bento-02.cells.cell4.title",
      bodyKey: "blocks.bento-02.cells.cell4.body",
    },
    {
      span: "triple",
      illustration: "map",
      bg: "radialMask",
      titleKey: "blocks.bento-02.cells.cell5.title",
      bodyKey: "blocks.bento-02.cells.cell5.body",
    },
  ],
};
