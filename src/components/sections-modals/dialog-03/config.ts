import type { DialogBlock } from "./schema";

export const dialog03Key = "dialog-03" as const;
export const dialog03Namespace = "blocks.dialog-03" as const;

export const dialog03Sample: Omit<DialogBlock, "id"> = {
  type: "dialog-03",
  defaultOpen: true,
};
