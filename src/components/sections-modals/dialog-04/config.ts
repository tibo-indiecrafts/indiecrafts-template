import type { DialogBlock } from "./schema";

export const dialog04Key = "dialog-04" as const;
export const dialog04Namespace = "blocks.dialog-04" as const;

export const dialog04Sample: Omit<DialogBlock, "id"> = {
  type: "dialog-04",
  defaultOpen: true,
};
